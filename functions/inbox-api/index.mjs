/**
 * Neon Function: authenticated tenant-membership bootstrap.
 *
 * Required server-side environment:
 *   NEON_AUTH_BASE_URL   Neon Better Auth base URL (server-side only)
 *   WA_APP_DATABASE_URL  pooled connection string for wa_app_runtime (never owner)
 *   ALLOWED_ORIGIN       exact dashboard origin
 *
 * Deployment gate: verify that the chosen browser auth flow can securely deliver
 * a valid session to this function. GitHub Pages and Neon Auth are separate origins;
 * do not assume an HttpOnly cookie is sent to this function's hostname.
 * This function intentionally fails closed when configuration/session is absent.
 */
import postgres from "postgres";

const json = (data, status = 200, extra = {}) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store, max-age=0",
      "x-content-type-options": "nosniff",
      "referrer-policy": "no-referrer",
      ...extra,
    },
  });

function cors(request) {
  const origin = request.headers.get("origin");
  const allowed = process.env.ALLOWED_ORIGIN;
  if (!origin || !allowed || origin !== allowed) return {};
  return {
    "access-control-allow-origin": allowed,
    "access-control-allow-credentials": "true",
    "access-control-allow-methods": "GET, OPTIONS",
    "access-control-allow-headers": "content-type",
    "vary": "Origin",
  };
}

async function verifiedSession(request) {
  const base = process.env.NEON_AUTH_BASE_URL;
  const cookie = request.headers.get("cookie");
  if (!base || !cookie) return null;

  // Keep Neon Auth's path prefix (e.g. /neondb/auth) intact.
  const authBase = base.endsWith("/") ? base : `${base}/`;
  const response = await fetch(new URL("get-session", authBase), {
    method: "GET",
    headers: { cookie, accept: "application/json" },
    redirect: "error",
    signal: AbortSignal.timeout(5000),
  });
  if (!response.ok) return null;

  const value = await response.json().catch(() => null);
  const user = value?.user;
  if (!user || typeof user.id !== "string" || user.id.length < 1 || user.id.length > 255) return null;
  return { id: user.id, name: typeof user.name === "string" ? user.name : null };
}

let sql;
function database() {
  const url = process.env.WA_APP_DATABASE_URL;
  if (!url) throw new Error("DATABASE_NOT_CONFIGURED");
  if (!sql) {
    sql = postgres(url, {
      max: 2,
      idle_timeout: 10,
      connect_timeout: 5,
      prepare: false,
      onnotice: () => {},
    });
  }
  return sql;
}

async function getMemberships(authSubject) {
  const db = database();
  return db.begin(async (tx) => {
    const roleRows = await tx`select current_user as role`;
    const role = roleRows[0]?.role;
    if (!role || ["neondb_owner", "postgres", "cloud_admin"].includes(role)) {
      throw new Error("PRIVILEGED_DATABASE_ROLE");
    }
    return tx`select tenant_id, tenant_name, tenant_slug, membership_role
               from app_private.resolve_active_memberships(${authSubject})`;
  });
}

export default {
  async fetch(request) {
    const headers = cors(request);
    if (request.method === "OPTIONS") {
      if (!headers["access-control-allow-origin"]) return json({ error: "origin_not_allowed" }, 403);
      return new Response(null, { status: 204, headers });
    }

    const url = new URL(request.url);
    if (request.method === "GET" && url.pathname === "/api/health") {
      return json({ status: "ok", service: "wa-ai-host-inbox-api", mode: "auth-required-for-data" }, 200, headers);
    }

    if (request.method !== "GET" || url.pathname !== "/api/session/tenants") {
      return json({ error: "not_found" }, 404, headers);
    }

    if (!headers["access-control-allow-origin"]) return json({ error: "origin_not_allowed" }, 403);

    try {
      const session = await verifiedSession(request);
      if (!session) return json({ error: "unauthorized" }, 401, headers);

      const memberships = await getMemberships(session.id);
      return json({
        user: { id: session.id, name: session.name },
        memberships: memberships.map((row) => ({
          tenantId: row.tenant_id,
          tenantName: row.tenant_name,
          tenantSlug: row.tenant_slug,
          role: row.membership_role,
        })),
      }, 200, headers);
    } catch (error) {
      const code = error instanceof Error ? error.message : "";
      if (code === "DATABASE_NOT_CONFIGURED" || code === "PRIVILEGED_DATABASE_ROLE") {
        return json({ error: "service_not_configured" }, 503, headers);
      }
      return json({ error: "internal_error" }, 500, headers);
    }
  },
};
