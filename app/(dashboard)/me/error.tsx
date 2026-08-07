"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log exception to telemetry monitoring
    console.error("Dashboard Runtime Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
      <div className="p-4 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 mb-4">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h2 className="text-2xl font-bold text-white tracking-tight">
        Command Center Operational Interruption
      </h2>
      <p className="text-sm text-slate-400 max-w-md mt-2 mb-6">
        An unexpected telemetry error occurred while rendering the staff command center module.
      </p>
      <Button onClick={() => reset()} className="gap-2">
        <RefreshCw className="w-4 h-4" />
        <span>Reload Operational State</span>
      </Button>
    </div>
  );
}
