import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { Clause } from "@/components/site/parts";
import { education, journey, languages, links, RESUME_HREF } from "@/content/profile";
import { pageMetadata, profilePageJsonLd, PROFILE_IMAGE } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "About Nirmal Ranpariya | React Native Developer & Software Engineer",
  description:
    "About Nirmal Ranpariya, a React Native developer from Gujarat, India: how he works, what he studied, what he builds and what he is exploring now.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <JsonLd data={profilePageJsonLd()} />

      <section className="frame" style={{ paddingTop: "calc(var(--header-h) + var(--s-6))" }} data-rail="About">
        <Clause n="02" label="About" />
        <div className="grid" style={{ rowGap: "var(--s-6)" }}>
          <div style={{ gridColumn: "1 / -1" }} className="about-head">
            <h1 className="h1">
              An engineer who cares what happens <em>after the screen.</em>
            </h1>
          </div>
          <div style={{ gridColumn: "1 / -1" }} className="about-body">
            <div className="grid" style={{ rowGap: "var(--s-6)" }}>
              <div className="about-portrait ab-p rv-img">
                <Image src={PROFILE_IMAGE} alt="Portrait of Nirmal Ranpariya" width={640} height={640} sizes="26rem" />
              </div>
              <div className="prose ab-t">
                <p className="lead">
                  I&apos;m Nirmal Ranpariya, a software engineer from Gujarat, India. I work mostly in React Native,
                  building Android and iOS apps.
                </p>
                <p>
                  Day to day that means the app and the parts around it: API integration, Firebase, push notifications,
                  native modules and getting builds into the stores. I studied IT and computer science, and I keep
                  building whole things rather than pieces. Collective Ledger OS, which I designed and shipped
                  end to end, is the clearest example.
                </p>
                <p>
                  That habit shapes how I think about mobile work. A feature is not done when the screen renders. It is
                  done when it holds up on a slow network, on an older phone, and after the next release.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="band--tight frame" data-rail="What I enjoy">
        <div className="grid pair">
          <div className="pair__l">
            <h2 className="meta">
              <b>Problems I enjoy</b>
            </h2>
          </div>
          <div className="pair__r prose">
            <p>
              Flows where state, network and the device all meet: onboarding, ordering, recharge, real-time updates and
              notifications. Places where a small decision in the data layer decides whether the screen feels calm or
              broken.
            </p>
          </div>
        </div>
        <div className="grid pair">
          <div className="pair__l">
            <h2 className="meta">
              <b>Exploring now</b>
            </h2>
          </div>
          <div className="pair__r prose">
            <p>
              AI-assisted development and AI-integrated app features, and taking whole products from data model to
              deployment, as with Collective Ledger OS.
            </p>
          </div>
        </div>
        <div className="grid pair">
          <div className="pair__l">
            <h2 className="meta">
              <b>How I work</b>
            </h2>
          </div>
          <div className="pair__r prose">
            <p>
              I start from the user&apos;s journey, keep state predictable and treat the release process as part of
              the product. The <Link className="tlink" href="/#build-h">six habits</Link> are on the home page.
            </p>
          </div>
        </div>
      </section>

      <section className="band band--paper2" data-rail="Journey" aria-labelledby="journey-h">
        <div className="frame">
          <Clause n="03" label="Journey" />
          <h2 className="h2" id="journey-h" style={{ marginBottom: "var(--s-6)" }}>
            An engineering log.
          </h2>
          <ol className="log">
            {journey.map((j) => (
              <li className="log__item rv" key={j.year}>
                <p className="log__year">{j.year}</p>
                <p className="log__label">{j.label}</p>
                <p className="log__text">{j.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="band" data-rail="Background">
        <div className="frame">
          <Clause n="04" label="Background" />
          <div className="grid pair" style={{ borderTop: 0, paddingTop: 0 }}>
            <div className="pair__l">
              <h2 className="meta">
                <b>Education</b>
              </h2>
            </div>
            <ul className="pair__r plain-list">
              {education.map((e) => (
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
          <div className="grid pair">
            <div className="pair__l">
              <h2 className="meta">
                <b>Languages</b>
              </h2>
            </div>
            <p className="pair__r">{languages}</p>
          </div>
          <div className="grid pair">
            <div className="pair__l">
              <h2 className="meta">
                <b>Elsewhere</b>
              </h2>
            </div>
            <ul className="pair__r plain-list">
              {links.map((l) => (
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
