import { AIPromptItem, DevCommandItem, DevNote } from "@/types/ai";

export const aiService = {
  async getPrompts(): Promise<AIPromptItem[]> {
    return [
      {
        id: "p_1",
        title: "Senior Staff Code Audit & Refactor",
        category: "Refactoring",
        promptText: "Act as a Senior Staff Engineer. Review the following code for memory leaks, unnecessary re-renders, clean architecture, and type safety.",
        tags: ["Refactor", "React", "TypeScript", "Performance"],
        favorite: true,
      },
      {
        id: "p_2",
        title: "Decimal Financial Calculations Audit",
        category: "Architecture",
        promptText: "Analyze this ledger transaction model to guarantee IEEE 754 floating-point rounding errors cannot corrupt financial sums. Use BigNumber or Decimal precision rules.",
        tags: ["Fintech", "Math", "Backend", "Prisma"],
        favorite: true,
      },
      {
        id: "p_3",
        title: "React Native Performance Profile",
        category: "Mobile Dev",
        promptText: "Identify JS bridge bottlenecks, unmemoized list items, and high-frequency state updates causing frame drops on low-end Android devices.",
        tags: ["React Native", "Performance", "Optimization"],
        favorite: false,
      },
    ];
  },

  async getCommands(): Promise<DevCommandItem[]> {
    return [
      { id: "cmd_1", label: "Check Type Safety", command: "npx tsc --noEmit", description: "Runs TypeScript compiler without emitting files to verify zero errors.", category: "Next.js" },
      { id: "cmd_2", label: "Production Build Test", command: "npm run build", description: "Compiles production Turbopack bundles & checks route static generation.", category: "Next.js" },
      { id: "cmd_3", label: "Docker Local Postgres", command: "docker run --name collective-db -e POSTGRES_PASSWORD=secret -p 5432:5432 -d postgres:16-alpine", description: "Launches local PostgreSQL 16 container for Collective Ledger testing.", category: "Docker" },
      { id: "cmd_4", label: "Prisma Migration Deploy", command: "npx prisma migrate deploy && npx prisma generate", description: "Applies pending database migrations to production database cluster.", category: "Backend" },
    ];
  },

  async getNotes(): Promise<DevNote[]> {
    return [
      {
        id: "note_1",
        title: "Collective Ledger Multi-Tenant Security Rules",
        category: "Architecture",
        content: "Every Prisma query MUST include `communityId` filter. Never expose cross-tenant queries. Audit logs are append-only.",
        lastUpdated: "2026-07-31",
      },
      {
        id: "note_2",
        title: "React Native Infinite Scroll Throttling",
        category: "Mobile Dev",
        content: "Use `getItemLayout` on FlatList and throttle Firebase realtime listeners using custom 300ms debouncers to keep 60 FPS UI thread.",
        lastUpdated: "2026-07-30",
      },
    ];
  },
};
