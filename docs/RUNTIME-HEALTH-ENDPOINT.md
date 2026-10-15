# Runtime health endpoint

Vercel serverless endpoint: `GET /api/runtime-health`.

- Returns HTTP 200 only when `DATABASE_URL` is configured and the connection can assume `wa_app_runtime_safe`, whose database role flags are verified as least-privilege.
- Returns HTTP 503 with a generic response when the runtime is not configured or the safe role check fails.
- Returns HTTP 405 for unsupported methods.
- Never returns database errors, connection details, role names, or query output.
- Uses no cache and does not perform writes.

This is a readiness probe, not proof that customer authentication, tenant isolation, channel providers, payments, or all migrations are ready. A successful response must not be interpreted as commercial launch approval. The endpoint requires the serverless `api/` directory to be deployed on a platform such as Vercel; GitHub Pages does not execute it. Keep the webhook and marketing delivery switches disabled until end-to-end checks pass.
