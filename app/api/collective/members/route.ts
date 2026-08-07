import { NextResponse } from "next/server";
import { collectiveApiFetch, ApiError } from "@/lib/api-client";
import { verifyStaffSession } from "@/lib/session";

export async function GET(request: Request) {
  try {
    const session = await verifyStaffSession(request);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const members = await collectiveApiFetch<MemberItem[]>("/members");
    return NextResponse.json({ members });
  } catch (err) {
    const status = err instanceof ApiError ? err.status : 500;
    return NextResponse.json({ error: (err as Error).message }, { status });
  }
}

interface MemberItem {
  _id: string;
  name: string;
  email: string;
  role: string;
  communityId: string;
}
