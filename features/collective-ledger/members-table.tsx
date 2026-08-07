"use client";

import React from "react";
import { LedgerMember } from "@/types/ledger";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { ShieldCheck, UserCheck } from "lucide-react";

export function MembersTable({ members }: { members: LedgerMember[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Community Members & Role Governance</CardTitle>
        <CardDescription>Multi-tenant member directory, contribution ledger & active permissions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="border-b border-white/10 text-xs font-semibold uppercase tracking-wider text-slate-400 bg-slate-950/40">
              <tr>
                <th className="py-3 px-4">Member Name</th>
                <th className="py-3 px-4">Community</th>
                <th className="py-3 px-4">Governance Role</th>
                <th className="py-3 px-4">Total Contributed</th>
                <th className="py-3 px-4">Pending Dues</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {members.map((m) => (
                <tr key={m.id} className="hover:bg-white/5 transition">
                  <td className="py-3.5 px-4 font-semibold text-white">
                    <div>
                      <span className="block">{m.name}</span>
                      <span className="text-xs text-slate-400 font-normal">{m.email}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-xs">{m.community}</td>
                  <td className="py-3.5 px-4">
                    <Badge variant={m.role === "Admin" ? "purple" : "default"} className="text-[10px]">
                      {m.role}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-emerald-400">
                    {formatCurrency(m.totalContributed)}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-xs text-slate-400">
                    {m.pendingInstallment > 0 ? (
                      <span className="text-amber-400">{formatCurrency(m.pendingInstallment)}</span>
                    ) : (
                      "Clear"
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge variant={m.status === "active" ? "success" : "warning"} className="text-[10px]">
                      {m.status.toUpperCase()}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
