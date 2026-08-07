"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ActivityLog } from "@/types/dashboard";
import { CheckCircle2, AlertTriangle, Info, Clock, Zap } from "lucide-react";

export function ActivityTimeline() {
  const activities: ActivityLog[] = [
    {
      id: "act_1",
      timestamp: "10 mins ago",
      source: "Collective Ledger",
      title: "New Member Joined Community",
      description: "Vikram Malhotra joined Apex Tech Guild & initialized dues workflow.",
      severity: "success",
    },
    {
      id: "act_2",
      timestamp: "32 mins ago",
      source: "Portfolio",
      title: "Recruiter Message Received",
      description: "Alex Rivera submitted contract inquiry via Portfolio Contact Form.",
      severity: "info",
    },
    {
      id: "act_3",
      timestamp: "1 hour ago",
      source: "API Monitor",
      title: "PostgreSQL Migration Executed",
      description: "Prisma schema sync completed for per-day late fee rules on Render backend.",
      severity: "success",
    },
    {
      id: "act_4",
      timestamp: "3 hours ago",
      source: "GitHub",
      title: "Commit Pushed to main",
      description: "Merged Next.js 16 Turbopack performance patch to NirmalPortfolio repository.",
      severity: "info",
    },
  ];

  return (
    <Card className="col-span-full lg:col-span-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-400" />
          <span>Real-time Operations</span>
        </CardTitle>
        <CardDescription>Live system audit trail & operational updates</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((act) => (
          <div key={act.id} className="relative pl-6 border-l border-white/10 space-y-1">
            <div className="absolute -left-1.5 top-1 h-3 w-3 rounded-full bg-sky-500 ring-4 ring-slate-950" />
            <div className="flex items-center justify-between text-xs text-slate-400">
              <Badge variant="outline" className="text-[10px] py-0 px-2">
                {act.source}
              </Badge>
              <span className="flex items-center gap-1 text-[11px] text-slate-500">
                <Clock className="w-3 h-3" />
                {act.timestamp}
              </span>
            </div>
            <h4 className="text-sm font-semibold text-white mt-1">{act.title}</h4>
            <p className="text-xs text-slate-400 leading-relaxed">{act.description}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
