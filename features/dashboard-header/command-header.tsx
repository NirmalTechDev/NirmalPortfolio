"use client";

import React, { useState } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { SystemStatusPills } from "./system-status";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Command, LogOut } from "lucide-react";
import { CommandPalette } from "./command-palette";
import { DashboardTab } from "@/types/dashboard";

export function CommandHeader({
  activeTab,
  onTabChange,
}: {
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
}) {
  const { user, logout } = useAuth();
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);

  React.useEffect(() => {
    const handleGlobalKeydown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleGlobalKeydown);
    return () => window.removeEventListener("keydown", handleGlobalKeydown);
  }, []);

  // Dynamic greeting based on current time
  const hour = new Date().getHours();
  const greetingTime = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-slate-950/90 backdrop-blur-2xl">
      <div className="mx-auto flex items-center justify-between gap-3 max-w-7xl px-4 lg:px-8 py-3">
        {/* User Greeting & Title */}
        <div className="flex items-center gap-3 min-w-0">
          <Avatar
            src={user?.avatar || "/profile.jpeg"}
            alt={user?.name || "Nirmal Ranpariya"}
            size="lg"
            className="ring-2 ring-sky-500/50 shrink-0"
          />
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base lg:text-xl font-bold text-white tracking-tight whitespace-nowrap">
                {greetingTime}, {user?.name.split(" ")[0] || "Nirmal"} 👋
              </h1>
              <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full border border-sky-500/30 bg-sky-500/10 text-sky-400 text-[10px] font-bold tracking-wide uppercase">
                Staff Admin
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate hidden md:block">
              Personal Command Center • Management & Real-time Operations
            </p>
          </div>
        </div>

        {/* System Status Pills & Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden lg:flex">
            <SystemStatusPills />
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPaletteOpen(true)}
            className="hidden sm:flex items-center gap-2 text-xs px-3"
          >
            <Command className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Search</span>
            <span className="text-slate-500 hidden md:inline">⌘K</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={logout}
            className="text-slate-400 hover:text-red-400 hover:bg-red-500/10"
            title="Sign out of command center"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Mobile: status pills row */}
      <div className="lg:hidden border-t border-white/5 px-4 py-2 overflow-x-auto scrollbar-none">
        <SystemStatusPills />
      </div>

      {/* Command Palette Modal */}
      <CommandPalette
        isOpen={isPaletteOpen}
        onClose={() => setIsPaletteOpen(false)}
        onSelectTab={onTabChange}
      />
    </header>
  );
}
