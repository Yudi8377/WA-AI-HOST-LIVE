import postgres from "postgres";
import type { IncomingMessage, ServerResponse } from "node:http";

type VercelRequest = IncomingMessage & { method?: string };
type VercelResponse = ServerResponse;

let sql: ReturnType<typeof postgres> | undefined;

function respond(res: VercelResponse, status: number, payload: unknown) {
  res.statusCode = status;
  res.setHeader("content-type", "application/json; charset=utf-8");
  res.setHeader("cache-control", "no-store, max-age=0");
  res.setHeader("x-content-type-options", "nosniff");
  res.setHeader("referrer-policy", "no-referrer");
  res.end(JSON.stringify(payload));
}

function database() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_NOT_CONFIGURED");
  if (!sql) {
    sql = postgres(url, { max: 1, idle_timeout: 5, connect_timeout: 3, prepare: false });
  }
  return sql;
}

/**
 * Minimal public readiness probe for a separately deployed Vercel function.
 * It reveals no connection strings, role names, schema names, or query errors.
 * HTTP 200 means the database connection can assume the configured safe runtime role.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.setHeader("allow", "GET, HEAD");
    return respond(res, 405, { status: "not_ready", error: "METHOD_NOT_ALLOWED" });
  }

  try {
    const db = database();
    await db.begin(async (tx) => {
      await tx`SET LOCAL ROLE wa_app_runtime_safe`;
      const rows = await tx`SELECT current_user AS role_name,
        (SELECT rolbypassrls FROM pg_roles WHERE rolname = current_user) AS bypass_rls,
        (SELECT rolsuper FROM pg_roles WHERE rolname = current_user) AS superuser,
        (SELECT rolcreaterole FROM pg_roles WHERE rolname = current_user) AS create_role,
        (SELECT rolcreatedb FROM pg_roles WHERE rolname = current_user) AS create_db,
        pg_has_role(current_user, 'neon_superuser', 'MEMBER') AS can_escalate`;
      const row = rows[0];
      if (!row || row.role_name !== "wa_app_runtime_safe" || row.bypass_rls !== false ||
          row.superuser !== false || row.create_role !== false || row.create_db !== false ||
          row.can_escalate === true) {
        throw new Error("UNSAFE_RUNTIME_ROLE");
      }
    });
    return respond(res, 200, { service: "aptinusa-runtime", status: "ready", checks: { database: "ok", leastPrivilegeRole: "ok" } });
  } catch {
    // Intentionally suppress error details: connection strings and SQL errors are sensitive.
    return respond(res, 503, { service: "aptinusa-runtime", status: "not_ready", checks: { database: "unverified", leastPrivilegeRole: "unverified" } });
  }
}
