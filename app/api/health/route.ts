import { NextResponse } from "next/server";
import { getDatabase } from "@/src/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({
      ok: true,
      mode: "simulator",
      database: "not_configured",
      message: "Set DATABASE_URL in the server environment to enable Neon connectivity."
    });
  }

  try {
    await getDatabase()`select 1 as ok`;
    return NextResponse.json({ ok: true, mode: "configured", database: "connected" });
  } catch {
    return NextResponse.json(
      { ok: false, mode: "configured", database: "unavailable", message: "Database connectivity check failed." },
      { status: 503 }
    );
  }
}
