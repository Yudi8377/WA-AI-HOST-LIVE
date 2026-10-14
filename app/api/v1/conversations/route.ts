import { NextResponse } from "next/server";

/**
 * Static-export-safe placeholder only.
 * Production conversation APIs must be deployed as a server runtime after
 * server-side session verification, tenant membership, and RLS context are wired.
 * Never accept caller-supplied identity as authentication.
 */
export const dynamic = "force-static";

export async function GET() {
  return NextResponse.json({
    error: "RUNTIME_API_NOT_CONFIGURED",
    message: "Conversation listing is not available on the static frontend. Deploy the authenticated API runtime before enabling this endpoint."
  });
}
