/**
 * Adapters: map Collective Ledger backend API shapes → dashboard UI types.
 */
import {
  LedgerAuditLog,
  LedgerFinancialSummary,
  LedgerInvestment,
  LedgerMember,
} from "@/types/ledger";
import { ContactMessage } from "@/types/portfolio";
import { ServiceHealth, SystemLogEntry } from "@/types/monitoring";

const paiseToRupees = (paise: number) => Math.round(paise / 100);

interface BackendAdminSummary {
  totalMembers: number;
  totalCollectedPaise: number;
  totalInvestedPaise: number;
  availablePaise: number;
  pendingPaise: number;
  latePaymentsCount: number;
}

interface BackendOverview {
  users: number;
  communities: number;
  paymentsTotalPaise: number;
  investmentsTotalPaise: number;
  unreadMessages: number;
  projectsCount: number;
  systemStatus: string;
}

interface BackendInvestment {
  _id: string;
  title: string;
  amountPaise: number;
  date: string;
  notes?: string;
}

interface BackendMember {
  _id: string;
  name: string;
  email: string;
  role: string;
  communityId: string;
  createdAt?: string;
}

interface BackendAuditLog {
  actorId?: string;
  actorName?: string;
  action: string;
  entityType?: string;
  createdAt: string;
}

interface BackendContactMessage {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: "NEW" | "READ" | "REPLIED" | "ARCHIVED";
  createdAt: string;
}

interface BackendHealth {
  status: "ok" | "degraded";
  uptimeSeconds: number;
  timestamp: string;
  environment: string;
  memory?: { rssMB: string; heapTotalMB: string; heapUsedMB: string };
  database?: { connected: boolean };
  error?: string;
}

const STATUS_MAP: Record<string, ContactMessage["status"]> = {
  NEW: "unread",
  READ: "read",
  REPLIED: "replied",
  ARCHIVED: "archived",
};

const REVERSE_STATUS_MAP: Record<ContactMessage["status"], string> = {
  unread: "NEW",
  read: "READ",
  replied: "REPLIED",
  archived: "ARCHIVED",
};

export function toLedgerSummary(
  adminSummary: BackendAdminSummary | null,
  overview: BackendOverview | null
): LedgerFinancialSummary {
  const summary = adminSummary ?? {
    totalMembers: overview?.users ?? 0,
    totalCollectedPaise: overview?.paymentsTotalPaise ?? 0,
    totalInvestedPaise: overview?.investmentsTotalPaise ?? 0,
    availablePaise: 0,
    pendingPaise: 0,
    latePaymentsCount: 0,
  };

  return {
    totalCollected: paiseToRupees(summary.totalCollectedPaise),
    totalInvested: paiseToRupees(summary.totalInvestedPaise),
    availableCash: paiseToRupees(summary.availablePaise),
    pendingDues: paiseToRupees(summary.pendingPaise),
    latePenalties: summary.latePaymentsCount * 100,
    memberCount: summary.totalMembers,
    activeCommunities: overview?.communities ?? 1,
    currency: "INR",
  };
}

export function toLedgerMembers(members: BackendMember[]): LedgerMember[] {
  return members.map((m) => ({
    id: m._id,
    name: m.name,
    email: m.email,
    community: "Ledger Cooperative",
    role: mapRole(m.role),
    totalContributed: 0,
    pendingInstallment: 0,
    joinedAt: m.createdAt ?? new Date().toISOString(),
    status: "active" as const,
  }));
}

function mapRole(role: string): LedgerMember["role"] {
  const r = role.toUpperCase();
  if (r.includes("ADMIN")) return "Admin";
  if (r.includes("FINANCE") || r.includes("TREASUR")) return "Treasurer";
  if (r.includes("AUDIT")) return "Auditor";
  return "Member";
}

export function toLedgerInvestments(items: BackendInvestment[]): LedgerInvestment[] {
  return items.map((inv) => ({
    id: inv._id,
    assetName: inv.title,
    category: "Fixed Deposit" as const,
    investedAmount: paiseToRupees(inv.amountPaise),
    currentValue: paiseToRupees(inv.amountPaise),
    returnsPercent: 0,
    allocatedDate: inv.date,
  }));
}

export function toLedgerAuditLogs(logs: BackendAuditLog[]): LedgerAuditLog[] {
  return logs.map((log, idx) => ({
    id: log.actorId ?? `log_${idx}`,
    actor: log.actorName ?? "System",
    action: log.action,
    target: log.entityType ?? "—",
    timestamp: log.createdAt,
    ipAddress: "—",
    status: "SUCCESS" as const,
  }));
}

export function toContactMessages(
  messages: BackendContactMessage[],
  starredIds: Set<string> = new Set()
): ContactMessage[] {
  return messages.map((m) => ({
    id: m._id,
    name: m.name,
    email: m.email,
    company: m.subject,
    message: m.message,
    submittedAt: m.createdAt,
    status: STATUS_MAP[m.status] ?? "unread",
    starred: starredIds.has(m._id),
  }));
}

export function toBackendStatus(status: ContactMessage["status"]): string {
  return REVERSE_STATUS_MAP[status] ?? "READ";
}

