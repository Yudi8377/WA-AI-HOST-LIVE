# Neon Recheck — WA AI HOST LIVE
Checked: 2026-10-14 07:51 WIB

## Project and branches
- Neon project: `morning-field-24942730` (WA AI HOST LIVE), AWS ap-southeast-1, free tier.
- `production`: `br-shy-queen-b3e1ch9j`, ready/default/primary.
- `wa-ai-host-live-dev`: `br-quiet-lake-b3f99jd3`, ready, compute idle/suspended between requests.
- Database: `neondb`; owner role currently listed as `neondb_owner`.
- Production endpoint compute is active; dev endpoint was idle at the time of inspection.

## Production schema verification
12 application tables are present in `public`: agent_runs, app_users, audit_events, channel_connections, conversations, customers, knowledge_documents, memberships, messages, products, tenants, webhook_events.
Read-only SQL metadata verification confirms:
- RLS enabled on all 12 tables.
- FORCE RLS enabled on the 11 tenant-owned tables; app_users is enabled but not forced.
- 12 policies exist: 11 `tenant_isolation` policies and one `tenant_members_only` SELECT policy on app_users.
- Sample data counts: tenants=0, app_users=0, conversations=0, messages=0. No real customer data is present.
- The tenant policy depends on `current_setting('app.tenant_id', true)`. A server-side request handler must set this transaction-locally after verifying identity and membership. This has not yet been wired into the static dashboard.

## Authentication and app status
- Neon Auth (Better Auth) is configured on dev branch only.
- Production `get_auth` returns not enabled; no production auth integration is configured.
- The deployed Neon Function `dashboard` has deployment status `completed`, Node.js 24, URL https://br-quiet-lake-b3f99jd3-dashboard.compute.c-4.ap-southeast-1.aws.neon.tech/
- The Next.js frontend currently has `output: "export"` and a client-side seeded conversation list. It is a prototype, not a persistent inbox/API.
- Channel integrations (WhatsApp Business, Facebook/Instagram, TikTok, Shopee) are not connected.
- The only listed production DB role is `neondb_owner`; a least-privilege runtime role has not been provisioned.

## Next steps
1. Build a server-side API/runtime that verifies Better Auth sessions, resolves active tenant membership, and sets tenant context in a transaction.
2. Provision a least-privilege DB role for runtime traffic; never expose owner credentials to the browser.
3. Add persistent conversation/message CRUD and cross-tenant read/write tests under the runtime role.
4. Configure production auth only after the canonical app URL/trusted origins and auth callbacks are finalized.
5. Complete independent HTTP/E2E checks and then connect official channel APIs with verified webhooks.

**Status: production schema exists and RLS metadata is verified. Not ready for live customer messaging.**
