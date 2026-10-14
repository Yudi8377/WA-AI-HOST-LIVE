# WhatsApp-first launch plan

Status: **adapter foundation implemented; channel not connected; not production-ready yet**.

## What this phase provides

- Meta webhook challenge validation.
- HMAC SHA-256 validation over the exact raw request body.
- Normalization of inbound text messages and delivery statuses.
- Outbound Cloud API text sender with strict input checks.
- Guardrails requiring explicit customer opt-in and an open 24-hour customer-service window for free-form text.
- Contract tests that do not require a Meta account or send real messages.

## Required production architecture

1. Public HTTPS webhook runtime (not GitHub Pages static export).
2. Verify `x-hub-signature-256` against the raw bytes before parsing JSON.
3. Map `metadata.phone_number_id` to exactly one active `channel_connections` row; reject unknown/revoked numbers.
4. Persist the provider event with a unique provider event ID and process it idempotently.
5. Persist customer/conversation/message in a single transaction under a tenant-scoped database context.
6. Acknowledge Meta promptly; schedule AI work separately with retries and dead-letter handling.
7. Keep AI output as a draft until the product knowledge/policy checks pass. Human handoff is the default for uncertain claims, complaints, refunds, and other sensitive actions.
8. Send outbound messages only through the official Graph API; persist provider message ID and delivery status.
9. Keep access tokens and app secrets in deployment secret storage, never in Git, frontend code, or client-visible logs.

## Environment needed by the runtime

- `WHATSAPP_ACCESS_TOKEN` — permanent/system-user token with minimum approved scopes.
- `WHATSAPP_PHONE_NUMBER_ID` — phone number ID from the WhatsApp Business Platform.
- `WHATSAPP_VERIFY_TOKEN` — high-entropy random value configured identically in Meta webhook settings and the runtime.
- `WHATSAPP_APP_SECRET` — Meta app secret used to validate signatures.
- `WHATSAPP_GRAPH_API_VERSION` — supported Graph API version confirmed in the Meta app dashboard at release time.
- `DATABASE_URL` — least-privilege runtime database role, not owner credentials.

Do not place any of these values in a GitHub issue, commit, or browser bundle.

## External onboarding that cannot be fabricated by code

A real launch requires a Meta Business Portfolio, a WhatsApp Business Account and approved phone number, app/webhook subscription, permissions, customer opt-in language, privacy policy and terms, and approved message templates for outreach outside the 24-hour service window. These account approvals and secrets are not present in the repository, so the code must stay in a safe disconnected state until they are configured.

## Release gates

- [ ] Production runtime and secret storage deployed.
- [ ] Webhook challenge succeeds from Meta.
- [ ] Invalid signature returns 401; no body is processed.
- [ ] Duplicate webhook events are idempotent.
- [ ] Unknown/revoked phone number IDs are rejected.
- [ ] Inbound test message appears once in the correct tenant inbox.
- [ ] Reply inside the allowed service window is sent and provider ID persisted.
- [ ] Out-of-window free-form reply is blocked; approved template path tested separately.
- [ ] Tenant isolation, opt-out, rate limiting, retries and incident rollback tested.
- [ ] Privacy, support, pricing and customer onboarding materials approved.
