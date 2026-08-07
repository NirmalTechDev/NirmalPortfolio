import { NextResponse } from "next/server";
import { collectiveApiFetch, ApiError } from "@/lib/api-client";
import { verifyStaffSession } from "@/lib/session";

/** GET /api/collective/portfolio/projects — Fetch all projects (Public) */
export async function GET() {
  try {
    const projects = await collectiveApiFetch<unknown[]>("/portfolio/projects", {
      public: true,
    });
    return NextResponse.json({ projects });
  } catch (err) {
    const status = err instanceof ApiError ? err.status : 500;
    return NextResponse.json({ error: (err as Error).message }, { status });
  }
}

/** POST /api/collective/portfolio/projects — Create project (Staff only) */
export async function POST(request: Request) {
  try {
    const session = await verifyStaffSession(request);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const result = await collectiveApiFetch("/portfolio/projects", {
      method: "POST",
      body: JSON.stringify(body),
    });
    return NextResponse.json({ success: true, project: result });
  } catch (err) {
    const status = err instanceof ApiError ? err.status : 500;
    return NextResponse.json({ error: (err as Error).message }, { status });
  }
}
