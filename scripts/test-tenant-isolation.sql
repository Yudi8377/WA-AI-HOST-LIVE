-- Development-only two-tenant RLS verification.
-- Run on wa-ai-host-live-dev as neondb_owner; wa_app_runtime_safe must exist
-- with NOBYPASSRLS and be granted to neondb_owner for SET LOCAL ROLE.
-- This transaction rolls back all synthetic fixtures at the end.
BEGIN;

INSERT INTO tenants(id,name,slug) VALUES
 ('00000000-0000-4000-8000-0000000000a1','RLS Synthetic A','rls-smoke-a-20261014'),
 ('00000000-0000-4000-8000-0000000000b2','RLS Synthetic B','rls-smoke-b-20261014');

INSERT INTO app_users(id,auth_provider,auth_subject,display_name)
 VALUES ('00000000-0000-4000-8000-0000000000c3','rls-smoke','tenant-isolation-20261014','Synthetic RLS Test');

INSERT INTO memberships(tenant_id,user_id,role,status) VALUES
 ('00000000-0000-4000-8000-0000000000a1','00000000-0000-4000-8000-0000000000c3','owner','active'),
 ('00000000-0000-4000-8000-0000000000b2','00000000-0000-4000-8000-0000000000c3','viewer','active');

INSERT INTO customers(id,tenant_id,display_name) VALUES
 ('00000000-0000-4000-8000-0000000000d4','00000000-0000-4000-8000-0000000000a1','Synthetic customer A'),
 ('00000000-0000-4000-8000-0000000000e5','00000000-0000-4000-8000-0000000000b2','Synthetic customer B');

SET LOCAL ROLE wa_app_runtime_safe;

SELECT set_config('app.tenant_id','00000000-0000-4000-8000-0000000000b2',true);
SELECT 'Tenant B customers' AS check_name, count(*) AS visible_rows FROM customers;
SELECT 'Tenant B tenants' AS check_name, count(*) AS visible_rows FROM tenants;
SELECT 'Tenant B memberships' AS check_name, count(*) AS visible_rows FROM memberships;

SELECT set_config('app.tenant_id','00000000-0000-4000-8000-0000000000a1',true);
SELECT 'Tenant A customers' AS check_name, count(*) AS visible_rows FROM customers;
SELECT 'Tenant A tenants' AS check_name, count(*) AS visible_rows FROM tenants;
SELECT 'Tenant A memberships' AS check_name, count(*) AS visible_rows FROM memberships;

RESET ROLE;
ROLLBACK;
