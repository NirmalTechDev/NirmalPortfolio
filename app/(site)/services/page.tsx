import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { FaqList, HireCta, ServiceLinks } from "@/components/site/Landing";
import { Clause, PageHead, ProjectIndex } from "@/components/site/parts";
import { getPortfolio } from "@/lib/content/api";
import { landingPath, visiblePages } from "@/lib/content/services";
import { faqJsonLd, pageJsonLd, pageMetadata, personJsonLd, professionalServiceJsonLd } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const { site } = await getPortfolio();
  return pageMetadata({ title: site.services.metaTitle, description: site.services.metaDescription, path: "/services" });
}

export default async function ServicesPage() {
  const { site, projects } = await getPortfolio();
  const s = site.services;
  const services = visiblePages(s, "service");
  const locations = visiblePages(s, "location");
  const base = pageJsonLd({ path: "/services", name: s.metaTitle, description: s.metaDescription, crumbs: [{ name: "Services", path: "/services" }] });

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            ...(base["@graph"] as Record<string, unknown>[]),
            professionalServiceJsonLd(services.map((p) => ({ name: p.heading, path: landingPath(p), description: p.metaDescription }))),
            personJsonLd(),
            ...(s.faqs.length ? [faqJsonLd("/services", s.faqs)] : []),
          ],
        }}
      />

      <PageHead n="01" label="Services" title={s.heading}>
        <p className="lead" style={{ maxWidth: "40rem" }}>
          {s.intro}
        </p>
        <p className="hero__actions" style={{ marginTop: "var(--s-5)" }}>
          <Link className="btn" href="/contact">
            Start a conversation <span aria-hidden="true">→</span>
          </Link>
          <Link className="tlink" href="/work">
            See the work <span className="arr" aria-hidden="true">→</span>
          </Link>
        </p>
      </PageHead>

      {services.length > 0 && (
        <section className="band" data-rail="What I do" aria-labelledby="svc-h">
          <div className="frame">
            <Clause n="02" label="What I do" />
            <h2 className="h2" id="svc-h" style={{ marginBottom: "var(--s-6)" }}>
              What I can build or fix for you
            </h2>
            <ServiceLinks pages={services} />
          </div>
        </section>
      )}

      {s.engagement.length > 0 && (
        <section className="band--tight frame" data-rail="How we work">
          <Clause n="03" label="Ways to work together" />
          {s.engagement.map((e) => (
            <div className="grid pair" key={e.label}>
              <div className="pair__l">
                <h2 className="meta">
                  <b>{e.label}</b>
                </h2>
              </div>
              <div className="pair__r prose">
                <p>{e.value}</p>
              </div>
            </div>
          ))}
        </section>
      )}

      {s.process.length > 0 && (
        <section className="band band--paper2" data-rail="Process" aria-labelledby="proc-h">
          <div className="frame">
            <Clause n="04" label="Process" />
            <h2 className="h2" id="proc-h" style={{ marginBottom: "var(--s-6)" }}>
              From first message to release
            </h2>
            <ol className="principles">
              {s.process.map((p, i) => (
                <li className="principle" key={p.title}>
                  <span className="principle__n" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3>{p.title}</h3>
                  <p>{p.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {projects.length > 0 && (
        <section className="band" data-rail="Proof" aria-labelledby="proof-h">
          <div className="frame">
            <Clause n="05" label="Proof" />
            <h2 className="h2" id="proof-h" style={{ marginBottom: "var(--s-6)" }}>
              Apps I&apos;ve built
            </h2>
            <ProjectIndex items={projects} />
          </div>
        </section>
      )}

      {s.faqs.length > 0 && (
        <section className="band band--paper2" data-rail="Questions" aria-labelledby="faq-h">
          <div className="frame">
            <Clause n="06" label="Questions" />
            <h2 className="h2" id="faq-h" style={{ marginBottom: "var(--s-6)" }}>
              Common questions
            </h2>
            <FaqList faqs={s.faqs} />
          </div>
        </section>
      )}

      {locations.length > 0 && (
        <section className="band" data-rail="Where" aria-labelledby="loc-h">
          <div className="frame">
            <Clause n="07" label="Where I work" />
            <h2 className="h2" id="loc-h" style={{ marginBottom: "var(--s-6)" }}>
              In Surat, across India, and remote
            </h2>
            <ServiceLinks pages={locations} />
          </div>
        </section>
      )}

      <HireCta />
    </>
  );
}
