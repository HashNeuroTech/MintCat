import { NextResponse } from "next/server";
import { serverClient } from "../../../../lib/oracat/supabase-server";

export const dynamic = "force-dynamic";

export async function GET() {
  const client = serverClient();
  if (!client) {
    return NextResponse.json({ actions: [] });
  }

  const { data, error } = await client.from("oracat_moderation_actions").select("*").order("created_at", { ascending: false }).limit(50);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ actions: data || [] });
}

export async function POST(request) {
  const client = serverClient();
  const body = await request.json();

  if (!client) {
    return NextResponse.json({ error: "Supabase is required." }, { status: 500 });
  }

  const payload = {
    target_type: String(body.targetType || "").trim(),
    target_id: String(body.targetId || "").trim(),
    action_type: String(body.actionType || "").trim(),
    notes: String(body.notes || "").trim()
  };

  if (!payload.target_type || !payload.target_id || !payload.action_type) {
    return NextResponse.json({ error: "targetType, targetId, actionType are required." }, { status: 400 });
  }

  const { data, error } = await client.from("oracat_moderation_actions").insert(payload).select("*").single();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, action: data });
}
