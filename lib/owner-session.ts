import "server-only";
import { cookies } from "next/headers";
import { getAuthSecret } from "@/lib/env";
import { signStaffToken, verifyStaffToken } from "@/lib/jwt";

/**
 * Dashboard session = two httpOnly cookies set together at login:
 *  - SESSION_COOKIE: signed by this app (AUTH_SECRET); lets the proxy gate /me quickly.
 *  - OWNER_COOKIE:   the backend's owner token; forwarded as a Bearer token by /api/admin.
 * The backend re-verifies the owner token on every request, so the cookie alone grants nothing.
 */
export const SESSION_COOKIE = "nirmal_cmd_token";
export const OWNER_COOKIE = "nirmal_owner";

const cookieBase = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
};

export function buildSessionCookies(ownerToken: string, expiresAtIso: string) {
  const secret = getAuthSecret();
  if (!secret) throw new Error("AUTH_SECRET is not configured");
  const maxAge = Math.max(60, Math.floor((new Date(expiresAtIso).getTime() - Date.now()) / 1000));
  const session = signStaffToken({ sub: "owner", email: "", name: "Nirmal" }, secret, maxAge);
  return [
    { name: SESSION_COOKIE, value: session, maxAge, ...cookieBase },
    { name: OWNER_COOKIE, value: ownerToken, maxAge, ...cookieBase },
  ];
}

export function clearedSessionCookies() {
  return [SESSION_COOKIE, OWNER_COOKIE].map((name) => ({ name, value: "", maxAge: 0, ...cookieBase }));
}

export async function readOwnerSession(): Promise<{ ownerToken: string; expiresAt: number } | null> {
  const store = await cookies();
  const session = store.get(SESSION_COOKIE)?.value;
  const ownerToken = store.get(OWNER_COOKIE)?.value;
  const secret = getAuthSecret();
  if (!session || !ownerToken || !secret) return null;
  const payload = verifyStaffToken(session, secret);
  if (!payload) return null;
  return { ownerToken, expiresAt: payload.exp * 1000 };
}
