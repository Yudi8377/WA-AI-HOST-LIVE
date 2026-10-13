-- Run on the intended Neon development branch after migrations 0001 and 0002.
-- This script is read-only and reports the tenant RLS posture.
SELECT current_database() AS database_name, current_user AS database_role;

SELECT
  c.relname AS table_name,
  c.relrowsecurity AS rls_enabled,
  c.relforcerowsecurity AS rls_forced,
  count(p.policyname) AS policy_count
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
LEFT JOIN pg_policies p ON p.schemaname = n.nspname AND p.tablename = c.relname
WHERE n.nspname = 'public'
  AND c.relkind = 'r'
  AND c.relname IN (
    'tenants', 'memberships', 'app_users', 'channel_connections',
    'customers', 'conversations', 'messages', 'products',
    'knowledge_documents', 'agent_runs', 'webhook_events', 'audit_events'
  )
GROUP BY c.relname, c.relrowsecurity, c.relforcerowsecurity
ORDER BY c.relname;

SELECT
  to_regprocedure('public.app_current_tenant_id()') IS NOT NULL
  OR to_regprocedure('app_current_tenant_id()') IS NOT NULL AS tenant_context_function_exists;
