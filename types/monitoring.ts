export interface ServiceHealth {
  id: string;
  name: string;
  endpoint: string;
  status: "ONLINE" | "DEGRADED" | "OFFLINE";
  responseTimeMs: number;
  uptime24h: number;
  errorRate: number;
}

export interface LatencyDataPoint {
  time: string;
  portfolioMs: number;
  ledgerBackendMs: number;
  databaseMs: number;
}

export interface SystemLogEntry {
  id: string;
  timestamp: string;
  level: "INFO" | "WARN" | "ERROR" | "DEBUG";
  service: string;
  message: string;
  statusCode?: number;
}
