# Aptinusa backend phase 02 — API & identity gates

## Current implementation state
- The public Next.js frontend uses `output: "export"`. Its `GET /api/health` route is a static-export-safe fallback and reports `status: static`; it is not a live readiness probe.
- A development Neon health function is deployed, but it currently reports a development-only liveness response and does not validate database connectivity or production dependencies.
- `GET /api/v1/conversations` is a static placeholder that returns `RUNTIME_API_NOT_CONFIGURED`. It does not read tenant data and must not be presented as a working conversation API.
- No production conversation read/write route is enabled. This is intentionally fail-closed until verified server sessions, tenant membership, a least-privilege runtime database role, and transaction-scoped RLS context are wired.
- The production Neon branch has the 12 core application tables. RLS is enabled on every public application table and forced on all tenant-owned tables; `app_users` has enabled-but-not-forced RLS for trusted identity provisioning.
- Production Neon Auth was provisioned with Better Auth on 2026-10-14. The GitHub Pages origin `https://yudi8377.github.io` has been added to its trusted-origin allowlist. This does not by itself make login production-ready.

## Environment audit (2026-10-14)
- Neon project: `WA AI HOST LIVE`, production branch `br-shy-queen-b3e1ch9j`, database `neondb`.
- Production Auth uses Better Auth and its Neon-managed endpoint. Email/password sign-up is currently enabled without mandatory email verification. The configured Google OAuth provider has no client ID/secret visible in the configuration; do not advertise Google sign-in as operational.
- The production database currently has only the `neondb_owner` login role in the checked runtime-role set; it has `BYPASSRLS`. No dedicated `wa_app_runtime` role was found. Application traffic must not use the owner role.
- GitHub Actions quality checks pass. The Pages workflow can build and upload a static artifact, but the last recorded successful workflow did not publish a Pages deployment because the repository Pages enablement variable is opt-in. A successful workflow run is not proof that the public site is live.

## Remaining implementation gates
1. Configure email verification and production sign-in policy; do not rely on unconfigured Google OAuth.
2. Create a dedicated least-privilege runtime role and secret-managed connection, with no `BYPASSRLS`; do not expose database credentials to the browser.
3. Implement server-side Better Auth session verification, mapping of authenticated provider subjects to `app_users.id`, active membership checks, role authorization, and suspended-tenant denial.
4. Set `app.tenant_id` only within each database transaction after membership verification. Never accept tenant identity from request parameters or headers without server-side authorization.
5. Add authenticated conversation/message read and write handlers with pagination, schema validation, rate limiting, request correlation, and audit events.
6. Test two tenants, expired/revoked sessions, missing membership, suspended tenants, malformed IDs, transaction rollback, and cross-tenant reads/writes using the non-owner runtime role.
7. Apply the reviewed subscription-entitlements migration only after its RLS policies, grants, authorization rules, and webhook signature/idempotency handling are tested on a disposable branch.
8. Publish GitHub Pages after a repository administrator enables **Settings → Pages → GitHub Actions** and sets repository Actions variable `PAGES_ENABLED=true`. The workflow then deploys on the next push to `main`.

## Not yet implemented
No public production conversation API, outbound message sending, subscription billing, official WhatsApp/TikTok/Facebook/Shopee connector, or end-to-end customer onboarding is enabled. Do not onboard real customers or store/process real customer messages until the gates above pass.
