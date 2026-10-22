import Link from "next/link";
import { landingPath, visiblePages } from "@/lib/content/services";
import type { Faq, LandingPage, Project, ServicesContent } from "@/lib/content/types";
import { Clause, NumberedList, PageHead, ProjectIndex } from "./parts";

/** Accessible FAQ list (native details/summary; also mirrored as FAQPage structured data). */
export function FaqList({ faqs }: { faqs: Faq[] }) {
  return (
    <div className="faq">
      {faqs.map((f) => (
        <details key={f.q} className="faq__item">
          <summary>
            <h3 className="faq__q">{f.q}</h3>
            <span className="faq__icon" aria-hidden="true" />
          </summary>
          <p className="faq__a">{f.a}</p>
        </details>
      ))}
    </div>
  );
}

/** Cards linking to the service / location pages (internal links matter for search). */
export function ServiceLinks({ pages, exclude }: { pages: LandingPage[]; exclude?: string }) {
  const list = pages.filter((p) => p.slug !== exclude);
  if (!list.length) return null;
  return (
    <ul className="svc-cards">
      {list.map((p) => (
        <li key={p.slug}>
          <Link href={landingPath(p)} className="svc-card">
            <span className="svc-card__title">{p.navLabel}</span>
            <span className="svc-card__text">{p.summary}</span>
            <span className="svc-card__more">
              Read more <span className="arr" aria-hidden="true">→</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function HireCta({ heading = "Tell me about your app.", text }: { heading?: string; text?: string }) {
  return (
    <section className="band band--ink" data-rail="Start">
      <div className="frame">
        <h2 className="h1" style={{ maxWidth: "14ch" }}>
          {heading}
        </h2>
        <p className="lead" style={{ marginTop: "var(--s-5)", maxWidth: "34rem" }}>
          {text || "What you're building, who it's for, and where it hurts today. I read every message and reply by email."}
        </p>
        <p className="hero__actions" style={{ marginTop: "var(--s-6)" }}>
          <Link className="btn" href="/contact">
            Start a conversation <span aria-hidden="true">→</span>
          </Link>
          <Link className="tlink" href="/work">
            See the work <span className="arr" aria-hidden="true">→</span>
          </Link>
        </p>
      </div>
    </section>
  );
}

/** A service or location page. */
export function LandingView({ page, services, projects }: { page: LandingPage; services: ServicesContent; projects: Project[] }) {
  const proof = page.projects.map((slug) => projects.find((p) => p.slug === slug)).filter((p): p is Project => !!p);
  const others = visiblePages(services);
  let n = 1;
  const next = () => String(++n).padStart(2, "0");
  return (
    <>
      <PageHead n="01" label={page.kind === "location" ? "Hire" : "Service"} title={page.heading}>
        <p className="lead" style={{ maxWidth: "40rem" }}>
          {page.intro}
        </p>
        <p className="hero__actions" style={{ marginTop: "var(--s-5)" }}>
          <Link className="btn" href="/contact">
            Start a conversation <span aria-hidden="true">→</span>
          </Link>
          <Link className="tlink" href="/services">
            All services <span className="arr" aria-hidden="true">→</span>
          </Link>
        </p>
      </PageHead>

      {page.includes.length > 0 && (
        <section className="band" data-rail="What you get" aria-labelledby="inc-h">
          <div className="frame">
            <Clause n={next()} label="What you get" />
            <h2 className="h2" id="inc-h" style={{ marginBottom: "var(--s-6)" }}>
              What&apos;s included
            </h2>
            <NumberedList items={page.includes} />
          </div>
        </section>
      )}

      {page.sections.length > 0 && (
        <section className="band--tight frame" data-rail="Details">
          {page.sections.map((sec) => (
            <div className="grid pair" key={sec.heading}>
              <div className="pair__l">
                <h2 className="meta">
                  <b>{sec.heading}</b>
                </h2>
              </div>
              <div className="pair__r prose">
                {sec.body.split(/\n{2,}/).map((t, i) => (
                  <p key={i}>{t}</p>
                ))}
              </div>
            </div>
          ))}
        </section>
      )}

      {proof.length > 0 && (
        <section className="band" data-rail="Proof" aria-labelledby="proof-h">
          <div className="frame">
            <Clause n={next()} label="Proof" />
            <h2 className="h2" id="proof-h" style={{ marginBottom: "var(--s-6)" }}>
              Related work
            </h2>
            <ProjectIndex items={proof} />
          </div>
        </section>
      )}

      {page.faqs.length > 0 && (
        <section className="band band--paper2" data-rail="Questions" aria-labelledby="faq-h">
          <div className="frame">
            <Clause n={next()} label="Questions" />
            <h2 className="h2" id="faq-h" style={{ marginBottom: "var(--s-6)" }}>
              Common questions
            </h2>
            <FaqList faqs={page.faqs} />
          </div>
        </section>
      )}

      {others.length > 1 && (
        <section className="band" data-rail="More" aria-labelledby="more-h">
          <div className="frame">
            <Clause n={next()} label="More" />
            <h2 className="h2" id="more-h" style={{ marginBottom: "var(--s-6)" }}>
              Other ways I can help
            </h2>
            <ServiceLinks pages={others} exclude={page.slug} />
          </div>
        </section>
      )}

      <HireCta />
    </>
  );
}
