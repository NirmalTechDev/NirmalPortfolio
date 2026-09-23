import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { Clause, Figure, Flow, NumberedList } from "@/components/site/parts";
import { getProject, projects } from "@/content/projects";
import { pageJsonLd, pageMetadata } from "@/lib/seo";

type Params = { slug: string };

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const p = getProject((await params).slug);
  if (!p) return {};
  return pageMetadata({
    title: `${p.title}: case study | Nirmal Ranpariya`,
    description: `${p.oneLiner} A case study by Nirmal Ranpariya.`,
    path: `/work/${p.slug}`,
    image: p.cover?.src,
  });
}

export default async function CasePage({ params }: { params: Promise<Params> }) {
  const p = getProject((await params).slug);
  if (!p) notFound();

  const i = projects.indexOf(p);
  const next = projects[(i + 1) % projects.length];

  // Sections render only when there is real content behind them.
  const sections: { label: string; body: React.ReactNode; wide?: React.ReactNode }[] = [];
  sections.push({ label: "Context", body: <div className="prose">{p.context.map((t) => <p key={t}>{t}</p>)}</div> });
  if (p.problem) sections.push({ label: "Problem", body: <div className="prose">{p.problem.map((t) => <p key={t}>{t}</p>)}</div> });
  sections.push({
    label: "Role",
    body: (
      <>
        <p className="prose" style={{ marginBottom: "var(--s-4)" }}>{p.role.intro}</p>
        <NumberedList items={p.role.items} />
      </>
    ),
  });
  if (p.system)
    sections.push({
      label: "System",
      body: (
        <>
          <h3 className="h3" style={{ marginBottom: "var(--s-3)" }}>{p.system.title}</h3>
          <p className="cap prose">{p.system.caption}</p>
        </>
      ),
      wide: <Flow lanes={p.system.lanes} label={p.system.title} />,
    });
  if (p.engineering)
    sections.push({
      label: "Engineering",
      body: (
        <div className="decisions">
          {p.engineering.map((e) => (
            <div key={e.title}>
              <h3>{e.title}</h3>
              <p>{e.body}</p>
            </div>
          ))}
        </div>
      ),
    });
  if (p.experience)
    sections.push({ label: "Experience", body: <div className="prose">{p.experience.map((t) => <p key={t}>{t}</p>)}</div> });
  if (p.challenges)
    sections.push({
      label: "Challenges",
      body: (
        <div className="decisions">
          {p.challenges.map((c) => (
            <div key={c.title}>
              <h3>{c.title}</h3>
              <p>{c.body}</p>
            </div>
          ))}
        </div>
      ),
    });
  sections.push({ label: "Outcome", body: <div className="prose">{p.outcome.map((t) => <p key={t}>{t}</p>)}</div> });
  sections.push({
    label: "Stack",
    body: (
      <dl className="stack">
        {p.stack.map((s) => (
          <div key={s.group}>
            <dt>{s.group}</dt>
            <dd>{s.items.join(" · ")}</dd>
          </div>
        ))}
      </dl>
    ),
  });
  if (p.reflection)
    sections.push({ label: "Reflection", body: <div className="prose">{p.reflection.map((t) => <p key={t}>{t}</p>)}</div> });

  const description = `${p.oneLiner} A case study by Nirmal Ranpariya.`;

  return (
    <>
      <JsonLd
        data={pageJsonLd({
          path: `/work/${p.slug}`,
          name: `${p.title}: case study | Nirmal Ranpariya`,
          description,
          crumbs: [
            { name: "Work", path: "/work" },
            { name: p.title, path: `/work/${p.slug}` },
          ],
        })}
      />

      <section className="case-hero" data-rail={`${p.title}`}>
        <div className="frame">
          <Clause n={p.number} label={p.kind} />
          <h1 className="h1 case-hero__title">{p.title}</h1>
          <p className="lead">{p.oneLiner}</p>
          <dl className="factsheet" style={{ "--cols": p.spec.length } as React.CSSProperties}>
            {p.spec.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
          {p.links.length > 0 && (
            <ul className="links" aria-label={`${p.title} links`}>
              {p.links.map((l) => (
                <li key={l.href}>
                  <a className="tlink" href={l.href} target="_blank" rel="noopener noreferrer">
                    {l.label} <span className="arr" aria-hidden="true">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {(p.cover || p.screens.length > 0) && (
        <section className="frame" style={{ paddingBottom: "var(--s-7)" }} aria-label={`${p.title} screens`}>
          {p.screenLayout === "wide" ? (
            <>
              {p.cover && <Figure img={{ ...p.cover, caption: "Fig. 1 — Landing page" }} priority sizes="(min-width: 96rem) 90rem, 100vw" />}
              <div className="wide-figs" style={{ marginTop: "var(--s-6)" }}>
                {p.screens.map((s, n) => (
                  <Figure key={s.src} img={{ ...s, caption: `Fig. ${n + 2}` }} sizes="(min-width: 60rem) 45vw, 100vw" />
                ))}
              </div>
            </>
          ) : (
            <div className="phones">
              {[...(p.cover ? [p.cover] : []), ...p.screens].slice(0, 4).map((s, n) => (
                <Figure key={s.src} img={s} priority={n === 0} sizes="(min-width: 48rem) 22vw, 45vw" />
              ))}
            </div>
          )}
        </section>
      )}

      {sections.map((s, n) => (
        <section className="case-sec" key={s.label} data-rail={`${p.title} · ${s.label}`} aria-labelledby={`s-${n}`}>
          <div className="frame">
            <div className="grid case-sec__grid">
              <div className="case-sec__label">
                <h2 className="meta" id={`s-${n}`}>
                  <b>
                    {String(n + 1).padStart(2, "0")} — {s.label}
                  </b>
                </h2>
              </div>
              <div className="case-sec__body rv">{s.body}</div>
              {s.wide && <div className="case-sec__wide rv">{s.wide}</div>}
            </div>
          </div>
        </section>
      ))}

      <section className="band band--ink" data-rail="Next project">
        <div className="frame">
          <p className="meta">Next project</p>
          <Link href={`/work/${next.slug}`} className="h1 tlink" style={{ marginTop: "var(--s-3)" }}>
            {next.title} <span className="arr" aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </>
  );
}
