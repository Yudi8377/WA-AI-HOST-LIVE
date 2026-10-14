# Auth membership bootstrap migration

Migration: `db/migrations/0002_auth_membership_bootstrap.sql`

## Purpose

The tenant-owned `memberships` table is protected by RLS requiring a tenant context. That creates a bootstrap problem: the API must learn which tenant a signed-in user belongs to before it can set that tenant context.

The migration adds `app_private.resolve_active_memberships(text)`, a narrowly scoped `SECURITY DEFINER` function outside the exposed `public` schema. It returns only active memberships for the fixed provider `better_auth` and a verified auth subject. It does not accept a tenant ID from the caller and does not return customer messages or other tenant data.

## Mandatory controls

1. The API must validate the Better Auth session/JWT server-side before calling this function. Never pass an unverified subject from a request body or query string.
2. Keep the function non-public. Only the server runtime role should have `USAGE` on `app_private` and `EXECUTE` on this function.
3. After selecting a membership, set `app.tenant_id` transaction-locally and perform all tenant queries in the same transaction.
4. Use parameterized SQL. Never expose the database URL to the browser.
5. Test two tenants and two users: no membership, invited/suspended membership, unknown subject, and cross-tenant reads/writes must all deny access.
6. Verify the actual Better Auth user ID maps to `app_users.auth_subject` before production rollout. No mapping is assumed by this migration.

## Rollout

- Apply and test on the Neon development branch first.
- Confirm the runtime role exists and its grants are least-privilege.
- Inspect the function owner and privileges after applying.
- Apply to production only after development tests pass and the production auth configuration is verified.

This file defines the migration; it does not claim the migration has been applied to Neon.
