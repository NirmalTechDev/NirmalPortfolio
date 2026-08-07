"use client";

import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { DollarSign, PieChart as PieIcon, ArrowUpRight } from "lucide-react";

const flowData = [
  { month: "Jan", collected: 180000, invested: 50000, available: 130000 },
  { month: "Feb", collected: 210000, invested: 65000, available: 145000 },
  { month: "Mar", collected: 235000, invested: 72000, available: 163000 },
  { month: "Current", collected: 250000, invested: 80000, available: 170000 },
];

export function MoneyFlowChart({
  collected,
  invested,
  available,
}: {
  collected: number;
  invested: number;
  available: number;
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Financial Summary Cards */}
      <div className="lg:col-span-4 space-y-4">
        <Card className="border-emerald-500/30 bg-emerald-500/5">
          <CardContent className="p-5">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Total Collected Funds
            </span>
            <h3 className="text-3xl font-extrabold text-white mt-1">
              {formatCurrency(collected)}
            </h3>
            <p className="text-xs text-slate-400 mt-2">
              100% precision decimal-safe contributions
            </p>
          </CardContent>
        </Card>

        <Card className="border-purple-500/30 bg-purple-500/5">
          <CardContent className="p-5">
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-400">
              Active Investments Allocated
            </span>
            <h3 className="text-3xl font-extrabold text-white mt-1">
              {formatCurrency(invested)}
            </h3>
            <p className="text-xs text-slate-400 mt-2">
              Allocated into Mutual Funds & Corporate Bonds
            </p>
          </CardContent>
        </Card>

        <Card className="border-sky-500/30 bg-sky-500/5">
          <CardContent className="p-5">
            <span className="text-xs font-semibold uppercase tracking-wider text-sky-400">
              Available Treasury Liquid Cash
            </span>
            <h3 className="text-3xl font-extrabold text-white mt-1">
              {formatCurrency(available)}
            </h3>
            <p className="text-xs text-slate-400 mt-2">
              Ready for upcoming community distributions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Visual Money Flow Chart */}
      <Card className="lg:col-span-8">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <PieIcon className="w-5 h-5 text-sky-400" />
            <span>Collective Ledger Treasury & Capital Allocation Flow</span>
          </CardTitle>
          <CardDescription>
            Multi-community fund growth, investment allocations, and liquid reserves
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={flowData} margin={{ top: 10, right: 20, left: 15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} width={65} />
                <Tooltip
                  formatter={(val: any) => formatCurrency(Number(val || 0))}
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "16px",
                    color: "#f8fafc",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                <Bar dataKey="collected" name="Collected" fill="#10b981" radius={[8, 8, 0, 0]} />
                <Bar dataKey="invested" name="Invested" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                <Bar dataKey="available" name="Liquid Available" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
