import { NextResponse } from "next/server";
import { orderedCollection } from "../../../../lib/oracat/activitypub";
import { followingUrl, getBaseUrl, jsonHeaders } from "../../../../lib/oracat/config";
import { getFollowing } from "../../../../lib/oracat/repository";

export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  const { username } = await params;
  const items = await getFollowing(username);
  return new NextResponse(
    JSON.stringify(orderedCollection(followingUrl(getBaseUrl(request), username), items.map((entry) => entry.remote_actor_url))),
    {
      headers: jsonHeaders('application/activity+json; charset=utf-8')
    }
  );
}
