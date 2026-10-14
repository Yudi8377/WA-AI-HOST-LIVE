-- 0002: Safe bootstrap for resolving the authenticated user's active tenant memberships.
-- Apply only after reviewing the auth-subject mapping and creating the runtime role.
-- The API MUST verify the Better Auth session/JWT before calling this function.
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
  -- Reject malformed subjects early. Never accept a tenant ID from the caller here.
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

-- SECURITY DEFINER functions are not public APIs. Grant only to the server-side runtime role,
-- when it exists in this branch. If the role is created later, repeat these grants explicitly.
REVOKE ALL ON FUNCTION app_private.resolve_active_memberships(text) FROM PUBLIC;
DO $grant$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_catalog.pg_roles WHERE rolname = 'wa_app_runtime') THEN
    EXECUTE 'GRANT USAGE ON SCHEMA app_private TO wa_app_runtime';
    EXECUTE 'GRANT EXECUTE ON FUNCTION app_private.resolve_active_memberships(text) TO wa_app_runtime';
  END IF;
END;
$grant$;

COMMENT ON FUNCTION app_private.resolve_active_memberships(text) IS
  'Internal auth bootstrap. Call only after verifying a Better Auth session on the server; returns active memberships for that auth subject.';

COMMIT;
