import { NextResponse } from "next/server";
import { collectiveApiFetch, ApiError } from "@/lib/api-client";
import { verifyStaffSession } from "@/lib/session";

/** GET /api/collective/portfolio/skills — Fetch all skills (Public) */
export async function GET() {
  try {
    const skills = await collectiveApiFetch<unknown[]>("/portfolio/skills", {
      public: true,
    });
    return NextResponse.json({ skills });
  } catch (err) {
    const status = err instanceof ApiError ? err.status : 500;
    return NextResponse.json({ error: (err as Error).message }, { status });
  }
}

/** POST /api/collective/portfolio/skills — Create skill (Staff only) */
export async function POST(request: Request) {
  try {
    const session = await verifyStaffSession(request);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const result = await collectiveApiFetch("/portfolio/skills", {
      method: "POST",
      body: JSON.stringify(body),
    });
    return NextResponse.json({ success: true, skill: result });
  } catch (err) {
    const status = err instanceof ApiError ? err.status : 500;
    return NextResponse.json({ error: (err as Error).message }, { status });
  }
}
