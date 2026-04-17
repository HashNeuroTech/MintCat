import { NextResponse } from "next/server";
import { getBaseUrl, jsonHeaders } from "../../../../../lib/oracat/config";
import { getNoteDocument } from "../../../../../lib/oracat/repository";

export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  const { username, postId } = await params;
  const note = await getNoteDocument({
    username,
    postId,
    baseUrl: getBaseUrl(request)
  });

  if (!note) {
    return NextResponse.json({ error: "Unknown status." }, { status: 404 });
  }

  return new NextResponse(JSON.stringify(note), {
    headers: jsonHeaders('application/activity+json; charset=utf-8')
  });
}
