import { NextResponse } from "next/server";
import { readOwnerSession } from "@/lib/owner-session";

export async function GET() {
  const session = await readOwnerSession();
  if (!session) return NextResponse.json({ authenticated: false }, { status: 401 });
  return NextResponse.json({ authenticated: true, expiresAt: new Date(session.expiresAt).toISOString() });
}
