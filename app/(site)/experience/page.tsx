import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { PageHead } from "@/components/site/parts";
import { getPortfolio, RESUME_HREF } from "@/lib/content/api";
import { pageJsonLd, pageMetadata } from "@/lib/seo";

const description =
  "Professional experience of Nirmal Ranpariya: React Native developer at Ofniinfo Software Solutions, Surat, since June 2024.";

export const metadata: Metadata = pageMetadata({
  title: "React Native Developer Experience | Nirmal Ranpariya",
  description,
  path: "/experience",
});

const formatDates = (e: { startDate: string; endDate?: string | null; current?: boolean }) => {
  const fmt = (d: string) => new Date(d).toLocaleDateString("en-GB", { month: "long", year: "numeric" });
  return `${fmt(e.startDate)} — ${e.current || !e.endDate ? "Present" : fmt(e.endDate)}`;
};

export default async function ExperiencePage() {
  const { site, experience } = await getPortfolio();

  return (
    <>
      <JsonLd
        data={pageJsonLd({
          path: "/experience",
          name: "React Native Developer Experience | Nirmal Ranpariya",
          description,
          crumbs: [{ name: "Experience", path: "/experience" }],
        })}
      />
      <PageHead n="03" label="Experience" title={<>Where I&apos;ve <em>worked.</em></>}>
        <p className="lead">
          {site.experiencePage.intro}{" "}
          <a className="tlink" href={RESUME_HREF} target="_blank" rel="noopener noreferrer">
            The full résumé is a PDF <span className="arr" aria-hidden="true">↗</span>
          </a>
        </p>
      </PageHead>

      {experience.map((role, idx) => (
        <section
          key={role._id || `${role.company}-${idx}`}
          className="frame"
          style={{ marginTop: "var(--s-7)", paddingBottom: idx === experience.length - 1 ? "var(--s-8)" : "var(--s-6)" }}
          data-rail={role.company}
        >
          <div className="grid role">
            <div className="role__head">
              <p className="meta signal">{role.datesLabel || formatDates(role)}</p>
              <h2 className="h2" style={{ marginBlock: "var(--s-3)" }}>
                {role.company}
              </h2>
              <p className="meta">
                <b>{role.position}</b>
                {role.location ? ` · ${role.location}` : ""}
              </p>
            </div>
            <div className="role__body">
              {(role.responsibilities.length > 0 || role.description) && (
                <div>
                  <h3 className="meta" style={{ marginBottom: "var(--s-3)" }}>
                    <b>Responsibilities</b>
                  </h3>
                  <ul className="list">
                    {(role.responsibilities.length ? role.responsibilities : [role.description]).map((r, i) => (
                      <li key={i} data-n={String(i + 1).padStart(2, "0")}>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {role.systems.length > 0 && (
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
              )}
              {role.technologies.length > 0 && (
                <div>
                  <h3 className="meta" style={{ marginBottom: "var(--s-3)" }}>
                    <b>Technologies</b>
                  </h3>
                  <p>{role.technologies.join(" · ")}</p>
                </div>
              )}
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
