import { readFileSync } from "node:fs";
import assert from "node:assert/strict";

const sql = readFileSync(
  new URL("../db/migrations/0002_auth_membership_bootstrap.sql", import.meta.url),
  "utf8",
);

const required = [
  /CREATE SCHEMA IF NOT EXISTS app_private/i,
  /CREATE OR REPLACE FUNCTION app_private\.resolve_active_memberships\(p_auth_subject text\)/i,
  /SECURITY DEFINER/i,
  /SET search_path = pg_catalog, public/i,
  /REVOKE ALL ON FUNCTION app_private\.resolve_active_memberships\(text\) FROM PUBLIC/i,
  /u\.auth_provider = 'better_auth'/i,
  /u\.auth_subject = p_auth_subject/i,
  /m\.status = 'active'/i,
  /t\.status = 'active'/i,
  /GRANT EXECUTE ON FUNCTION app_private\.resolve_active_memberships\(text\) TO wa_app_runtime/i,
  /AND NOT rolsuper/i,
  /AND NOT rolcreatedb/i,
  /AND NOT rolcreaterole/i,
  /AND NOT rolreplication/i,
  /AND NOT rolbypassrls/i,
  /FROM pg_catalog\.pg_auth_members/i,
  /REVOKE ALL ON FUNCTION app_private\.resolve_active_memberships\(text\) FROM wa_app_runtime/i,
  /REVOKE ALL ON SCHEMA app_private FROM wa_app_runtime/i,
  /RAISE WARNING .*no runtime grants were issued/i,
];

for (const pattern of required) {
  assert.match(sql, pattern, `Security migration is missing required invariant: ${pattern}`);
}

assert.doesNotMatch(
  sql,
  /GRANT\s+EXECUTE\s+ON\s+FUNCTION\s+app_private\.resolve_active_memberships\(text\)\s+TO\s+PUBLIC/i,
  "The private membership function must never be executable by PUBLIC",
);

console.log("Auth membership migration static security checks passed.");
