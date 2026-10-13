-- WA AI HOST LIVE — initial schema for Neon PostgreSQL
-- Apply only after confirming this is the intended development branch.
-- Creates new tables; does not alter or drop existing tables.
BEGIN;
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE IF NOT EXISTS tenants (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 name text NOT NULL CHECK (length(trim(name)) BETWEEN 1 AND 160),
 slug text NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9][a-z0-9-]{1,62}$'),
 plan text NOT NULL DEFAULT 'free' CHECK (plan IN ('free','community','pro','enterprise')),
 status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','suspended','closed')),
 created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS app_users (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), auth_provider text NOT NULL, auth_subject text NOT NULL,
 email text, display_name text, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE (auth_provider, auth_subject)
);
CREATE TABLE IF NOT EXISTS memberships (
 tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
 user_id uuid NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
 role text NOT NULL CHECK (role IN ('owner','admin','manager','operator','analyst','viewer')),
 status text NOT NULL DEFAULT 'active' CHECK (status IN ('invited','active','suspended')),
 created_at timestamptz NOT NULL DEFAULT now(), PRIMARY KEY (tenant_id,user_id)
);
CREATE TABLE IF NOT EXISTS channel_connections (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
 provider text NOT NULL CHECK (provider IN ('whatsapp','facebook','instagram','tiktok','shopee','webchat','manual')),
 display_name text NOT NULL, provider_account_id text,
 status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','connected','degraded','disconnected','revoked')),
 capabilities jsonb NOT NULL DEFAULT '{}'::jsonb, secret_reference text, last_verified_at timestamptz,
 created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE (tenant_id,provider,provider_account_id), UNIQUE (tenant_id,id)
);
CREATE INDEX IF NOT EXISTS channel_connections_tenant_status_idx ON channel_connections(tenant_id,status);
CREATE TABLE IF NOT EXISTS customers (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
 display_name text, normalized_phone text, email text, metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
 created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(), UNIQUE (tenant_id,id)
);
CREATE INDEX IF NOT EXISTS customers_tenant_created_idx ON customers(tenant_id,created_at DESC);
CREATE INDEX IF NOT EXISTS customers_tenant_phone_idx ON customers(tenant_id,normalized_phone) WHERE normalized_phone IS NOT NULL;
CREATE TABLE IF NOT EXISTS conversations (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
 channel_connection_id uuid, customer_id uuid, provider_conversation_id text, subject text,
 status text NOT NULL DEFAULT 'open' CHECK (status IN ('open','pending','resolved','archived')),
 assigned_user_id uuid REFERENCES app_users(id) ON DELETE SET NULL,
 handling_mode text NOT NULL DEFAULT 'copilot' CHECK (handling_mode IN ('copilot','human','automation')),
 last_message_at timestamptz, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE (tenant_id,id),
 FOREIGN KEY (tenant_id,channel_connection_id) REFERENCES channel_connections(tenant_id,id),
 FOREIGN KEY (tenant_id,customer_id) REFERENCES customers(tenant_id,id)
);
CREATE INDEX IF NOT EXISTS conversations_tenant_status_recent_idx ON conversations(tenant_id,status,last_message_at DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS conversations_tenant_assignee_idx ON conversations(tenant_id,assigned_user_id,status);
CREATE TABLE IF NOT EXISTS messages (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
 conversation_id uuid NOT NULL, provider_message_id text,
 direction text NOT NULL CHECK (direction IN ('inbound','outbound','internal')),
 actor_type text NOT NULL CHECK (actor_type IN ('customer','ai','user','system')), body text,
 content_type text NOT NULL DEFAULT 'text',
 delivery_status text NOT NULL DEFAULT 'received' CHECK (delivery_status IN ('received','draft','queued','sent','delivered','read','failed','cancelled')),
 metadata jsonb NOT NULL DEFAULT '{}'::jsonb, created_at timestamptz NOT NULL DEFAULT now(),
 FOREIGN KEY (tenant_id,conversation_id) REFERENCES conversations(tenant_id,id) ON DELETE CASCADE, UNIQUE (tenant_id,id)
);
CREATE INDEX IF NOT EXISTS messages_tenant_conversation_created_idx ON messages(tenant_id,conversation_id,created_at);
CREATE UNIQUE INDEX IF NOT EXISTS messages_provider_idempotency_idx ON messages(tenant_id,provider_message_id) WHERE provider_message_id IS NOT NULL;
CREATE TABLE IF NOT EXISTS products (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
 sku text, name text NOT NULL CHECK (length(trim(name)) BETWEEN 1 AND 240), description text,
 price_minor bigint CHECK (price_minor IS NULL OR price_minor >= 0), currency char(3) NOT NULL DEFAULT 'IDR',
 stock_quantity integer CHECK (stock_quantity IS NULL OR stock_quantity >= 0),
 status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','active','archived')),
 facts jsonb NOT NULL DEFAULT '{}'::jsonb, updated_at timestamptz NOT NULL DEFAULT now(), created_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE (tenant_id,id), UNIQUE (tenant_id,sku)
);
CREATE INDEX IF NOT EXISTS products_tenant_status_name_idx ON products(tenant_id,status,name);
CREATE TABLE IF NOT EXISTS knowledge_documents (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
 title text NOT NULL, source_type text NOT NULL CHECK (source_type IN ('product','policy','faq','manual','import')),
 source_uri text, content text NOT NULL,
 status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','approved','archived')),
 version integer NOT NULL DEFAULT 1 CHECK (version > 0), approved_by uuid REFERENCES app_users(id) ON DELETE SET NULL,
 approved_at timestamptz, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE (tenant_id,id)
);
CREATE INDEX IF NOT EXISTS knowledge_tenant_status_idx ON knowledge_documents(tenant_id,status,source_type);
CREATE TABLE IF NOT EXISTS agent_runs (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
 conversation_id uuid, agent_name text NOT NULL, model_provider text, model_name text, prompt_version text,
 status text NOT NULL DEFAULT 'queued' CHECK (status IN ('queued','running','succeeded','failed','escalated','cancelled')),
 confidence numeric(5,4) CHECK (confidence IS NULL OR (confidence >= 0 AND confidence <= 1)),
 input_tokens integer CHECK (input_tokens IS NULL OR input_tokens >= 0), output_tokens integer CHECK (output_tokens IS NULL OR output_tokens >= 0),
 latency_ms integer CHECK (latency_ms IS NULL OR latency_ms >= 0), policy_result text,
 source_ids jsonb NOT NULL DEFAULT '[]'::jsonb, error_code text,
 created_at timestamptz NOT NULL DEFAULT now(), completed_at timestamptz,
 FOREIGN KEY (tenant_id,conversation_id) REFERENCES conversations(tenant_id,id) ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS agent_runs_tenant_created_idx ON agent_runs(tenant_id,created_at DESC);
CREATE TABLE IF NOT EXISTS webhook_events (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE,
 provider text NOT NULL, provider_event_id text NOT NULL, event_type text NOT NULL,
 status text NOT NULL DEFAULT 'received' CHECK (status IN ('received','processing','processed','failed','ignored')),
 payload_hash text, received_at timestamptz NOT NULL DEFAULT now(), processed_at timestamptz, error_code text,
 UNIQUE (provider,provider_event_id)
);
CREATE INDEX IF NOT EXISTS webhook_events_status_received_idx ON webhook_events(status,received_at);
CREATE TABLE IF NOT EXISTS audit_events (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid REFERENCES tenants(id) ON DELETE SET NULL,
 actor_user_id uuid REFERENCES app_users(id) ON DELETE SET NULL,
 actor_type text NOT NULL CHECK (actor_type IN ('user','ai','system','provider')), action text NOT NULL,
 resource_type text, resource_id text,
 outcome text NOT NULL DEFAULT 'success' CHECK (outcome IN ('success','denied','failed')),
 request_id text, details jsonb NOT NULL DEFAULT '{}'::jsonb, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS audit_events_tenant_created_idx ON audit_events(tenant_id,created_at DESC);
CREATE INDEX IF NOT EXISTS audit_events_action_created_idx ON audit_events(action,created_at DESC);
COMMIT;
-- Tenant scoping must be enforced in every server-side query.
-- Add/test RLS only after auth/session and connection-pooling behavior is defined.
-- This schema alone does not secure a multi-tenant app.
