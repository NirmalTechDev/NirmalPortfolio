import React from "react";
import { Metadata } from "next";
import { QueryProvider } from "@/components/providers/query-provider";
import { AuthProvider } from "@/components/providers/auth-provider";

export const metadata: Metadata = {
  title: "Staff Command Center ✦ Nirmal Ranpariya",
  description: "Private staff dashboard.",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <AuthProvider>
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-sky-500 selection:text-white antialiased">
          {children}
        </div>
      </AuthProvider>
    </QueryProvider>
  );
}
