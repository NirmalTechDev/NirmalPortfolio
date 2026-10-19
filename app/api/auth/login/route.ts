import { NextResponse } from "next/server";
import { backendFetch, BackendError } from "@/lib/backend";
import { buildSessionCookies } from "@/lib/owner-session";
import { getAuthSecret } from "@/lib/env";
import { visitorHeaders } from "@/lib/forward-ip";

/**
 * Password-only owner login. The password is checked by the backend against a bcrypt
 * hash (OWNER_PASSWORD_HASH); this app never stores or compares it. Brute-force
 * protection (per-IP and global lockout) lives in the backend.
 */
export async function POST(request: Request) {
  if (!getAuthSecret()) {
    return NextResponse.json({ message: "Dashboard sign-in is not configured (AUTH_SECRET missing)." }, { status: 503 });
  }
  const origin = request.headers.get("origin");
  if (origin && new URL(origin).host !== request.headers.get("host")) {
    return NextResponse.json({ message: "Cross-site sign-in blocked." }, { status: 403 });
  }

  let password = "";
  try {
    ({ password } = (await request.json()) as { password?: string } as { password: string });
  } catch {
    /* empty body */
  }
  if (!password) return NextResponse.json({ message: "Enter your password." }, { status: 400 });

  try {
    const session = await backendFetch<{ token: string; expiresAt: string }>("/owner/login", {
      method: "POST",
      body: JSON.stringify({ password }),
      headers: visitorHeaders(request),
      timeoutMs: 45_000,
    });
    const response = NextResponse.json({ ok: true, expiresAt: session.expiresAt });
    for (const c of buildSessionCookies(session.token, session.expiresAt)) response.cookies.set(c);
    return response;
  } catch (err) {
    const e = err as BackendError;
    const status = e.status === 401 || e.status === 429 || e.status === 503 ? e.status : 502;
    return NextResponse.json({ message: e.message, code: e.code }, { status });
  }
}
