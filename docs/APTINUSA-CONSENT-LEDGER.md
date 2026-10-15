# Aptinusa Consent Ledger — Migration 0006

This additive schema establishes the minimum database record for marketing contacts, channel/purpose-specific consent, suppression, campaign approval metadata, spend limits, and idempotent campaign events.

## Privacy and security

- `destination_ciphertext` is intended to hold application-encrypted destination data; database encryption at rest alone is not a substitute for application-level protection.
- `destination_hash` must be a keyed HMAC of a normalized destination, not a plain unsalted hash, so suppression lookup does not expose phone numbers through easy enumeration.
- Store no raw phone/email, message body, API token, or secret in event metadata/logs.
- Every table enables and forces row-level security, scoped through `app_current_tenant_id()`. The application must set `app.tenant_id` transaction-locally only after authenticating membership. Do not rely on user-supplied tenant IDs.
- The database schema is not a substitute for a least-privilege runtime role. A role with `BYPASSRLS` or superuser membership can defeat these policies.
- Live delivery is constrained false in the initial campaign schema. A later reviewed migration may change this only after runtime, provider, consent, opt-out, audit, and end-to-end release gates pass.

## Application contract

Before a campaign recipient can enter a queue, the server must atomically verify: authenticated tenant membership, contact tenant ownership, active consent for the exact channel and purpose, no suppression entry, verified destination, campaign approval, spend/frequency/quiet-hour limits, idempotency, provider authorization, and an explicit live-delivery feature gate. Re-check consent and suppression at send time, not only when a campaign is drafted.

This migration has not been applied to a database by this commit. Run it first in a development branch and execute cross-tenant RLS tests before any production rollout.