export function toServiceHealth(health: BackendHealth, latencyMs: number): ServiceHealth[] {
  const beStatus =
    health.status === "ok" && health.database?.connected !== false
      ? "ONLINE"
      : health.error
        ? "OFFLINE"
        : "DEGRADED";

  return [
    {
      id: "srv_portfolio",
      name: "Personal Portfolio",
      endpoint: process.env.NEXT_PUBLIC_SITE_URL ?? "https://nirmalranpariya.in",
      status: "ONLINE",
      responseTimeMs: 42,
      uptime24h: 99.98,
      errorRate: 0.01,
    },
    {
      id: "srv_collective_fe",
      name: "Collective Ledger Frontend",
      endpoint: "https://collective-sandy.vercel.app",
      status: "ONLINE",
      responseTimeMs: 85,
      uptime24h: 99.95,
      errorRate: 0.02,
    },
    {
      id: "srv_collective_be",
      name: "Collective Ledger Node Backend",
      endpoint:
        process.env.NEXT_PUBLIC_COLLECTIVE_API_URL?.replace("/api/v1", "") ??
        "https://collective-onc6.onrender.com",
      status: beStatus,
      responseTimeMs: latencyMs,
      uptime24h: health.uptimeSeconds > 0 ? 99.9 : 0,
      errorRate: beStatus === "ONLINE" ? 0.02 : 1.0,
    },
    {
      id: "srv_database",
      name: "MongoDB Atlas",
      endpoint: "mongodb+srv://cluster",
      status: health.database?.connected ? "ONLINE" : "OFFLINE",
      responseTimeMs: 12,
      uptime24h: health.database?.connected ? 100 : 0,
      errorRate: health.database?.connected ? 0 : 1,
    },
  ];
}

export function toSystemLogs(health: BackendHealth): SystemLogEntry[] {
  const now = new Date().toISOString();
  const logs: SystemLogEntry[] = [
    {
      id: "log_health",
      timestamp: health.timestamp ?? now,
      level: health.status === "ok" ? "INFO" : "WARN",
      service: "Collective-BE",
      message: `System health: ${health.status} | uptime ${health.uptimeSeconds}s | env ${health.environment}`,
      statusCode: health.status === "ok" ? 200 : 503,
    },
  ];

  if (health.memory) {
    logs.push({
      id: "log_memory",
      timestamp: now,
      level: "INFO",
      service: "Collective-BE",
      message: `Memory RSS ${health.memory.rssMB}MB | heap ${health.memory.heapUsedMB}/${health.memory.heapTotalMB}MB`,
      statusCode: 200,
    });
  }

  if (health.error) {
    logs.push({
      id: "log_error",
      timestamp: now,
      level: "ERROR",
      service: "Collective-BE",
      message: health.error,
      statusCode: 503,
    });
  }

  return logs;
}

export type { BackendOverview, BackendAdminSummary, BackendHealth };

export interface BackendProject {
  _id: string;
  title: string;
  slug: string;
  description: string;
  longDescription?: string;
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
  featured: boolean;
  order: number;
}

export interface BackendSkill {
  _id: string;
  name: string;
  category: string;
  proficiency: number;
  icon?: string;
  order: number;
}

import { CMSProject, CMSSkill } from "@/types/portfolio";

export function toCMSProjects(projects: BackendProject[]): CMSProject[] {
  return projects.map((p) => {
    // Parse longDescription if it holds extra fields as JSON, otherwise fallback
    let extra = {
      problem: "User research & prototyping",
      role: "Lead Engineer",
      process: "Design, build & release",
      features: ["Responsive design"],
      challenges: ["Optimizing performance"],
      outcomes: ["Successfully deployed"],
    };

    if (p.longDescription) {
      try {
        if (p.longDescription.startsWith("{")) {
          extra = { ...extra, ...JSON.parse(p.longDescription) };
        } else {
          extra.problem = p.longDescription;
        }
      } catch {
        extra.problem = p.longDescription;
      }
    }

    return {
      id: p._id,
      slug: p.slug,
      title: p.title,
      tagline: p.description,
      summary: p.description,
      problem: extra.problem,
      role: extra.role,
      process: extra.process,
      stack: p.techStack,
      features: extra.features,
      challenges: extra.challenges,
      outcomes: extra.outcomes,
      order: p.order,
      liveUrl: p.liveUrl ?? "",
      githubUrl: p.githubUrl ?? "",
      imageSrc: p.imageUrl || "/trofy.jpg",
    };
  });
}

export function fromCMSProject(p: CMSProject): Partial<BackendProject> {
  const extra = {
    problem: p.problem,
    role: p.role,
    process: p.process,
    features: p.features,
    challenges: p.challenges,
    outcomes: p.outcomes,
  };

  return {
    title: p.title,
    slug: p.slug,
    description: p.tagline || p.summary,
    longDescription: JSON.stringify(extra),
    techStack: p.stack,
    githubUrl: p.githubUrl,
    liveUrl: p.liveUrl,
    imageUrl: p.imageSrc,
    featured: true,
    order: p.order,
  };
}

export function toCMSSkills(skills: BackendSkill[]): CMSSkill[] {
  return skills.map((s) => {
    let level: CMSSkill["level"] = "Intermediate";
    if (s.proficiency >= 90) level = "Expert";
    else if (s.proficiency >= 75) level = "Advanced";

    return {
      id: s._id,
      name: s.name,
      category: s.category as CMSSkill["category"],
      level,
      logo: s.icon || "/logos/react-js.png",
      order: s.order,
    };
  });
}

export function fromCMSSkill(s: CMSSkill): Partial<BackendSkill> {
  let proficiency = 60;
  if (s.level === "Expert") proficiency = 95;
  else if (s.level === "Advanced") proficiency = 80;

  return {
    name: s.name,
    category: s.category,
    proficiency,
    icon: s.logo,
    order: s.order,
  };
}
