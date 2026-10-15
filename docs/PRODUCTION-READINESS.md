# Production Readiness Gate — WA AI HOST LIVE / Aptinusa

Last checked: 2026-10-15

## Verified progress

- Main branch commit after the marketing consent ledger: `957e878337444640c08d677f20b37e5e7e203f5d`; Quality checks run [38689348652](https://github.com/Yudi8377/WA-AI-HOST-LIVE/actions/runs/38689348652): **success**.
- GitHub Pages workflow [38689348722](https://github.com/Yudi8377/WA-AI-HOST-LIVE/actions/runs/38689348722): static build and deployment jobs **success**. This verifies the Actions deployment, not a separate browser-based customer journey.
- Delivery ZIP build [38689348695](https://github.com/Yudi8377/WA-AI-HOST-LIVE/actions/runs/38689348695): **success**.
- Aptinusa dry-run queue PR [#34](https://github.com/Yudi8377/WA-AI-HOST-LIVE/pull/34) merged. Its Quality checks run [38691109752](https://github.com/Yudi8377/WA-AI-HOST-LIVE/actions/runs/38691109752): **success**. The queue contract is preview-only and never persists, queues, or sends messages.
- Marketing consent ledger migration `0006_aptinusa_marketing_consent_ledger.sql` was applied **only to the Neon development branch** `br-quiet-lake-b3f99jd3` in project `morning-field-24942730`. Verified all five marketing tables have RLS enabled, FORCE RLS enabled, and one tenant policy each. The campaign table enforces `live_delivery_enabled = false`.
- The migration has **not** been applied to the production branch `br-shy-queen-b3e1ch9j`.

## Confirmed blockers before commercial customer onboarding

1. **Public browser journey:** the GitHub Pages deployment workflow succeeded, but a full browser/device smoke test of navigation, forms, accessibility, and mobile layouts is still outstanding.
2. **Backend hosting:** GitHub Pages serves static assets and cannot execute the Next.js server APIs. A linked production server runtime is not currently verified. The Vercel connection reports no available teams; do not claim the backend is deployed.
3. **Protected customer APIs:** `GET /api/v1/conversations` remains a placeholder returning `RUNTIME_API_NOT_CONFIGURED`. Authenticated conversation/message read/write routes and authorization tests are not production-ready.
4. **Database credentials and roles:** the production role inventory shows `neondb_owner` with `BYPASSRLS`, and `wa_webhook_runtime` with `BYPASSRLS`, role/database creation privileges, and membership in `neon_superuser`. `wa_app_runtime_safe` has safe role flags but cannot log in and has no grants on the new marketing tables. Do not use `neondb_owner` or `wa_webhook_runtime` for customer-facing requests. A dedicated least-privilege runtime identity, scoped grants, secret storage, and cross-tenant tests are still required.
5. **Authentication policy:** Better Auth is provisioned, but email/password sign-up has not been verified to require email verification. Google OAuth is not confirmed operational because client credentials were not verified.
6. **Official channels:** WhatsApp, TikTok, Facebook, Instagram, and Shopee have not passed provider-authorized end-to-end messaging tests. Live webhook and delivery remain disabled.
7. **Subscriptions and payments:** subscription entitlement enforcement, a verified payment provider, signed/idempotent billing webhooks, cancellation/refund paths, and billing reconciliation have not passed end-to-end tests.
8. **Operational readiness:** browser/device QA, load testing, backup restoration, incident alerts, retention/deletion flows, and independent security review remain outstanding.

## Safety decisions

- Do not enable real SMS/WhatsApp/email delivery based only on static CI or the dry-run queue contract.
- Keep customer marketing destinations encrypted in application code; use a keyed HMAC for lookup hashes. Never log raw destinations, access tokens, or message bodies.
- Re-check tenant membership, current purpose/channel-specific consent, revocation, suppression, provider authorization, campaign approval, spend cap, quiet hours, frequency cap, and idempotency immediately before a real delivery.
- Apply schema changes to a development branch first, run RLS tests as a non-owner `NOBYPASSRLS` runtime role, and only then prepare a reviewed production migration.
- Do not advertise integrations, payments, authentication methods, or live delivery until verified end-to-end.

## Next execution sequence

1. Secure a real server runtime connected to the repository and verify its production deployment and environment-secret controls.
2. Implement session verification, tenant membership/role authorization, transaction-scoped tenant context, and protected conversation/message APIs.
3. Provision a dedicated least-privilege database role with no `BYPASSRLS`, no role/database creation, only required table/function grants, and credentials stored only in the server runtime secret manager.
4. Add cross-tenant RLS and auth integration tests; do not use owner credentials in application requests.
5. Connect one official channel at a time using provider sandbox credentials, signed webhook verification, opt-out handling, idempotent delivery events, and spend/rate limits.
6. Integrate subscription entitlements and a payment provider, then test checkout, renewals, failed payments, cancellations, refunds, and webhook replay.
7. Complete end-to-end QA, recovery, monitoring, and security review before onboarding paying customers.

## Honest status

**The static build/deployment pipeline and the marketing-ledger development migration are verified. WA AI HOST LIVE / Aptinusa is not yet verified as a commercially live full-stack service.** The protected API, least-privilege production runtime identity, provider credentials, payment integration, and full end-to-end tests are material blockers.
