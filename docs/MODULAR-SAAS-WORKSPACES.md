# WA AI HOST LIVE — Modular SaaS Workspaces & Product Architecture

Status: product architecture proposal; not a claim that every module or connector is implemented or live.

## Product direction

WA AI HOST LIVE is a multi-tenant SaaS control plane for customer communications and business workflows. Every customer gets an isolated workspace, similar in familiarity to a cPanel, but focused on AI operations, conversations, CRM, automation, channel integrations, analytics, and subscriptions.

The platform is modular: customers subscribe to a base workspace and add capabilities by plan or add-on. The platform must enforce entitlements server-side; hiding a menu in the UI is not authorization.

## Roles and workspace model

- Platform owner/admin: manages plans, modules, connector availability, system health, abuse controls, billing state, and tenant support. Access to tenant content must be limited, audited, and justified.
- Tenant owner: manages their business profile, channels, subscription, team, AI policies, data, and usage.
- Tenant admin/manager: manages assigned operations and team permissions.
- Agent/operator: handles assigned conversations and CRM tasks.
- Analyst/read-only: sees permitted reports only.
- Optional agency/partner role: manages multiple tenants only with explicit tenant grants and scoped permissions.

Each tenant must have separate records and authorization boundaries for users, memberships, conversations, contacts, CRM records, channel connections, AI instructions, knowledge sources, automations, audit events, usage, billing, and entitlements. All tenant-owned database access must be scoped and tested against cross-tenant access. Never rely on client-supplied tenant IDs alone.

## Customer workspace navigation

1. Overview
2. Omnichannel Inbox
3. AI Host & business profile
4. Contacts and CRM
5. Sales pipeline and tasks
6. Knowledge base / FAQ
7. Automation and workflows
8. Channel connections
9. Campaigns and follow-ups (consent and channel-policy gated)
10. Analytics and reports
11. Team and access
12. Subscription, modules, usage and invoices
13. Integrations and API keys
14. Audit log and security

Show modules based on entitlements, but also enforce every capability in server-side API handlers and database permissions.

## Module catalogue

### Core workspace
- Tenant profile, team roles, audit log, usage meter, notifications, support, subscription/entitlements.
- Shared inbox shell and connection health indicators.

### WhatsApp modules
- WhatsApp channel connection and webhook ingestion.
- AI-assisted replies and configurable business tone.
- Human handoff, assignment, tags, conversation notes and SLA.
- Contact capture and CRM sync.
- Approved-template messaging and compliant follow-up automation where required by Meta policy.
- Delivery/status events and usage reporting.

### CRM and sales
- Contacts, leads, segments, consent/preferences, source attribution.
- Pipeline stages, follow-up tasks, reminders, notes, ownership and conversion reports.
- Optional catalog/order integrations where the provider API and authorization support them.

### AI Host configuration
- Business-specific instructions, tone, supported languages, service hours, FAQs, escalation rules, prohibited actions and confidence thresholds.
- Knowledge sources with ownership, access controls, update status and retrieval audit.
- Human approval for high-impact actions (refunds, pricing commitments, account changes) until explicitly configured and tested.

### Automation
- Event-triggered workflows, scheduled tasks, retries, idempotency, rate limits, audit trail and kill switch.
- Start with safe triggers and approved actions. Bulk outreach requires consent, opt-out handling, provider-policy checks and rate controls.

### Channel connector add-ons
- TikTok Business Messaging and TikTok Shop customer-service/order APIs as separate connector capabilities; they are not interchangeable and require applicable account/app access, authorization, scopes, market availability and review.
- Shopee seller APIs only for supported partner-approved capabilities and authorized shops. Do not promise a general Shopee inbox connector until the applicable API scope is verified.
- Future connector candidates: Instagram/Messenger, website live chat, email, and other marketplaces when supported by official APIs and account permissions.
- Each connector must show: Available, Setup required, Awaiting provider approval, Connected, Needs attention, or Unsupported in the tenant's market.

## Subscription and pricing design

Use a configurable product catalogue rather than hard-coded plan checks. A subscription may contain:
- Base workspace tier.
- Paid feature modules/add-ons.
- Usage allowance and overage policy (messages, AI tokens, seats, connected accounts, workflow runs, storage).
- Billing period, trial, renewal state, grace period, cancellation and entitlement history.

Illustrative packaging only; prices must be validated against actual AI, hosting, provider, support and payment costs before publication:

- Starter: one workspace, limited seats, one initial channel, basic AI reply allowance.
- Growth: CRM, multiple seats, assignment, knowledge base, reporting and automation allowance.
- Business: multiple channels/accounts where authorized, advanced workflows, higher limits, team controls and priority support.
- Add-ons: WhatsApp AI replies; CRM & pipeline; advanced automation; knowledge base; analytics; TikTok Business Messaging; TikTok Shop operations; Shopee integration (only once supported); additional seats/channels/usage.

Avoid advertising modules as available until their connector, policy, pricing, support process and operational monitoring are implemented. A module can be listed as “coming soon” or “access request” without granting active entitlements.

## Connector architecture

Use a channel-neutral internal model for tenants, contacts, conversations, messages, delivery events, consent, and agent assignments, with provider-specific adapters behind a strict interface. Store provider IDs and encrypted tokens separately from message content; support token rotation, revocation, webhook signature validation, idempotency, retries and dead-letter handling. Never expose provider secrets to browser code or logs.

A connector is not “live” just because code exists: it requires approved provider access, a real authorized test account, verified webhook delivery, successful send/receive tests, failure/retry tests, consent/policy checks, and monitoring.

## Security and release gates

- Verify authenticated session server-side and resolve active tenant membership from trusted identity, not request parameters.
- Enforce least privilege and row-level tenant isolation on every data path.
- Encrypt connector credentials at rest; redact secrets and message content from logs by default.
- Add rate limits, abuse prevention, CSRF/CORS protections where relevant, webhook signature verification, idempotency, audit logging and data-retention/deletion workflows.
- Test tenant A cannot read, alter, export or trigger actions for tenant B.
- Require explicit authorization and consent for customer channel connections and outreach.
- Keep billing and entitlements server-authoritative.
- Publish privacy terms, data processing terms, acceptable-use rules and provider-specific limitations before commercial onboarding.

## Phased delivery

1. Secure tenant/workspace foundation, auth transport, least-privilege database runtime and server-side entitlements.
2. Customer dashboard shell, team roles, audit log, module catalogue and subscription/usage model.
3. WhatsApp onboarding, inbound webhook, inbox, AI draft/reply, human handoff and CRM basics.
4. Billing integration and usage metering after product cost assumptions are validated.
5. TikTok Business Messaging and TikTok Shop connectors as distinct gated projects after developer access and scope approval.
6. Shopee connector only after verified official API access for the desired seller messaging/order workflows.
7. Additional channels, analytics and automation based on real customer demand and provider approvals.

## Definition of done

A module is sellable only when its user experience, backend enforcement, tenant isolation, provider authorization, metering, support documentation, failure handling, privacy controls and end-to-end tests all pass. A roadmap item is not a production capability.
