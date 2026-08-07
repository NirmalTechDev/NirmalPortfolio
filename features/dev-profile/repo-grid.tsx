"use client";

import React from "react";
import { GitHubRepo } from "@/types/github";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, GitFork, ExternalLink, GitBranch } from "lucide-react";
import { formatDate } from "@/lib/utils";

export function RepoGrid({ repos }: { repos: GitHubRepo[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <GitBranch className="w-5 h-5 text-sky-400" />
          <span>GitHub Production Repositories (@NirmalTechDev)</span>
        </CardTitle>
        <CardDescription>Featured public repositories, star ratings, and recent git activity</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {repos.map((r) => (
            <div
              key={r.id}
              className="flex flex-col justify-between p-5 rounded-2xl border border-white/10 bg-slate-950/60 space-y-4 hover:border-white/20 transition group"
            >
              <div>
                <div className="flex items-center justify-between">
                  <a
                    href={r.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold text-white text-base hover:text-sky-400 transition flex items-center gap-1.5"
                  >
                    <span>{r.name}</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition text-sky-400" />
                  </a>
                  <Badge variant="outline" className="text-[10px]">
                    {r.language}
                  </Badge>
                </div>
                <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  {r.description}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-white/10">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    {r.stargazers_count}
                  </span>
                  <span className="flex items-center gap-1">
                    <GitFork className="w-3.5 h-3.5 text-slate-400" />
                    {r.forks_count}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500">Updated {formatDate(r.updated_at)}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
