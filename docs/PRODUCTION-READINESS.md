# Production Readiness Gate — WA AI HOST LIVE

Last checked: 2026-10-14

## Confirmed
- GitHub Actions quality checks pass for the current main-branch implementation.
- Neon production branch: `br-shy-queen-b3e1ch9j`; database: `neondb`.
- The production database contains the 12 core application tables. RLS is enabled on every public application table and forced on all tenant-owned tables. `app_users` uses enabled-but-not-forced RLS for trusted server-side identity provisioning.
- Production Neon Auth is provisioned with Better Auth. The trusted origin `https://yudi8377.github.io` has been added.
- A production Neon health function is deployed at https://br-shy-queen-b3e1ch9j-health.compute.c-4.ap-southeast-1.aws.neon.tech/ . Its deployment status is `completed`; Neon logs show function invocation begin/end. The endpoint reports `status: degraded` intentionally while customer-facing runtime dependencies are missing.
- The public frontend's Next.js build succeeds and its GitHub Actions workflow can build/upload a static artifact.

## Confirmed production blockers
1. **Public website:** GitHub Pages is not yet confirmed published. The repository deployment workflow only performs the Pages deployment when repository Actions variable `PAGES_ENABLED=true` is set. The connected GitHub integration cannot change repository-level Pages/Actions settings. The repository owner must select **Settings → Pages → GitHub Actions** and set that variable.
2. **Runtime database identity:** the checked runtime-role set contains only `neondb_owner`, which has `BYPASSRLS`. A dedicated least-privilege `wa_app_runtime` role was not found. Do not use the owner role for customer-facing application requests.
3. **Authentication policy:** Better Auth is provisioned, but email/password sign-up currently does not require email verification. Google OAuth is listed without visible client ID/secret and must not be advertised as operational.
4. **Protected application APIs:** `GET /api/v1/conversations` remains a static placeholder returning `RUNTIME_API_NOT_CONFIGURED`. No authenticated conversation/message read/write API is live.
5. **Official messaging connectors:** WhatsApp, TikTok, Facebook, Instagram and Shopee are not connected for live message processing.
6. **Subscriptions:** subscription-entitlements migration remains review-only. Its RLS policies, least-privilege grants, effective entitlement enforcement, and signed/idempotent billing webhook handling must be tested before applying it.
7. **End-to-end validation:** customer sign-in, tenant isolation, live messaging, payment, and browser flows have not passed production end-to-end testing.

## Next steps
- Enable GitHub Pages in repository settings and set `PAGES_ENABLED=true`.
- Configure a verified production sign-in policy and trusted sender; do not enable unverified production account flows for real customers.
- Create a dedicated no-`BYPASSRLS` runtime database role and store credentials only in server runtime secrets.
- Implement Better Auth session verification, identity mapping, membership/role checks, transaction-scoped `app.tenant_id`, audit logs and protected conversation/message APIs.
- Run cross-tenant isolation tests on a disposable branch using the non-owner runtime role.
- Complete and test subscription entitlements and each official channel connector separately; never claim an integration is live before its provider credentials and end-to-end tests pass.

## Honest status
**Production health endpoint deployed; application is not yet ready for real customers.** The health endpoint reports degraded readiness by design. The public Pages deployment, protected customer APIs, verified sign-in policy, least-privilege runtime DB access, subscription enforcement, and live channel connectors remain outstanding. Do not onboard customers or process real customer messages yet.
