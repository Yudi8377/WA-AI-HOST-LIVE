# WhatsApp-first launch plan

Status: **adapter foundation implemented; channel not connected; not production-ready yet**.

## What this phase provides

- Meta webhook challenge validation.
- HMAC SHA-256 validation over the exact raw request body.
- Normalization of inbound text messages and delivery statuses.
- Outbound Cloud API text sender with strict input checks.
- Guardrails requiring explicit customer opt-in and an open 24-hour customer-service window for free-form text.
- Contract tests that do not require a Meta account or send actual messages.

## Required production architecture

1. Public HTTPS webhook runtime (not GitHub Pages static export).
2. Verify `x-hub-signature-256` against raw bytes before parsing JSON.
3. Map `metadata.phone_number_id` to exactly one active `channel_connections` row; reject unknown/revoked numbers.
4. Persist provider events with a unique provider event ID and process idempotently.
5. Persist customer/conversation/message in one transaction under a tenant-scoped database context.
6. Acknowledge Meta promptly; schedule AI work separately with retries and dead-letter handling.
7. Keep AI output as a draft until product knowledge/policy checks pass. Human handoff is the default for uncertain claims, complaints, refunds, and sensitive actions.
8. Send outbound messages only through the official Graph API; persist provider message ID and delivery status.
9. Keep tokens and app secrets in deployment secret storage, never in Git, frontend code, or client-visible logs.

## Required environment

- `WHATSAPP_ACCESS_TOKEN`
- `WHATSAPP_PHONE_NUMBER_ID`
- `WHATSAPP_VERIFY_TOKEN`
- `WHATSAPP_APP_SECRET`
- `WHATSAPP_GRAPH_API_VERSION`
- `DATABASE_URL` using a dedicated least-privilege runtime role.

Never place these values in a GitHub issue, commit, or browser bundle.

## Critical database role finding — 2026-10-15

Read-only inspection of the Neon production branch `production` found:

- `wa_app_runtime_safe`: `rolbypassrls=false`, `rolcanlogin=false`, `rolcreaterole=false`, `rolcreatedb=false`.
- `wa_webhook_runtime`: `rolbypassrls=true`, `rolcreaterole=true`, `rolcreatedb=true`, and membership in `neon_superuser`.

This violates the required least-privilege design. The login role must not be used by a live runtime until an authorized Neon administrator removes its elevated membership and attributes, and the exact effective runtime path is re-tested. An attempted membership revocation through the available connection was rejected for insufficient privilege; no database role change was made. Keep `WHATSAPP_WEBHOOK_ENABLED=false`.

## External onboarding still required

A real launch requires a Meta Business Portfolio, WhatsApp Business Account and approved phone number, app/webhook subscription and permissions, customer opt-in language, privacy policy and terms, and approved templates for messages outside the 24-hour service window. Account approvals and secrets are not present in the repository.

## Release gates

- [ ] Least-privilege runtime role verified on production and development.
- [ ] Public Node-capable runtime and secret storage deployed.
- [ ] Webhook challenge succeeds from Meta.
- [ ] Invalid signature returns 401 before JSON parsing.
- [ ] Duplicate events are idempotent.
- [ ] Unknown/revoked phone IDs are rejected without storing customer content.
- [ ] Inbound test message appears once in the correct tenant inbox.
- [ ] Reply inside the allowed service window is sent and provider ID persisted.
- [ ] Out-of-window free-form reply is blocked; approved template path tested separately.
- [ ] Cross-tenant isolation, opt-out, rate limiting, retries, and rollback tested.
- [ ] Privacy, support, pricing, and customer onboarding materials approved.

The webhook is intentionally disabled and is not yet verified on a public Node runtime. A successful build or configuration preflight is not a production-readiness certificate.
