"use client";

import type { ProjectRecruiterSummary } from "./projects.data";

export default function RecruiterSummary({ summary }: { summary: ProjectRecruiterSummary }) {
    return (
        <div className="border border-white/10 rounded-2xl bg-white/5 backdrop-blur-xl p-6 shadow-[0_15px_40px_rgba(15,23,42,0.45)]">
            <h3 className="text-xl font-semibold text-white">Recruiter Summary</h3>
            <div className="mt-4 grid gap-2 text-sm text-white/80">
                <p>
                    <strong className="text-white">Project:</strong> {summary.projectType}
                </p>
                <p>
                    <strong className="text-white">Timeline:</strong> {summary.timeline}
                </p>
                <p>
                    <strong className="text-white">Role:</strong> {summary.role}
                </p>
                <p>
                    <strong className="text-white">Stack:</strong> {summary.stack}
                </p>
                <p>
                    <strong className="text-white">Outcome:</strong> {summary.outcome}
                </p>
                <p>
                    <strong className="text-white">Why it matters:</strong> {summary.whyItMatters}
                </p>
            </div>
        </div>
    );
}
