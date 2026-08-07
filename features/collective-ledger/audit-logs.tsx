"use client";

import React from "react";
import { LedgerAuditLog } from "@/types/ledger";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { ShieldCheck, Lock } from "lucide-react";

export function AuditLogs({ logs }: { logs: LedgerAuditLog[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-purple-400" />
          <span>Append-Only Ledger Audit Logs</span>
        </CardTitle>
        <CardDescription>Immutable transaction history, governance decisions, & actor IP tracking</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {logs.map((l) => (
            <div
              key={l.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border border-white/10 bg-slate-950/40 text-xs gap-2"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/30 shrink-0">
                  <Lock className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-bold text-white block">{l.action}</span>
                  <span className="text-slate-400">Actor: {l.actor} • Target: {l.target}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center">
                <span className="font-mono text-slate-400">{l.ipAddress}</span>
                <Badge variant="success" className="text-[9px]">
                  {l.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
