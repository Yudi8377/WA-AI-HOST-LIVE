# Neon database setup

The owner supplied a Neon project dashboard. This repository can prepare SQL migrations, but connectivity and migration application cannot be reported as complete until an authorized Neon connection/tool is available.

## Safe setup
1. Open the intended Neon project and choose the correct branch.
2. Create/use a dedicated application role with least privilege; avoid using the owner/admin role at runtime.
3. Put the pooled connection string into local .env.local or deployment secret settings. Never paste credentials into chat, issues, commits or screenshots.
4. Apply db/migrations/0001_initial.sql in a controlled session.
5. Verify tables/indexes and run tenant-isolation checks in a non-production branch first.
6. Record migration ID, timestamp, environment and outcome without recording secrets.

## Connection strategy
Use a pooled connection for short web requests where appropriate. Use a direct connection for migration/admin operations if required by the chosen Neon setup. Background workers and session/transaction requirements must be tested against the selected pooler mode.

## Not yet verified
- Connection from this runtime to Neon.
- Whether the selected branch is intended for development or production.
- Existing tables/data; no schema should be overwritten blindly.
- Applied migration status.

Do not run destructive schema changes without a backup and explicit environment check.