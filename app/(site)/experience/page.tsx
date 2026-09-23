import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { PageHead } from "@/components/site/parts";
import { RESUME_HREF, role } from "@/content/profile";
import { pageJsonLd, pageMetadata } from "@/lib/seo";

const description =
  "Professional experience of Nirmal Ranpariya: React Native developer at Ofniinfo Software Solutions, Surat, since June 2024.";

export const metadata: Metadata = pageMetadata({
  title: "Experience | Nirmal Ranpariya",
  description,
  path: "/experience",
});

export default function ExperiencePage() {
  return (
    <>
      <JsonLd
        data={pageJsonLd({
          path: "/experience",
          name: "Experience | Nirmal Ranpariya",
          description,
          crumbs: [{ name: "Experience", path: "/experience" }],
        })}
      />
      <PageHead n="03" label="Experience" title={<>Where I&apos;ve <em>worked.</em></>}>
        <p className="lead">
          One role so far, and I&apos;ve tried to describe it plainly.{" "}
          <a className="tlink" href={RESUME_HREF} target="_blank" rel="noopener noreferrer">
            The full résumé is a PDF <span className="arr" aria-hidden="true">↗</span>
          </a>
        </p>
      </PageHead>

      <section className="frame" style={{ marginTop: "var(--s-7)", paddingBottom: "var(--s-8)" }} data-rail="Ofniinfo">
        <div className="grid role">
          <div className="role__head">
            <p className="meta signal">{role.dates}</p>
            <h2 className="h2" style={{ marginBlock: "var(--s-3)" }}>{role.company}</h2>
            <p className="meta">
              <b>{role.title}</b> · {role.location}
            </p>
          </div>
          <div className="role__body">
            <div>
              <h3 className="meta" style={{ marginBottom: "var(--s-3)" }}>
                <b>Responsibilities</b>
              </h3>
              <ul className="list">
                {role.responsibilities.map((r, i) => (
                  <li key={r} data-n={String(i + 1).padStart(2, "0")}>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="meta" style={{ marginBottom: "var(--s-3)" }}>
                <b>Systems</b>
              </h3>
              <ul className="plain-list">
                {role.systems.map((s) => (
                  <li key={s.href}>
                    <Link className="tlink" href={s.href}>
                      {s.name} <span className="arr" aria-hidden="true">→</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="meta" style={{ marginBottom: "var(--s-3)" }}>
                <b>Technologies</b>
              </h3>
              <p>{role.tech.join(" · ")}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
