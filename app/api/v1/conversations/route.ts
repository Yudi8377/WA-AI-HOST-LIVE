import { NextRequest, NextResponse } from "next/server";
import { withTenantDatabase } from "@/src/lib/tenant-db";

/**
 * Tenant-scoped conversation listing.
 *
 * IMPORTANT: Authentication is deliberately fail-closed until the Better Auth
 * session adapter is implemented. Never accept userId from body/query/header.
 */
export const dynamic = "force-dynamic";
export async function GET(request: NextRequest) {
  const tenantId = request.nextUrl.searchParams.get("tenantId");
  if (!tenantId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(tenantId)) {
    return NextResponse.json({ error: "INVALID_TENANT_ID" }, { status: 400, headers: { "Cache-Control": "no-store" } });
  }

  // Intentionally no anonymous or caller-supplied identity fallback.
  // Wire this route only after a verified server-side Better Auth session exists.
  return NextResponse.json(
    { error: "AUTHENTICATION_NOT_CONFIGURED", message: "Conversation API is unavailable until server-side session verification is configured." },
    { status: 503, headers: { "Cache-Control": "no-store" } },
  );
}
