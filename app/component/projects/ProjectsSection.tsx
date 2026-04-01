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
                <h2
                    className="reveal"
                    style={{ textAlign: "center", fontSize: "var(--subtitle)", marginBottom: "var(--gap)" }}
                >
                    Selected Projects
                </h2>
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
