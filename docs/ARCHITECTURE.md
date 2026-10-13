# Architecture and Decisions

## Runtime layout target
- app/: Next.js routes and UI
- src/domain/: tenant, inbox, catalog and policy modules
- src/adapters/channels/: normalized channel contracts and platform adapters
- src/agents/: orchestration and bounded agent roles
- src/lib/db/: Neon client, migrations and tenant-scoped repositories
- src/jobs/: async handlers and retry/idempotency policy
- tests/: unit, integration and security tests
- db/migrations/: ordered SQL migrations
- docs/: product, security and operations records

This is a target layout; introduce folders with real functionality rather than empty architecture theater.

## ADR-001: Modular monolith first
Decision: one deployable Next.js application with clear domain boundaries. Reason: cheapest to operate and simplest to debug for a new team. Split services only when measured scaling/isolation needs justify it.

## ADR-002: Neon PostgreSQL is the system of record
Decision: GitHub for code; Neon PostgreSQL for durable application data. No Supabase. Migration files in Git are schema source of truth. Do not assume a migration ran just because it exists in the repository.

## ADR-003: Channel-neutral domain events
Normalize provider events into internal events with source channel, provider event ID, account/tenant mapping, timestamp, payload schema version and privacy-safe metadata. Preserve provider payload only where required, access-controlled and retention-limited.

## ADR-004: Official API adapters only
Each adapter documents required scopes, supported events, outbound limitations, webhook verification, rate limits and retention. Unsupported actions must be disabled, not simulated as connected.

## ADR-005: Simulator before paid services
Local/demo data should make core workflows reviewable without model keys, channel credentials, paid queues or external hosting. Clearly separate simulator mode from production.

## Data flow
Inbound event → verify provider signature → map provider account to tenant → validate/deduplicate event → persist minimal normalized record → retrieve tenant-scoped context → safety review → draft or approved action → outbound provider API → persist delivery result/audit. Never trust a tenant ID supplied by a client request.

## Queue decision
pg-boss is a candidate, not yet adopted. Test compatibility with Neon connection/pooling mode, worker hosting, migrations, retries, lock duration and duplicate delivery. Do not run queue workers in a short-lived request handler.