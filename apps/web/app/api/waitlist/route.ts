import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { email, source } = body as { email?: string; source?: string };

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // If Supabase isn't configured yet, still return success — don't block the form
  if (!supabaseUrl || !serviceKey) {
    console.log(`[waitlist] ${email} (source: ${source ?? "unknown"}) — Supabase not configured, logged only`);
    return NextResponse.json({ ok: true });
  }

  const res = await fetch(`${supabaseUrl}/rest/v1/waitlist`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      Prefer: "resolution=ignore-duplicates",
    },
    body: JSON.stringify({
      email: email.toLowerCase().trim(),
      source: source ?? "unknown",
      created_at: new Date().toISOString(),
    }),
  });

  if (!res.ok && res.status !== 409) {
    console.error("Supabase waitlist insert failed:", res.status, await res.text());
    // Still return ok — don't surface DB errors to the user
  }

  return NextResponse.json({ ok: true });
}
