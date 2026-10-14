# Production Readiness Gate — WA AI HOST LIVE

Last checked: 2026-10-14

## Confirmed
- GitHub Actions: Quality checks #48 and Deploy GitHub Pages #15 completed successfully for commit `2e6ccc9`.
- Neon Function `dashboard` deployment is marked `completed` on development branch `br-quiet-lake-b3f99jd3`.
- Preview URL: https://br-quiet-lake-b3f99jd3-dashboard.compute.c-4.ap-southeast-1.aws.neon.tech/
- Preview is a static interactive prototype using synthetic data. It does not receive or send customer messages.
- Development branch contains the core tables and tenant RLS policies. RLS is enabled and forced for tenant-owned tables.
- Production Neon Auth was provisioned with Better Auth on 2026-10-14. It currently has no trusted origins configured; Google OAuth is listed as a shared provider but has no client credentials visible in the configuration. Do not treat sign-in as launch-ready until origins, email verification, session validation, and tenant provisioning are configured and tested.

## Production database finding
The Neon `production` branch (`br-shy-queen-b3e1ch9j`) had no application tables in the `public` schema when inspected. It must not be treated as a production-ready application database yet.

A schema migration was prepared against a temporary branch and inspected:
- Migration ID: `dd80cd35-6bf9-40e8-9274-838575720f8e`
- Temporary branch: `br-square-hall-b39mwek6`
- Parent branch: `br-shy-queen-b3e1ch9j`
- The temporary branch contains the expected 12 application tables.
- RLS is enabled for all tenant/application tables; RLS is forced for tenant-owned tables. `app_users` intentionally uses enabled-but-not-forced RLS for trusted server-side identity provisioning.
- The production branch still has **no application tables**; enabling Auth did not create the app schema. The earlier prepared schema migration is not applied because the migration-completion connector has a mandatory explicit-approval gate and its exact prepared SQL payload is not available in the current execution context. Do not substitute a hand-reconstructed SQL string into that migration.

## Remaining gates before real customers
1. Complete the prepared production schema migration using its original exact payload and the database migration workflow's required approval gate.
2. Configure a trusted origin and email verification for production Auth; wire Auth sessions to tenant provisioning and enforce authorization on every server-side operation.
3. Add server-only database access using a least-privilege role; do not expose owner credentials to browsers.
4. Add persistent inbox/conversation APIs and tests for cross-tenant read/write isolation under a non-BYPASSRLS runtime role.
5. Connect only official, approved channel APIs; configure secrets in runtime environment, not in source control.
6. Complete end-to-end browser tests and verify the preview URL over HTTP from an independent client.
7. To publish the Next.js static site, a repository administrator must open **Settings → Pages**, select **GitHub Actions** as the build/deployment source, then add repository Actions variable `PAGES_ENABLED=true` under **Settings → Secrets and variables → Actions → Variables**. The workflow successfully builds the static site artifact, but GitHub rejected automatic Pages-site creation with `Resource not accessible by integration`; the connected GitHub permission cannot change this repository-level setting. Once the owner enables Pages and sets the variable, the next main-branch push or manual workflow run will deploy automatically.

## Honest status
**Repository code is merged and static builds pass, but the public Pages deployment and production application runtime are not live.** Production Auth has been provisioned but is not launch-ready; the production app schema is absent. Do not onboard real customers or store/process real customer messages. No claim is made that WhatsApp, TikTok, Facebook, Shopee, or payment integration is active.
