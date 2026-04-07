"use client";

import { useState } from "react";
import ProjectCard from "./ProjectCard";
import ProjectCaseStudyOverlay from "./ProjectCaseStudyOverlay";
import { projects } from "./projects.data";

export default function ProjectsSection() {
    const [activeProject, setActiveProject] = useState<typeof projects[number] | null>(null);

    return (
        <>
            <section id="projects" className="section wrap">
                <div className="reveal" style={{ textAlign: "center", marginBottom: "var(--gap)" }}>
                    <p className="muted" style={{ letterSpacing: ".28em", textTransform: "uppercase", fontSize: 12 }}>
                        My Products
                    </p>
                    <h2 style={{ fontSize: "var(--subtitle)", marginTop: 12 }}>
                        Product Case Studies
                    </h2>
                    <p className="muted" style={{ maxWidth: 760, margin: "12px auto 0" }}>
                        A mix of mobile and web products focused on real user problems, clean execution, and scalable architecture.
                    </p>
                </div>
                <div className="gallery">
                    {projects.map((project) => (
                        <ProjectCard key={project.id} project={project} onSelect={setActiveProject} />
                    ))}
                </div>
            </section>
            <ProjectCaseStudyOverlay
                project={activeProject}
                isOpen={!!activeProject}
                onClose={() => setActiveProject(null)}
            />
        </>
    );
}
