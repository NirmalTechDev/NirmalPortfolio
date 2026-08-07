import { CMSAbout, CMSHero, CMSProject, CMSSkill } from "@/types/portfolio";
import { projects as defaultProjects } from "@/app/component/projects/projects.data";
import { dashboardFetch } from "@/lib/dashboard-fetch";
import {
  toCMSProjects,
  fromCMSProject,
  toCMSSkills,
  fromCMSSkill,
  BackendProject,
  BackendSkill,
} from "@/lib/collective-adapters";

let fallbackProjects: CMSProject[] = defaultProjects.map((p, idx) => ({
  id: p.id,
  slug: p.slug,
  title: p.title,
  tagline: p.tagline,
  summary: p.summary,
  problem: p.problem,
  role: p.role,
  process: p.process,
  stack: p.stack,
  features: p.features,
  challenges: p.challenges,
  outcomes: p.outcomes,
  order: idx + 1,
  liveUrl: p.links.live || p.links.web,
  githubUrl: p.links.github,
  playStoreUrl: p.links.playStore,
  appStoreUrl: p.links.appStore,
  imageSrc: p.gallery[0]?.src || "/trofy.jpg",
}));

let fallbackSkills: CMSSkill[] = [
  { id: "sk-1", name: "React Native", category: "Mobile", level: "Expert", logo: "/logos/React-native.png", order: 1 },
  { id: "sk-2", name: "React.js", category: "Frontend", level: "Expert", logo: "/logos/react-js.png", order: 2 },
  { id: "sk-3", name: "Next.js 16", category: "Frontend", level: "Expert", logo: "/logos/next-js.png", order: 3 },
  { id: "sk-4", name: "Node.js", category: "Backend", level: "Expert", logo: "/logos/node.js.png", order: 4 },
  { id: "sk-5", name: "TypeScript", category: "Frontend", level: "Expert", logo: "/logos/TypeScript.png", order: 5 },
  { id: "sk-6", name: "Tailwind CSS v4", category: "Frontend", level: "Expert", logo: "/logos/tailwind.png", order: 6 },
  { id: "sk-7", name: "MongoDB", category: "Cloud", level: "Advanced", logo: "/logos/mongodb.png", order: 7 },
  { id: "sk-8", name: "Firebase Realtime DB", category: "Cloud", level: "Expert", logo: "/logos/firebase.png", order: 8 },
];

export const portfolioService = {
  async getHero(): Promise<CMSHero> {
    return {
      headline: "Nirmal Ranpariya",
      subheadline: "Full-Stack Software Developer | Mobile & Web Engineering Specialist",
      ctaTextPrimary: "View Projects ✦",
      ctaTextSecondary: "My Core Skills",
      availableForHire: true,
    };
  },

  async getAbout(): Promise<CMSAbout> {
    return {
      title: "Full-Stack Software Developer",
      missionStatement: "Fueled by a deep passion for full-stack engineering, crafting seamless mobile & web applications.",
      bio: "2+ years of crafting high-performance, scalable applications across React Native, React.js, Node.js, and cloud ecosystems.",
      location: "India (Remote Worldwide)",
      experienceYears: 2,
    };
  },

  async getSkills(): Promise<CMSSkill[]> {
    try {
      const data = await dashboardFetch<{ skills: BackendSkill[] }>(
        "/api/collective/portfolio/skills"
      );
      if (!data.skills || data.skills.length === 0) return fallbackSkills;
      return toCMSSkills(data.skills);
    } catch {
      return fallbackSkills;
    }
  },

  async getProjects(): Promise<CMSProject[]> {
    try {
      const data = await dashboardFetch<{ projects: BackendProject[] }>(
        "/api/collective/portfolio/projects"
      );
      if (!data.projects || data.projects.length === 0) return fallbackProjects;
      return toCMSProjects(data.projects);
    } catch {
      return fallbackProjects;
    }
  },

  async saveProject(project: CMSProject): Promise<CMSProject> {
    try {
      const isNew = project.id.startsWith("proj_") && project.id.length < 24; // MongoDB ObjectIds are 24 chars
      const payload = fromCMSProject(project);

      if (isNew) {
        const res = await dashboardFetch<{ project: BackendProject }>(
          "/api/collective/portfolio/projects",
          {
            method: "POST",
            body: JSON.stringify(payload),
          }
        );
        return toCMSProjects([res.project])[0];
      } else {
        const res = await dashboardFetch<{ project: BackendProject }>(
          `/api/collective/portfolio/projects/${project.id}`,
          {
            method: "PATCH",
            body: JSON.stringify(payload),
          }
        );
        return toCMSProjects([res.project])[0];
      }
    } catch (err) {
      console.error("Failed to save project to backend:", err);
      // Fallback in-memory update
      const existingIndex = fallbackProjects.findIndex((p) => p.id === project.id);
      if (existingIndex >= 0) {
        fallbackProjects[existingIndex] = project;
      } else {
        fallbackProjects.push({ ...project, id: `proj_${Date.now()}` });
      }
      return project;
    }
  },

  async deleteProject(id: string): Promise<void> {
    try {
      await dashboardFetch(`/api/collective/portfolio/projects/${id}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.error("Failed to delete project from backend:", err);
    }
    fallbackProjects = fallbackProjects.filter((p) => p.id !== id);
  },

  async reorderProjects(reorderedIds: string[]): Promise<CMSProject[]> {
    // Reorder locally first
    const map = new Map(fallbackProjects.map((p) => [p.id, p]));
    const nextList: CMSProject[] = [];
    
    reorderedIds.forEach((id, index) => {
      const item = map.get(id);
      if (item) {
        item.order = index + 1;
        nextList.push(item);
      }
    });
    fallbackProjects = nextList;

    // Send order updates to backend sequentially
    for (const project of fallbackProjects) {
      if (!project.id.startsWith("proj_") || project.id.length === 24) {
        try {
          await dashboardFetch(`/api/collective/portfolio/projects/${project.id}`, {
            method: "PATCH",
            body: JSON.stringify({ order: project.order }),
          });
        } catch (err) {
          console.error(`Failed to update project order for ${project.id}:`, err);
        }
      }
    }

    return fallbackProjects;
  },
};
