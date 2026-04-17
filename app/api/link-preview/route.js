import { NextResponse } from "next/server";
import { fetchLinkPreview } from "../../../lib/oracat/link-preview";
import { checkRateLimit } from "../../../lib/oracat/rate-limit";
import { recordRiskEvent } from "../../../lib/oracat/risk-events";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const rate = checkRateLimit(request, "link-preview:read", { limit: 60, windowMs: 60_000 });
  if (!rate.ok) {
    await recordRiskEvent("rate_limit_triggered", {
      route: "/api/link-preview",
      retryAfter: rate.retryAfter
    }, "warning");
    return NextResponse.json({ error: "Rate limit exceeded.", retryAfter: rate.retryAfter }, { status: 429 });
  }

  const url = request.nextUrl.searchParams.get("url") || "";
  if (!url) {
    return NextResponse.json({ error: "url is required." }, { status: 400 });
  }

  try {
    const preview = await fetchLinkPreview(url);
    return NextResponse.json({ preview });
  } catch (error) {
    await recordRiskEvent("preview_fetch_failure", {
      route: "/api/link-preview",
      url,
      message: error.message || "Preview fetch failed."
    }, "warning");
    return NextResponse.json({ error: error.message || "Preview fetch failed." }, { status: 500 });
  }
}
