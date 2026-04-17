import { NextResponse } from "next/server";
import { getAccountByEmail, listDeliveryJobs } from "../../../../lib/oracat/repository";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const email = request.nextUrl.searchParams.get("email");
  if (!email) {
    return NextResponse.json({ jobs: [] });
  }

  const account = await getAccountByEmail(email);
  if (!account) {
    return NextResponse.json({ jobs: [] });
  }

  const jobs = await listDeliveryJobs(account.username);
  return NextResponse.json({ jobs });
}
