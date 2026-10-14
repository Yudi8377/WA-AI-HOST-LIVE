# Aptinusa backend phase 02 — API & identity gates

## Implemented in this phase
- `GET /api/health` reports a minimal readiness check; it never returns connection strings, hostnames, or SQL error details.
- `GET /api/v1/conversations` establishes the route contract and rejects malformed tenant identifiers.
- Conversation access deliberately fails closed with HTTP 503 until the verified Better Auth server session adapter is wired.

## Next implementation gate
1. Configure Better Auth against the chosen persistence adapter and verify the server session on every protected request.
2. Map the authenticated provider subject to `app_users.id`; never trust identity supplied by request parameters.
3. Verify active membership and role before calling `withTenantDatabase`.
4. Ensure `app.tenant_id` is set only inside the transaction and all conversation/message queries are tenant scoped.
5. Add pagination, schema validation, rate limiting, audit records and request correlation.
6. Test two tenants, expired/revoked sessions, missing membership, suspended tenant, malformed IDs and transaction rollback.
7. Add a staging-only end-to-end test against a disposable Neon branch before any production migration.

## Not yet implemented
No public conversation read/write API, message sending, billing, OAuth connector or customer authentication is enabled by this phase. The health endpoint is not an uptime monitor.
