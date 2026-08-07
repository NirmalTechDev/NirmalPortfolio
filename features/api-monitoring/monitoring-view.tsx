"use client";

import React, { useEffect, useState } from "react";
import { LatencyDataPoint, ServiceHealth, SystemLogEntry } from "@/types/monitoring";
import { monitoringService } from "@/services/monitoring.service";
import { LatencyChart } from "./latency-chart";
import { ServerHealthGauges } from "./server-health-gauges";
import { LogStream } from "./log-stream";
import { Skeleton } from "@/components/ui/skeleton";

export function MonitoringView() {
  const [services, setServices] = useState<ServiceHealth[]>([]);
  const [history, setHistory] = useState<LatencyDataPoint[]>([]);
  const [logs, setLogs] = useState<SystemLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadMonitoring() {
      try {
        const [s, h, l] = await Promise.all([
          monitoringService.getServices(),
          monitoringService.getLatencyHistory(),
          monitoringService.getLogs(),
        ]);
        setServices(s);
        setHistory(h);
        setLogs(l);
      } finally {
        setIsLoading(false);
      }
    }
    loadMonitoring();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-300">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <LatencyChart history={history} />
        <ServerHealthGauges services={services} />
      </div>
      <LogStream logs={logs} />
    </div>
  );
}
