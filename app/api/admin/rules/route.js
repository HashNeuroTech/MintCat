import { NextResponse } from "next/server";
import { serverClient } from "../../../../lib/oracat/supabase-server";

export const dynamic = "force-dynamic";

export async function GET() {
  const client = serverClient();
  if (!client) {
    return NextResponse.json({ rules: [] });
  }

  const { data, error } = await client.from("oracat_instance_rules").select("*").order("created_at", { ascending: true });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ rules: data || [] });
}

export async function POST(request) {
  const client = serverClient();
  const body = await request.json();

  if (!client) {
    return NextResponse.json({ error: "Supabase is required." }, { status: 500 });
  }

  const payload = {
    title: String(body.title || "").trim(),
    body: String(body.body || "").trim()
  };

  if (!payload.title || !payload.body) {
    return NextResponse.json({ error: "title and body are required." }, { status: 400 });
  }

  const { data, error } = await client.from("oracat_instance_rules").insert(payload).select("*").single();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, rule: data });
}
