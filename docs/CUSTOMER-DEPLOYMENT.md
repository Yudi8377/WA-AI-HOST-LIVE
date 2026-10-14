# Aptinusa customer deployment guide

## Scope
This is the deployment handoff template. Current pages are previews; the repository is not yet production-ready for real customer data, billing or messaging.

## Before deployment
- Confirm target hosting supports the required Next.js runtime. Current configuration uses static export for GitHub Pages; authenticated server APIs and background jobs need a compatible backend target.
- Confirm the customer owns/controls the domain and DNS. The final domain is intentionally not hard-coded.
- Provision separate development/staging and production environments.
- Provision Neon database resources with backup and a documented restore test.
- Configure environment variables through the hosting secret manager; never commit .env files.
- Use a least-privilege runtime database role, never owner/superuser credentials from application code.

## Configuration checklist
1. Set approved public app URL and allowed origins.
2. Set database connection secret server-side only.
3. Configure auth provider, session cookie settings, callback URLs and trusted origins.
4. Configure provider credentials only after business verification and approved scopes.
5. Configure webhook URL, signature verification, replay protection and provider retries.
6. Configure rate limits, consent/opt-out, retention, export/delete and audit logs.
7. Set monitoring/alert contacts and incident ownership.

## Release procedure
1. Pin a reviewed commit/tag and retain its SHA.
2. Apply migrations to staging; test migration and rollback/restore.
3. Run CI, lint, typecheck, unit, security and end-to-end tests.
4. Verify cross-tenant denial with distinct test tenants and least-privilege runtime credentials.
5. Run provider sandbox tests, webhook signature tests and failure/retry tests.
6. Deploy staging; smoke-test auth, workspace, API, billing sandbox, connectors and audit.
7. Approve production rollout, apply migrations under the approved change process, deploy and monitor.
8. If health checks fail, disable the affected feature, roll back the application release and follow the database restore plan.

## Customer acceptance
- No unresolved critical/high security finding.
- Data isolation and authorization tests pass.
- Backup restore and incident escalation are verified.
- Privacy notice, terms, consent, retention and support contacts are configured.
- Enabled connectors have official access and customer authorization.
- Known limitations and SLA/availability commitments are documented honestly.

No production secrets, domain registration, provider approval, billing activation or production launch is performed by this document.
