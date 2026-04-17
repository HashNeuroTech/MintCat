import { NextResponse } from "next/server";
import { serverClient } from "../../../../lib/oracat/supabase-server";

export const dynamic = "force-dynamic";

export async function GET() {
  const client = serverClient();
  if (!client) {
    return NextResponse.json({ events: [] });
  }

  const { data, error } = await client.from("oracat_risk_events").select("*").order("created_at", { ascending: false }).limit(50);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ events: data || [] });
}

export async function POST(request) {
  const client = serverClient();
  const body = await request.json();

  if (!client) {
    return NextResponse.json({ error: "Supabase is required." }, { status: 500 });
  }

  let payload = {};
  if (typeof body.payload === "string" && body.payload.trim()) {
    try {
      payload = JSON.parse(body.payload);
    } catch (_error) {
      return NextResponse.json({ error: "payload must be valid JSON." }, { status: 400 });
    }
  } else if (body.payload && typeof body.payload === "object") {
    payload = body.payload;
  }

  const insert = {
    event_type: String(body.eventType || "").trim(),
    severity: String(body.severity || "info").trim() || "info",
    payload
  };

  if (!insert.event_type) {
    return NextResponse.json({ error: "eventType is required." }, { status: 400 });
  }

  const { data, error } = await client.from("oracat_risk_events").insert(insert).select("*").single();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, event: data });
}
