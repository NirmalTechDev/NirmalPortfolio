"use client";

import type { ProjectRecruiterSummary } from "./projects.data";

export default function RecruiterSummary({ summary }: { summary: ProjectRecruiterSummary }) {
    const items = [
        { label: "Project", value: summary.projectType },
        { label: "Timeline", value: summary.timeline },
        { label: "Role", value: summary.role },
        { label: "Stack", value: summary.stack },
        { label: "Outcome", value: summary.outcome },
        { label: "Why it matters", value: summary.whyItMatters },
    ];

    return (
        <section className="min-w-0 rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/45">
                        Snapshot
                    </p>
                    <h3 className="mt-2 text-2xl font-semibold text-white">Recruiter Summary</h3>
                </div>
                <p className="max-w-2xl text-sm leading-6 text-white/55">
                    Quick-read information with balanced spacing and full-width wrapping.
                </p>
            </div>

            <div className="mt-5 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-2 md:overflow-visible md:pb-0">
                {items.map((item) => (
                    <div
                        key={item.label}
                        className="w-[min(24rem,85vw)] shrink-0 snap-start rounded-2xl border border-white/10 bg-black/20 p-5 md:min-w-0 md:w-auto md:shrink"
                    >
                        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/45">
                            {item.label}
                        </p>
                        <p className="mt-3 break-words text-base leading-7 text-white/82">
                            {item.value}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}
