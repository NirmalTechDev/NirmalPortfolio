"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

const systemTheme = (): Theme =>
  typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

/** Light/dark switch for the public site. Remembers the choice; defaults to the system setting. */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const saved = document.documentElement.dataset.siteTheme as Theme | undefined;
    setTheme(saved || systemTheme());
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.siteTheme = next;
    try {
      localStorage.setItem("site-theme", next);
    } catch {
      /* private mode */
    }
  };

  return (
    <button
      type="button"
      className="theme-btn"
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      title={theme === "dark" ? "Light theme" : "Dark theme"}
    >
      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
        {theme === "dark" ? (
          <path fill="currentColor" d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0-5 1 3h-2l1-3Zm0 20-1-3h2l-1 3ZM2 12l3-1v2l-3-1Zm20 0-3 1v-2l3 1ZM4.9 4.9l2.8 1.4-1.4 1.4L4.9 4.9Zm14.2 14.2-2.8-1.4 1.4-1.4 1.4 2.8Zm0-14.2-1.4 2.8-1.4-1.4 2.8-1.4ZM4.9 19.1l1.4-2.8 1.4 1.4-2.8 1.4Z" />
        ) : (
          <path fill="currentColor" d="M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5Z" />
        )}
      </svg>
    </button>
  );
}
