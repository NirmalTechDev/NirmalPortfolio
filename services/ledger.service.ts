import {
  LedgerAuditLog,
  LedgerFinancialSummary,
  LedgerInvestment,
  LedgerMember,
} from "@/types/ledger";
import { dashboardFetch } from "@/lib/dashboard-fetch";
import {
  toLedgerAuditLogs,
  toLedgerInvestments,
  toLedgerMembers,
  toLedgerSummary,
} from "@/lib/collective-adapters";

/** Fallback mock data when backend is unreachable */
const MOCK_SUMMARY: LedgerFinancialSummary = {
  totalCollected: 250000,
  totalInvested: 80000,
  availableCash: 170000,
  pendingDues: 18500,
  latePenalties: 3200,
  memberCount: 142,
  activeCommunities: 6,
  currency: "INR",
};

const MOCK_MEMBERS: LedgerMember[] = [
  { id: "mem_101", name: "Nirmal Ranpariya", email: "nirmal@collective.io", community: "Apex Tech Guild", role: "Admin", totalContributed: 45000, pendingInstallment: 0, joinedAt: "2024-01-15", status: "active" },
  { id: "mem_102", name: "Aarav Patel", email: "aarav@patel.dev", community: "Apex Tech Guild", role: "Treasurer", totalContributed: 35000, pendingInstallment: 0, joinedAt: "2024-02-01", status: "active" },
];

const MOCK_INVESTMENTS: LedgerInvestment[] = [
  { id: "inv_01", assetName: "Nifty 50 Index Mutual Fund", category: "Mutual Fund", investedAmount: 40000, currentValue: 46800, returnsPercent: 17.0, allocatedDate: "2024-02-15" },
];

const MOCK_AUDIT: LedgerAuditLog[] = [
  { id: "log_901", actor: "System", action: "Demo mode — connect Collective backend for live data", target: "Ledger", timestamp: new Date().toISOString(), ipAddress: "—", status: "WARNING" },
];

export const ledgerService = {
  async getSummary(): Promise<LedgerFinancialSummary> {
    try {
      const data = await dashboardFetch<{
        overview: Parameters<typeof toLedgerSummary>[1];
        adminSummary: Parameters<typeof toLedgerSummary>[0];
      }>("/api/collective/dashboard");
      return toLedgerSummary(data.adminSummary, data.overview);
    } catch {
      return MOCK_SUMMARY;
    }
  },

  async getMembers(): Promise<LedgerMember[]> {
    try {
      const data = await dashboardFetch<{ members: Parameters<typeof toLedgerMembers>[0] }>(
        "/api/collective/members"
      );
      return toLedgerMembers(data.members ?? []);
    } catch {
      return MOCK_MEMBERS;
    }
  },

  async getInvestments(): Promise<LedgerInvestment[]> {
    try {
      const data = await dashboardFetch<{ investments: Parameters<typeof toLedgerInvestments>[0] }>(
        "/api/collective/ledger"
      );
      return toLedgerInvestments(data.investments ?? []);
    } catch {
      return MOCK_INVESTMENTS;
    }
  },

  async getAuditLogs(): Promise<LedgerAuditLog[]> {
    try {
      const data = await dashboardFetch<{ auditLogs: Parameters<typeof toLedgerAuditLogs>[0] }>(
        "/api/collective/ledger"
      );
      return toLedgerAuditLogs(data.auditLogs ?? []);
    } catch {
      return MOCK_AUDIT;
    }
  },
};
