import { NextResponse } from "next/server";
import { serverClient } from "../../../../lib/oracat/supabase-server";

export const dynamic = "force-dynamic";

export async function GET() {
  const client = serverClient();
  if (!client) {
    return NextResponse.json({ reports: [] });
  }

  const { data, error } = await client.from("oracat_reports").select("*").order("created_at", { ascending: false }).limit(50);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ reports: data || [] });
}

export async function POST(request) {
  const client = serverClient();
  const body = await request.json();

  if (!client) {
    return NextResponse.json({ error: "Supabase is required." }, { status: 500 });
  }

  const payload = {
    reporter_email: String(body.reporterEmail || "").trim(),
    target_post_id: body.targetPostId ? String(body.targetPostId) : null,
    target_actor: body.targetActor ? String(body.targetActor) : null,
    reason: String(body.reason || "").trim(),
    details: String(body.details || "").trim()
  };

  if (!payload.reporter_email || !payload.reason) {
    return NextResponse.json({ error: "reporterEmail and reason are required." }, { status: 400 });
  }

  const { data, error } = await client.from("oracat_reports").insert(payload).select("*").single();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, report: data });
}
