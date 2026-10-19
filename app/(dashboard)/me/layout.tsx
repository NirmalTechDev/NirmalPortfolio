import React from "react";
import type { Metadata } from "next";
import { QueryProvider } from "@/components/providers/query-provider";
import { AdminShell } from "@/features/admin/shell";
import "@/features/admin/admin.css";

export const metadata: Metadata = {
  title: { default: "Dashboard · Nirmal Ranpariya", template: "%s · Dashboard" },
  description: "Private dashboard.",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      {/* Applies the saved dashboard theme before first paint (no light flash in dark mode). */}
      <script
        dangerouslySetInnerHTML={{
          __html: `try{var t=localStorage.getItem("adm-theme");if(!t)t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";document.documentElement.dataset.admTheme=t;}catch(e){}`,
        }}
      />
      <AdminShell>{children}</AdminShell>
    </QueryProvider>
  );
}
