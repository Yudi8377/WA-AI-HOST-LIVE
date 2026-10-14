-- 0002: Safe bootstrap for resolving the authenticated user's active tenant memberships.
-- The API MUST verify the Better Auth session before calling this function.
-- Runtime grants are withheld unless wa_app_runtime is a least-privilege login role.
BEGIN;

CREATE SCHEMA IF NOT EXISTS app_private;
REVOKE ALL ON SCHEMA app_private FROM PUBLIC;

CREATE OR REPLACE FUNCTION app_private.resolve_active_memberships(p_auth_subject text)
RETURNS TABLE (
  tenant_id uuid,
  tenant_name text,
  tenant_slug text,
  membership_role text
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $function$
BEGIN
  IF p_auth_subject IS NULL
     OR length(p_auth_subject) < 1
     OR length(p_auth_subject) > 255 THEN
    RETURN;
  END IF;

  RETURN QUERY
    SELECT t.id, t.name, t.slug, m.role
    FROM public.app_users AS u
    JOIN public.memberships AS m ON m.user_id = u.id
    JOIN public.tenants AS t ON t.id = m.tenant_id
    WHERE u.auth_provider = 'better_auth'
      AND u.auth_subject = p_auth_subject
      AND m.status = 'active'
      AND t.status = 'active'
    ORDER BY t.name, t.id;
END;
$function$;

REVOKE ALL ON FUNCTION app_private.resolve_active_memberships(text) FROM PUBLIC;

-- Never grant to a role with elevated attributes or inherited role memberships.
-- The Neon role-creation integration may produce a role with elevated grants; fail closed.
DO $grant$
DECLARE
  runtime_oid oid;
BEGIN
  SELECT oid INTO runtime_oid
  FROM pg_catalog.pg_roles
  WHERE rolname = 'wa_app_runtime'
    AND rolcanlogin
    AND NOT rolsuper
    AND NOT rolcreatedb
    AND NOT rolcreaterole
    AND NOT rolreplication
    AND NOT rolbypassrls;

  IF runtime_oid IS NOT NULL
     AND NOT EXISTS (
       SELECT 1 FROM pg_catalog.pg_auth_members
       WHERE member = runtime_oid
     ) THEN
    EXECUTE 'GRANT USAGE ON SCHEMA app_private TO wa_app_runtime';
    EXECUTE 'GRANT EXECUTE ON FUNCTION app_private.resolve_active_memberships(text) TO wa_app_runtime';
  ELSE
    RAISE WARNING 'wa_app_runtime is missing or not least-privileged; no runtime grants were issued';
  END IF;
END;
$grant$;

COMMENT ON FUNCTION app_private.resolve_active_memberships(text) IS
  'Internal auth bootstrap. Call only after verifying a Better Auth session on the server; returns active memberships for that auth subject.';

COMMIT;
