export type DashboardTab =
  | "overview"
  | "portfolio"
  | "contacts"
  | "ledger"
  | "monitoring"
  | "github"
  | "ai";

export interface SystemStatus {
  portfolio: "ONLINE" | "DEGRADED" | "OFFLINE";
  backend: "HEALTHY" | "DEGRADED" | "OFFLINE";
  database: "CONNECTED" | "DISCONNECTED";
  latencyMs: number;
  lastChecked: string;
}

export interface MetricCardData {
  title: string;
  value: string | number;
  changePercent: number;
  changeType: "increase" | "decrease";
  subtitle: string;
  trendData: number[];
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  source: "Portfolio" | "Collective Ledger" | "API Monitor" | "GitHub" | "System";
  title: string;
  description: string;
  severity: "info" | "success" | "warning" | "error";
}
