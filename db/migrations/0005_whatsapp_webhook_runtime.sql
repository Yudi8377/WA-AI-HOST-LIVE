-- 0005: Tenant-scoped WhatsApp webhook runtime.
-- The login role must SET LOCAL ROLE wa_app_runtime_safe in every transaction.
-- This safe role is NOLOGIN and NOBYPASSRLS; never run application queries as
-- the login role because Neon-created login roles may have elevated attributes.
BEGIN;

CREATE SCHEMA IF NOT EXISTS app_private;
REVOKE ALL ON SCHEMA app_private FROM PUBLIC;

CREATE OR REPLACE FUNCTION public.app_current_tenant_id()
RETURNS uuid
LANGUAGE sql
STABLE
AS $tenant$
  SELECT NULLIF(current_setting('app.tenant_id', true), '')::uuid
$tenant$;

CREATE OR REPLACE FUNCTION app_private.resolve_whatsapp_channel(p_phone_number_id text)
RETURNS TABLE (tenant_id uuid, channel_connection_id uuid)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $function$
  SELECT min(cc.tenant_id::text)::uuid, min(cc.id::text)::uuid
  FROM public.channel_connections AS cc
  JOIN public.tenants AS t ON t.id = cc.tenant_id
  WHERE p_phone_number_id ~ '^[0-9]{5,32}$'
    AND cc.provider = 'whatsapp'
    AND cc.provider_account_id = p_phone_number_id
    AND cc.status = 'connected'
    AND t.status = 'active'
  HAVING count(*) = 1;
$function$;

REVOKE ALL ON FUNCTION app_private.resolve_whatsapp_channel(text) FROM PUBLIC;

DO $grant$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_catalog.pg_roles WHERE rolname = 'wa_webhook_runtime')
     AND EXISTS (SELECT 1 FROM pg_catalog.pg_roles WHERE rolname = 'wa_app_runtime_safe')
     AND NOT pg_catalog.pg_has_role('wa_app_runtime_safe', 'neon_superuser', 'MEMBER') THEN
    GRANT wa_app_runtime_safe TO wa_webhook_runtime WITH INHERIT FALSE;
    GRANT USAGE ON SCHEMA public, app_private TO wa_app_runtime_safe;
    GRANT EXECUTE ON FUNCTION app_private.resolve_whatsapp_channel(text) TO wa_app_runtime_safe;
    GRANT EXECUTE ON FUNCTION public.app_current_tenant_id() TO wa_app_runtime_safe;
    GRANT SELECT ON public.channel_connections TO wa_app_runtime_safe;
    GRANT SELECT, INSERT, UPDATE ON public.customers TO wa_app_runtime_safe;
    GRANT SELECT, INSERT, UPDATE ON public.conversations TO wa_app_runtime_safe;
    GRANT SELECT, INSERT, UPDATE ON public.messages TO wa_app_runtime_safe;
    GRANT SELECT, INSERT, UPDATE ON public.webhook_events TO wa_app_runtime_safe;
    GRANT SELECT, INSERT, UPDATE ON public.customer_channel_preferences TO wa_app_runtime_safe;
    GRANT INSERT ON public.audit_events TO wa_app_runtime_safe;

    REVOKE ALL PRIVILEGES ON public.channel_connections FROM wa_webhook_runtime;
    REVOKE ALL PRIVILEGES ON public.customers FROM wa_webhook_runtime;
    REVOKE ALL PRIVILEGES ON public.conversations FROM wa_webhook_runtime;
    REVOKE ALL PRIVILEGES ON public.messages FROM wa_webhook_runtime;
    REVOKE ALL PRIVILEGES ON public.webhook_events FROM wa_webhook_runtime;
    REVOKE ALL PRIVILEGES ON public.customer_channel_preferences FROM wa_webhook_runtime;
    REVOKE ALL PRIVILEGES ON public.audit_events FROM wa_webhook_runtime;
  END IF;
END;
$grant$;

COMMIT;
