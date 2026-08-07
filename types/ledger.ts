export interface LedgerFinancialSummary {
  totalCollected: number;
  totalInvested: number;
  availableCash: number;
  pendingDues: number;
  latePenalties: number;
  memberCount: number;
  activeCommunities: number;
  currency: string;
}

export interface LedgerMember {
  id: string;
  name: string;
  email: string;
  community: string;
  role: "Admin" | "Treasurer" | "Member" | "Auditor";
  totalContributed: number;
  pendingInstallment: number;
  joinedAt: string;
  status: "active" | "pending" | "suspended";
}

export interface LedgerInvestment {
  id: string;
  assetName: string;
  category: "Mutual Fund" | "Bonds" | "Real Estate" | "Fixed Deposit" | "Equity";
  investedAmount: number;
  currentValue: number;
  returnsPercent: number;
  allocatedDate: string;
}

export interface LedgerAuditLog {
  id: string;
  actor: string;
  action: string;
  target: string;
  timestamp: string;
  ipAddress: string;
  status: "SUCCESS" | "WARNING" | "FAILED";
}
