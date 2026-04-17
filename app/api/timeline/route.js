import { NextResponse } from "next/server";
import { listTimeline, timelineSummary } from "../../../lib/oracat/repository";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const viewerEmail = request.nextUrl.searchParams.get("email") || "";
  const posts = await listTimeline(request, viewerEmail);
  return NextResponse.json({
    posts,
    summary: timelineSummary(posts)
  });
}
