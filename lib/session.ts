/**
 * Server-side dashboard session check used by the /api/collective (advanced) routes.
 */
import { readOwnerSession } from "@/lib/owner-session";

export interface StaffSession {
  sub: string;
}

export async function verifyStaffSession(_request?: Request): Promise<StaffSession | null> {
  const session = await readOwnerSession();
  return session ? { sub: "owner" } : null;
}
