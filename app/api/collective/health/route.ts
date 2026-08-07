import { NextResponse } from "next/server";
import { collectiveApiFetch, ApiError } from "@/lib/api-client";

/**
 * GET /api/collective/health
 *
 * Public endpoint — no staff auth required.
 * Proxies the Collective Ledger backend system health check.
 * The backend /dashboard/system-health is also public (no JWT required).
 */
export async function GET() {
  try {
    const health = await collectiveApiFetch<BackendHealth>("/dashboard/system-health", {
      public: true,
      timeout: 10_000,
    });
    return NextResponse.json({ health });
  } catch (err) {
    // Return degraded status on failure rather than erroring out
    return NextResponse.json({
      health: {
        status: "degraded",
        uptimeSeconds: 0,
        timestamp: new Date().toISOString(),
        environment: "unknown",
        memory: null,
        database: { connected: false },
        error: (err as Error).message,
      },
    });
  }
}

interface BackendHealth {
  status: "ok" | "degraded";
  uptimeSeconds: number;
  timestamp: string;
  environment: string;
  memory: {
    rssMB: string;
    heapTotalMB: string;
    heapUsedMB: string;
  };
  database: {
    connected: boolean;
  };
}
