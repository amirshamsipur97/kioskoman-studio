import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = {
  name?: unknown;
  email?: unknown;
  message?: unknown;
};

function isNonEmptyString(v: unknown, max = 2000): v is string {
  return typeof v === "string" && v.trim().length > 0 && v.length <= max;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!isNonEmptyString(body.name, 120))
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  if (!isNonEmptyString(body.email, 200) || !EMAIL_RE.test(body.email))
    return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
  if (!isNonEmptyString(body.message, 5000))
    return NextResponse.json({ error: "Message is required" }, { status: 400 });

  const payload = {
    name: body.name.trim(),
    email: body.email.trim().toLowerCase(),
    message: body.message.trim(),
    user_agent: req.headers.get("user-agent")?.slice(0, 500) ?? null,
  };

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    // Demo mode: not wired to a DB yet. Log so devs can see it during preview.
    console.log("[contact] no DB configured, message:", payload);
    return NextResponse.json({ ok: true, demo: true });
  }

  const { error } = await supabase.from("contact_submissions").insert(payload);
  if (error) {
    console.error("[contact] supabase insert failed:", error);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
