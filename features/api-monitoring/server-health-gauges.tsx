"use client";

import React from "react";
import { ServiceHealth } from "@/types/monitoring";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Server, CheckCircle2, AlertCircle } from "lucide-react";

export function ServerHealthGauges({ services }: { services: ServiceHealth[] }) {
  return (
    <Card className="lg:col-span-4">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Server className="w-5 h-5 text-emerald-400" />
          <span>Infrastructure Health</span>
        </CardTitle>
        <CardDescription>Live health checks & SLA uptime metrics</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {services.map((srv) => (
          <div
            key={srv.id}
            className="p-4 rounded-2xl border border-white/10 bg-slate-950/40 space-y-2 hover:border-white/20 transition"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-xs truncate max-w-[180px]">{srv.name}</span>
              <Badge
                variant={srv.status === "ONLINE" ? "success" : srv.status === "DEGRADED" ? "warning" : "danger"}
                className="text-[10px]"
              >
                {srv.status}
              </Badge>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-white/5">
              <span>Latency: <strong className="text-sky-400">{srv.responseTimeMs}ms</strong></span>
              <span>24h Uptime: <strong className="text-emerald-400">{srv.uptime24h}%</strong></span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
