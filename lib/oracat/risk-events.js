import { serverClient } from "./supabase-server";

export async function recordRiskEvent(eventType, payload = {}, severity = "info") {
  const client = serverClient();
  if (!client) {
    return null;
  }

  const insert = {
    event_type: String(eventType || "").trim(),
    severity: String(severity || "info").trim() || "info",
    payload
  };

  if (!insert.event_type) {
    return null;
  }

  const { data, error } = await client.from("oracat_risk_events").insert(insert).select("*").maybeSingle();
  if (error) {
    console.error("Failed to record risk event", error.message);
    return null;
  }

  return data || null;
}
