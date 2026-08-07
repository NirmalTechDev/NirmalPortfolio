"use client";

import React, { useState, useEffect } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search, Command, ArrowRight, Layers, LayoutDashboard, Mail, Activity, GitBranch, Cpu } from "lucide-react";
import { DashboardTab } from "@/types/dashboard";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: DashboardTab) => void;
}

export function CommandPalette({ isOpen, onClose, onSelectTab }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const items: { label: string; tab: DashboardTab; icon: any; category: string }[] = [
    { label: "Overview Metrics & Real-time Traffic", tab: "overview", icon: LayoutDashboard, category: "Navigation" },
    { label: "Portfolio CMS & Case Studies", tab: "portfolio", icon: Layers, category: "Navigation" },
    { label: "Contact Inbox & Recruiter Messages", tab: "contacts", icon: Mail, category: "Navigation" },
    { label: "Collective Ledger SaaS Admin", tab: "ledger", icon: Activity, category: "Navigation" },
    { label: "API Monitoring & Latency Logs", tab: "monitoring", icon: Cpu, category: "Navigation" },
    { label: "GitHub Profile & Repo Metrics", tab: "github", icon: GitBranch, category: "Navigation" },
    { label: "AI Prompt Library & Dev Notes", tab: "ai", icon: Command, category: "Navigation" },
  ];

  const filtered = items.filter((i) =>
    i.label.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filtered.length || 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % (filtered.length || 1));
    } else if (e.key === "Enter" && filtered[selectedIndex]) {
      e.preventDefault();
      onSelectTab(filtered[selectedIndex].tab);
      onClose();
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} maxWidth="max-w-xl">
      <div className="space-y-4" onKeyDown={handleKeyDown}>
        <div className="relative">
          <Search className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search module (e.g. Ledger, CMS, API)..."
            className="pl-11 h-12 text-base bg-slate-950/80"
            autoFocus
          />
        </div>

        <div className="max-h-72 overflow-y-auto scrollbar-thin space-y-1 pr-1">
          {filtered.length === 0 ? (
            <p className="p-4 text-center text-sm text-slate-500">No matching command center modules.</p>
          ) : (
            filtered.map((item, idx) => {
              const Icon = item.icon;
              const isFocused = idx === selectedIndex;
              return (
                <button
                  key={item.tab}
                  onClick={() => {
                    onSelectTab(item.tab);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl transition text-left text-sm group ${
                    isFocused
                      ? "bg-sky-500/20 border border-sky-500/40 text-white"
                      : "text-slate-200 hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-sky-400 group-hover:bg-sky-500/20">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-medium text-white block">{item.label}</span>
                      <span className="text-[10px] text-slate-400">{item.category}</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white transition" />
                </button>
              );
            })
          )}
        </div>
      </div>
    </Dialog>
  );
}
