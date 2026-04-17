import { NextResponse } from "next/server";
import { actorDocument, webfingerDocument } from "../../../lib/oracat/activitypub";
import { getBaseUrl, getHostFromRequest, webfingerResource, jsonHeaders } from "../../../lib/oracat/config";
import { getAccountByUsername } from "../../../lib/oracat/repository";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const resource = request.nextUrl.searchParams.get("resource");
  const host = getHostFromRequest(request);
  const match = String(resource || "").match(/^acct:([^@]+)@(.+)$/i);

  if (!match || match[2] !== host) {
    return NextResponse.json({ error: "Unsupported resource." }, { status: 404 });
  }

  const username = match[1];
  const account = await getAccountByUsername(username);
  if (!account) {
    return NextResponse.json({ error: "Unknown actor." }, { status: 404 });
  }

  const actor = actorDocument(getBaseUrl(request), account);
  return new NextResponse(JSON.stringify(webfingerDocument(webfingerResource(username, host), actor)), {
    headers: jsonHeaders("application/jrd+json; charset=utf-8")
  });
}
