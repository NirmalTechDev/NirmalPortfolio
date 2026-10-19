"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Briefcase,
  Cake,
  ExternalLink,
  FileText,
  FolderKanban,
  Gauge,
  Images,
  Inbox,
  LayoutGrid,
  LogOut,
  Menu,
  Moon,
  Sparkles,
  Sun,
  UserRound,
} from "lucide-react";
import { api } from "./api";
import type { Overview } from "./types";
import { FeedbackProvider } from "./ui";

type Theme = "light" | "dark";

const NAV: { group: string; items: { href: string; label: string; icon: React.ElementType; count?: "messages" }[] }[] = [
  {
    group: "Website",
    items: [
      { href: "/me", label: "Overview", icon: LayoutGrid },
      { href: "/me/profile", label: "Profile & pages", icon: UserRound },
      { href: "/me/resume", label: "Résumé", icon: FileText },
      { href: "/me/projects", label: "Projects", icon: FolderKanban },
      { href: "/me/experience", label: "Experience", icon: Briefcase },
      { href: "/me/skills", label: "Skills & habits", icon: Sparkles },
    ],
  },
  { group: "Messages", items: [{ href: "/me/inbox", label: "Inbox", icon: Inbox, count: "messages" }] },
  {
    group: "Personal",
    items: [
      { href: "/me/gallery", label: "Gallery", icon: Images },
      { href: "/me/birthdays", label: "Birthday pages", icon: Cake },
    ],
  },
  { group: "Advanced", items: [{ href: "/me/advanced", label: "System & tools", icon: Gauge }] },
];

const isActive = (pathname: string, href: string) => (href === "/me" ? pathname === "/me" : pathname === href || pathname.startsWith(`${href}/`));

export function useOverview() {
  return useQuery({ queryKey: ["overview"], queryFn: () => api.get<Overview>("owner/overview"), staleTime: 30_000, retry: 1 });
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  // null until mounted: the pre-paint script on <html> decides the first frame.
  const [theme, setTheme] = useState<Theme | null>(null);
  const [open, setOpen] = useState(false);
  const isLogin = pathname.startsWith("/me/login");

  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem("adm-theme");
    } catch {
      /* ignore */
    }
    setTheme(saved === "dark" || saved === "light" ? saved : window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  }, []);
  useEffect(() => setOpen(false), [pathname]);

  const toggleTheme = () => {
    const current = theme ?? (document.documentElement.dataset.admTheme as Theme) ?? "light";
    const next: Theme = current === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.admTheme = next;
    try {
      localStorage.setItem("adm-theme", next);
    } catch {
      /* ignore */
    }
  };

  if (isLogin) {
    return (
      <div className="adm" data-theme={theme ?? undefined}>
        <FeedbackProvider>{children}</FeedbackProvider>
      </div>
    );
  }

  return (
    <div className="adm" data-theme={theme ?? undefined}>
      <FeedbackProvider>
        <div className="adm-shell">
          <Sidebar open={open} theme={theme ?? "light"} onToggleTheme={toggleTheme} onSignOut={async () => {
            await fetch("/api/auth/logout", { method: "POST" });
            router.replace("/me/login");
            router.refresh();
          }} pathname={pathname} />
          {open && <button type="button" className="adm-scrim" aria-label="Close menu" onClick={() => setOpen(false)} />}
          <div style={{ minWidth: 0 }}>
            <div className="adm-top">
              <button type="button" className="adm-btn adm-btn--icon adm-btn--quiet" onClick={() => setOpen(true)} aria-label="Open menu" aria-expanded={open}>
                <Menu />
              </button>
              <span style={{ fontWeight: 600 }}>Dashboard</span>
              <span className="adm-spacer" />
              <button type="button" className="adm-btn adm-btn--icon adm-btn--quiet" onClick={toggleTheme} aria-label={theme === "dark" ? "Use light theme" : "Use dark theme"} suppressHydrationWarning>
                {theme === "dark" ? <Sun /> : <Moon />}
              </button>
            </div>
            <main className="adm-main" id="adm-main">
              {children}
            </main>
          </div>
        </div>
      </FeedbackProvider>
    </div>
  );
}

function Sidebar({ open, pathname, theme, onToggleTheme, onSignOut }: { open: boolean; pathname: string; theme: Theme; onToggleTheme: () => void; onSignOut: () => void }) {
  const { data } = useOverview();
  const newMessages = data?.counts.newMessages ?? 0;
  return (
    <aside className="adm-side" data-open={open} aria-label="Dashboard navigation">
      <Link href="/me" className="adm-brand">
        <span className="adm-brand__mark" aria-hidden="true">
          N
        </span>
        <span>
          <span className="adm-brand__name" style={{ display: "block" }}>
            Nirmal Ranpariya
          </span>
          <span className="adm-brand__sub">Your dashboard</span>
        </span>
      </Link>
      <nav className="adm-nav">
        {NAV.map((g) => (
          <div className="adm-nav__group" key={g.group}>
            <p className="adm-nav__label">{g.group}</p>
            <ul>
              {g.items.map((it) => {
                const Icon = it.icon;
                return (
                  <li key={it.href}>
                    <Link href={it.href} className="adm-nav__link" aria-current={isActive(pathname, it.href) ? "page" : undefined}>
                      <Icon aria-hidden="true" />
                      {it.label}
                      {it.count === "messages" && newMessages > 0 && (
                        <span className="adm-nav__count" aria-label={`${newMessages} new`}>
                          {newMessages}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
      <div className="adm-side__foot">
        <a className="adm-nav__link" href="/" target="_blank" rel="noopener noreferrer">
          <ExternalLink aria-hidden="true" />
          View website
        </a>
        <button type="button" className="adm-nav__link" style={{ border: 0, background: "none", font: "inherit", cursor: "pointer", width: "100%" }} onClick={onToggleTheme}>
          {theme === "dark" ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
          {theme === "dark" ? "Light theme" : "Dark theme"}
        </button>
        <button type="button" className="adm-nav__link" style={{ border: 0, background: "none", font: "inherit", cursor: "pointer", width: "100%" }} onClick={onSignOut}>
          <LogOut aria-hidden="true" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
