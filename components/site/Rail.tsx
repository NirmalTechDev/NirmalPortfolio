"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * The margin rail: a fixed annotation in the left margin that names the
 * clause currently in view and draws page progress. Sections opt in with
 * a `data-rail="Label"` attribute. Desktop only (CSS hides it elsewhere).
 */
export function Rail() {
  const pathname = usePathname();
  const [label, setLabel] = useState("");
  const [index, setIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-rail]"));
    setLabel(sections[0]?.dataset.rail ?? "");
    setIndex(0);
    if (!sections.length || !window.matchMedia("(min-width: 80rem)").matches) return;

    const visible = new Map<Element, number>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? visible.set(e.target, e.intersectionRatio) : visible.delete(e.target)));
        const first = sections.find((s) => visible.has(s));
        if (first) {
          setLabel(first.dataset.rail ?? "");
          setIndex(sections.indexOf(first));
        }
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: [0, 1] },
    );
    sections.forEach((s) => io.observe(s));

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        trackRef.current?.style.setProperty("--p", String(max > 0 ? Math.min(1, window.scrollY / max) : 0));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, [pathname]);

  return (
    <div className="rail" aria-hidden="true">
      <span className="meta rail__label">
        <b>§ {String(index + 1).padStart(2, "0")}</b> — {label}
      </span>
      <div className="rail__track" ref={trackRef} />
    </div>
  );
}
