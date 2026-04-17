import { NextResponse } from "next/server";
import { createLocalPost, enqueueCreateDeliveries } from "../../../lib/oracat/repository";
import { checkRateLimit } from "../../../lib/oracat/rate-limit";
import { recordRiskEvent } from "../../../lib/oracat/risk-events";

export const dynamic = "force-dynamic";

export async function POST(request) {
  const rate = checkRateLimit(request, "posts:create", { limit: 20, windowMs: 60_000 });
  if (!rate.ok) {
    await recordRiskEvent("rate_limit_triggered", {
      route: "/api/posts",
      retryAfter: rate.retryAfter
    }, "warning");
    return NextResponse.json({ error: "Rate limit exceeded.", retryAfter: rate.retryAfter }, { status: 429 });
  }

  const body = await request.json();
  const content = String(body.content || "").trim();
  const email = String(body.email || "").trim();
  const displayName = String(body.displayName || "").trim();
  const media = Array.isArray(body.media) ? body.media : [];
  const poll = body.poll && typeof body.poll === "object" ? body.poll : null;
  const visibility = String(body.visibility || "public").trim();
  const language = String(body.language || "").trim();

  if (!content) {
    return NextResponse.json({ error: "Content is required." }, { status: 400 });
  }

  if (!email || !displayName) {
    return NextResponse.json({ error: "Authenticated identity is required." }, { status: 401 });
  }

  try {
    const { account, post } = await createLocalPost({
      email,
      displayName,
      content,
      media,
      poll,
      visibility,
      language,
      request
    });

    await enqueueCreateDeliveries({
      account,
      post,
      request
    });

    return NextResponse.json({
      ok: true,
      postId: post.id,
      actor: account.username
    });
  } catch (error) {
    await recordRiskEvent("post_create_failed", {
      route: "/api/posts",
      email,
      message: error.message || "Unable to create post."
    }, "warning");
    return NextResponse.json({ error: error.message || "Unable to create post." }, { status: 500 });
  }
}
