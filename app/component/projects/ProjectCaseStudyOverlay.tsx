"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import RecruiterSummary from "./RecruiterSummary";
import ProjectTimeline from "./ProjectTimeline";
import type { ProjectCaseStudy } from "./projects.data";

interface Props {
    project: ProjectCaseStudy | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function ProjectCaseStudyOverlay({ project, isOpen, onClose }: Props) {
    const containerRef = useRef<HTMLDivElement>(null);
    const gallerySlots = project
        ? Array.from({ length: 6 }, (_, idx) => project.gallery[idx] ?? null)
        : [];

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
            containerRef.current?.focus();
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    useEffect(() => {
        const handleKey = (event: KeyboardEvent) => {
            if (event.key === "Escape" && isOpen) {
                event.preventDefault();
                onClose();
            }
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [isOpen, onClose]);

    if (!project || !isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8"
            role="dialog"
            aria-modal="true"
            aria-labelledby="caseStudyTitle"
        >
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-xl transition-opacity"
                onClick={onClose}
                aria-hidden="true"
            />
            <div
                ref={containerRef}
                tabIndex={-1}
                className="relative z-10 mx-auto w-full max-w-5xl max-h-[92vh] overflow-hidden rounded-[32px] border border-white/10 bg-[radial-gradient(circle_at_top,_hsla(var(--brand),0.35),_hsla(var(--card),0.95))] shadow-[0_40px_80px_rgba(15,23,42,0.8)]"
            >
                <div className="flex w-full items-center justify-between border-b border-white/10 bg-black/60 px-6 py-4">
                    <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-white/50">Case Study Command Center</p>
                        <h2 id="caseStudyTitle" className="text-3xl font-bold text-white">
                            {project.title}
                        </h2>
                        <p className="text-sm text-white/60">{project.tagline}</p>
                    </div>
                    <button
                        onClick={onClose}
                        aria-label="Close case study"
                        className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/60 hover:bg-white/20"
                    >
                        Close
                    </button>
                </div>
                <div className="px-6 py-6 overflow-y-auto max-h-[75vh] space-y-6 pr-4">
                    <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
                        <div className="space-y-5 text-white">
                            <p className="text-white/80">{project.summary}</p>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <p className="text-sm font-semibold uppercase tracking-wide text-white/60">Problem</p>
                                    <p>{project.problem}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold uppercase tracking-wide text-white/60">Role & Process</p>
                                    <p>{project.role}</p>
                                    <p className="text-white/70 mt-1">{project.process}</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm font-semibold uppercase tracking-wide text-white/60">Tech Stack</p>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {project.stack.map((tech) => (
                                        <span
                                            key={tech}
                                            className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/70"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="lg:sticky top-6">
                            <RecruiterSummary summary={project.recruiterSummary} />
                        </div>
                    </div>
                    <div className="grid gap-6 lg:grid-cols-2">
                        <div className="space-y-3 text-white">
                            <p className="text-sm font-semibold uppercase tracking-wide text-white/60">Features & Highlights</p>
                            <ul className="list-disc space-y-2 pl-4 text-white/80">
                                {project.features.map((feature) => (
                                    <li key={`feature-${feature}`}>{feature}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="space-y-3 text-white">
                            <p className="text-sm font-semibold uppercase tracking-wide text-white/60">Challenges & Outcomes</p>
                            <div className="space-y-2 text-white/80">
                                {project.challenges.map((challenge) => (
                                    <p key={`challenge-${challenge}`}>Challenge: {challenge}</p>
                                ))}
                                {project.outcomes.map((outcome) => (
                                    <p key={`outcome-${outcome}`} className="text-white">
                                        Outcome: {outcome}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </div>
                    <ProjectTimeline entries={project.timeline} />
                    <div className="mt-6 grid gap-6 lg:grid-cols-2">
                        <div className="space-y-3">
                            <p className="text-sm font-semibold uppercase tracking-wide text-white/60">Image Gallery</p>
                            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                                {gallerySlots.map((shot, idx) => (
                                    <div
                                        key={`gallery-${project.id}-${idx}`}
                                        className="overflow-hidden rounded-2xl border border-white/10 bg-white/5"
                                    >
                                        <div className="relative aspect-[4/3] h-full w-full">
                                            {shot ? (
                                                <Image
                                                    src={shot.src}
                                                    alt={shot.alt}
                                                    fill
                                                    sizes="(max-width: 768px) 33vw, 25vw"
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center px-3 text-center text-xs uppercase tracking-[0.3em] text-white/50">
                                                    Awaiting visual
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm font-semibold uppercase tracking-wide text-white/60">Process Notes</p>
                                <p className="text-white/80">{project.process}</p>
                            </div>
                            <div>
                                <p className="text-sm font-semibold uppercase tracking-wide text-white/60">What I learned</p>
                                <ul className="list-disc space-y-2 pl-4 text-white/80">
                                    {project.lessons.map((lesson) => (
                                        <li key={`lesson-${lesson}`}>{lesson}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {project.links.live && (
                                    <a
                                        href={project.links.live}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="rounded-full border border-white/20 bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-cyan-500/40 transition hover:scale-[1.01]"
                                    >
                                        View Live
                                    </a>
                                )}
                                {project.links.github && (
                                    <a
                                        href={project.links.github}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/60"
                                    >
                                        View GitHub
                                    </a>
                                )}
                                {project.links.caseStudy && (
                                    <a
                                        href={project.links.caseStudy}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/60"
                                    >
                                        Download Case Study
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
