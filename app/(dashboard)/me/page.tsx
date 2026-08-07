"use client";

import React, { useState } from "react";
import { AuthGuard } from "@/features/auth/auth-guard";
import { CommandHeader } from "@/features/dashboard-header/command-header";
import { OverviewView } from "@/features/overview/overview-view";
import { CMSView } from "@/features/portfolio-cms/cms-view";
import { ContactsView } from "@/features/contact-mgmt/contacts-view";
import { LedgerView } from "@/features/collective-ledger/ledger-view";
import { MonitoringView } from "@/features/api-monitoring/monitoring-view";
import { DevProfileView } from "@/features/dev-profile/dev-profile-view";
import { AIWorkspaceView } from "@/features/ai-workspace/ai-workspace-view";
import { DashboardTab } from "@/types/dashboard";
import {
  LayoutDashboard,
  Layers,
  Mail,
  Activity,
  Cpu,
  GitBranch,
  Sparkles,
} from "lucide-react";

const NAV_TABS: { value: DashboardTab; label: string; icon: React.ElementType; activeColor: string }[] = [
  { value: "overview",    label: "Overview",          icon: LayoutDashboard, activeColor: "text-sky-400 border-sky-500/40 bg-sky-500/10" },
  { value: "portfolio",   label: "Portfolio CMS",     icon: Layers,          activeColor: "text-purple-400 border-purple-500/40 bg-purple-500/10" },
  { value: "contacts",    label: "Contact Inbox",     icon: Mail,            activeColor: "text-pink-400 border-pink-500/40 bg-pink-500/10" },
  { value: "ledger",      label: "Collective Ledger", icon: Activity,        activeColor: "text-emerald-400 border-emerald-500/40 bg-emerald-500/10" },
  { value: "monitoring",  label: "API Monitoring",    icon: Cpu,             activeColor: "text-amber-400 border-amber-500/40 bg-amber-500/10" },
  { value: "github",      label: "GitHub Profile",    icon: GitBranch,       activeColor: "text-blue-400 border-blue-500/40 bg-blue-500/10" },
  { value: "ai",          label: "AI Workspace",      icon: Sparkles,        activeColor: "text-indigo-400 border-indigo-500/40 bg-indigo-500/10" },
];

export default function CommandCenterPage() {
  const [activeTab, setActiveTab] = useState<DashboardTab>("overview");

  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col bg-slate-950 pb-16">
        <CommandHeader activeTab={activeTab} onTabChange={setActiveTab} />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 pt-5 space-y-6">
          {/* Navigation Tab Bar */}
          <nav className="w-full overflow-x-auto scrollbar-none -mx-1 px-1">
            <div className="flex items-center gap-1.5 min-w-max p-1.5 bg-slate-900/80 border border-white/10 rounded-2xl backdrop-blur-xl">
              {NAV_TABS.map(({ value, label, icon: Icon, activeColor }) => {
                const isActive = activeTab === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setActiveTab(value)}
                    className={`
                      inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold
                      whitespace-nowrap transition-all duration-200 select-none
                      ${isActive
                        ? `${activeColor} border shadow-sm`
                        : "text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent"
                      }
                    `}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? "" : "opacity-70"}`} />
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Module Content Views — animated fade-in on tab change */}
          <div key={activeTab} className="animate-in fade-in-0 duration-200">
            {activeTab === "overview"   && <OverviewView />}
            {activeTab === "portfolio"  && <CMSView />}
            {activeTab === "contacts"   && <ContactsView />}
            {activeTab === "ledger"     && <LedgerView />}
            {activeTab === "monitoring" && <MonitoringView />}
            {activeTab === "github"     && <DevProfileView />}
            {activeTab === "ai"         && <AIWorkspaceView />}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
