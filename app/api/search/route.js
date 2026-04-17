import { NextResponse } from "next/server";
import { searchRemoteAccount, serializeRemoteActorForClient, upsertRemoteActor } from "../../../lib/oracat/repository";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const query = request.nextUrl.searchParams.get("query");
  if (!query) {
    return NextResponse.json({ result: null });
  }

  try {
    const actor = await searchRemoteAccount(query);
    if (!actor) {
      return NextResponse.json({ result: null });
    }

    const stored = await upsertRemoteActor(actor);
    return NextResponse.json({
      result: serializeRemoteActorForClient(stored)
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
