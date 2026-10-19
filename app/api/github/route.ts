import { NextResponse } from "next/server";
import { env } from "@/lib/env";

export const revalidate = 3600; // GitHub data refreshes at most hourly

interface Repo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
  fork: boolean;
}

/** Real GitHub profile data only. If GitHub is unreachable this says so instead of inventing numbers. */
export async function GET() {
  const username = env.GITHUB_USERNAME;
  const headers: Record<string, string> = { Accept: "application/vnd.github+json", "User-Agent": "NirmalPortfolio" };
  if (env.GITHUB_TOKEN) headers.Authorization = `Bearer ${env.GITHUB_TOKEN}`;

  try {
    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`, { headers, next: { revalidate: 3600 } }),
      fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100&type=owner`, { headers, next: { revalidate: 3600 } }),
    ]);
    if (!userRes.ok || !reposRes.ok) {
      return NextResponse.json({ error: `GitHub responded with ${userRes.ok ? reposRes.status : userRes.status}` }, { status: 502 });
    }
    const user = await userRes.json();
    const repos = ((await reposRes.json()) as Repo[]).filter((r) => !r.fork);
    const langCount = new Map<string, number>();
    repos.forEach((r) => r.language && langCount.set(r.language, (langCount.get(r.language) || 0) + 1));
    const totalWithLang = [...langCount.values()].reduce((a, b) => a + b, 0) || 1;

    return NextResponse.json({
      stats: {
        username,
        profileUrl: user.html_url,
        publicRepos: user.public_repos,
        followers: user.followers,
        totalStars: repos.reduce((a, r) => a + r.stargazers_count, 0),
        topLanguages: [...langCount.entries()]
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([name, n]) => ({ name, percentage: Math.round((n / totalWithLang) * 100) })),
      },
      repos: repos.slice(0, 6).map((r) => ({
        id: r.id,
        name: r.name,
        description: r.description,
        html_url: r.html_url,
        stargazers_count: r.stargazers_count,
        forks_count: r.forks_count,
        language: r.language,
        updated_at: r.updated_at,
      })),
    });
  } catch (err) {
    return NextResponse.json({ error: `GitHub is unreachable: ${(err as Error).message}` }, { status: 502 });
  }
}
