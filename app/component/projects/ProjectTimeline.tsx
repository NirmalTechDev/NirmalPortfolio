"use client";

import type { ProjectTimelineEntry } from "./projects.data";

export default function ProjectTimeline({ entries }: { entries: ProjectTimelineEntry[] }) {
    return (
        <section className="rounded-[28px] border border-white/10 bg-white/4 p-6">
            <h3 className="text-2xl font-semibold text-white">Timeline</h3>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
                {entries.map((entry) => (
                    <div
                        key={entry.label}
                        className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/80"
                    >
                        <p className="text-lg font-semibold text-white">{entry.label}</p>
                        <p className="mt-2 text-sm uppercase leading-6 tracking-wide text-white/60">{entry.detail}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
