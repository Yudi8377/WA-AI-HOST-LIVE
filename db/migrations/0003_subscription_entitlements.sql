-- Aptinusa subscription and module-entitlement foundation.
-- REVIEW ONLY: do not apply to production until auth/RLS policy and migration approval pass.
BEGIN;

CREATE TABLE IF NOT EXISTS public.module_catalog (
  code text PRIMARY KEY CHECK (code ~ '^[a-z][a-z0-9_]{1,63}$'),
  name text NOT NULL CHECK (length(trim(name)) BETWEEN 1 AND 120),
  description text NOT NULL DEFAULT '',
  billing_period text NOT NULL DEFAULT 'monthly' CHECK (billing_period IN ('monthly','annual','usage')),
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','active','retired')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.plan_catalog (
  code text PRIMARY KEY CHECK (code ~ '^[a-z][a-z0-9_]{1,63}$'),
  name text NOT NULL CHECK (length(trim(name)) BETWEEN 1 AND 120),
  description text NOT NULL DEFAULT '',
  currency char(3) NOT NULL DEFAULT 'IDR',
  price_minor bigint NOT NULL DEFAULT 0 CHECK (price_minor >= 0),
  billing_period text NOT NULL DEFAULT 'monthly' CHECK (billing_period IN ('monthly','annual')),
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','active','retired')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.plan_module_entitlements (
  plan_code text NOT NULL REFERENCES public.plan_catalog(code) ON DELETE CASCADE,
  module_code text NOT NULL REFERENCES public.module_catalog(code) ON DELETE RESTRICT,
  enabled boolean NOT NULL DEFAULT false,
  limits jsonb NOT NULL DEFAULT '{}'::jsonb CHECK (jsonb_typeof(limits) = 'object'),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (plan_code, module_code)
);

CREATE TABLE IF NOT EXISTS public.tenant_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  plan_code text NOT NULL REFERENCES public.plan_catalog(code) ON DELETE RESTRICT,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','trialing','active','past_due','suspended','cancelled','expired')),
  billing_provider text,
  provider_customer_ref text,
  provider_subscription_ref text,
  current_period_start timestamptz,
  current_period_end timestamptz,
  trial_ends_at timestamptz,
  cancel_at_period_end boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (billing_provider, provider_subscription_ref)
);
CREATE INDEX IF NOT EXISTS tenant_subscriptions_tenant_status_idx
  ON public.tenant_subscriptions(tenant_id, status, updated_at DESC);

CREATE TABLE IF NOT EXISTS public.tenant_module_overrides (
  tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  module_code text NOT NULL REFERENCES public.module_catalog(code) ON DELETE RESTRICT,
  enabled boolean NOT NULL,
  limits jsonb NOT NULL DEFAULT '{}'::jsonb CHECK (jsonb_typeof(limits) = 'object'),
  reason text NOT NULL CHECK (length(trim(reason)) BETWEEN 1 AND 500),
  expires_at timestamptz,
  changed_by uuid REFERENCES public.app_users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (tenant_id, module_code)
);
CREATE INDEX IF NOT EXISTS tenant_module_overrides_expiry_idx
  ON public.tenant_module_overrides(expires_at) WHERE expires_at IS NOT NULL;

CREATE TABLE IF NOT EXISTS public.billing_webhook_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider text NOT NULL,
  provider_event_id text NOT NULL,
  event_type text NOT NULL,
  payload_hash text NOT NULL,
  status text NOT NULL DEFAULT 'received' CHECK (status IN ('received','processing','processed','failed','ignored')),
  received_at timestamptz NOT NULL DEFAULT now(),
  processed_at timestamptz,
  error_code text,
  UNIQUE (provider, provider_event_id)
);
CREATE INDEX IF NOT EXISTS billing_webhook_events_status_idx
  ON public.billing_webhook_events(status, received_at);

-- Deliberately no grants and no RLS disabling. Access policies and least-privilege
-- runtime grants must be added and tested before this migration can be applied.
COMMIT;
