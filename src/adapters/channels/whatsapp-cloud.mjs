import { createHmac, timingSafeEqual } from "node:crypto";

const GRAPH_VERSION_PATTERN = /^v\d+\.\d+$/;
const PHONE_ID_PATTERN = /^\d{5,32}$/;
const WA_ID_PATTERN = /^\d{5,20}$/;
const MAX_TEXT_LENGTH = 4096;

function safeEqualText(left, right) {
  if (typeof left !== "string" || typeof right !== "string" || !left || !right) return false;
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Verify Meta's x-hub-signature-256 over the exact raw request body. */
export function verifyWhatsAppSignature(rawBody, signatureHeader, appSecret) {
  if (typeof rawBody !== "string" || !appSecret || !signatureHeader) return false;
  if (!/^sha256=[a-f0-9]{64}$/i.test(signatureHeader)) return false;
  const expected = `sha256=${createHmac("sha256", appSecret).update(rawBody, "utf8").digest("hex")}`;
  return safeEqualText(expected.toLowerCase(), signatureHeader.toLowerCase());
}

/** Handle Meta's GET webhook challenge without leaking the verify token. */
export function verifyWhatsAppChallenge(requestUrl, configuredVerifyToken) {
  if (!configuredVerifyToken) return { ok: false, status: 503, challenge: null };
  let url;
  try {
    url = new URL(requestUrl);
  } catch {
    return { ok: false, status: 400, challenge: null };
  }
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");
  if (mode !== "subscribe" || !challenge || !safeEqualText(token ?? "", configuredVerifyToken)) {
    return { ok: false, status: 403, challenge: null };
  }
  return { ok: true, status: 200, challenge };
}

/**
 * Normalize supported Cloud API webhook events. Callers must verify the
 * signature first, resolve phone_number_id to a connected tenant, and persist
 * with provider-event idempotency before enqueueing any AI or outbound work.
 */
export function parseWhatsAppWebhook(payload) {
  if (!payload || payload.object !== "whatsapp_business_account" || !Array.isArray(payload.entry)) {
    return { messages: [], statuses: [], ignored: true };
  }

  const messages = [];
  const statuses = [];
  for (const entry of payload.entry) {
    if (!Array.isArray(entry?.changes)) continue;
    for (const change of entry.changes) {
      if (change?.field !== "messages") continue;
      const value = change?.value;
      const phoneNumberId = value?.metadata?.phone_number_id;
      if (typeof phoneNumberId !== "string" || !PHONE_ID_PATTERN.test(phoneNumberId)) continue;

      for (const message of Array.isArray(value?.messages) ? value.messages : []) {
        if (typeof message?.id !== "string" || !message.id || !WA_ID_PATTERN.test(String(message.from ?? ""))) continue;
        const contact = Array.isArray(value?.contacts)
          ? value.contacts.find((item) => item?.wa_id === message.from)
          : null;
        const normalized = {
          provider: "whatsapp",
          providerEventId: message.id,
          providerMessageId: message.id,
          phoneNumberId,
          senderWaId: message.from,
          timestamp: Number.isFinite(Number(message.timestamp)) ? Number(message.timestamp) : null,
          messageType: typeof message.type === "string" ? message.type : "unknown",
          profileName: typeof contact?.profile?.name === "string" ? contact.profile.name.slice(0, 160) : null,
          text: message.type === "text" && typeof message.text?.body === "string"
            ? message.text.body.slice(0, MAX_TEXT_LENGTH)
            : null,
          unsupportedContent: message.type !== "text"
        };
        messages.push(normalized);
      }

      for (const status of Array.isArray(value?.statuses) ? value.statuses : []) {
        if (typeof status?.id !== "string" || !status.id) continue;
        statuses.push({
          provider: "whatsapp",
          providerMessageId: status.id,
          phoneNumberId,
          status: ["sent", "delivered", "read", "failed"].includes(status.status) ? status.status : "unknown",
          timestamp: Number.isFinite(Number(status.timestamp)) ? Number(status.timestamp) : null,
          errorCodes: Array.isArray(status.errors)
            ? status.errors.map((error) => String(error.code ?? "unknown").slice(0, 40))
            : []
        });
      }
    }
  }

  return { messages, statuses, ignored: messages.length === 0 && statuses.length === 0 };
}

/**
 * Send free-form text only inside an active customer-service window and after
 * the customer has opted in. Outside that window, use an approved template.
 * Never call this directly from an untrusted browser request.
 */
export async function sendWhatsAppText({
  phoneNumberId,
  to,
  text,
  accessToken,
  graphApiVersion,
  serviceWindowOpen,
  customerOptedIn,
  fetchImpl = fetch
}) {
  if (!accessToken) throw new Error("WHATSAPP_ACCESS_TOKEN_MISSING");
  if (!PHONE_ID_PATTERN.test(String(phoneNumberId ?? ""))) throw new Error("WHATSAPP_PHONE_NUMBER_ID_INVALID");
  if (!WA_ID_PATTERN.test(String(to ?? ""))) throw new Error("WHATSAPP_RECIPIENT_INVALID");
  if (typeof text !== "string" || !text.trim() || text.length > MAX_TEXT_LENGTH) {
    throw new Error("WHATSAPP_TEXT_INVALID");
  }
  if (customerOptedIn !== true) throw new Error("WHATSAPP_CUSTOMER_OPT_IN_REQUIRED");
  if (serviceWindowOpen !== true) throw new Error("WHATSAPP_TEMPLATE_REQUIRED_OUTSIDE_SERVICE_WINDOW");
  if (!GRAPH_VERSION_PATTERN.test(String(graphApiVersion ?? ""))) throw new Error("WHATSAPP_GRAPH_API_VERSION_INVALID");

  const response = await fetchImpl(
    `https://graph.facebook.com/${graphApiVersion}/${phoneNumberId}/messages`,
    {
      method: "POST",
      headers: {
        authorization: `Bearer ${accessToken}`,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to,
        type: "text",
        text: { preview_url: false, body: text.trim() }
      })
    }
  );

  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error("WHATSAPP_PROVIDER_SEND_FAILED");
    error.status = response.status;
    error.providerCode = typeof result?.error?.code === "number" ? result.error.code : null;
    throw error;
  }
  const providerMessageId = result?.messages?.[0]?.id;
  if (typeof providerMessageId !== "string" || !providerMessageId) {
    throw new Error("WHATSAPP_PROVIDER_RESPONSE_INVALID");
  }
  return { providerMessageId, recipientWaId: result?.contacts?.[0]?.wa_id ?? to };
}
