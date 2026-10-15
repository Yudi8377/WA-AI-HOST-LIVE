# Aptinusa Proximity Marketing & SMS Gateway

Status: technical product specification and safe MVP plan. This document does not mean a telecom connection, SMS delivery, WhatsApp integration, location tracking, or production deployment is already active.

## Executive decision

Build a consent-based proximity marketing system, not a system that silently identifies passers-by or sends unsolicited messages.

A phone's GPS/Bluetooth signals do not expose its phone number to Aptinusa. SMS needs a valid destination number and a permitted sending route; WhatsApp needs a user-initiated conversation or an approved business messaging path under the provider's current policies. Proximity can be a discovery signal, but it is not consent to contact someone.

## Product experiences

### 1. Zero-cost discovery MVP
- Give every business a public landing page, product catalog, QR code, and short link.
- A visitor scans the QR, views an offer, and can optionally request a coupon.
- A separate unchecked opt-in lets the visitor choose WhatsApp, SMS, or email and see what they are agreeing to.
- If they do not opt in, they can still view the offer. Viewing a page must not silently subscribe them.
- Measure QR visits, coupon claims, click-to-chat, and redemptions without collecting unnecessary personal data.

### 2. Proximity app experience (later)
- An optional Aptinusa consumer app can request foreground/background location and Bluetooth permissions with a clear explanation and revocable setting.
- A business-owned BLE beacon can broadcast an opaque rotating identifier. The app may show an in-app offer only when the user enabled nearby offers.
- Never attempt to derive phone numbers from GPS, Bluetooth, Wi-Fi scans, or device identifiers.
- Do not send SMS or WhatsApp merely because a beacon or geofence was detected. The event may trigger an on-device notification if the user explicitly enabled it; marketing channel consent is separate.
- Respect platform background-execution limits, OS notification permissions, and location privacy requirements.

### 3. SMS/WhatsApp follow-up
- A visitor submits their number themselves and chooses the channel, purpose, and frequency.
- Store tenant-scoped consent evidence: timestamp, source, disclosure version, channel, purpose, and revocation time.
- Confirm subscriptions when appropriate. Provide a clear opt-out such as STOP/BERHENTI and process inbound opt-out immediately.
- Before every send, check current consent, tenant scope, suppression list, quiet hours, frequency caps, template/provider requirements, budget, and campaign approval.
- Only use an authorized SMS aggregator/SMPP provider and official WhatsApp Business Platform/provider. No SIM farms, spoofing, private-session scraping, or bypassing platform controls.

## What does “build our own SMS gateway” mean?

Aptinusa can own the orchestration gateway: campaign API, queue, tenant quotas, consent validation, templates, routing, retries, delivery receipts, cost accounting, and audit logs.

Aptinusa still needs a telecom path:
- For a production service, contract an authorized SMS aggregator or operator with documented API or SMPP access, sender-ID requirements, delivery receipt support, and pricing.
- SMPP is a protocol, not a free connection to mobile networks. Direct operator connectivity requires commercial and technical authorization.
- A GSM modem/SIM can be useful for a controlled lab experiment, but it is not recommended as the public multi-tenant production gateway: throughput, carrier filtering, sender identity, reliability, abuse prevention, and compliance are difficult to operate.
- Keep provider credentials in deployment secrets, never in Git or browser code.

## Recommended architecture

1. **Business/offer service:** tenant-scoped profiles, offer landing pages, QR and short links.
2. **Consent ledger:** channel-specific opt-in, disclosure version, source, timestamp, purpose, revoked timestamp.
3. **Campaign manager:** drafts, audience criteria, frequency cap, schedule, estimated provider cost, human approval.
4. **Policy gate:** fail-closed decision before enqueue/send. No consent or any suppression match means no send.
5. **Queue and worker:** idempotent jobs, per-tenant rate limits, bounded retries, dead-letter handling, provider timeouts.
6. **Provider adapters:** SMS provider interface and official WhatsApp provider interface; keep provider-specific status mapping separate.
7. **Webhook receiver:** authenticate/signature-check provider callbacks, deduplicate event IDs, validate state transitions.
8. **Analytics:** accepted, queued, submitted, delivered, failed, clicked, coupon redeemed. Never label submitted as delivered or delivered as a sale.
9. **Admin controls:** pause all sends, pause a tenant, spend caps, daily caps, quiet hours, abuse alerts, audit export.

## Minimum consent record

