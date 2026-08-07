import { NextResponse } from "next/server";
import { collectiveApiFetch, ApiError } from "@/lib/api-client";
import { verifyStaffSession } from "@/lib/session";

/**
 * GET /api/collective/dashboard
 *
 * Proxies two backend calls in parallel:
 *  - GET /v1/dashboard/overview  → total users, communities, payments, messages
 *  - GET /v1/dashboard/admin-summary → collected, invested, pending, late payments
 *
 * Staff auth required.
 */
export async function GET(request: Request) {
  try {
    // Verify staff dashboard session first
    const session = await verifyStaffSession(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [overview, adminSummary] = await Promise.allSettled([
      collectiveApiFetch<OverviewData>("/dashboard/overview"),
      collectiveApiFetch<AdminSummaryData>("/dashboard/admin-summary"),
    ]);

    return NextResponse.json({
      overview: overview.status === "fulfilled" ? overview.value : null,
      adminSummary: adminSummary.status === "fulfilled" ? adminSummary.value : null,
    });
  } catch (err) {
    const status = err instanceof ApiError ? err.status : 500;
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status });
  }
}

interface OverviewData {
  users: number;
  communities: number;
  paymentsTotalPaise: number;
  investmentsTotalPaise: number;
  unreadMessages: number;
  projectsCount: number;
  systemStatus: string;
}

interface AdminSummaryData {
  totalMembers: number;
  totalCollectedPaise: number;
  totalInvestedPaise: number;
  availablePaise: number;
  pendingPaise: number;
  latePaymentsCount: number;
}
