-- WA AI HOST LIVE — WhatsApp consent and service-window controls
-- Additive migration. Apply to a verified development branch first; never
-- mark a channel connected until Meta credentials and end-to-end tests pass.
BEGIN;

CREATE TABLE IF NOT EXISTS customer_channel_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  customer_id uuid NOT NULL,
  channel_connection_id uuid NOT NULL,
  provider text NOT NULL DEFAULT 'whatsapp' CHECK (provider = 'whatsapp'),
  destination_address text NOT NULL CHECK (destination_address ~ '^[0-9]{5,20}$'),
  consent_status text NOT NULL DEFAULT 'unknown'
    CHECK (consent_status IN ('unknown','opted_in','opted_out')),
  consent_source text,
  consent_recorded_at timestamptz,
  consent_revoked_at timestamptz,
  last_inbound_at timestamptz,
  service_window_expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, id),
  UNIQUE (tenant_id, channel_connection_id, destination_address),
  FOREIGN KEY (tenant_id, customer_id)
    REFERENCES customers(tenant_id, id) ON DELETE CASCADE,
  FOREIGN KEY (tenant_id, channel_connection_id)
    REFERENCES channel_connections(tenant_id, id) ON DELETE CASCADE,
  CHECK (
    (consent_status <> 'opted_in')
    OR (consent_recorded_at IS NOT NULL AND consent_source IS NOT NULL)
  )
);

CREATE INDEX IF NOT EXISTS customer_channel_preferences_tenant_consent_idx
  ON customer_channel_preferences(tenant_id, provider, consent_status);

CREATE INDEX IF NOT EXISTS customer_channel_preferences_service_window_idx
  ON customer_channel_preferences(tenant_id, service_window_expires_at)
  WHERE consent_status = 'opted_in';

ALTER TABLE customer_channel_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_channel_preferences FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation ON customer_channel_preferences;
CREATE POLICY tenant_isolation ON customer_channel_preferences
  USING (tenant_id = app_current_tenant_id())
  WITH CHECK (tenant_id = app_current_tenant_id());

COMMIT;
