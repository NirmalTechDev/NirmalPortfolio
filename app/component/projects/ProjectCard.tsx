"use client";

import Image from "next/image";
import Link from "next/link";
import type { ProjectCaseStudy } from "./projects.data";

interface Props {
    project: ProjectCaseStudy;
    onSelect: (project: ProjectCaseStudy) => void;
}

export default function ProjectCard({ project, onSelect }: Props) {
    const thumb = project.gallery[0];

    return (
        <article className="tile reveal group flex flex-col items-start justify-between">
            <div className="shine" aria-hidden="true"></div>
            <div className="tile-content flex flex-col gap-3 text-left">
                <div>
                    <p className="text-sm uppercase tracking-[0.4em] text-[hsl(var(--muted))]">Project</p>
                    <h3 className="pb-3 text-2xl font-bold text-[hsl(var(--text))]">{project.title}</h3>
                </div>
                <p className="tech">{project.tagline}</p>
                <p className="role" style={{ maxHeight: "5rem", overflow: "hidden" }}>
                    {project.summary}
                </p>
            </div>
            {thumb && (
                <div className="relative mx-6 mt-4 h-[180px] w-[calc(100%-3rem)] overflow-hidden rounded-2xl border border-[hsl(var(--text)/.08)]">
                    <Image
                        src={thumb.src}
                        alt={thumb.alt}
                        fill
                        sizes="(max-width: 768px) 80vw, 40vw"
                        className="object-cover transition duration-500 group-hover:scale-105"
                    />
                </div>
            )}
            <div className="flex flex-wrap gap-3 px-7 pb-6 pt-4">
                <Link
                    href={`/projects/${project.slug}`}
                    className="text-xs uppercase tracking-[0.35em] text-[hsl(var(--text))] underline underline-offset-4"
                >
                    Read case study
                </Link>
                <button
                    type="button"
                    onClick={() => onSelect(project)}
                    className="text-xs uppercase tracking-[0.35em] text-[hsl(var(--muted))] underline underline-offset-4"
                >
                    Quick preview
                </button>
            </div>
        </article>
    );
}