Recommended fields:
- tenant_id
- contact_id
- channel (sms, whatsapp, email)
- purpose (offers, order_updates, service_messages)
- status (active, revoked)
- source (QR, web form, in-store form, checkout)
- captured_at
- disclosure_version
- proof/reference for the opt-in event
- revoked_at and revocation_source

Marketing consent must not be inferred from a purchase, a phone number appearing on a business card, a nearby-device signal, a public directory, or an unrelated service interaction. Service messages and marketing offers should be separated by purpose.

## Suggested tenant-isolated entities

- `business_offers`: tenant_id, business_profile_id, title, public_slug, valid_from, valid_until, status.
- `proximity_beacons`: tenant_id, beacon_id_hash, location_label, status, rotated_identifier metadata; never store raw personal device identifiers.
- `marketing_contacts`: tenant_id, channel, normalized_destination encrypted or otherwise access-controlled, created_at, source.
- `marketing_consents`: tenant_id, contact_id, channel, purpose, status, captured_at, disclosure_version, revoked_at.
- `suppression_entries`: tenant_id, channel, destination_hash, reason, created_at.
- `campaigns`: tenant_id, channel, audience_rule, status, approved_by, approved_at, max_spend, estimated_cost.
- `message_jobs`: tenant_id, campaign_id, contact_id, provider, idempotency_key, status, attempts, provider_message_id.
- `message_events`: tenant_id, job_id, provider_event_id, event_type, occurred_at, safe_metadata.
- `offer_events`: tenant_id, offer_id, event_type, event_time, anonymous_session_id or consented contact reference.

These are proposed entities, not an approved migration. Review existing schema, RLS, tenant boundaries, encryption, retention, webhook idempotency, and access roles before creating tables.

## Fail-closed send policy

A message may be queued only if all checks pass:
1. Authenticated actor is authorized for the tenant and campaign.
2. Destination was supplied by the contact or another documented lawful source.
3. Active consent matches tenant + destination + channel + purpose.
4. Destination is not suppressed and no opt-out is pending.
5. Provider, sender identity, template, and account are approved/configured.
6. Tenant and platform spend/rate/frequency caps allow it.
7. Campaign is approved by a permitted human when it has external impact or cost.
8. The request has a stable idempotency key and passes abuse/rate-limit checks.

If any check is missing or errors, do not send. Record a safe reason code, not the full destination or message body in generic logs.

## Pricing hypothesis (to validate)

Do not promise “unlimited SMS” inside a flat subscription. Separate:
- Aptinusa campaign management subscription;
- provider message cost, shown transparently or charged through a disclosed prepaid wallet;
- optional onboarding and managed campaign service;
- AI content usage quotas.

Start with QR/offer/landing pages as a low-cost feature. Add paid messaging only after provider pricing, delivery quality, sender registration, taxes, abuse controls, and unit economics are verified.

## Release phases

### Phase A — safe no-message MVP
- Public offer page and QR/short-link generation.
- Business-controlled offer editor and preview.
- Optional contact form with explicit, unchecked channel consent.
- Consent/revocation UX design and local simulation only.
- Basic event metrics with data minimization.

### Phase B — consent and CRM foundation
- Tenant-isolated contacts, consent ledger, suppression list, export/delete workflow.
- Automated tests proving no cross-tenant access and no send without matching consent.
- Do not connect a live provider until database/runtime security gates pass.

### Phase C — provider sandbox
- Select provider after comparing legal eligibility, local delivery, API/SMPP, sender ID, pricing, receipts, webhook signing, and support.
- Use sandbox/test destinations where available.
- Verify opt-out, duplicates, retries, failure mapping, spend caps, and kill switch.

### Phase D — controlled pilot
- Small number of opt-in businesses and contacts.
- Written pilot terms, support/incident runbook, monitoring, backup/restore, and daily spend caps.
- Expand only after delivery, complaint, opt-out, conversion, and unit-economics reviews.

## Acceptance criteria

- A visitor can view offers without submitting a phone number or subscribing.
- Consent is channel- and purpose-specific, recorded, revocable, and tenant-scoped.
- No code path can enqueue a message without passing the fail-closed policy.
- Opt-out prevents future marketing sends even if a queued job exists.
- Cross-tenant access tests fail closed.
- Provider webhooks are authenticated and idempotent.
- Dashboard distinguishes simulation from provider-confirmed submission/delivery.
- Default state is `liveMessagingEnabled: false`.
- No claim that every passer-by can be reached automatically.
