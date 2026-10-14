import { createHash } from "node:crypto";
import type { IncomingMessage, ServerResponse } from "node:http";
import postgres from "postgres";
import {
  parseWhatsAppWebhook,
  verifyWhatsAppChallenge,
  verifyWhatsAppSignature
} from "../src/adapters/channels/whatsapp-cloud.mjs";

const MAX_BODY_BYTES = 1_048_576;
let db: ReturnType<typeof postgres> | undefined;

type Request = IncomingMessage & { method?: string; url?: string };
type Response = ServerResponse;

function json(res: Response, status: number, payload: unknown) {
  res.statusCode = status;
  res.setHeader("content-type", "application/json; charset=utf-8");
  res.setHeader("cache-control", "no-store");
  res.setHeader("x-content-type-options", "nosniff");
  res.end(JSON.stringify(payload));
}

async function readRawBody(req: Request): Promise<string> {
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of req) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    size += buffer.length;
    if (size > MAX_BODY_BYTES) throw Object.assign(new Error("BODY_TOO_LARGE"), { status: 413 });
    chunks.push(buffer);
  }
  return Buffer.concat(chunks).toString("utf8");
}

function database() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_NOT_CONFIGURED");
  if (!db) {
    db = postgres(url, {
      max: 1,
      idle_timeout: 10,
      connect_timeout: 5,
      prepare: false
    });
  }
  return db;
}

function hashPayload(rawBody: string) {
  return createHash("sha256").update(rawBody, "utf8").digest("hex");
}

async function persistInbound(message: ReturnType<typeof parseWhatsAppWebhook>["messages"][number], payloadHash: string) {
  const sql = database();
  return sql.begin(async (tx) => {
    await tx`SET LOCAL ROLE wa_app_runtime_safe`;
    // This SECURITY DEFINER resolver returns a tenant only for one unambiguous,
    // active WhatsApp phone number. Caller-supplied tenant IDs are never trusted.
    const matches = await tx`select tenant_id, channel_connection_id
      from app_private.resolve_whatsapp_channel(${message.phoneNumberId})`;
    if (matches.length !== 1) return { accepted: false, duplicate: false };

    const tenantId = String(matches[0].tenant_id);
    const channelConnectionId = String(matches[0].channel_connection_id);
    await tx`select set_config('app.tenant_id', ${tenantId}, true)`;

    const inserted = await tx`insert into webhook_events
      (tenant_id, provider, provider_event_id, event_type, status, payload_hash, processed_at)
      values (${tenantId}::uuid, 'whatsapp', ${message.providerEventId}, 'inbound_message', 'processed', ${payloadHash}, now())
      on conflict (provider, provider_event_id) do nothing
      returning id`;
    if (inserted.length === 0) return { accepted: true, duplicate: true };

    await tx`select pg_advisory_xact_lock(hashtext(${tenantId + ":" + message.senderWaId}))`;
    let customerRows = await tx`select id from customers
      where tenant_id = ${tenantId}::uuid and normalized_phone = ${message.senderWaId}
      order by created_at asc limit 1`;
    let customerId: string;
    if (customerRows.length === 0) {
      const created = await tx`insert into customers (tenant_id, display_name, normalized_phone)
        values (${tenantId}::uuid, ${message.profileName}, ${message.senderWaId})
        returning id`;
      customerId = String(created[0].id);
    } else {
      customerId = String(customerRows[0].id);
      if (message.profileName) {
        await tx`update customers set display_name = coalesce(display_name, ${message.profileName}), updated_at = now()
          where tenant_id = ${tenantId}::uuid and id = ${customerId}::uuid`;
      }
    }

    await tx`insert into customer_channel_preferences
      (tenant_id, customer_id, channel_connection_id, provider, destination_address,
       consent_status, last_inbound_at, service_window_expires_at)
      values (${tenantId}::uuid, ${customerId}::uuid, ${channelConnectionId}::uuid, 'whatsapp',
       ${message.senderWaId}, 'unknown', now(), now() + interval '24 hours')
      on conflict (tenant_id, channel_connection_id, destination_address)
      do update set last_inbound_at = now(),
        service_window_expires_at = now() + interval '24 hours', updated_at = now()`;

    const existingConversation = await tx`select id from conversations
      where tenant_id = ${tenantId}::uuid
        and channel_connection_id = ${channelConnectionId}::uuid
        and customer_id = ${customerId}::uuid
        and status in ('open','pending')
      order by updated_at desc limit 1`;
    let conversationId: string;
    if (existingConversation.length) {
      conversationId = String(existingConversation[0].id);
      await tx`update conversations set last_message_at = now(), updated_at = now()
        where tenant_id = ${tenantId}::uuid and id = ${conversationId}::uuid`;
    } else {
      const created = await tx`insert into conversations
        (tenant_id, channel_connection_id, customer_id, provider_conversation_id, status, handling_mode, last_message_at)
        values (${tenantId}::uuid, ${channelConnectionId}::uuid, ${customerId}::uuid,
          ${message.senderWaId}, 'open', 'copilot', now())
        returning id`;
      conversationId = String(created[0].id);
    }

    await tx`insert into messages
      (tenant_id, conversation_id, provider_message_id, direction, actor_type, body, content_type, delivery_status, metadata)
      values (${tenantId}::uuid, ${conversationId}::uuid, ${message.providerMessageId},
        'inbound', 'customer', ${message.text}, ${message.messageType}, 'received',
        ${JSON.stringify({ unsupportedContent: message.unsupportedContent })}::jsonb)`;

    await tx`insert into audit_events
      (tenant_id, actor_type, action, resource_type, resource_id, outcome, details)
      values (${tenantId}::uuid, 'provider', 'whatsapp.inbound.persisted', 'conversation',
        ${conversationId}, 'success', ${JSON.stringify({ providerMessageId: message.providerMessageId, messageType: message.messageType })}::jsonb)`;

    return { accepted: true, duplicate: false };
  });
}

