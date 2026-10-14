# Aptinusa multi-agent network — architecture and safety contract

## Design goal
Coordinate specialized agents around a shared task/event model without sharing unrestricted credentials or granting agents autonomous authority over production systems.

## Proposed agents
- **Orchestrator:** decomposes requests into typed tasks, selects agents, enforces budget/deadline and aggregates results.
- **Channel agent:** interprets normalized events from authorized connectors and drafts responses.
- **Customer context agent:** retrieves only tenant-authorized CRM, conversation and order context.
- **Knowledge agent:** retrieves versioned tenant knowledge with provenance and freshness metadata.
- **Sales/workflow agent:** proposes next steps and executes only allowlisted low-risk actions.
- **Safety/policy agent:** checks consent, provider policy, data scope, claims, sensitive actions and escalation.
- **Evaluation agent:** runs regression/adversarial fixtures and measures groundedness, task success, latency and cost.
- **Observability agent:** correlates traces, errors, retries, latency, usage and incidents; recommends fixes instead of silently changing production.
- **Admin copilot:** summarizes platform health and proposes changes for authorized human review.

## Typed task envelope
Each task should carry task_id, trace_id, tenant_id, actor_id, agent_id, task_type, input_refs, policy_version, allowed_tools, deadline, budget, idempotency_key and audit reference. Validate server-side; never trust a browser-supplied tenant ID without checking authenticated membership.

## Collective intelligence and shared memory
Use an event bus, versioned knowledge store, retrieval indexes and explicit sharing rules. Collective intelligence means controlled knowledge reuse and evaluated learning signals; it does not mean copying private tenant data between customers. Customer data never crosses tenant boundaries without explicit lawful basis, authorization and privacy controls. Model weights or agent policies must not self-modify in production without review and evaluation.

## Tool authority tiers
- Tier 0: read-only public or synthetic data.
- Tier 1: tenant-scoped read operations.
- Tier 2: reversible low-impact writes with idempotency and audit.
- Tier 3: outbound communication, campaign sends, billing changes, order mutations or exports — explicit authorization, consent and often human approval required.
- Tier 4: infrastructure, secrets, production schema, role grants and deployments — human approval, change record, backup/rollback and dual verification required.

## Reliability controls
Timeouts, bounded retries, exponential backoff, circuit breakers, idempotency, queue dead-letter handling, per-tenant rate limits, cost budgets, cancellation, trace IDs and human escalation. Agents cannot grant their own permissions, bypass policy, exfiltrate secrets or perform unreviewed production migrations.

## Evaluation gates
Maintain unit tests, provider contract fixtures, prompt-injection tests, tenant-isolation tests, PII leakage tests, grounding checks, tool-authorization tests and cost/latency budgets. Promote changes only after evaluation passes and rollback is available.

## Current state
This describes the target architecture. It is not proof of a deployed multi-agent runtime. Production runtime, queues, model provider, observability and evaluation pipeline remain implementation work.
