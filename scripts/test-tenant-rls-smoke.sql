-- Run only as a database role with rolbypassrls = false.
-- The Neon owner role has BYPASSRLS, so running this under the owner is not a valid RLS test.
-- Run only after migration 0002 on a development branch.
DO $$
BEGIN
  IF (SELECT rolbypassrls FROM pg_roles WHERE rolname = current_user) THEN
    RAISE EXCEPTION 'Invalid RLS test role: current_user has BYPASSRLS. Use a NOBYPASSRLS runtime role.';
  END IF;
END $$;

BEGIN;
SELECT set_config('app.tenant_id', '00000000-0000-4000-8000-000000000000', true)
  AS test_tenant_context;

SELECT 'tenants' AS table_name, count(*) AS visible_rows FROM tenants
UNION ALL SELECT 'memberships', count(*) FROM memberships
UNION ALL SELECT 'channel_connections', count(*) FROM channel_connections
UNION ALL SELECT 'customers', count(*) FROM customers
UNION ALL SELECT 'conversations', count(*) FROM conversations
UNION ALL SELECT 'messages', count(*) FROM messages
UNION ALL SELECT 'products', count(*) FROM products
UNION ALL SELECT 'knowledge_documents', count(*) FROM knowledge_documents
UNION ALL SELECT 'agent_runs', count(*) FROM agent_runs
UNION ALL SELECT 'webhook_events', count(*) FROM webhook_events
UNION ALL SELECT 'audit_events', count(*) FROM audit_events
ORDER BY table_name;

ROLLBACK;
