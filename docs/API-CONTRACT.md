# Tenant-safe inbox API contract

Status: design contract only. It does not mean the API exists.

## Architecture
The dashboard is a static Next.js export. It must never connect directly to Neon. A server-side Neon Function must verify authentication, resolve active tenant membership, access PostgreSQL with a least-privilege runtime role, and return only tenant-scoped data. Do not expose database URLs or secrets to browser assets.

## Proposed endpoints
- GET /api/health — liveness only; no customer data.
- GET /api/inbox/conversations — list conversations for the authenticated user's verified tenant.
- GET /api/inbox/conversations/:id/messages — read messages only after authorizing the parent conversation.
- POST /api/inbox/conversations/:id/messages — persist a draft/queue record; no real channel send by default.
- POST /api/webhooks/:provider — enable only after provider signature, replay, and idempotency checks are implemented.

## Request rules
1. Verify the server-side Better Auth session.
2. Resolve an active membership for that user. Never trust a tenant ID or role supplied by the browser.
3. Start a database transaction and set tenant context transaction-locally from the verified membership.
4. Execute parameterized, tenant-scoped queries under a least-privilege role; rely on RLS as defense in depth.
5. Commit or roll back the transaction. Never leave tenant context on a pooled session.
6. Return generic errors; do not log tokens, message bodies, SQL, or stack traces.

## Required tests
- Missing/expired/invalid session is rejected.
- Invited and suspended memberships are denied.
- Tenant A cannot read or mutate Tenant B's conversations or messages, even with a guessed UUID.
- Missing tenant context denies access under RLS; tenant context cannot bleed across pooled requests.
- Invalid IDs, unsupported enums, malformed cursors, and oversized payloads are rejected.
- Duplicate provider event IDs are idempotent.
- Private responses use no-store caching.
- Static browser assets contain no database URL or server-only secret.
- Browser tests distinguish persisted API results from simulator data.

## Release gates
- [ ] Versioned, reproducible server function source and package.
- [ ] Verified least-privilege runtime grants; no owner credential in app traffic.
- [ ] Session verification, membership lookup, and tenant isolation tests pass on development branch.
- [ ] Inbox reads/writes are durable and browser E2E passes.
- [ ] Production auth origins/callbacks are configured and tested.
- [ ] Official provider sandbox, webhook verification, delivery retries, and human-approved send test pass.

## Current blockers
The frontend still uses static export and seeded client state. Production auth and API functions are not configured, and no official messaging channel is connected. Status remains prototype, not ready for live customer messaging.
