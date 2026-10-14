import { NextResponse } from "next/server";
import { getDatabase } from "@/src/lib/db";

/**
 * Safe liveness/readiness endpoint. It never returns database details or secrets.
 * GET /api/health
 */
export const dynamic = "force-dynamic";
export async function GET() {
  const configured = Boolean(process.env.DATABASE_URL);
  if (!configured) {
    return NextResponse.json(
      { service: "aptinusa-api", status: "degraded", checks: { database: "not_configured" } },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
  try {
    await getDatabase()`select 1 as ok`;
    return NextResponse.json(
      { service: "aptinusa-api", status: "ok", checks: { database: "reachable" } },
      { status: 200, headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      { service: "aptinusa-api", status: "degraded", checks: { database: "unavailable" } },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
