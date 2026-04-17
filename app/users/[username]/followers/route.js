import { NextResponse } from "next/server";
import { orderedCollection } from "../../../../lib/oracat/activitypub";
import { followersUrl, getBaseUrl, jsonHeaders } from "../../../../lib/oracat/config";
import { getFollowers } from "../../../../lib/oracat/repository";

export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  const { username } = await params;
  const items = await getFollowers(username);
  return new NextResponse(
    JSON.stringify(orderedCollection(followersUrl(getBaseUrl(request), username), items.map((entry) => entry.remote_actor_url))),
    {
      headers: jsonHeaders('application/activity+json; charset=utf-8')
    }
  );
}
