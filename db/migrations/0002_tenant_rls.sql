-- WA AI HOST LIVE — tenant isolation enforcement
-- Apply after 0001 on the intended development branch. This is fail-closed:
-- every tenant-scoped table is invisible unless app.tenant_id is set per transaction.
BEGIN;

CREATE OR REPLACE FUNCTION app_current_tenant_id()
RETURNS uuid
LANGUAGE sql
STABLE
AS $$
  SELECT NULLIF(current_setting('app.tenant_id', true), '')::uuid
$$;

ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenants FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation ON tenants;
CREATE POLICY tenant_isolation ON tenants
  USING (id = app_current_tenant_id())
  WITH CHECK (id = app_current_tenant_id());

ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE memberships FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation ON memberships;
CREATE POLICY tenant_isolation ON memberships
  USING (tenant_id = app_current_tenant_id())
  WITH CHECK (tenant_id = app_current_tenant_id());

-- app_users is the global identity map used during sign-in/provisioning.
-- RLS is enabled but intentionally not forced: the trusted server DB owner must
-- be able to resolve identities and create the first membership. Never expose
-- unrestricted app_users queries through public API routes.
ALTER TABLE app_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_users NO FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_members_only ON app_users;
CREATE POLICY tenant_members_only ON app_users
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM memberships m
    WHERE m.user_id = app_users.id
      AND m.tenant_id = app_current_tenant_id()
      AND m.status = 'active'
  ));

DO $$
DECLARE table_name text;
BEGIN
  FOREACH table_name IN ARRAY ARRAY[
    'channel_connections',
    'customers',
    'conversations',
    'messages',
    'products',
    'knowledge_documents',
    'agent_runs',
    'webhook_events',
    'audit_events'
  ]
  LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', table_name);
    EXECUTE format('ALTER TABLE %I FORCE ROW LEVEL SECURITY', table_name);
    EXECUTE format('DROP POLICY IF EXISTS tenant_isolation ON %I', table_name);
    EXECUTE format(
      'CREATE POLICY tenant_isolation ON %I USING (tenant_id = app_current_tenant_id()) WITH CHECK (tenant_id = app_current_tenant_id())',
      table_name
    );
  END LOOP;
END $$;

COMMIT;
