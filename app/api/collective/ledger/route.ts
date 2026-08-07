import { NextResponse } from "next/server";
import { collectiveApiFetch, ApiError } from "@/lib/api-client";
import { verifyStaffSession } from "@/lib/session";

export async function GET(request: Request) {
  try {
    const session = await verifyStaffSession(request);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const [investments, payments, auditLogs] = await Promise.allSettled([
      collectiveApiFetch<InvestmentItem[]>("/investments"),
      collectiveApiFetch<unknown>("/payments/status"),
      collectiveApiFetch<AuditLogItem[]>("/audit-logs"),
    ]);

    return NextResponse.json({
      investments: investments.status === "fulfilled" ? investments.value : [],
      payments: payments.status === "fulfilled" ? payments.value : null,
      auditLogs: auditLogs.status === "fulfilled" ? auditLogs.value : [],
    });
  } catch (err) {
    const status = err instanceof ApiError ? err.status : 500;
    return NextResponse.json({ error: (err as Error).message }, { status });
  }
}

interface InvestmentItem {
  _id: string;
  title: string;
  amountPaise: number;
  date: string;
  notes?: string;
  communityId: string;
}

interface AuditLogItem {
  actorId: string;
  actorName: string;
  action: string;
  entityType: string;
  createdAt: string;
  communityId: string;
}
