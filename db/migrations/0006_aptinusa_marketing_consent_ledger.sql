-- Aptinusa Growth Engine: tenant-scoped marketing consent and campaign ledger.
-- Additive only. Apply first on a verified development branch; this migration
-- does not enable delivery or grant provider access.
BEGIN;

CREATE TABLE IF NOT EXISTS marketing_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  channel text NOT NULL CHECK (channel IN ('sms','whatsapp','email')),
  destination_ciphertext text NOT NULL,
  destination_hash text NOT NULL,
  source text NOT NULL CHECK (length(trim(source)) > 0),
  verified_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, id),
  UNIQUE (tenant_id, channel, destination_hash)
);

CREATE TABLE IF NOT EXISTS marketing_consents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  contact_id uuid NOT NULL,
  channel text NOT NULL CHECK (channel IN ('sms','whatsapp','email')),
  purpose text NOT NULL CHECK (purpose IN ('marketing','service_updates','transactional')),
  status text NOT NULL DEFAULT 'unknown' CHECK (status IN ('unknown','opted_in','opted_out')),
  source text,
  notice_version text,
  captured_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY (tenant_id, contact_id)
    REFERENCES marketing_contacts(tenant_id, id) ON DELETE CASCADE,
  CHECK (
    status <> 'opted_in'
    OR (
      source IS NOT NULL AND length(trim(source)) > 0
      AND notice_version IS NOT NULL AND length(trim(notice_version)) > 0
      AND captured_at IS NOT NULL
      AND revoked_at IS NULL
    )
  ),
  UNIQUE (tenant_id, contact_id, channel, purpose)
);

CREATE TABLE IF NOT EXISTS marketing_suppressions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  channel text NOT NULL CHECK (channel IN ('sms','whatsapp','email')),
  destination_hash text NOT NULL,
  reason text NOT NULL CHECK (reason IN ('opt_out','complaint','invalid_destination','admin_block')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, channel, destination_hash)
);

CREATE TABLE IF NOT EXISTS marketing_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name text NOT NULL CHECK (length(trim(name)) BETWEEN 1 AND 160),
  channel text NOT NULL CHECK (channel IN ('sms','whatsapp','email')),
  purpose text NOT NULL CHECK (purpose IN ('marketing','service_updates','transactional')),
  status text NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft','pending_approval','approved','queued','paused','cancelled','completed','failed')),
  live_delivery_enabled boolean NOT NULL DEFAULT false CHECK (live_delivery_enabled = false),
  approved_by uuid,
  approved_at timestamptz,
  estimated_cost_minor bigint CHECK (estimated_cost_minor IS NULL OR estimated_cost_minor >= 0),
  spend_limit_minor bigint CHECK (spend_limit_minor IS NULL OR spend_limit_minor >= 0),
  provider text,
  provider_reference text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (
    status NOT IN ('approved','queued')
    OR (approved_by IS NOT NULL AND approved_at IS NOT NULL)
  ),
  CHECK (
    estimated_cost_minor IS NULL OR spend_limit_minor IS NULL
    OR estimated_cost_minor <= spend_limit_minor
  ),
  UNIQUE (tenant_id, id)
);

CREATE TABLE IF NOT EXISTS marketing_campaign_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  campaign_id uuid NOT NULL,
  event_type text NOT NULL CHECK (event_type IN (
    'created','approval_requested','approved','denied','queued','provider_accepted',
    'delivered','failed','opted_out','cancelled'
  )),
  idempotency_key text NOT NULL,
  provider_event_id text,
  occurred_at timestamptz NOT NULL DEFAULT now(),
  safe_metadata jsonb NOT NULL DEFAULT '{}'::jsonb
    CHECK (jsonb_typeof(safe_metadata) = 'object'),
  FOREIGN KEY (tenant_id, campaign_id)
    REFERENCES marketing_campaigns(tenant_id, id) ON DELETE CASCADE,
  UNIQUE (tenant_id, idempotency_key)
);

CREATE INDEX IF NOT EXISTS marketing_contacts_lookup_idx
  ON marketing_contacts(tenant_id, channel, destination_hash);
CREATE INDEX IF NOT EXISTS marketing_consents_active_idx
  ON marketing_consents(tenant_id, contact_id, channel, purpose, status);
CREATE INDEX IF NOT EXISTS marketing_suppressions_lookup_idx
  ON marketing_suppressions(tenant_id, channel, destination_hash);
CREATE INDEX IF NOT EXISTS marketing_campaigns_queue_idx
  ON marketing_campaigns(tenant_id, status, created_at);
CREATE INDEX IF NOT EXISTS marketing_campaign_events_campaign_idx
  ON marketing_campaign_events(tenant_id, campaign_id, occurred_at);

DO $$
DECLARE table_name text;
BEGIN
  FOREACH table_name IN ARRAY ARRAY[
    'marketing_contacts',
    'marketing_consents',
    'marketing_suppressions',
    'marketing_campaigns',
    'marketing_campaign_events'
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
