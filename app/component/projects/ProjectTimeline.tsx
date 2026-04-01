"use client";

import type { ProjectTimelineEntry } from "./projects.data";

export default function ProjectTimeline({ entries }: { entries: ProjectTimelineEntry[] }) {
    return (
        <div className="mt-4">
            <h3 className="text-lg font-semibold text-white">Timeline</h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
                {entries.map((entry) => (
                    <div
                        key={entry.label}
                        className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white/80 w-50"
                    >
                        <p className="text-white font-semibold">{entry.label}</p>
                        <p className="text-xs uppercase tracking-wide text-white/60">{entry.detail}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
