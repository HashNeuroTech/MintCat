import { NextResponse } from "next/server";
import { orderedCollection } from "../../../../lib/oracat/activitypub";
import { getBaseUrl, jsonHeaders, outboxUrl } from "../../../../lib/oracat/config";
import { getOutboxCollection } from "../../../../lib/oracat/repository";

export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  const { username } = await params;
  const baseUrl = getBaseUrl(request);
  const items = await getOutboxCollection({ username, baseUrl });
  if (!items) {
    return NextResponse.json({ error: "Unknown actor." }, { status: 404 });
  }

  return new NextResponse(JSON.stringify(orderedCollection(outboxUrl(baseUrl, username), items)), {
    headers: jsonHeaders('application/activity+json; charset=utf-8')
  });
}
