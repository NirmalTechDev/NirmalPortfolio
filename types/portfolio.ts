export interface CMSHero {
  headline: string;
  subheadline: string;
  ctaTextPrimary: string;
  ctaTextSecondary: string;
  availableForHire: boolean;
}

export interface CMSAbout {
  title: string;
  missionStatement: string;
  bio: string;
  location: string;
  experienceYears: number;
}

export interface CMSSkill {
  id: string;
  name: string;
  category: "Mobile" | "Frontend" | "Backend" | "Cloud" | "DevOps" | "Design";
  level: "Expert" | "Advanced" | "Intermediate";
  logo: string;
  order: number;
}

export interface CMSProject {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  summary: string;
  problem: string;
  role: string;
  process: string;
  stack: string[];
  features: string[];
  challenges: string[];
  outcomes: string[];
  order: number;
  liveUrl?: string;
  githubUrl?: string;
  playStoreUrl?: string;
  appStoreUrl?: string;
  imageSrc: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  company?: string;
  message: string;
  submittedAt: string;
  status: "unread" | "read" | "replied" | "archived";
  starred: boolean;
}
