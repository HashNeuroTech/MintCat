import { NextResponse } from "next/server";
import { mutatePostInteraction } from "../../../../lib/oracat/repository";

export const dynamic = "force-dynamic";

export async function POST(request, { params }) {
  const { postId } = await params;
  const body = await request.json();
  const email = String(body.email || "").trim();
  const displayName = String(body.displayName || "").trim();
  const action = String(body.action || "").trim();
  const content = String(body.content || "");

  if (!postId || !email || !displayName || !action) {
    return NextResponse.json({ error: "postId, email, displayName and action are required." }, { status: 400 });
  }

  const post = await mutatePostInteraction({
    postId,
    email,
    displayName,
    action,
    content
  });

  if (!post) {
    return NextResponse.json({ error: "Post not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
