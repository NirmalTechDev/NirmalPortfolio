"use client";

import React from "react";
import { LedgerInvestment } from "@/types/ledger";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp, ArrowUpRight, ShieldCheck } from "lucide-react";

export function InvestmentsGrid({ investments }: { investments: LedgerInvestment[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-400" />
          <span>Active Asset Portfolio & Capital Yields</span>
        </CardTitle>
        <CardDescription>Capital invested across low-risk index funds, corporate bonds & REITs</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {investments.map((inv) => (
            <div
              key={inv.id}
              className="p-5 rounded-2xl border border-white/10 bg-slate-950/60 space-y-3 hover:border-white/20 transition"
            >
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-[10px]">
                  {inv.category}
                </Badge>
                <span className="flex items-center gap-0.5 text-xs font-bold text-emerald-400">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  +{inv.returnsPercent}%
                </span>
              </div>

              <div>
                <h4 className="text-base font-bold text-white line-clamp-1">{inv.assetName}</h4>
                <p className="text-xs text-slate-400 mt-0.5">Allocated on {inv.allocatedDate}</p>
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-between items-baseline">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block">Invested Principal</span>
                  <span className="text-sm font-semibold text-slate-200">{formatCurrency(inv.investedAmount)}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase block">Current Value</span>
                  <span className="text-base font-extrabold text-emerald-400">{formatCurrency(inv.currentValue)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
