import { LatencyDataPoint, ServiceHealth, SystemLogEntry } from "@/types/monitoring";
import { dashboardFetch } from "@/lib/dashboard-fetch";
import { toServiceHealth, toSystemLogs, BackendHealth } from "@/lib/collective-adapters";

const MOCK_SERVICES: ServiceHealth[] = [
  { id: "srv_01", name: "Personal Portfolio", endpoint: "https://nirmalranpariya.in", status: "ONLINE", responseTimeMs: 42, uptime24h: 99.98, errorRate: 0.01 },
  { id: "srv_03", name: "Collective Ledger Node Backend", endpoint: "https://collective-onc6.onrender.com", status: "DEGRADED", responseTimeMs: 0, uptime24h: 0, errorRate: 1 },
];

export const healthService = {
  async checkServices(): Promise<ServiceHealth[]> {
    const start = Date.now();
    try {
      const data = await dashboardFetch<{ health: BackendHealth }>("/api/collective/health");
      const latencyMs = Date.now() - start;
      return toServiceHealth(data.health, latencyMs);
    } catch {
      return MOCK_SERVICES;
    }
  },

  async getLatencyTrend(): Promise<LatencyDataPoint[]> {
    const start = Date.now();
    let backendMs = 120;
    try {
      await dashboardFetch<{ health: BackendHealth }>("/api/collective/health");
      backendMs = Date.now() - start;
    } catch {
      backendMs = 0;
    }

    const times = ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00", "NOW"];
    return times.map((time, idx) => ({
      time,
      portfolioMs: 38 + idx * 2,
      ledgerBackendMs: idx === times.length - 1 ? backendMs : backendMs + Math.floor(Math.random() * 20),
      databaseMs: 10 + Math.floor(Math.random() * 4),
    }));
  },

  async fetchSystemLogs(): Promise<SystemLogEntry[]> {
    try {
      const data = await dashboardFetch<{ health: BackendHealth }>("/api/collective/health");
      return toSystemLogs(data.health);
    } catch {
      return [
        {
          id: "log_offline",
          timestamp: new Date().toISOString(),
          level: "ERROR",
          service: "Collective-BE",
          message: "Backend unreachable — showing cached demo logs",
          statusCode: 503,
        },
      ];
    }
  },
};
