# WhatsApp Cloud API onboarding

This project must use an official WhatsApp Business Platform integration. The admin's personal WhatsApp number is the notification recipient only; it is not automatically the sender number or a connected business account.

## Private server-side configuration

Set these only in the backend's secret/environment configuration. Never put them in GitHub Pages variables, browser JavaScript, commits, issues, or screenshots.

- `WA_ADMIN_PHONE`: administrator's recipient number in international format, digits only (country code included; no leading plus, spaces, or punctuation).
- `WHATSAPP_PHONE_NUMBER_ID`: sender phone-number ID issued by Meta for the connected WhatsApp Business account.
- `WHATSAPP_ACCESS_TOKEN`: Meta-issued server-side access token with the minimum required permissions.
- `WHATSAPP_VERIFY_TOKEN`: random high-entropy value used only to verify webhook setup.
- `WHATSAPP_APP_SECRET`: Meta app secret used to validate webhook signatures.
- `WHATSAPP_API_VERSION`: supported Graph API version pinned and reviewed before deployment.

The administrator recipient number is intentionally not hardcoded into this public repository.

## Before enabling real messages

1. The owner must control the Meta Business Portfolio and WhatsApp Business Account and complete any required business verification.
2. Connect an eligible sender number to the WhatsApp Business Platform. A personal recipient number alone cannot create that sender connection.
3. Confirm the recipient is opted in to receive operational notifications. Outside the customer-service window, use an approved template; do not assume free-form text is allowed.
4. Configure a public HTTPS webhook, verify the challenge, validate every webhook signature using the raw request body, reject replayed/duplicate events, and store idempotency keys.
5. Keep access tokens and app secrets server-side. Never return them to the browser or include them in logs.
6. Start with a test recipient and approved template; confirm delivery receipts and inbound replies before enabling production sends.
7. Add tenant authorization, audit logs, rate limits, queue/retry with bounded backoff, opt-out handling, and per-tenant usage limits before multi-tenant launch.

## Current truth

No WhatsApp Business sender, Meta token, webhook, or approved message template is configured by this repository change. The API must remain in disabled/not-configured mode until those items are supplied and verified. Never claim a message was sent based only on a successful local API response.


## Source-controlled adapter

The server-side adapter is `functions/whatsapp-adapter/send-admin-notification.mjs`. It fails closed when configuration is missing, limits message length, hides provider error bodies, and returns a provider message ID rather than claiming delivery. It is not wired to a public route.

Mocked tests: `npm run test:whatsapp-adapter`. These tests do not send messages to any phone.
