# Phase 01 — Product surface and honest preview

## Included
- Public marketing website.
- Customer dashboard preview.
- Admin subscription/control-plane preview.
- API contract landing page.
- Connector catalogue and readiness gates.
- Manually maintained status page.
- Preserve existing inbox simulator at /workspace/.
- Initial SEO, delivery phases, deployment and multi-agent architecture documents.

## Not included
- Real authentication or authorization on these preview routes.
- Persistent subscription/billing writes.
- Live provider integrations or real outbound messages.
- Automated uptime monitoring, production API endpoints or deployed multi-agent runtime.
- Domain registration or production identity changes.

## Acceptance criteria
- All routes render with responsive navigation.
- Preview state and limitations are explicit.
- No real credentials or customer data are shipped.
- CI build/lint/typecheck passes before merge.
