import { readFileSync } from "node:fs";
import assert from "node:assert/strict";

const sql = readFileSync(
  new URL("../db/migrations/0004_whatsapp_customer_consent.sql", import.meta.url),
  "utf8",
);

const required = [
  /CREATE TABLE IF NOT EXISTS customer_channel_preferences/i,
  /FOREIGN KEY \(tenant_id, customer_id\)\s+REFERENCES customers\(tenant_id, id\)/i,
  /FOREIGN KEY \(tenant_id, channel_connection_id\)\s+REFERENCES channel_connections\(tenant_id, id\)/i,
  /consent_status IN \('unknown','opted_in','opted_out'\)/i,
  /consent_recorded_at IS NOT NULL AND consent_source IS NOT NULL/i,
  /service_window_expires_at timestamptz/i,
  /ALTER TABLE customer_channel_preferences ENABLE ROW LEVEL SECURITY/i,
  /ALTER TABLE customer_channel_preferences FORCE ROW LEVEL SECURITY/i,
  /USING \(tenant_id = app_current_tenant_id\(\)\)/i,
  /WITH CHECK \(tenant_id = app_current_tenant_id\(\)\)/i,
];

for (const pattern of required) {
  assert.match(sql, pattern, `WhatsApp consent migration is missing invariant: ${pattern}`);
}

assert.doesNotMatch(
  sql,
  /DROP TABLE|TRUNCATE|DELETE FROM/i,
  "WhatsApp consent migration must be additive and non-destructive",
);

console.log("WhatsApp consent migration static security checks passed.");
