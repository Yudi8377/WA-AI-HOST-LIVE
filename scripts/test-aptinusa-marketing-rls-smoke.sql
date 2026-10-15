-- Run only after migration 0006 on a disposable/development Neon branch.
-- Execute as the intended application role with rolbypassrls=false and no
-- superuser membership. A successful run under an owner/BYPASSRLS role proves
-- nothing about tenant isolation.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = current_user AND NOT rolbypassrls AND NOT rolsuper) THEN
    RAISE EXCEPTION 'Invalid RLS test role: use a non-superuser NOBYPASSRLS application role';
  END IF;
  IF to_regclass('public.marketing_contacts') IS NULL
     OR to_regclass('public.marketing_consents') IS NULL
     OR to_regclass('public.marketing_suppressions') IS NULL
     OR to_regclass('public.marketing_campaigns') IS NULL
     OR to_regclass('public.marketing_campaign_events') IS NULL THEN
    RAISE EXCEPTION 'Migration 0006 is not fully applied';
  END IF;
END $$;

BEGIN;
SELECT set_config('app.tenant_id', '00000000-0000-4000-8000-000000000000', true);

SELECT 'marketing_contacts' AS table_name, count(*) AS visible_rows FROM marketing_contacts
UNION ALL SELECT 'marketing_consents', count(*) FROM marketing_consents
UNION ALL SELECT 'marketing_suppressions', count(*) FROM marketing_suppressions
UNION ALL SELECT 'marketing_campaigns', count(*) FROM marketing_campaigns
UNION ALL SELECT 'marketing_campaign_events', count(*) FROM marketing_campaign_events
ORDER BY table_name;

-- A zero-row result is expected for the synthetic tenant unless test fixtures
-- explicitly create it. The purpose is to verify policies deny unscoped data.
ROLLBACK;
