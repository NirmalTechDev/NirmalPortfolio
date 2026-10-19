import "server-only";
import { cache } from "react";
import { API_URL } from "@/lib/env";
import { fallbackExperience, fallbackProjects, fallbackResume, fallbackSite } from "./fallback";
import type { ExperienceEntry, PortfolioData, Project, ResumeInfo, SiteContent } from "./types";

/**
 * Public-site content loader.
 *
 * Reads from the backend with a cache tag so a dashboard save refreshes the site
 * immediately (revalidateTag("portfolio")). If the backend is unreachable, or has not
 * been migrated yet (no site content), the static snapshot is used so the site never breaks.
 */
const REVALIDATE_SECONDS = 600;

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    next: { tags: ["portfolio"], revalidate: REVALIDATE_SECONDS },
    signal: AbortSignal.timeout(8000),
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`${path} → ${res.status}`);
  const body = (await res.json()) as { data: T };
  return body.data;
}

const mergeSite = (live: Partial<SiteContent>): SiteContent => {
  const out = { ...fallbackSite } as Record<string, unknown>;
  for (const [k, v] of Object.entries(live)) {
    const base = (fallbackSite as unknown as Record<string, unknown>)[k];
    if (v && typeof v === "object" && !Array.isArray(v) && base && typeof base === "object" && !Array.isArray(base)) {
      out[k] = { ...(base as object), ...(v as object) };
    } else if (v !== undefined && v !== null) {
      out[k] = v;
    }
  }
  return out as unknown as SiteContent;
};

const normalizeProject = (p: Project): Project => ({
  ...p,
  spec: p.spec || [],
  links: p.links || [],
  screens: p.screens || [],
  context: p.context || [],
  outcome: p.outcome || [],
  stack: p.stack || [],
  role: p.role || { intro: "", items: [] },
  screenLayout: p.screenLayout || "phones",
  problem: p.problem?.length ? p.problem : undefined,
  engineering: p.engineering?.length ? p.engineering : undefined,
  experience: p.experience?.length ? p.experience : undefined,
  challenges: p.challenges?.length ? p.challenges : undefined,
  reflection: p.reflection?.length ? p.reflection : undefined,
  system: p.system && p.system.lanes?.length ? p.system : undefined,
  cover: p.cover?.src ? p.cover : undefined,
  icon: p.icon?.src ? p.icon : undefined,
});

export const getPortfolio = cache(async (): Promise<PortfolioData> => {
  const fallback: PortfolioData = {
    site: fallbackSite,
    projects: fallbackProjects,
    experience: fallbackExperience,
    resume: fallbackResume,
    source: "fallback",
  };
  try {
    const [site, projects, experience, resume] = await Promise.all([
      get<SiteContent | null>("/portfolio/site"),
      get<Project[]>("/portfolio/projects?publishable=1"),
      get<ExperienceEntry[]>("/portfolio/experience"),
      get<ResumeInfo | null>("/portfolio/resume/active"),
    ]);
    // Not migrated yet → keep showing the original content.
    if (!site) return fallback;
    return {
      site: mergeSite(site),
      projects: projects.map(normalizeProject),
      experience: experience.map((e) => ({ ...e, responsibilities: e.responsibilities || [], systems: e.systems || [], technologies: e.technologies || [] })),
      resume: resume || fallbackResume,
      source: "live",
    };
  } catch (err) {
    console.warn("[portfolio] backend unavailable, using static content:", (err as Error).message);
    return fallback;
  }
});

export async function getProject(slug: string) {
  const data = await getPortfolio();
  const index = data.projects.findIndex((p) => p.slug === slug);
  return index === -1 ? null : { project: data.projects[index], next: data.projects[(index + 1) % data.projects.length], data };
}

/** Public URL of the résumé: always served through /resume so links never change. */
export const RESUME_HREF = "/resume";

export const fullName = (site: SiteContent) => `${site.identity.firstName} ${site.identity.lastName}`.trim();
