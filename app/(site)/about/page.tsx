import type { Metadata } from "next";
import Image from "next/image";
import { JsonLd } from "@/components/JsonLd";
import { Clause } from "@/components/site/parts";
import { getPortfolio, RESUME_HREF } from "@/lib/content/api";
import { pageMetadata, profilePageJsonLd } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "About Nirmal Ranpariya | React Native Developer",
  description:
    "About Nirmal Ranpariya, a React Native developer from Gujarat, India: how he works, what he studied, what he builds and what he is exploring now.",
  path: "/about",
});

export default async function AboutPage() {
  const { site } = await getPortfolio();
  const { about, identity } = site;

  return (
    <>
      <JsonLd data={profilePageJsonLd()} />

      <section className="frame" style={{ paddingTop: "calc(var(--header-h) + var(--s-6))" }} data-rail="About">
        <Clause n="02" label="About" />
        <div className="grid" style={{ rowGap: "var(--s-6)" }}>
          <div style={{ gridColumn: "1 / -1" }} className="about-head">
            <h1 className="h1">
              {about.heading}
              {about.headingEmphasis && (
                <>
                  {" "}
                  <em>{about.headingEmphasis}</em>
                </>
              )}
            </h1>
          </div>
          <div style={{ gridColumn: "1 / -1" }} className="about-body">
            <div className="grid" style={{ rowGap: "var(--s-6)" }}>
              <div className="about-portrait ab-p rv-img">
                <Image
                  src={identity.photo.url}
                  alt={identity.photo.alt || `Portrait of ${identity.firstName} ${identity.lastName}`}
                  width={identity.photo.width || 1000}
                  height={identity.photo.height || 1000}
                  sizes="26rem"
                />
              </div>
              <div className="prose ab-t">
                {about.lead && <p className="lead">{about.lead}</p>}
                {about.paragraphs.map((t, i) => (
                  <p key={i}>{t}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {about.pairs.length > 0 && (
        <section className="band--tight frame" data-rail="What I enjoy">
          {about.pairs.map((pair) => (
            <div className="grid pair" key={pair.label}>
              <div className="pair__l">
                <h2 className="meta">
                  <b>{pair.label}</b>
                </h2>
              </div>
              <div className="pair__r prose">
                <p>{pair.body}</p>
              </div>
            </div>
          ))}
        </section>
      )}

      {about.journey.length > 0 && (
        <section className="band band--paper2" data-rail="Journey" aria-labelledby="journey-h">
          <div className="frame">
            <Clause n="03" label="Journey" />
            <h2 className="h2" id="journey-h" style={{ marginBottom: "var(--s-6)" }}>
              An engineering log.
            </h2>
            <ol className="log">
              {about.journey.map((j) => (
                <li className="log__item rv" key={`${j.year}-${j.label}`}>
                  <p className="log__year">{j.year}</p>
                  <p className="log__label">{j.label}</p>
                  <p className="log__text">{j.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      <section className="band" data-rail="Background">
        <div className="frame">
          <Clause n="04" label="Background" />
          {about.education.length > 0 && (
            <div className="grid pair" style={{ borderTop: 0, paddingTop: 0 }}>
              <div className="pair__l">
                <h2 className="meta">
                  <b>Education</b>
                </h2>
              </div>
              <ul className="pair__r plain-list">
                {about.education.map((e) => (
                  <li key={e.name}>
                    <b>{e.name}</b>
                    <br />
                    <span className="cap">
                      {e.place} · {e.when}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {identity.languages && (
            <div className="grid pair">
              <div className="pair__l">
                <h2 className="meta">
                  <b>Languages</b>
                </h2>
              </div>
              <p className="pair__r">{identity.languages}</p>
            </div>
          )}
          <div className="grid pair">
            <div className="pair__l">
              <h2 className="meta">
                <b>Elsewhere</b>
              </h2>
            </div>
            <ul className="pair__r plain-list">
              {identity.socials.map((l) => (
                <li key={l.href}>
                  <a className="tlink" href={l.href} target="_blank" rel="noopener noreferrer">
                    {l.label} <span className="arr" aria-hidden="true">↗</span>
                  </a>
                </li>
              ))}
              <li>
                <a className="tlink" href={RESUME_HREF} target="_blank" rel="noopener noreferrer">
                  Résumé (PDF) <span className="arr" aria-hidden="true">↗</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
