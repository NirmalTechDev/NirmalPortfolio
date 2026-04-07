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

function SectionHeading({
    eyebrow,
    title,
    description,
}: {
    eyebrow: string;
    title: string;
    description?: string;
}) {
    return (
        <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/45">
                {eyebrow}
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-white">{title}</h3>
            {description ? (
                <p className="mt-2 max-w-3xl break-words text-sm leading-6 text-white/58">
                    {description}
                </p>
            ) : null}
        </div>
    );
}

export default function ProjectCaseStudyOverlay({ project, isOpen, onClose }: Props) {
    const containerRef = useRef<HTMLDivElement>(null);
    const gallerySlots = project
        ? Array.from({ length: 6 }, (_, idx) => project.gallery[idx] ?? null)
        : [];
    const challengeOutcomePairs = project
        ? [
              ...project.challenges.map((item) => ({ type: "Challenge", value: item })),
              ...project.outcomes.map((item) => ({ type: "Outcome", value: item })),
          ]
        : [];
    const webLink = project?.links.web ?? project?.links.live;

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
            className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 sm:px-6 sm:py-8"
            role="dialog"
            aria-modal="true"
            aria-labelledby="caseStudyTitle"
        >
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-xl"
                onClick={onClose}
                aria-hidden="true"
            />

            <div
                ref={containerRef}
                tabIndex={-1}
                className="relative z-10 flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-[32px] border border-white/10 bg-[radial-gradient(circle_at_top,_hsla(var(--brand),0.16),_hsla(var(--card),0.98))] shadow-[0_40px_80px_rgba(15,23,42,0.8)]"
            >
                <header className="flex flex-col gap-4 border-b border-white/10 bg-black/55 px-5 py-5 sm:px-6 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                        <p className="text-xs uppercase tracking-[0.3em] text-white/45">
                            Case Study Command Center
                        </p>
                        <h2
                            id="caseStudyTitle"
                            className="mt-2 break-words text-3xl font-bold text-white sm:text-4xl"
                        >
                            {project.title}
                        </h2>
                        <p className="mt-2 max-w-3xl break-words text-base leading-7 text-white/62">
                            {project.tagline}
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        aria-label="Close case study"
                        className="shrink-0 self-start rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-white/60 hover:bg-white/20"
                    >
                        Close
                    </button>
                </header>

                <div className="max-h-[76vh] overflow-y-auto overflow-x-hidden px-5 py-5 sm:px-6 sm:py-6">
                    <div className="space-y-6">
                        <section className="rounded-[28px] border border-white/10 bg-white/4 p-5 sm:p-6">
                            <SectionHeading
                                eyebrow="Overview"
                                title="Project Summary"
                                description="Important context first, with enough width for readable lines."
                            />

                            <p className="mt-5 max-w-4xl break-words text-lg leading-8 text-white/82">
                                {project.summary}
                            </p>

                            <div className="mt-6 grid gap-4 lg:grid-cols-2">
                                <div className="min-w-0 rounded-2xl border border-white/10 bg-black/20 p-5 w-100">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/45">
                                        Problem
                                    </p>
                                    <p className="mt-3 break-words text-base leading-8 text-white/82">
                                        {project.problem}
                                    </p>
                                </div>

                                <div className="min-w-0 rounded-2xl border border-white/10 bg-black/20 p-5 w-100">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/45">
                                        Role
                                    </p>
                                    <p className="mt-3 break-words text-base leading-8 text-white/82">
                                        {project.role}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-4 min-w-0 rounded-2xl border border-white/10 bg-black/20 p-5">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/45">
                                    Process
                                </p>
                                <p className="mt-3 break-words text-base leading-8 text-white/82">
                                    {project.process}
                                </p>
                            </div>

                            <div className="mt-6">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/45">
                                    Tech Stack
                                </p>
                                <div className="mt-4 flex flex-wrap gap-3">
                                    {project.stack.map((tech) => (
                                        <span
                                            key={tech}
                                            className="rounded-full border border-white/15 bg-white/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/72"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </section>

                        <RecruiterSummary summary={project.recruiterSummary} />

                        <section className="grid gap-6 lg:grid-cols-2">
                            <div className="min-w-0 rounded-[28px] border border-white/10 bg-white/4 p-5 text-white sm:p-6 w-100">
                                <SectionHeading
                                    eyebrow="Highlights"
                                    title="Features"
                                    description="Key product capabilities shown as readable content cards."
                                />

                                <div className="mt-5 space-y-4">
                                    {project.features.map((feature) => (
                                        <div
                                            key={`feature-${feature}`}
                                            className="min-w-0 rounded-2xl border border-white/10 bg-black/20 px-5 py-4"
                                        >
                                            <p className="break-words text-base leading-8 text-white/82">
                                                {feature}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="min-w-0 rounded-[28px] border border-white/10 bg-white/4 p-5 text-white sm:p-6 w-100">
                                <SectionHeading
                                    eyebrow="Delivery"
                                    title="Challenges And Outcomes"
                                    description="Trade-offs and measurable results grouped in one place."
                                />

                                <div className="mt-5 space-y-4">
                                    {challengeOutcomePairs.map((item) => (
                                        <div
                                            key={`${item.type}-${item.value}`}
                                            className="min-w-0 rounded-2xl border border-white/10 bg-black/20 px-5 py-4"
                                        >
                                            <p
                                                className={`text-[11px] font-semibold uppercase tracking-[0.24em] ${
                                                    item.type === "Outcome"
                                                        ? "text-cyan-300/80"
                                                        : "text-amber-200/70"
                                                }`}
                                            >
                                                {item.type}
                                            </p>
                                            <p className="mt-2 break-words text-base leading-8 text-white/82">
                                                {item.value}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        <ProjectTimeline entries={project.timeline} />

                        <section className="rounded-[28px] border border-white/10 bg-white/4 p-5 sm:p-6">
                            <SectionHeading
                                eyebrow="Gallery"
                                title="Project Visuals"
                                description="Images stay responsive and never push the layout sideways."
                            />

                            <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                                {gallerySlots.map((shot, idx) => (
                                    <div
                                        key={`gallery-${project.id}-${idx}`}
                                        className="overflow-hidden rounded-2xl border border-white/10 bg-black/20 w-39 h-50"
                                    >
                                        <div className="relative aspect-[4/3] w-full h-full">
                                            {shot ? (
                                                <Image
                                                    src={shot.src}
                                                    alt={shot.alt}
                                                    fill
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                                                    className="object-fit"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center px-4 text-center text-xs uppercase tracking-[0.28em] text-white/45">
                                                    Awaiting visual
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
                            <div className="min-w-0 rounded-[28px] border border-white/10 bg-white/4 p-5 sm:p-6 w-100">
                                <SectionHeading
                                    eyebrow="Notes"
                                    title="Process Notes"
                                    description="Additional implementation context in a proper readable block."
                                />
                                <p className="mt-5 break-words text-base leading-8 text-white/82">
                                    {project.process}
                                </p>
                            </div>

                            <div className="min-w-0 rounded-[28px] border border-white/10 bg-white/4 p-5 sm:p-6 w-100">
                                <SectionHeading
                                    eyebrow="Retrospective"
                                    title="What I Learned"
                                    description="Lessons are listed as individual cards so they stay readable."
                                />
                                <div className="mt-5 space-y-4">
                                    {project.lessons.map((lesson) => (
                                        <div
                                            key={`lesson-${lesson}`}
                                            className="min-w-0 rounded-2xl border border-white/10 bg-black/20 px-5 py-4"
                                        >
                                            <p className="break-words text-base leading-8 text-white/82">
                                                {lesson}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        <section className="rounded-[28px] border border-white/10 bg-white/4 p-5 sm:p-6">
                            <SectionHeading
                                eyebrow="Links"
                                title="Project Links"
                                description="External links are grouped at the end for a cleaner reading flow."
                            />

                            <div className="mt-5 flex flex-wrap gap-3">
                                {webLink ? (
                                    <a
                                        href={webLink}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="rounded-full border border-white/20 bg-gradient-to-r from-cyan-500 to-blue-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/40 transition hover:scale-[1.01]"
                                    >
                                        Live Website
                                    </a>
                                ) : null}

                                {project.links.playStore ? (
                                    <a
                                        href={project.links.playStore}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/60"
                                    >
                                        Play Store
                                    </a>
                                ) : null}

                                {project.links.appStore ? (
                                    <a
                                        href={project.links.appStore}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/60"
                                    >
                                        App Store
                                    </a>
                                ) : null}

                                {project.links.github ? (
                                    <a
                                        href={project.links.github}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/60"
                                    >
                                        View GitHub
                                    </a>
                                ) : null}

                                {project.links.caseStudy ? (
                                    <a
                                        href={project.links.caseStudy}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/60"
                                    >
                                        Download Case Study
                                    </a>
                                ) : null}
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
