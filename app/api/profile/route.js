import { NextResponse } from "next/server";
import { getAccountByEmail, updateProfileAvatar } from "../../../lib/oracat/repository";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const email = request.nextUrl.searchParams.get("email") || "";
  if (!email) {
    return NextResponse.json({ profile: null });
  }

  const profile = await getAccountByEmail(email);
  return NextResponse.json({
    profile: profile
      ? {
          email: profile.email,
          displayName: profile.display_name,
          username: profile.username,
          avatarUrl: profile.avatar_url || ""
        }
      : null
  });
}

export async function POST(request) {
  const body = await request.json();
  const email = String(body.email || "").trim();
  const avatarUrl = String(body.avatarUrl || "").trim();

  if (!email) {
    return NextResponse.json({ error: "Email is required." }, { status: 400 });
  }

  const profile = await updateProfileAvatar({
    email,
    avatarUrl
  });

  return NextResponse.json({
    ok: true,
    profile: profile
      ? {
          email: profile.email,
          displayName: profile.display_name,
          username: profile.username,
          avatarUrl: profile.avatar_url || ""
        }
      : null
  });
}
