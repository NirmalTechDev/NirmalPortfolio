"use client";

import React, { useEffect, useState } from "react";
import {
  LedgerAuditLog,
  LedgerFinancialSummary,
  LedgerInvestment,
  LedgerMember,
} from "@/types/ledger";
import { ledgerService } from "@/services/ledger.service";
import { MoneyFlowChart } from "./money-flow-chart";
import { MembersTable } from "./members-table";
import { InvestmentsGrid } from "./investments-grid";
import { AuditLogs } from "./audit-logs";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink } from "lucide-react";
import { API_ENDPOINTS } from "@/lib/constants";

export function LedgerView() {
  const [activeSubTab, setActiveSubTab] = useState("flow");
  const [summary, setSummary] = useState<LedgerFinancialSummary | null>(null);
  const [members, setMembers] = useState<LedgerMember[]>([]);
  const [investments, setInvestments] = useState<LedgerInvestment[]>([]);
  const [auditLogs, setAuditLogs] = useState<LedgerAuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadLedger() {
      try {
        const [s, m, i, a] = await Promise.all([
          ledgerService.getSummary(),
          ledgerService.getMembers(),
          ledgerService.getInvestments(),
          ledgerService.getAuditLogs(),
        ]);
        setSummary(s);
        setMembers(m);
        setInvestments(i);
        setAuditLogs(a);
      } finally {
        setIsLoading(false);
      }
    }
    loadLedger();
  }, []);

  if (isLoading || !summary) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-300">
      {/* SaaS Live Links Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-sky-500/20 bg-sky-500/5">
        <div>
          <h2 className="text-lg font-bold text-white">Collective Ledger OS • Production SaaS Admin</h2>
          <p className="text-xs text-slate-400">
            Community Finance Management System with decimal precision calculations & voting governance
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href={API_ENDPOINTS.COLLECTIVE_FE}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 text-xs font-semibold text-white hover:bg-white/20 transition"
          >
            <span>Live SaaS App</span>
            <ExternalLink className="w-3.5 h-3.5 text-sky-400" />
          </a>
          <a
            href={API_ENDPOINTS.COLLECTIVE_BE}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 text-xs font-semibold text-white hover:bg-white/20 transition"
          >
            <span>Backend Health</span>
            <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
          </a>
        </div>
      </div>

      <Tabs value={activeSubTab} onValueChange={setActiveSubTab}>
        <TabsList>
          <TabsTrigger value="flow">Capital & Treasury Flow</TabsTrigger>
          <TabsTrigger value="members">Community Members ({members.length})</TabsTrigger>
          <TabsTrigger value="investments">Asset Yields ({investments.length})</TabsTrigger>
          <TabsTrigger value="audit">Audit Logs ({auditLogs.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="flow">
          <MoneyFlowChart
            collected={summary.totalCollected}
            invested={summary.totalInvested}
            available={summary.availableCash}
          />
        </TabsContent>

        <TabsContent value="members">
          <MembersTable members={members} />
        </TabsContent>

        <TabsContent value="investments">
          <InvestmentsGrid investments={investments} />
        </TabsContent>

        <TabsContent value="audit">
          <AuditLogs logs={auditLogs} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
