# Aptinusa backend phase 02 — API & identity gates

## Current implementation state
- The public Next.js frontend uses `output: "export"`. Its `GET /api/health` route is a static-export-safe fallback and reports `status: static`; it is not a live readiness probe.
- Live runtime health must be checked through the separately deployed Neon health function. That function's deployment and operational readiness must be verified independently.
- `GET /api/v1/conversations` is a static placeholder that returns `RUNTIME_API_NOT_CONFIGURED`. It does not read tenant data and must not be presented as a working conversation API.
- No production conversation read/write route is enabled. This is intentionally fail-closed until verified server sessions, tenant membership and transaction-scoped RLS context are wired.

## Next implementation gate
1. Choose and configure the production server-side identity/session adapter; verify the session on every protected request.
2. Map the authenticated provider subject to `app_users.id`; never trust identity supplied by request parameters.
3. Verify active membership and role before calling `withTenantDatabase`.
4. Ensure `app.tenant_id` is set only inside the transaction and all conversation/message queries are tenant scoped.
5. Add pagination, schema validation, rate limiting, audit records and request correlation.
6. Test two tenants, expired/revoked sessions, missing membership, suspended tenant, malformed IDs and transaction rollback.
7. Add a staging-only end-to-end test against a disposable Neon branch before any production migration.

## Not yet implemented
No public conversation read/write API, message sending, billing, OAuth connector or customer authentication is enabled by this phase. The static fallback is not an uptime monitor, and no production readiness claim should be inferred from a successful frontend build.
