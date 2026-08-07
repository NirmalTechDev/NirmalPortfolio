import { NextResponse } from "next/server";
import { collectiveApiFetch, ApiError } from "@/lib/api-client";
import { verifyStaffSession } from "@/lib/session";

/** GET /api/collective/contacts — fetch all contact messages */
export async function GET(request: Request) {
  try {
    const session = await verifyStaffSession(request);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const messages = await collectiveApiFetch<ContactMessage[]>("/contact/messages");
    return NextResponse.json({ messages });
  } catch (err) {
    const status = err instanceof ApiError ? err.status : 500;
    return NextResponse.json({ error: (err as Error).message }, { status });
  }
}

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: "NEW" | "READ" | "REPLIED" | "ARCHIVED";
  ipAddress?: string;
  createdAt: string;
  updatedAt: string;
}
