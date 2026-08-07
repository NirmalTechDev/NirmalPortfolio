import { NextResponse } from "next/server";
import { collectiveApiFetch, ApiError } from "@/lib/api-client";
import { verifyStaffSession } from "@/lib/session";

/** PATCH /api/collective/portfolio/projects/[id] — Update project (Staff only) */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await verifyStaffSession(request);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await request.json();
    const result = await collectiveApiFetch(`/portfolio/projects/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
    return NextResponse.json({ success: true, project: result });
  } catch (err) {
    const status = err instanceof ApiError ? err.status : 500;
    return NextResponse.json({ error: (err as Error).message }, { status });
  }
}

/** DELETE /api/collective/portfolio/projects/[id] — Delete project (Staff only) */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await verifyStaffSession(request);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    await collectiveApiFetch(`/portfolio/projects/${id}`, {
      method: "DELETE",
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    const status = err instanceof ApiError ? err.status : 500;
    return NextResponse.json({ error: (err as Error).message }, { status });
  }
}
