# Roadmap and release gates

## Phase 0 — Foundation (current)
- [x] Create GitHub-tracked product blueprint and design baseline.
- [x] Build responsive simulator dashboard with explicit mock-data disclosure.
- [x] Prepare initial Neon migration.
- [ ] Run CI and fix all failures.
- [ ] Inspect Neon branch and apply migration in development only.

## Phase 1 — Secure core
- [ ] Auth/session and workspace membership.
- [ ] Server-side tenant authorization and isolation tests.
- [ ] Database repositories and migration runner.
- [ ] Product catalog CRUD and approved knowledge records.
- [ ] Inbox persistence, assignment and human handoff.
- Exit gate: no cross-tenant reads/writes in tests; audit trail for privileged actions.

## Phase 2 — Agent core
- [ ] AI provider interface with simulator fallback.
- [ ] Product-grounded retrieval, confidence thresholds and escalation paths.
- [ ] Agent trace, feedback, latency and cost measurement.
- [ ] Queue evaluation for retries and scheduled work.
- Exit gate: offline evaluation passes and product answers make no unsupported claims.

## Phase 3 — First official channel
- [ ] Confirm business account eligibility and API scopes.
- [ ] Configure secret storage and webhook verification.
- [ ] Verify inbound, outbound, retries, opt-out and human handoff end-to-end.
- Exit gate: live test evidence, audit logs and operational rollback.

## Phase 4 — Live commerce
- [ ] Research current official capabilities/permissions for each target platform.
- [ ] Implement adapters only for supported scopes/events.
- [ ] Provide manual Live Host Copilot fallback when live comment access is unavailable.
- Exit gate: per-platform capability matrix and permission review.

## Phase 5 — Scale & operations
- [ ] Tenant quotas, usage metering and cost controls.
- [ ] Backup/restore drill, monitoring, incident response and retention jobs.
- [ ] Security review, accessibility/browser QA, load test and privacy/legal review.
- [ ] Choose deployment provider only after explicit infrastructure decision.

## Completion language
Use separate statuses: implemented, tested, connected, deployed, production-ready. Never use one as evidence for another.