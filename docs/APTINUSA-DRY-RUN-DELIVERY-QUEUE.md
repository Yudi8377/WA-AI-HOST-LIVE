# Aptinusa — Dry-run delivery queue contract

## Status
This is a **preview-only safety boundary**, not a live message queue or provider adapter. It creates a deterministic plan from an already-approved policy decision and makes no network calls, database writes, or delivery attempts.

## Contract
- Only accepts a policy result with `allowed: true` and `decision: allow_queue_only`.
- Requires campaign, tenant, channel, purpose, and an idempotency key.
- Emits a SHA-256 digest of the idempotency key, never the key itself.
- Never accepts or emits a phone number, email address, destination, or message body.
- Always returns `mode: dry_run`, `persisted: false`, `queued: false`, and `deliveryAttempted: false` for accepted plans.
- The plan is immutable; the identifier is deterministic for the same idempotency key.
- It does not prove that consent is current. A real worker must re-check tenant membership, current consent/revocation, suppression, provider authorization, campaign approval, spend caps, quiet hours, frequency limits, and idempotency immediately before sending.

## Before live commercial delivery
Implement and separately review authenticated tenant context, a durable transactional outbox with unique idempotency constraints, encryption/key management, provider-specific signing and webhook verification, retry/backoff/dead-letter handling, opt-out processing, audit events without personal data, rate limits, spend controls, monitoring/alerts, backup recovery, and end-to-end tests with a provider sandbox. Apply database migrations only to a verified non-production branch first. Keep live delivery disabled until all gates pass.
