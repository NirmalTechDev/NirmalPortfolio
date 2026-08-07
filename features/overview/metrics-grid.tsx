"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { INITIAL_METRICS } from "@/lib/constants";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { dashboardService, DashboardMetrics } from "@/services/dashboard.service";
import { DollarSign, FolderGit2, Users, Cpu, Eye, Mail, ArrowUpRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function MetricsGrid() {
  const [metrics, setMetrics] = useState<DashboardMetrics>(INITIAL_METRICS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    dashboardService.getMetrics().then(setMetrics).finally(() => setIsLoading(false));
  }, []);

  const cards = [
    {
      title: "SaaS Revenue",
      value: formatCurrency(metrics.revenue.amount),
      change: `+${metrics.revenue.growth}%`,
      sub: metrics.revenue.text,
      icon: DollarSign,
      color: "from-emerald-500/20 to-teal-500/10 text-emerald-400 border-emerald-500/30",
    },
    {
      title: "Production Projects",
      value: metrics.projects.amount,
      change: `+${metrics.projects.growth}%`,
      sub: metrics.projects.text,
      icon: FolderGit2,
      color: "from-sky-500/20 to-blue-500/10 text-sky-400 border-sky-500/30",
    },
    {
      title: "Active Users",
      value: formatNumber(metrics.users.amount),
      change: `+${metrics.users.growth}%`,
      sub: metrics.users.text,
      icon: Users,
      color: "from-purple-500/20 to-indigo-500/10 text-purple-400 border-purple-500/30",
    },
    {
      title: "API Requests (24h)",
      value: formatNumber(metrics.apiRequests.amount),
      change: `+${metrics.apiRequests.growth}%`,
      sub: metrics.apiRequests.text,
      icon: Cpu,
      color: "from-amber-500/20 to-orange-500/10 text-amber-400 border-amber-500/30",
    },
    {
      title: "Unique Visitors",
      value: formatNumber(metrics.visitors.amount),
      change: `+${metrics.visitors.growth}%`,
      sub: metrics.visitors.text,
      icon: Eye,
      color: "from-pink-500/20 to-rose-500/10 text-pink-400 border-pink-500/30",
    },
    {
      title: "Recruiter Messages",
      value: metrics.messages.amount,
      change: `+${metrics.messages.growth}%`,
      sub: metrics.messages.text,
      icon: Mail,
      color: "from-cyan-500/20 to-blue-500/10 text-cyan-400 border-cyan-500/30",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-36 w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-5">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <Card key={c.title} className="relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${c.color} rounded-full blur-3xl opacity-50 pointer-events-none group-hover:scale-125 transition duration-500`} />
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 leading-tight">
                  {c.title}
                </span>
                <div className={`shrink-0 p-2 rounded-xl bg-slate-950/60 border ${c.color.split(" ").pop()}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="mt-3 flex items-baseline justify-between gap-2 flex-wrap">
                <h3 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">{c.value}</h3>
                <span className="inline-flex items-center text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full shrink-0">
                  <ArrowUpRight className="w-3 h-3 mr-0.5" />
                  {c.change}
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between text-[10px] text-slate-400 border-t border-white/5 pt-3 gap-2">
                <span className="truncate">{c.sub}</span>
                <span className="font-mono text-sky-400/80 shrink-0">☱ ☲ ☴ ☵</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
