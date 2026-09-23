import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { CapabilityMap, Clause, Principles, ProjectIndex } from "@/components/site/parts";
import { email, RESUME_HREF } from "@/content/profile";
import { projects } from "@/content/projects";
import { homeJsonLd, pageMetadata, PROFILE_IMAGE } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Nirmal Ranpariya | React Native Developer & Software Engineer",
  description:
    "Nirmal Ranpariya is a software engineer in Surat, India, building React Native mobile products and the APIs, notifications and release pipelines behind them.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <JsonLd data={homeJsonLd()} />

      <section className="hero" data-rail="Introduction">
        <div className="frame">
          <div className="hero__top">
            <p className="meta">
              <b>Software engineer</b> — React Native
            </p>
            <p className="meta">Surat, India · {new Date().getFullYear()}</p>
          </div>

          <div className="grid">
            <h1 className="display hero__name">
              <span className="mask" style={{ "--i": 0 } as React.CSSProperties}>
                <span>Nirmal</span>
              </span>
              <span className="mask" style={{ "--i": 1 } as React.CSSProperties}>
                <span>
                  <em>Ranpariya</em>
                </span>
              </span>
            </h1>
          </div>

          <div className="grid hero__body">
            <div className="hero__portrait">
              <Image
                src={PROFILE_IMAGE}
                alt="Portrait of Nirmal Ranpariya"
                width={640}
                height={640}
                sizes="(min-width: 60rem) 33vw, 22rem"
                priority
              />
            </div>
            <div className="hero__copy">
              <p className="lead">
                I build mobile products, and the systems behind the screen: the APIs, notifications, native modules and
                release pipeline that get a change to real people.
              </p>
              <dl className="specs">
                <div>
                  <dt>Now</dt>
                  <dd>React Native developer at Ofniinfo Software Solutions, Surat</dd>
                </div>
                <div>
                  <dt>Shipped</dt>
                  <dd>OpiGo and by.U, both on Google Play and the App Store</dd>
                </div>
                <div>
                  <dt>Works in</dt>
                  <dd>React Native · TypeScript · Node.js · Firebase</dd>
                </div>
              </dl>
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

      <section className="band" data-rail="Selected work" aria-labelledby="work-h">
        <div className="frame">
          <Clause n="01" label="Selected work" />
          <div className="grid" style={{ marginBottom: "var(--s-6)", rowGap: "var(--s-4)" }}>
            <h2 className="h2" id="work-h" style={{ gridColumn: "1 / span 8" }}>
              Two apps in the stores, one product I built alone.
            </h2>
            <p className="lead" style={{ gridColumn: "1 / -1", maxWidth: "34rem" }}>
              Each entry is a case study: what the product does, what I built, and how it reaches users.
            </p>
          </div>
          <ProjectIndex items={projects} />
          <p style={{ marginTop: "var(--s-5)" }}>
            <Link className="tlink" href="/work">
              All work <span className="arr" aria-hidden="true">→</span>
            </Link>
          </p>
        </div>
      </section>

      <section className="band band--ink" data-rail="How I build" aria-labelledby="build-h">
        <div className="frame">
          <Clause n="02" label="How I build" />
          <h2 className="h2" id="build-h" style={{ marginBottom: "var(--s-6)", maxWidth: "14ch" }}>
            Six habits I work by.
          </h2>
          <Principles />
        </div>
      </section>

      <section className="band" data-rail="Capabilities" aria-labelledby="cap-h">
        <div className="frame">
          <Clause n="03" label="Capabilities" />
          <div className="grid" style={{ marginBottom: "var(--s-6)", rowGap: "var(--s-4)" }}>
            <h2 className="h2" id="cap-h" style={{ gridColumn: "1 / span 8" }}>
              What I work with, by where it sits in a product.
            </h2>
            <p className="cap" style={{ gridColumn: "1 / -1", maxWidth: "34rem" }}>
              Where my depth is limited, the entry says so. There are no scores.
            </p>
          </div>
          <CapabilityMap />
        </div>
      </section>

      <section className="band band--paper2" data-rail="Contact">
        <div className="frame">
          <Clause n="04" label="Contact" />
          <h2 className="h1" style={{ maxWidth: "12ch" }}>
            Have a product problem?
          </h2>
          <p className="lead" style={{ marginTop: "var(--s-5)" }}>
            Let&apos;s talk about the system, not just the screen.
          </p>
          <div className="hero__actions">
            <Link className="btn" href="/contact">
              Start a conversation <span aria-hidden="true">→</span>
            </Link>
            <a className="tlink" href={`mailto:${email}`}>
              {email}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
