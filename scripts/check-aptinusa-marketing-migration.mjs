import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const sql = readFileSync(new URL("../db/migrations/0006_aptinusa_marketing_consent_ledger.sql", import.meta.url), "utf8");
const required = [
  /CREATE TABLE IF NOT EXISTS marketing_contacts/i,
  /destination_ciphertext text NOT NULL/i,
  /destination_hash text NOT NULL/i,
  /CREATE TABLE IF NOT EXISTS marketing_consents/i,
  /status IN \('unknown','opted_in','opted_out'\)/i,
  /notice_version IS NOT NULL/i,
  /captured_at IS NOT NULL/i,
  /revoked_at IS NULL/i,
  /CREATE TABLE IF NOT EXISTS marketing_suppressions/i,
  /CREATE TABLE IF NOT EXISTS marketing_campaigns/i,
  /live_delivery_enabled boolean NOT NULL DEFAULT false CHECK \(live_delivery_enabled = false\)/i,
  /estimated_cost_minor <= spend_limit_minor/i,
  /CREATE TABLE IF NOT EXISTS marketing_campaign_events/i,
  /UNIQUE \(tenant_id, idempotency_key\)/i,
  /ALTER TABLE %I ENABLE ROW LEVEL SECURITY/i,
  /ALTER TABLE %I FORCE ROW LEVEL SECURITY/i,
  /USING \(tenant_id = app_current_tenant_id\(\)\)/i,
  /WITH CHECK \(tenant_id = app_current_tenant_id\(\)\)/i,
];
for (const pattern of required) assert.match(sql, pattern, `Missing marketing ledger invariant: ${pattern}`);
assert.doesNotMatch(sql, /DROP TABLE|TRUNCATE|DELETE FROM/i, "Migration must be additive and non-destructive");
console.log("Aptinusa marketing consent ledger migration checks passed.");
