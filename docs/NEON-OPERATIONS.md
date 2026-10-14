# Neon Operations and Release Gates

## Infrastructure boundary

The application source of truth is GitHub and PostgreSQL is Neon. Do not add Supabase or put a Neon connection string in client-side code. GitHub Pages is static hosting only; it cannot run Next.js server routes. A real deployment must either use a Neon-supported data/auth path suitable for browser access with RLS, or explicitly approve a server runtime. Until then, the UI is a simulator, not a live omnichannel service.

## Database environments

- Neon project: `morning-field-24942730`.
- Production/default branch: `br-shy-queen-b3e1ch9j` (`production`). No application migrations were applied there.
- Development branch: `br-quiet-lake-b3f99jd3` (`wa-ai-host-live-dev`), branched from production before schema setup.
- Initial schema and tenant RLS migrations are applied to the development branch only.

## Migration and verification results

- [x] Confirmed the production branch had no application tables before setup.
- [x] Applied `0001_initial.sql` and `0002_tenant_rls.sql` transactionally to the development branch.
- [x] Confirmed all 12 application tables exist on development.
- [x] Confirmed RLS is enabled and forced with one policy on every tenant-scoped table. `app_users` has RLS enabled but is not forced so trusted provisioning can resolve identities; never expose owner-level queries through public APIs.
- [x] Created a development-only `wa_app_runtime_safe` role with `NOBYPASSRLS` and no login. Under this role, synthetic Tenant A/B reads returned exactly one tenant, one membership, and one customer each.
- [x] Verified a cross-tenant customer insert is rejected with PostgreSQL's row-level security policy error; test fixtures were cleaned up.
- [x] Added repeatable RLS checks in `scripts/test-tenant-rls-smoke.sql` and `scripts/test-tenant-isolation.sql`. Run them with a `NOBYPASSRLS` role; the owner role has `BYPASSRLS` and is not a valid test identity.
- [x] GitHub Actions quality checks passed for commit `d743405cdfe4750add85693ca65069f0ac8361fa`.
- [x] Enabled Neon Managed Better Auth on the development branch and allow-listed the GitHub Pages origin for future UI integration; no auth UI is wired into the dashboard yet.
- [x] Deployed a development-only Neon Function health endpoint: https://br-quiet-lake-b3f99jd3-health.compute.c-4.ap-southeast-1.aws.neon.tech/ (deployment status is completed; external HTTP invocation could not be verified by the available fetch tool).
- [ ] Integrate the Neon Auth SDK into the dashboard and verify sign-up/sign-in/session behavior.
- [x] Deployed a self-contained interactive preview dashboard on Neon Functions: https://br-quiet-lake-b3f99jd3-dashboard.compute.c-4.ap-southeast-1.aws.neon.tech/ . It uses synthetic in-memory data and is not a real inbox.
- [ ] Enable GitHub Pages manually in repository Settings → Pages → Build and deployment → GitHub Actions. The latest workflow successfully built and uploaded the static export, but `actions/configure-pages` was rejected with `Resource not accessible by integration`; this is a GitHub permission/site-activation blocker, not a build failure.
- [ ] Implement tenant-aware persistent inbox APIs and test them end-to-end.
- [ ] Connect and test official channel adapters end-to-end.

## Runtime authorization contract

- Authenticate the caller before accepting a tenant ID.
- Pass the verified internal `app_users.id` and tenant UUID to `withTenantDatabase(userId, tenantId, callback)`.
- The helper sets a transaction-local tenant context and independently verifies an active membership before invoking the callback.
- Never trust user IDs or tenant IDs from a request body, query string, or untrusted header.
- Runtime connections must use a least-privilege role with `NOBYPASSRLS`; never use the Neon owner/BYPASSRLS connection for public API request handlers.
- `wa_app_runtime_safe` is a test role only: `NOLOGIN NOBYPASSRLS`. It is not a production credential.
- Webhook ingestion requires provider signature verification, idempotency, and an explicit service-role/path; do not weaken tenant policies for unauthenticated ingestion.
- Keep secrets in server-side environment variables only.

## Release rule

Do not label the product production-ready until all unchecked gates above are complete. GitHub Actions passing means the repository checks passed; it does not mean the app is deployed or that WhatsApp/social channels are connected.
