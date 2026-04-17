import { NextResponse } from "next/server";
import { serverClient } from "../../../../lib/oracat/supabase-server";

export const dynamic = "force-dynamic";

export async function GET() {
  const client = serverClient();
  let database = "unconfigured";
  let queuePending = null;
  let queueDead = null;

  if (client) {
    const [{ count: pendingCount, error: pendingError }, { count: deadCount, error: deadError }] = await Promise.all([
      client.from("oracat_delivery_jobs").select("*", { count: "exact", head: true }).eq("state", "pending"),
      client.from("oracat_delivery_jobs").select("*", { count: "exact", head: true }).eq("state", "dead")
    ]);

    database = pendingError || deadError ? "degraded" : "ok";
    queuePending = pendingCount ?? 0;
    queueDead = deadCount ?? 0;
  }

  return NextResponse.json({
    ok: true,
    service: "mintcat-web",
    timestamp: new Date().toISOString(),
    checks: {
      web: "ok",
      database,
      uploads: process.env.ORACAT_MEDIA_BUCKET ? "configured" : "demo",
      federationQueue: process.env.ORACAT_QUEUE_TOKEN ? "protected" : "open"
    },
    metrics: {
      queuePending,
      queueDead
    }
  });
}