async function persistStatus(status: ReturnType<typeof parseWhatsAppWebhook>["statuses"][number], payloadHash: string) {
  const sql = database();
  return sql.begin(async (tx) => {
    await tx`SET LOCAL ROLE wa_app_runtime_safe`;
    const matches = await tx`select tenant_id from app_private.resolve_whatsapp_channel(${status.phoneNumberId})`;
    if (matches.length !== 1) return { accepted: false, duplicate: false };
    const tenantId = String(matches[0].tenant_id);
    await tx`select set_config('app.tenant_id', ${tenantId}, true)`;

    const eventId = "status:" + status.providerMessageId + ":" + status.status;
    const inserted = await tx`insert into webhook_events
      (tenant_id, provider, provider_event_id, event_type, status, payload_hash, processed_at)
      values (${tenantId}::uuid, 'whatsapp', ${eventId}, 'delivery_status', 'processed', ${payloadHash}, now())
      on conflict (provider, provider_event_id) do nothing
      returning id`;
    if (inserted.length === 0) return { accepted: true, duplicate: true };

    await tx`update messages set delivery_status = ${status.status}
      where tenant_id = ${tenantId}::uuid and provider_message_id = ${status.providerMessageId}
        and direction = 'outbound'`;
    return { accepted: true, duplicate: false };
  });
}

export default async function handler(req: Request, res: Response) {
  if (req.method === "GET") {
    const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;
    if (!verifyToken) return json(res, 503, { error: "WHATSAPP_WEBHOOK_NOT_CONFIGURED" });
    const result = verifyWhatsAppChallenge(
      "https://webhook.invalid" + (req.url ?? "/"),
      verifyToken
    );
    if (!result.ok) return json(res, result.status, { error: "WEBHOOK_CHALLENGE_REJECTED" });
    res.statusCode = 200;
    res.setHeader("content-type", "text/plain; charset=utf-8");
    res.setHeader("cache-control", "no-store");
    return res.end(result.challenge);
  }

  if (req.method !== "POST") {
    res.setHeader("allow", "GET, POST");
    return json(res, 405, { error: "METHOD_NOT_ALLOWED" });
  }
  if (process.env.WHATSAPP_WEBHOOK_ENABLED !== "true") {
    return json(res, 503, { error: "WHATSAPP_WEBHOOK_DISABLED" });
  }
  const appSecret = process.env.WHATSAPP_APP_SECRET;
  if (!appSecret || !process.env.DATABASE_URL) {
    return json(res, 503, { error: "WHATSAPP_RUNTIME_NOT_CONFIGURED" });
  }

  let rawBody: string;
  try {
    rawBody = await readRawBody(req);
  } catch (error) {
    return json(res, Number((error as { status?: number }).status) || 400, { error: "INVALID_WEBHOOK_BODY" });
  }

  if (!verifyWhatsAppSignature(rawBody, String(req.headers["x-hub-signature-256"] ?? ""), appSecret)) {
    return json(res, 401, { error: "INVALID_WEBHOOK_SIGNATURE" });
  }

  let payload: unknown;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return json(res, 400, { error: "INVALID_JSON" });
  }

  const normalized = parseWhatsAppWebhook(payload);
  const payloadHash = hashPayload(rawBody);
  try {
    let processed = 0;
    let duplicates = 0;
    let ignored = 0;
    for (const message of normalized.messages) {
      const result = await persistInbound(message, payloadHash);
      if (!result.accepted) ignored++;
      else if (result.duplicate) duplicates++;
      else processed++;
    }
    for (const status of normalized.statuses) {
      const result = await persistStatus(status, payloadHash);
      if (!result.accepted) ignored++;
      else if (result.duplicate) duplicates++;
      else processed++;
    }
    // Unknown/unconnected phone IDs are acknowledged but never persisted or sent.
    return json(res, 200, { accepted: true, processed, duplicates, ignored });
  } catch {
    // Generic response only; DB/provider details and message content stay out of logs/responses.
    return json(res, 500, { error: "WEBHOOK_PERSISTENCE_FAILED" });
  }
}

export const config = { api: { bodyParser: false } };
