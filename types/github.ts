export interface GitHubRepo {
  id: number;
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  updated_at: string;
  isPrivate?: boolean;
}

export interface GitHubStats {
  username: string;
  totalRepos: number;
  totalStars: number;
  contributionsThisYear: number;
  topLanguages: { name: string; percentage: number; color: string }[];
  recentCommitsCount: number;
}
