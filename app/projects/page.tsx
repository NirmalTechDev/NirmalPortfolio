import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { projects } from "@/app/component/projects/projects.data";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Projects | Nirmal Ranpariya",
  description:
    "Explore Nirmal Ranpariya's React Native, full-stack web, Firebase, Node.js, and product engineering case studies.",
  path: "/projects",
  image: projects[0]?.gallery[0]?.src,
});

export default function ProjectsPage() {
  return (
    <main>
      <section className="section wrap">
        <p className="muted" style={{ letterSpacing: ".28em", textTransform: "uppercase", fontSize: 12 }}>
          Projects
        </p>
        <h1 style={{ fontSize: "var(--title)", margin: "12px 0" }}>Projects by Nirmal Ranpariya</h1>
        <p className="muted" style={{ maxWidth: 760, fontSize: "var(--lead)" }}>
          Crawlable case studies covering mobile apps, full-stack products, realtime workflows,
          Firebase, Node.js, TypeScript, and product-focused engineering.
        </p>
      </section>

      <section className="section wrap">
        <div className="gallery">
          {projects.map((project) => {
            const thumb = project.gallery[0];
            return (
              <article className="tile" key={project.id}>
                <div className="tile-content">
                  <p className="tech">{project.recruiterSummary.projectType}</p>
                  <h2>{project.title}</h2>
                  <p className="muted">{project.summary}</p>
                  <p className="muted">
                    Role: {project.recruiterSummary.role}. Stack: {project.recruiterSummary.stack}.
                  </p>
                  <Link className="btn primary" href={`/projects/${project.slug}`} style={{ marginTop: 18 }}>
                    Read {project.title} case study
                  </Link>
                </div>
                {thumb && (
                  <div className="relative mx-6 mb-6 h-[190px] overflow-hidden rounded-2xl border border-[hsl(var(--text)/.08)]">
                    <Image
                      src={thumb.src}
                      alt={thumb.alt}
                      fill
                      sizes="(max-width: 768px) 90vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
