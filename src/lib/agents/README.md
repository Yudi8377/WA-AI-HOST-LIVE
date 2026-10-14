# Aptinusa Agent Network kernel

Provider-neutral orchestration scaffold for specialized agents. Wire it into a server runtime only after auth, audit, approval and idempotency adapters are implemented.

## Runtime contract
- Server-verified membership check for each actor/tenant pair.
- Agents registered explicitly with task types, minimum risk tier and required tool scopes.
- Task envelope includes a deadline and hard budget ceiling.
- Write tasks require an idempotency key.
- External and infrastructure tasks require a server-verified approval reference.
- Every finished task emits a minimal audit record; audit adapter failure is fail-closed.
- Tools are passed as an allowlist; no database credentials or provider secrets are passed to agents by this kernel.
- Cross-tenant data sharing is not supported by this layer.

## Risk tiers
- read: tenant-scoped read-only work.
- write: reversible data changes with idempotency.
- external: outbound messages, order mutations, billing and exports; requires verified approval.
- infrastructure: secrets, roles, production schema and deployment; requires verified approval and separate operational controls.

## Current limitation
This kernel does not call an LLM, deploy a worker, create a queue, or provide a production auth adapter. Model/provider adapters, persistent audit/idempotency storage, task queues, evaluation and observability must be implemented and tested before customer use.

Run tests with: node scripts/check-agent-network.mjs
