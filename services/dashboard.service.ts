import { dashboardFetch } from "@/lib/dashboard-fetch";
import { BackendAdminSummary, BackendOverview } from "@/lib/collective-adapters";
import { INITIAL_METRICS } from "@/lib/constants";

export interface DashboardMetrics {
  revenue: { amount: number; growth: number; text: string };
  projects: { amount: number; growth: number; text: string };
  users: { amount: number; growth: number; text: string };
  apiRequests: { amount: number; growth: number; text: string };
  visitors: { amount: number; growth: number; text: string };
  messages: { amount: number; growth: number; text: string };
}

const paiseToRupees = (paise: number) => Math.round(paise / 100);

export const dashboardService = {
  async getMetrics(): Promise<DashboardMetrics> {
    try {
      const data = await dashboardFetch<{
        overview: BackendOverview | null;
        adminSummary: BackendAdminSummary | null;
      }>("/api/collective/dashboard");

      const overview = data.overview;
      const admin = data.adminSummary;

      return {
        revenue: {
          amount: paiseToRupees(admin?.totalCollectedPaise ?? overview?.paymentsTotalPaise ?? 0),
          growth: 12.4,
          text: "Collected across active funds",
        },
        projects: {
          amount: overview?.projectsCount ?? INITIAL_METRICS.projects.amount,
          growth: INITIAL_METRICS.projects.growth,
          text: "Production web & mobile apps",
        },
        users: {
          amount: admin?.totalMembers ?? overview?.users ?? 0,
          growth: INITIAL_METRICS.users.growth,
          text: "Active community members",
        },
        apiRequests: {
          amount: INITIAL_METRICS.apiRequests.amount,
          growth: INITIAL_METRICS.apiRequests.growth,
          text: "24h traffic across endpoints",
        },
        visitors: {
          amount: INITIAL_METRICS.visitors.amount,
          growth: INITIAL_METRICS.visitors.growth,
          text: "Portfolio unique visitors",
        },
        messages: {
          amount: overview?.unreadMessages ?? 0,
          growth: INITIAL_METRICS.messages.growth,
          text: "Unread recruiter & client inquiries",
        },
      };
    } catch {
      return INITIAL_METRICS;
    }
  },
};
