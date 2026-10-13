# Neon Operations and Release Gates

## Infrastructure boundary

The application source of truth is GitHub and PostgreSQL is Neon. Do not add Supabase or put a Neon connection string in client-side code. GitHub Pages is static hosting only; it cannot run Next.js server routes. A real deployment must either use a Neon-supported data/auth path suitable for browser access with RLS, or explicitly approve a server runtime. Until then, the UI is a simulator, not a live omnichannel service.

## Safe migration procedure

1. Confirm the Neon project is `morning-field-24942730` and branch is `br-shy-queen-b3e1ch9j`; do not assume that branch is disposable or non-production.
2. Inspect existing tables and the result of migration `0001_initial.sql` before changing anything.
3. Apply `db/migrations/0002_tenant_rls.sql` only after confirming the expected tables and columns exist.
4. Run `scripts/verify-tenant-rls.sql`. Every listed table should show RLS enabled, RLS forced, and at least one policy.
5. Verify a query without `app.tenant_id` sees no tenant rows; verify a tenant-scoped transaction sees only rows for that tenant. Use two isolated test tenants and synthetic data.
6. Never test tenant isolation with real customer data.

## Runtime contract

- Authenticate the caller before accepting a tenant ID.
- Check that the authenticated identity has an active membership in that tenant.
- Run all tenant queries through `withTenantDatabase(tenantId, callback)` so the context is transaction-local.
- Never trust a tenant ID supplied by the browser without authorization.
- Keep secrets in server-side environment variables only.
- Webhook ingestion requires signature verification, idempotency, and an explicit service role/path; do not weaken tenant policies to make unauthenticated ingestion work.

## Current release status

- [x] Initial application skeleton and simulator committed to GitHub.
- [x] Initial Neon schema migration drafted.
- [x] Tenant RLS migration and transaction-scoped helper committed.
- [ ] Neon branch/table inventory confirmed by a live database tool.
- [ ] Migrations applied and verified against the actual Neon branch.
- [ ] Authentication, membership authorization, and tenant-isolation integration tests passed.
- [ ] Runtime deployment chosen and live smoke test passed.
- [ ] Official channel adapter tested end-to-end.

Do not label the product production-ready until all unchecked release gates are complete.
