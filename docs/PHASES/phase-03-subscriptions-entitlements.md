# Phase 03 — Subscription catalog and module entitlements

## Scope
This phase adds a schema proposal for the Aptinusa SaaS control plane. It is intentionally a review-only migration and has not been applied to Neon.

## Tables
- `module_catalog`: separately sellable features, e.g. WhatsApp inbox, AI replies, CRM, analytics, TikTok connector, Shopee connector, multi-channel orchestration.
- `plan_catalog`: pricing and billing cadence. Prices are stored as integer currency amounts; confirm whether the selected billing provider expects rupiah or minor units before integration.
- `plan_module_entitlements`: which modules a plan includes and structured limits.
- `tenant_subscriptions`: tenant subscription lifecycle, trial window, billing-provider references and renewal period.
- `tenant_module_overrides`: audited administrative exception concept with reason and expiry.
- `billing_webhook_events`: deduplication and lifecycle for provider billing webhooks.

## Security gates before applying
1. Add RLS policies to every tenant-scoped table and test cross-tenant isolation.
2. Define read/write roles and grants; do not expose service or owner database credentials to browser code.
3. Verify admin role on every control-plane mutation.
4. Verify webhook signatures, timestamp tolerance, replay protection and idempotency.
5. Never trust a plan name or module list supplied by the browser; derive effective entitlements server-side.
6. Add transactional subscription state transitions and tests for duplicates, retries, cancellation and past-due states.
7. Run against a disposable Neon development branch and record migration checksum before any production approval.

## Business boundary
The schema is a foundation only. No payment processor, customer billing, subscription renewal, entitlement enforcement, or production admin action is live yet. Prices and plan packaging remain business decisions; do not seed fictional prices into production.
