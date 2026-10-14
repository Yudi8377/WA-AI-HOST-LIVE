# Aptinusa delivery phases

This roadmap describes planned work, not a claim that every feature is implemented.

## Phase 0 — Foundation and transparent preview
- Add public marketing surface, customer dashboard preview, admin control-panel preview, API/connector docs and status page.
- Preserve existing inbox simulator at /workspace/.
- Keep preview data synthetic; no claim of live provider connectivity.

## Phase 1 — Identity, tenant security and production schema
- Review/apply production schema migration only through the explicit migration gate.
- Finish secure sessions, active membership resolution and least-privilege runtime.
- Prove cross-tenant isolation with automated tests.

## Phase 2 — Workspace and subscription control plane
- Persist workspace settings, roles, module entitlements and usage events.
- Build admin controls with server authorization and audit records.
- Connect billing sandbox before production billing; validate webhook signatures and idempotency.

## Phase 3 — Connector engine and API
- Versioned connector contract, secure token/OAuth handling, scope checks, webhook signatures, retries, idempotency and revoke flow.
- Start with one approved provider and complete end-to-end tests before expanding.

## Phase 4 — Governed multi-agent AI network
- Orchestrator, channel agent, customer/context agent, knowledge retrieval agent, sales/workflow agent, safety/policy agent, evaluator and observability agent.
- Typed tasks, scoped tool permissions, provenance, cost budgets, timeouts/retries, human approval for consequential actions, evaluation dataset and rollback.
- Agents may not self-grant permissions, rewrite production configuration, or bypass platform policies.

## Phase 5 — SEO, reliability and launch
- Unique metadata, sitemap/robots/canonical, structured data, accessibility, Core Web Vitals and indexability.
- Uptime probes, structured logs, alert routing, incident runbooks, backups/restore test, load and security tests.

## Phase 6 — Customer deployment package
- Generate source archive, phase workpack and customer deployment bundle through the release workflow.
- Include templates only; never bundle real credentials, customer data or production connection strings.
- Record checksums, commit SHA, version, limitations and rollback instructions.

## Release gates
Production readiness requires CI, lint/typecheck, security checks, migration/rollback verification, auth and tenant-isolation tests, provider end-to-end tests and independent smoke checks. External API approvals and secrets must be configured securely by the owner.
