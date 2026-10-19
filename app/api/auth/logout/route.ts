import { NextResponse } from "next/server";
import { clearedSessionCookies } from "@/lib/owner-session";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  for (const c of clearedSessionCookies()) response.cookies.set(c);
  return response;
}
