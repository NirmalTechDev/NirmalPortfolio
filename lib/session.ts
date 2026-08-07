/**
 * Server-side staff session verification utility.
 */
import { cookies } from "next/headers";
import { verifyStaffToken } from "@/lib/jwt";
import { env } from "@/lib/env";
import { MOCK_ADMIN_USER } from "@/lib/constants";

export interface StaffSession {
  email: string;
  name: string;
  sub: string;
}

export async function verifyStaffSession(
  _request?: Request
): Promise<StaffSession | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("nirmal_cmd_token")?.value;
    if (!token) return null;

    const payload = verifyStaffToken(token, env.AUTH_SECRET);
    if (!payload) return null;

    return {
      sub: payload.sub,
      email: payload.email,
      name: payload.name,
    };
  } catch {
    return null;
  }
}

export async function getStaffUser() {
  const session = await verifyStaffSession();
  if (!session) return null;
  return { ...MOCK_ADMIN_USER, email: session.email, id: session.sub };
}
