import Image from "next/image";
import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import { capabilities, principles } from "@/content/profile";
import type { FlowLane, Img, Project } from "@/content/projects";

export function Clause({ n, label }: { n: string; label: string }) {
  return (
    <div className="clause">
      <span className="meta">§ {n}</span>
      <span className="meta">
        <b>{label}</b>
      </span>
    </div>
  );
}

export function ProjectIndex({ items }: { items: Project[] }) {
  return (
    <ol className="index">
      {items.map((p) => {
        const thumb = p.screens[0] ?? p.cover;
        return (
          <li key={p.slug}>
            <Link href={`/work/${p.slug}`} className="index__row">
              <span className="meta">{p.number}</span>
              <span className="index__title">{p.title}</span>
              <span className="index__meta meta">
                <b>{p.kind}</b>
                <span>{p.status}</span>
              </span>
              <span className="index__what">{p.oneLiner}</span>
              <span className="index__arrow" aria-hidden="true">→</span>
              {thumb && (
                <span className={`index__thumb${thumb.width > thumb.height ? " index__thumb--wide" : ""}`} aria-hidden="true">
                  <Image src={thumb.src} alt="" width={thumb.width} height={thumb.height} sizes="240px" />
                </span>
              )}
            </Link>
          </li>
        );
      })}
    </ol>
  );
}

export function Figure({ img, priority, sizes }: { img: Img; priority?: boolean; sizes: string }) {
  return (
    <figure className="fig rv-img">
      <Image src={img.src} alt={img.alt} width={img.width} height={img.height} sizes={sizes} priority={priority} />
      {img.caption && <figcaption className="cap">{img.caption}</figcaption>}
    </figure>
  );
}

export function ProjectFeature({ p }: { p: Project }) {
  const cover = p.cover;
  const wide = cover ? cover.width > cover.height : false;
  return (
    <article className="feature" aria-labelledby={`f-${p.slug}`}>
      <div className="frame">
        <div className="feature__head">
          <span className="meta signal">{p.number}</span>
          <span className="meta">
            <b>{p.kind}</b>
          </span>
          <span className="meta">{p.status}</span>
        </div>
        <div className="grid feature__grid">
          <div className="feature__visual rv-img">
            {cover ? (
              <div className={`cover${wide ? " cover--wide" : ""}`}>
                <Image
                  src={cover.src}
                  alt={cover.alt}
                  width={cover.width}
                  height={cover.height}
                  sizes="(min-width: 60rem) 55vw, 100vw"
                />
              </div>
            ) : (
              <div className="cover cover--none">
                <span className="meta">No public screenshots</span>
                <span className="h2" aria-hidden="true">{p.title}</span>
              </div>
            )}
          </div>
          <dl className="feature__facts rv">
            <div className="fact">
              <dt>What it is</dt>
              <dd>{p.context[0]}</dd>
            </div>
            <div className="fact">
              <dt>My role</dt>
              <dd>{p.spec.find(([k]) => k === "My role")?.[1]}</dd>
            </div>
            {p.engineering && (
              <div className="fact">
                <dt>Engineering</dt>
                <dd>{p.engineering.map((e) => e.title).join(" · ")}</dd>
              </div>
            )}
            <div className="fact">
              <dt>Stack</dt>
              <dd>{p.stack.flatMap((s) => s.items).join(" · ")}</dd>
            </div>
          </dl>
        </div>
        <h2 className="h1 rv" id={`f-${p.slug}`} style={{ marginTop: "var(--s-6)" }}>
          <Link href={`/work/${p.slug}`} className="tlink">
            {p.title}
          </Link>
        </h2>
        <p style={{ marginTop: "var(--s-4)" }}>
          <Link className="tlink" href={`/work/${p.slug}`}>
            Read the case study <span className="arr" aria-hidden="true">→</span>
          </Link>
        </p>
      </div>
    </article>
  );
}

export function Flow({ lanes, label }: { lanes: FlowLane[]; label: string }) {
  return (
    <div className="flow" role="group" aria-label={label}>
      {lanes.map((lane) => (
        <div className="flow__lane" key={lane.label}>
          <p className="meta">
            <b>{lane.label}</b>
          </p>
          <ol className="flow__steps">
            {lane.steps.map((s) => (
              <li className="flow__step" key={s}>
                {s}
              </li>
            ))}
          </ol>
        </div>
      ))}
    </div>
  );
}

export function Principles() {
  return (
    <ol className="principles">
      {principles.map((p, i) => (
        <li className="principle rv" key={p.title}>
          <span className="principle__n" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
          <h3>{p.title}</h3>
          <p>{p.body}</p>
        </li>
      ))}
    </ol>
  );
}

export function CapabilityMap() {
  return (
    <dl className="capmap">
      {capabilities.map((c) => (
        <div className="cap-row rv" key={c.group}>
          <dt>{c.group}</dt>
          <dd>
            {c.items.map((it, i) => (
              <Fragment key={it.name}>
                <span>
                  {it.name}
                  {it.note && <i>{it.note}</i>}
                </span>
                {i < c.items.length - 1 && (
                  <>
                    <s aria-hidden="true">/</s>{" "}
                  </>
                )}
              </Fragment>
            ))}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function NumberedList({ items }: { items: string[] }) {
  return (
    <ol className="list">
      {items.map((t, i) => (
        <li key={t} data-n={String(i + 1).padStart(2, "0")}>
          <span>{t}</span>
        </li>
      ))}
    </ol>
  );
}

export function PageHead({ n, label, title, children }: { n: string; label: string; title: ReactNode; children?: ReactNode }) {
  return (
    <section className="frame" style={{ paddingTop: "calc(var(--header-h) + var(--s-6))" }} data-rail={label}>
      <Clause n={n} label={label} />
      <h1 className="h1">{title}</h1>
      {children && <div style={{ marginTop: "var(--s-5)" }}>{children}</div>}
    </section>
  );
}
