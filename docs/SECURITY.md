# Security baseline

## Data boundaries
- Resolve tenant identity from a verified server session and membership record, never from an untrusted client-supplied tenant ID.
- Every repository method takes authenticated tenant context and scopes queries by tenant.
- Use composite constraints/foreign keys to prevent cross-tenant references where practical.
- Use database RLS only as defense in depth when the app connection strategy reliably sets and resets tenant context. Connection pooling must not leak session variables between requests.

## Inbound webhooks
- Verify provider signature over raw request bytes before parsing/trusting payload fields.
- Validate timestamp/replay window where supported.
- Store provider event IDs under a uniqueness constraint and process idempotently.
- Respond quickly, enqueue longer work, retry safely and dead-letter poison events.
- Rate-limit, size-limit and schema-validate inbound payloads.

## AI safety
- Treat customer text, product descriptions, URLs and imported transcripts as untrusted data.
- Retrieve only tenant-scoped and approved knowledge.
- Require source references for material product claims.
- Do not invent price, stock, shipping ETA, warranties or policy.
- Ask a clarifying question or hand off when confidence is low.
- Require human confirmation for refunds, cancellations, discounts, price changes, personal-data exports and irreversible actions.
- Keep a trace of model/version, prompt version, retrieved source IDs, policy outcome and operator approval, while minimizing personal data in logs.

## Privacy and operations
- Collect only necessary personal data and set retention/deletion rules.
- Mask tokens and sensitive payloads in logs; never log credentials.
- Use HTTPS in deployed environments; secure cookies; CSRF protection where applicable; CSP and security headers.
- Establish incident response, key rotation, backup/restore and access review before production.
- AI-generated suggestions remain drafts unless an explicitly approved workflow sends them.

## Launch blockers
No production launch before auth/session implementation, tenant-isolation tests, webhook signature tests, secret management, retention policy, backups, monitoring, rate limits, abuse tests and end-to-end verification of one official channel.
## Known development-tool advisory

The October 2026 full dependency-tree audit flags GHSA-vfj7-8cjw-p6xm in the transitive development dependency `braces@3.0.3`, pulled through `eslint-config-next` → `@next/eslint-plugin-next` → `fast-glob` → `micromatch`. The advisory currently lists no patched release: https://github.com/advisories/GHSA-vfj7-8cjw-p6xm. Do not use `npm audit fix --force` here because npm proposes a breaking downgrade of the Next.js ESLint configuration.

The current CI gate uses `npm audit --omit=dev --audit-level=high` and passed for production dependencies after upgrading to Next.js 16.4.0. This is a scoped decision, not a claim that the entire development dependency tree has zero advisories. Keep the issue visible, review it periodically, and remove the exception from this note once upstream remediation is available.
