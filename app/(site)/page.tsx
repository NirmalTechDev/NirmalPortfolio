import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { ServiceLinks } from "@/components/site/Landing";
import { CapabilityMap, Clause, Principles, ProjectIndex } from "@/components/site/parts";
import { getPortfolio, RESUME_HREF } from "@/lib/content/api";
import { visiblePages } from "@/lib/content/services";
import { homeJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "React Native Developer in Surat, India | Nirmal Ranpariya",
  description:
    "Nirmal Ranpariya is a React Native developer in Surat, India, building Android and iOS apps, APIs and releases. Available for freelance and contract work.",
  path: "/",
});

export default async function HomePage() {
  const { site, projects } = await getPortfolio();
  const { identity, home } = site;

  return (
    <>
      <JsonLd data={homeJsonLd()} />

      <section className="hero" data-rail="Introduction">
        <div className="frame">
          <div className="hero__top">
            <p className="meta">
              <b>Software engineer</b> — {identity.shortRole}
            </p>
            <p className="meta">
              {identity.location} · {new Date().getFullYear()}
            </p>
          </div>

          <div className="grid hero__grid">
            <h1 className="display hero__name">
              <span className="mask" style={{ "--i": 0 } as React.CSSProperties}>
                <span>{identity.firstName}</span>
              </span>{" "}
              <span className="mask" style={{ "--i": 1 } as React.CSSProperties}>
                <span>
                  <em>{identity.lastName}</em>
                </span>
              </span>{" "}
              <span className="hero__role">
                {identity.title} · {identity.location}
              </span>
            </h1>
            <div className="hero__portrait">
              <Image
                src={identity.photo.url}
                alt={identity.photo.alt || `Portrait of ${identity.firstName} ${identity.lastName}`}
                width={identity.photo.width || 1000}
                height={identity.photo.height || 1000}
                sizes="(min-width: 60rem) 33vw, 22rem"
                priority
              />
            </div>
            <div className="hero__copy">
              <p className="lead">{home.lead}</p>
              {home.specs.length > 0 && (
                <dl className="specs">
                  {home.specs.map((s) => (
                    <div key={s.label}>
                      <dt>{s.label}</dt>
                      <dd>{s.value}</dd>
                    </div>
                  ))}
                </dl>
              )}
              <div className="hero__actions">
                <Link className="btn" href="/work">
                  Selected work <span aria-hidden="true">↓</span>
                </Link>
                <Link className="tlink" href="/contact">
                  Start a conversation <span className="arr" aria-hidden="true">→</span>
                </Link>
                <a className="tlink" href={RESUME_HREF} target="_blank" rel="noopener noreferrer">
                  Résumé (PDF) <span className="arr" aria-hidden="true">↗</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {projects.length > 0 && (
        <section className="band" data-rail="Selected work" aria-labelledby="work-h">
          <div className="frame">
            <Clause n="01" label="Selected work" />
            <div className="grid" style={{ marginBottom: "var(--s-6)", rowGap: "var(--s-4)" }}>
              <h2 className="h2" id="work-h" style={{ gridColumn: "1 / span 8" }}>
                {home.workHeading}
              </h2>
              {home.workIntro && (
                <p className="lead" style={{ gridColumn: "1 / -1", maxWidth: "34rem" }}>
                  {home.workIntro}
                </p>
              )}
            </div>
            <ProjectIndex items={projects} />
            <p style={{ marginTop: "var(--s-5)" }}>
              <Link className="tlink" href="/work">
                All work <span className="arr" aria-hidden="true">→</span>
              </Link>
            </p>
          </div>
        </section>
      )}

      {site.principles.length > 0 && (
        <section className="band band--ink" data-rail="How I build" aria-labelledby="build-h">
          <div className="frame">
            <Clause n="02" label="How I build" />
            <h2 className="h2" id="build-h" style={{ marginBottom: "var(--s-6)", maxWidth: "14ch" }}>
              {home.buildHeading}
            </h2>
            <Principles principles={site.principles} />
          </div>
        </section>
      )}

      {site.capabilities.length > 0 && (
        <section className="band" data-rail="Capabilities" aria-labelledby="cap-h">
          <div className="frame">
            <Clause n="03" label="Capabilities" />
            <div className="grid" style={{ marginBottom: "var(--s-6)", rowGap: "var(--s-4)" }}>
              <h2 className="h2" id="cap-h" style={{ gridColumn: "1 / span 8" }}>
                {home.capabilitiesHeading}
              </h2>
              {home.capabilitiesIntro && (
                <p className="cap" style={{ gridColumn: "1 / -1", maxWidth: "34rem" }}>
                  {home.capabilitiesIntro}
                </p>
              )}
            </div>
            <CapabilityMap capabilities={site.capabilities} />
          </div>
        </section>
      )}

      {visiblePages(site.services, "service").length > 0 && (
        <section className="band" data-rail="Services" aria-labelledby="svc-h">
          <div className="frame">
            <Clause n="04" label="Services" />
            <div className="grid" style={{ marginBottom: "var(--s-6)", rowGap: "var(--s-4)" }}>
              <h2 className="h2" id="svc-h" style={{ gridColumn: "1 / span 8" }}>
                Hire me to build, fix or ship your app.
              </h2>
              <p className="lead" style={{ gridColumn: "1 / -1", maxWidth: "34rem" }}>
                Freelance and contract React Native work for startups and businesses in Surat, across India and abroad.
              </p>
            </div>
            <ServiceLinks pages={visiblePages(site.services, "service")} />
            <p style={{ marginTop: "var(--s-5)" }}>
              <Link className="tlink" href="/services">
                All services <span className="arr" aria-hidden="true">→</span>
              </Link>
            </p>
          </div>
        </section>
      )}

      <section className="band band--paper2" data-rail="Contact">
        <div className="frame">
          <Clause n="05" label="Contact" />
          <h2 className="h1" style={{ maxWidth: "12ch" }}>
            {home.contactHeading}
          </h2>
          {home.contactLead && (
            <p className="lead" style={{ marginTop: "var(--s-5)" }}>
              {home.contactLead}
            </p>
          )}
          <div className="hero__actions">
            <Link className="btn" href="/contact">
              Start a conversation <span aria-hidden="true">→</span>
            </Link>
            <a className="tlink" href={`mailto:${identity.email}`}>
              {identity.email}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
