import { NextResponse } from "next/server";
import { actorDocument } from "../../../lib/oracat/activitypub";
import { getBaseUrl, jsonHeaders } from "../../../lib/oracat/config";
import { getAccountByUsername } from "../../../lib/oracat/repository";

export const dynamic = "force-dynamic";

export async function GET(_request, { params }) {
  const { username } = await params;
  const account = await getAccountByUsername(username);
  if (!account) {
    return NextResponse.json({ error: "Unknown actor." }, { status: 404 });
  }

  return new NextResponse(JSON.stringify(actorDocument(getBaseUrl(_request), account)), {
    headers: jsonHeaders('application/activity+json; charset=utf-8')
  });
}
