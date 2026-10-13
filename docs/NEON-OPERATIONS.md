# Neon Operations and Release Gates

## Infrastructure boundary

The application source of truth is GitHub and PostgreSQL is Neon. Do not add Supabase or put a Neon connection string in client-side code. GitHub Pages is static hosting only; it cannot run Next.js server routes. A real deployment must either use a Neon-supported data/auth path suitable for browser access with RLS, or explicitly approve a server runtime. Until then, the UI is a simulator, not a live omnichannel service.

## Database environments

- Neon project: `morning-field-24942730`.
- Production/default branch: `br-shy-queen-b3e1ch9j` (`production`). Do not use for test writes.
- Development branch: `br-quiet-lake-b3f99jd3` (`wa-ai-host-live-dev`), branched from production before schema setup.
- Initial schema and tenant RLS migrations have been applied to the development branch only. Production was not changed.

## Migration and verification results

- [x] Confirmed production branch had no application tables before setup.
- [x] Applied `0001_initial.sql` and `0002_tenant_rls.sql` transactionally to the development branch.
- [x] Confirmed all 12 application tables exist on development.
- [x] Confirmed RLS is enabled and forced with one policy on each tenant-scoped table; `app_users` has RLS enabled but is not forced for trusted identity provisioning.
- [x] Smoke test with an unknown tenant UUID returned zero visible rows across all 11 tenant/identity tables queried.
- [ ] Test isolation with two synthetic tenants and cross-tenant read/write denial.
- [ ] Implement and verify a trusted authentication/session provider.
- [ ] Deploy server runtime and configure server-only environment variables.
- [ ] Test official channel adapters end-to-end.

## Runtime authorization contract

- Authenticate the caller before accepting a tenant ID.
- Pass the verified internal `app_users.id` and tenant UUID to `withTenantDatabase(userId, tenantId, callback)`.
- The helper sets a transaction-local tenant context and independently verifies an active membership before invoking the callback.
- Never trust user IDs or tenant IDs from a request body, query string, or untrusted header.
- Never expose unrestricted `app_users` queries through public API routes. Its RLS policy supports tenant-member visibility, while trusted server-side provisioning is still privileged.
- Webhook ingestion requires provider signature verification, idempotency, and an explicit service-role/path; do not weaken tenant policies for unauthenticated ingestion.
- Keep secrets in server-side environment variables only.

## Release rule

Do not label the product production-ready until all unchecked gates above are complete. GitHub Actions passing means the repository checks passed; it does not mean the app is deployed or that WhatsApp/social channels are connected.
