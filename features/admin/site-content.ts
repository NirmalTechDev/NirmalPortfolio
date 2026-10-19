"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fallbackSite } from "@/lib/content/fallback";
import type { SiteContent } from "@/lib/content/types";
import { api } from "./api";

const SECTIONS = ["identity", "home", "about", "workPage", "experiencePage", "contactPage", "principles", "capabilities"] as const;

/** Server document (or the built-in content when nothing has been saved yet). */
export function useSiteContent() {
  return useQuery({
    queryKey: ["site"],
    queryFn: async () => {
      const doc = await api.get<(SiteContent & { updatedAt?: string }) | null>("portfolio/site");
      if (!doc) return { content: structuredClone(fallbackSite), saved: false, updatedAt: null as string | null };
      const merged = structuredClone(fallbackSite) as unknown as Record<string, unknown>;
      for (const k of SECTIONS) {
        const v = (doc as unknown as Record<string, unknown>)[k];
        if (v === undefined || v === null) continue;
        merged[k] = Array.isArray(v) ? v : { ...(merged[k] as object), ...(v as object) };
      }
      return { content: merged as unknown as SiteContent, saved: true, updatedAt: doc.updatedAt || null };
    },
  });
}

export const pickSections = (c: SiteContent, only?: readonly (typeof SECTIONS)[number][]) =>
  Object.fromEntries((only || SECTIONS).map((k) => [k, c[k]]));

export function useSaveSiteContent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<SiteContent>) => api.put<SiteContent>("portfolio/site", payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["site"] });
      qc.invalidateQueries({ queryKey: ["overview"] });
    },
  });
}
