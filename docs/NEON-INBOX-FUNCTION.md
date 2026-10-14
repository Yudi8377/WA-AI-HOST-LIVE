# Neon inbox API function

Source: `functions/inbox-api/index.mjs`.

## Endpoints currently implemented
- `GET /api/health`: liveness only; never includes database information.
- `GET /api/session/tenants`: requires a verified Neon Better Auth session, then resolves active tenant memberships via the private database function.

This is not yet a live messaging API. It does not read/write inbox messages or call WhatsApp/provider APIs. It must not be represented as a live customer messaging connection.

## Required server-side configuration
- `NEON_AUTH_BASE_URL`: exact Neon Auth base URL including its path prefix.
- `WA_APP_DATABASE_URL`: pooled connection string for the dedicated `wa_app_runtime` login role. Never use the owner role.
- `ALLOWED_ORIGIN`: one exact trusted dashboard origin; no wildcard.

Do not commit any connection string or secret. Configure values only in the Neon Function environment.

## Mandatory pre-deployment checks
0. **Runtime-role blocker found on the current development branch:** `wa_app_runtime` currently has elevated role attributes and membership in `neon_superuser`. Do not use it for application traffic. The migration now withholds grants unless the role has no elevated attributes and no inherited role memberships. Provision a clean least-privilege login role through an authorized Neon role-management flow before continuing; do not try to work around permission denials.
1. Verify the frontend authentication transport. GitHub Pages and the Neon Auth/Function URLs are separate origins; do not assume an HttpOnly auth cookie for Neon Auth will be attached to a request to the Function hostname. If the browser cannot securely convey a verifiable session, do not deploy this as an authenticated endpoint. Configure a supported token/session transport first.
2. Apply `db/migrations/0002_auth_membership_bootstrap.sql` to the development branch only after verifying the role and the auth-subject mapping.
3. Verify the runtime connection's `current_user` is not `neondb_owner`, and ensure it has only required grants.
4. Test missing/expired session, suspended membership, no membership, and two tenants. Do not expose tenant IDs/roles supplied by the browser as authority.
5. Build a reproducible ZIP with this handler and the `postgres` runtime dependency; deploy to development and test the actual endpoint before production.
6. Add a separately reviewed inbox data adapter and provider webhook/send pipeline before claiming messaging readiness.

## Smoke test
Run `npm run test:inbox-api`. These tests exercise CORS, liveness, and unauthenticated rejection only; they do not prove provider integration, database authorization, or end-to-end authentication.
