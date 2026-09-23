import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects } from "@/app/component/projects/projects.data";
import { JsonLd } from "@/app/components/JsonLd";
import { absoluteUrl, pageMetadata, PERSON_ID } from "@/lib/seo";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

function findProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = findProject(slug);

  if (!project) {
    return {};
  }

  return pageMetadata({
    title: `${project.title} | Nirmal Ranpariya`,
    description: project.summary,
    path: `/projects/${project.slug}`,
    image: project.gallery[0]?.src,
  });
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = findProject(slug);

  if (!project) {
    notFound();
  }

  const projectJsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${absoluteUrl(`/projects/${project.slug}`)}#project`,
    name: project.title,
    headline: project.tagline,
    description: project.summary,
    url: absoluteUrl(`/projects/${project.slug}`),
    image: project.gallery.map((item) => absoluteUrl(item.src)),
    creator: {
      "@id": PERSON_ID,
    },
    about: project.stack,
  };

  return (
    <main>
      <JsonLd data={projectJsonLd} />
      <section className="section wrap hero">
        <div className="hero-content reveal in">
          <p className="muted" style={{ letterSpacing: ".28em", textTransform: "uppercase", fontSize: 12 }}>
            Project Case Study
          </p>
          <h1>{project.title}</h1>
          <p className="muted">{project.tagline}</p>
          <div className="cta">
            <Link className="btn" href="/projects">
              Back to Projects
            </Link>
            <Link className="btn" href="/about">
              About Nirmal Ranpariya
            </Link>
            <Link className="btn primary" href="/contact">
              Contact
            </Link>
          </div>
        </div>
        {project.gallery[0] && (
          <div className="hero-image reveal in">
            <Image
              src={project.gallery[0].src}
              alt={project.gallery[0].alt}
              width={640}
              height={480}
              priority
              style={{ borderRadius: "var(--radius)", aspectRatio: "4 / 3" }}
            />
          </div>
        )}
      </section>

      <section className="section wrap">
        <div className="home-grid">
          <article className="home-card">
            <h2>Summary</h2>
            <p>{project.summary}</p>
          </article>
          <article className="home-card">
            <h2>Problem</h2>
            <p>{project.problem}</p>
          </article>
          <article className="home-card">
            <h2>Nirmal&apos;s Role</h2>
            <p>{project.role}</p>
          </article>
        </div>
      </section>

      <section className="section wrap">
        <div className="home-grid">
          <article className="home-card" style={{ gridColumn: "span 6" }}>
            <h2>Responsibilities</h2>
            <p>{project.process}</p>
            <h3 style={{ marginTop: 20 }}>Notable Engineering Work</h3>
            <ul className="muted">
              {project.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </article>
          <article className="home-card" style={{ gridColumn: "span 6" }}>
            <h2>Technology Stack</h2>
            <div className="cta" style={{ marginBottom: 20 }}>
              {project.stack.map((item) => (
                <span className="btn" key={item}>
                  {item}
                </span>
              ))}
            </div>
            <h3>Platform</h3>
            <p className="muted">{project.recruiterSummary.projectType}</p>
          </article>
        </div>
      </section>

      <section className="section wrap">
        <h2 style={{ fontSize: "var(--subtitle)", marginBottom: "var(--gap)" }}>Screenshots</h2>
        <div className="gallery">
          {project.gallery.map((item) => (
            <div className="tile" key={item.src}>
              <div className="relative h-[280px] w-full">
                <Image src={item.src} alt={item.alt} fill sizes="(max-width: 768px) 90vw, 33vw" className="object-cover" />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section wrap">
        <div className="home-grid">
          <article className="home-card">
            <h2>Challenges</h2>
            <ul className="muted">
              {project.challenges.map((challenge) => (
                <li key={challenge}>{challenge}</li>
              ))}
            </ul>
          </article>
          <article className="home-card">
            <h2>Outcomes</h2>
            <ul className="muted">
              {project.outcomes.map((outcome) => (
                <li key={outcome}>{outcome}</li>
              ))}
            </ul>
          </article>
          <article className="home-card">
            <h2>Links</h2>
            <div className="cta">
              {project.links.web && (
                <a className="btn primary" href={project.links.web} target="_blank" rel="noreferrer">
                  Website
                </a>
              )}
              {project.links.playStore && (
                <a className="btn" href={project.links.playStore} target="_blank" rel="noreferrer">
                  Play Store
                </a>
              )}
              {project.links.appStore && (
                <a className="btn" href={project.links.appStore} target="_blank" rel="noreferrer">
                  App Store
                </a>
              )}
              {project.links.github && (
                <a className="btn" href={project.links.github} target="_blank" rel="noreferrer">
                  GitHub
                </a>
              )}
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
