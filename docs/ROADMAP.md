# Roadmap and release gates

## Phase 0 — Foundation
- [x] Create GitHub-tracked product blueprint and design baseline.
- [x] Build responsive simulator dashboard with explicit mock-data disclosure.
- [x] Prepare initial Neon schema and tenant-isolation migration files.
- [x] Publish workspace UX improvements and keep demo/noindex disclosures.
- [x] Add WhatsApp Cloud API adapter primitives and automated contract tests.
- [x] Add WhatsApp-first launch gates and operational checklist.
- [ ] Verify live browser availability and Pages deployment from a public client network.

## Phase 1 — Secure core (still a production blocker)
- [ ] Deploy a persistent, authenticated server API runtime; GitHub Pages is frontend-only.
- [ ] Complete auth/session verification and workspace membership mapping.
- [ ] Add server-side tenant authorization and cross-tenant integration tests.
- [ ] Run ordered migrations on the intended non-production branch and record checksums.
- [ ] Implement tenant-scoped repositories for inbox, messages, customer records, products and approved knowledge.
- [ ] Persist conversation assignment, read state, status transitions and audit events.
- Exit gate: no cross-tenant reads/writes; anonymous and expired sessions are denied; privileged actions are audited.

## Phase 2 — AI agent core
- [ ] Provider abstraction with a safe no-key fallback.
- [ ] Tenant-scoped retrieval from approved products/policies/FAQ only.
- [ ] Confidence thresholds, human handoff, and no unsupported claims about price/stock/delivery.
- [ ] Agent trace, feedback, latency/cost measurement, quotas and prompt versioning.
- [ ] Queue/worker with retry, idempotency, dead-letter and cancellation semantics.
- Exit gate: offline evaluation passes; AI messages are drafts until policy and send permission checks pass.

## Phase 3 — WhatsApp Cloud API (first live channel)
- [x] Implement signature verification, GET challenge validation, webhook normalization and guarded text sender.
- [x] Require opt-in and open 24-hour service window for free-form messages.
- [x] Add automated adapter tests to CI.
- [ ] Set up Meta Business Portfolio, WABA, approved number, app scopes and webhook subscription.
- [ ] Deploy webhook and send API on the authenticated persistent runtime with secret storage.
- [ ] Map provider phone-number ID to one active tenant channel; reject unknown/revoked IDs.
- [ ] Persist inbound/outbound messages and provider statuses with idempotency.
- [ ] Verify real inbound, reply, delivery/read status, opt-out, retry and human handoff using an approved test number.
- Exit gate: evidence from a real test tenant, no cross-tenant leakage, rollback tested, privacy/terms/opt-in approved.

## Phase 4 — Product and customer operations
- [ ] Production catalog CRUD, customer directory, inbox, assignment, statuses and canned replies.
- [ ] Subscription entitlements, usage metering, tenant quotas and support workflows.
- [ ] Privacy requests, retention/deletion, data export and audit review.
- [ ] Client onboarding, pricing, terms, privacy policy and service-level expectations.

## Phase 5 — Other channels and live commerce
- [ ] Review official scopes/capabilities before enabling any additional platform.
- [ ] Implement adapters only for supported events/actions.
- [ ] Provide manual Live Host Copilot fallback where platform APIs do not expose live comments.
- Exit gate: per-platform capability matrix and permission review.

## Phase 6 — Operational readiness
- [ ] Browser/accessibility QA, load testing, abuse testing and independent security review.
- [ ] Backup/restore drill, monitoring, alerting, incident response and key rotation.
- [ ] Cost controls and rollback runbook.
- [ ] Final release review before accepting paying customers.

## Completion language
Track these separately: implemented, automated-tested, connected, deployed, externally verified, production-ready. A passing build alone never proves the channel is live.
