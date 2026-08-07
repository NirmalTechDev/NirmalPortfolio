"use client";

import React, { useEffect, useState } from "react";
import { GitHubRepo, GitHubStats } from "@/types/github";
import { githubService } from "@/services/github.service";
import { GitHubMetrics } from "./github-metrics";
import { RepoGrid } from "./repo-grid";
import { Skeleton } from "@/components/ui/skeleton";

export function DevProfileView() {
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDevProfile() {
      try {
        const [s, r] = await Promise.all([
          githubService.getProfileStats(),
          githubService.getTopRepositories(),
        ]);
        setStats(s);
        setRepos(r);
      } finally {
        setIsLoading(false);
      }
    }
    loadDevProfile();
  }, []);

  if (isLoading || !stats) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-300">
      <GitHubMetrics stats={stats} />
      <RepoGrid repos={repos} />
    </div>
  );
}
