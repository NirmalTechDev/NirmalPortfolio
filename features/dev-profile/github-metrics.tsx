"use client";

import React from "react";
import { GitHubStats } from "@/types/github";
import { Card, CardContent } from "@/components/ui/card";
import { GitBranch, Star, GitCommit, Code2 } from "lucide-react";

export function GitHubMetrics({ stats }: { stats: GitHubStats }) {
  const cards = [
    { label: "Public Repositories", value: stats.totalRepos, icon: GitBranch, color: "text-sky-400 border-sky-500/30" },
    { label: "GitHub Stars Earned", value: stats.totalStars, icon: Star, color: "text-amber-400 border-amber-500/30" },
    { label: "Commits This Year", value: stats.contributionsThisYear, icon: GitCommit, color: "text-emerald-400 border-emerald-500/30" },
    { label: "Recent Commits", value: stats.recentCommitsCount, icon: Code2, color: "text-purple-400 border-purple-500/30" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <Card key={c.label}>
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 font-medium">{c.label}</span>
                <h3 className="text-2xl font-bold text-white mt-1">{c.value}</h3>
              </div>
              <div className={`p-3 rounded-2xl bg-slate-950/60 border ${c.color.split(" ").pop()}`}>
                <Icon className={`w-5 h-5 ${c.color.split(" ")[0]}`} />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
