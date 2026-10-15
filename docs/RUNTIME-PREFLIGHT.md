# Runtime environment preflight

This preflight is a configuration sanity check before deploying the WhatsApp webhook to a Node-capable runtime. It does not enable the webhook, connect WhatsApp, contact Meta, or verify database grants/RLS.

## Run

- `node scripts/check-runtime-preflight.mjs` — report missing configuration without failing the shell.
- `node scripts/check-runtime-preflight.mjs --strict` — same report, but return a non-zero exit code when configuration is incomplete.
- `npm run check:runtime-preflight` — run isolated self-tests; no real secrets or network access are required.

The checker prints variable names and blockers only. It never prints environment variable values.

## Required configuration

- `DATABASE_URL` using a PostgreSQL URL and a dedicated least-privilege runtime role.
- `WHATSAPP_ACCESS_TOKEN`
- `WHATSAPP_PHONE_NUMBER_ID`
- `WHATSAPP_VERIFY_TOKEN`
- `WHATSAPP_APP_SECRET`
- `WHATSAPP_GRAPH_API_VERSION` in the reviewed `vNN.N` format.
- `WHATSAPP_WEBHOOK_ENABLED=true` only after all independent production release gates pass.

Keep `WHATSAPP_WEBHOOK_ENABLED=false` until the public runtime is deployed, the exact database runtime role is validated against RLS and cross-tenant isolation, Meta webhook verification succeeds, and end-to-end inbound/outbound tests pass.

A successful preflight is not a production-readiness certificate. It does not verify credential validity, Meta approvals, network access, database connectivity, role privileges, webhook signatures from a live provider, opt-in/out behavior, delivery receipts, monitoring, or incident rollback.
