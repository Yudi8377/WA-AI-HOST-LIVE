-- 0005: Least-privilege WhatsApp webhook runtime.
-- Apply to a non-production branch first; all tenant records remain RLS scoped.
BEGIN;

CREATE SCHEMA IF NOT EXISTS app_private;
REVOKE ALL ON SCHEMA app_private FROM PUBLIC;

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
  IF EXISTS (SELECT 1 FROM pg_catalog.pg_roles WHERE rolname = 'wa_webhook_runtime') THEN
    GRANT USAGE ON SCHEMA public, app_private TO wa_webhook_runtime;
    GRANT EXECUTE ON FUNCTION app_private.resolve_whatsapp_channel(text) TO wa_webhook_runtime;
    GRANT EXECUTE ON FUNCTION public.app_current_tenant_id() TO wa_webhook_runtime;
    GRANT SELECT ON public.channel_connections TO wa_webhook_runtime;
    GRANT SELECT, INSERT, UPDATE ON public.customers TO wa_webhook_runtime;
    GRANT SELECT, INSERT, UPDATE ON public.conversations TO wa_webhook_runtime;
    GRANT SELECT, INSERT, UPDATE ON public.messages TO wa_webhook_runtime;
    GRANT SELECT, INSERT, UPDATE ON public.webhook_events TO wa_webhook_runtime;
    GRANT SELECT, INSERT, UPDATE ON public.customer_channel_preferences TO wa_webhook_runtime;
    GRANT INSERT ON public.audit_events TO wa_webhook_runtime;
  END IF;
END;
$grant$;

COMMIT;
