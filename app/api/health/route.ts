import { NextResponse } from "next/server";

/**
 * Static-export-safe fallback for the GitHub Pages frontend.
 * Real runtime health checks belong to the separately deployed Neon function.
 * This file must remain build-time static because next.config.ts uses output: "export".
 */
export const dynamic = "force-static";

export async function GET() {
  return NextResponse.json({
    service: "aptinusa-web",
    status: "static",
    message: "Frontend is statically exported; query the separately deployed runtime health function for live readiness."
  });
}
