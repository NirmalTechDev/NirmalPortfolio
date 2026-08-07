import { NextResponse } from "next/server";
import { getStaffUser } from "@/lib/session";

export async function GET() {
  const user = await getStaffUser();

  if (!user) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  }

  return NextResponse.json({ authenticated: true, user });
}
