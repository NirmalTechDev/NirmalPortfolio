"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { nav } from "@/content/profile";

const isActive = (pathname: string, href: string) => pathname === href || pathname.startsWith(`${href}/`);

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header className="header">
      <div className="frame header__in">
        <Link href="/" className="wordmark" aria-label="Nirmal Ranpariya, home">
          Nirmal Ranpariya
        </Link>
        <nav className="nav" aria-label="Primary">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} aria-current={isActive(pathname, item.href) ? "page" : undefined}>
              <span>{item.n}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <p className="meta status">
          <b>Open to select projects</b>
        </p>
        <button
          ref={menuRef}
          type="button"
          className="menu-btn"
          aria-expanded={open}
          aria-controls="menu-sheet"
          onClick={() => setOpen(true)}
        >
          Menu
        </button>
      </div>

      <div id="menu-sheet" className="sheet" data-open={open} inert={!open} role="dialog" aria-modal="true" aria-label="Menu">
        <div className="sheet__top">
          <span className="wordmark">Nirmal Ranpariya</span>
          <button ref={closeRef} type="button" className="menu-btn" onClick={() => setOpen(false)}>
            Close
          </button>
        </div>
        <nav aria-label="Mobile">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} aria-current={isActive(pathname, item.href) ? "page" : undefined}>
              <span>{item.n}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <p className="meta">
          <b>Open to select projects</b> · Surat, India
        </p>
      </div>
    </header>
  );
}
