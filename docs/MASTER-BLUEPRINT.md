# WA AI HOST LIVE — Master Blueprint

Version 1.0 | Status: implementation baseline

## 1. Product vision
One commerce command center where a seller can understand, reply to, and convert customer conversations across supported channels. It is a platform, not a WhatsApp-only bot. Promise: **one product brain, many channel adapters, accountable AI**.

## 2. Primary users
- Owner/admin: workspace, team, integrations, policy and analytics.
- Operator: inbox, assignment, customer context and suggested replies.
- Live seller/host: contextual prompts for product questions during streams where authorized access exists.
- Analyst: approved reports, intent trends and response quality.

## 3. Product modules
1. Workspace & tenant core — organization, memberships, roles, limits and configuration.
2. Channel adapter gateway — normalized inbound events, outbound capabilities, webhook validation, delivery receipts and platform-specific capability flags.
3. Omnichannel inbox — conversation timeline, assignment, status, search, internal notes, human handoff and customer context.
4. Product Brain — catalog, stock/price freshness, approved product facts, shipping/return policies, retrieval references and confidence.
5. Conversation Agent — intent, language, context, answer draft and follow-up questions.
6. Live Host Copilot — question clustering, suggested spoken answers, objection handling, pinned product context and moderation prompts. Real-time comments only when official APIs permit; manual paste/import fallback otherwise.
7. Sales Agent — ethical recommendations and next-best action, without fabricated inventory, discount, delivery or guarantees.
8. Safety & Policy Agent — sensitive request detection, prompt-injection resistance, policy checks, escalation and action approval.
9. Action Center — explicit, authorized operations; high-impact actions need confirmation and idempotency.
10. Commerce intelligence — response times, unresolved issues, conversion attribution only where source data is real and authorized.
11. Evaluation & observability — trace, latency, cost, error rate, feedback and replay-safe test fixtures.

## 4. Channel strategy
Targets: WhatsApp Business Platform, Facebook/Instagram messaging where permitted, TikTok commerce/live surfaces where approved, Shopee seller/commerce integrations where available, and website chat. Support is not uniform across channel, region, app type or account tier. Every adapter publishes a capability matrix and fails closed when access is missing.

### Safe fallback
When the channel does not expose the required LIVE comment/event API, offer a clearly labelled Live Host Copilot: operator pastes a question, imports a permitted transcript, or uses an approved integration. Do not scrape private sessions, automate browser sessions to evade policy, or represent manual input as a live platform connection.

## 5. System architecture
- Next.js + TypeScript application, initially a modular monolith.
- Neon PostgreSQL as the primary persistent database.
- Server-side domain modules isolate tenants, inbox, catalog, agent orchestration and adapters.
- Background work via PostgreSQL-compatible queue such as pg-boss only after runtime and connection-pool strategy is validated.
- AI provider abstraction keeps the core independent of a single model vendor. Simulator mode works without an AI key.
- GitHub Actions for lint, typecheck, tests and build. Production deployment target remains undecided.
- Channel secrets live in server-only environment variables or a managed secret store; never in NEXT_PUBLIC variables.

## 6. Multi-agent policy
Orchestrator delegates bounded tasks to specialized agents:
- Conversation: classify and draft.
- Product: retrieve verified product/policy facts.
- Live Host: summarize repeated questions and prepare spoken prompts.
- Sales: suggest relevant next steps.
- Safety: review answer, confidence and action risk.
- Evaluator: offline test/replay and outcome analysis.
Agents share approved, tenant-scoped knowledge; no agent may read another tenant's records. Agents cannot self-grant permissions, deploy code, purchase services, or publish externally without explicit gates.

## 7. Open-source integration strategy
Prefer small, replaceable dependencies over absorbing entire products. Evaluate license, maintenance, transitive dependencies, security, data flow, upgrade cost and runtime needs. Initial candidates:
- pg-boss (MIT): evaluate as a PostgreSQL-backed job queue.
- LangGraph.js (MIT): optional workflow orchestration if plain functions/state machine become insufficient.
- Chatwoot (MIT): reference for inbox and handoff; do not merge the Rails app wholesale into a Next.js modular monolith.
Recheck license details at the exact version and directory before distribution.

## 8. Security and trust
Tenant isolation on every query; authorization on server; validate inputs; verify signed webhooks and timestamps; deduplicate webhook event IDs; rate-limit endpoints; minimize personal data; redact logs; define retention/deletion; track outbound actions; apply confidence thresholds and human approval. Treat messages, imported transcripts, product descriptions and retrieved documents as untrusted data, never as system instructions.

## 9. Non-goals for initial MVP
- No promise of universal access to all platform live comments.
- No autonomous refund, price/discount change, order cancellation or money movement.
- No training on customer messages without a documented lawful basis and transparent controls.
- No production claim based on static UI or mock metrics.

## 10. MVP acceptance
- Simulator usable on desktop and mobile and labels fake data.
- Tenant, membership, catalog, conversation, message and audit schema migrated to Neon.
- Core authorization and tenant-isolation tests pass.
- Official webhook signatures and idempotency tested before live inbound activation.
- Human handoff works; AI suggestions can be reviewed/edited; failures visible.
- One official channel connected and verified end-to-end before adding another.