import { readFileSync } from "node:fs";
import assert from "node:assert/strict";

const migration = readFileSync(new URL("../db/migrations/0005_whatsapp_webhook_runtime.sql", import.meta.url), "utf8");
const handler = readFileSync(new URL("../api/whatsapp-webhook.ts", import.meta.url), "utf8");
const config = readFileSync(new URL("../next.config.ts", import.meta.url), "utf8");

for (const pattern of [
  /SECURITY DEFINER/i,
  /SET search_path = pg_catalog, public/i,
  /HAVING count\(\*\) = 1/i,
  /REVOKE ALL ON FUNCTION app_private\.resolve_whatsapp_channel\(text\) FROM PUBLIC/i,
  /GRANT EXECUTE ON FUNCTION app_private\.resolve_whatsapp_channel\(text\) TO wa_webhook_runtime/i,
  /GRANT SELECT, INSERT, UPDATE ON public\.messages TO wa_webhook_runtime/i
]) assert.match(migration, pattern, `Migration missing invariant: ${pattern}`);

for (const pattern of [
  /WHATSAPP_WEBHOOK_ENABLED !== "true"/,
  /verifyWhatsAppSignature\(rawBody/,
  /INVALID_WEBHOOK_SIGNATURE/,
  /MAX_BODY_BYTES/,
  /set_config\('app\.tenant_id'/,
  /on conflict \(provider, provider_event_id\) do nothing/i,
  /Unknown\/unconnected phone IDs are acknowledged but never persisted or sent/i,
  /customer_channel_preferences/,
  /service_window_expires_at/
]) assert.match(handler, pattern, `Webhook handler missing invariant: ${pattern}`);

assert.match(config, /isGitHubPages \? \{ output: "export" as const \} : \{\}/);
assert.doesNotMatch(handler, /console\.(log|error)\(/, "Webhook handler must not log message payloads or secrets");
console.log("WhatsApp runtime static security checks passed.");
