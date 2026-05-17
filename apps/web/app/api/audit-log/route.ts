import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(_req: NextRequest) {
  // TODO Phase 3: verify Supabase session, return org scan_results
  return NextResponse.json({ results: [], message: "Auth not yet wired" }, { status: 200 });
}

export async function POST(req: NextRequest) {
  const orgToken = req.headers.get("x-packguard-token");

  if (!orgToken) {
    return NextResponse.json({ error: "x-packguard-token header required" }, { status: 401 });
  }

  // TODO Phase 3: validate token against orgs table, insert scan_result row
  return NextResponse.json({ ok: true, message: "Audit log stub — Phase 3 wires Supabase" });
}
