import { GitHubRepo, GitHubStats } from "@/types/github";

export const githubService = {
  async getProfileStats(): Promise<GitHubStats> {
    const data = await this.fetchServerData();
    return data.stats;
  },

  async getTopRepositories(): Promise<GitHubRepo[]> {
    const data = await this.fetchServerData();
    return data.repos;
  },

  async fetchServerData(): Promise<{ stats: GitHubStats; repos: GitHubRepo[] }> {
    try {
      const res = await fetch("/api/github");
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    return {
      stats: {
        username: "NirmalTechDev",
        totalRepos: 18,
        totalStars: 42,
        contributionsThisYear: 840,
        recentCommitsCount: 156,
        topLanguages: [
          { name: "TypeScript", percentage: 48, color: "#3178c6" },
          { name: "JavaScript", percentage: 32, color: "#f7df1e" },
          { name: "React / React Native", percentage: 14, color: "#61dafb" },
          { name: "CSS / Tailwind", percentage: 6, color: "#38bdf8" },
        ],
      },
      repos: [
        { id: 101, name: "NirmalPortfolio", description: "Production personal portfolio & Command Center built with Next.js 16, Turbopack, Tailwind CSS v4, and Framer Motion.", html_url: "https://github.com/NirmalTechDev/NirmalPortfolio", stargazers_count: 18, forks_count: 4, language: "TypeScript", updated_at: new Date().toISOString() },
        { id: 102, name: "collective-ledger-api", description: "Node.js + Express backend service for community finance, decimal precision tracking, and automated late fees.", html_url: "https://github.com/NirmalTechDev/collective-ledger-api", stargazers_count: 14, forks_count: 3, language: "JavaScript", updated_at: new Date(Date.now() - 86400000).toISOString() },
        { id: 103, name: "opigo-mobile-app", description: "React Native social stock trading application with live polls, expert advice, and Firebase Realtime DB pipelines.", html_url: "https://github.com/NirmalTechDev/opigo-mobile-app", stargazers_count: 9, forks_count: 2, language: "TypeScript", updated_at: new Date(Date.now() - 172800000).toISOString() },
      ],
    };
  },
};
