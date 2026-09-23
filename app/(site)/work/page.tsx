import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { PageHead, ProjectFeature } from "@/components/site/parts";
import { projects } from "@/content/projects";
import { pageJsonLd, pageMetadata } from "@/lib/seo";

const description =
  "Case studies by Nirmal Ranpariya: React Native apps OpiGo, by.U and SELA, and Collective Ledger OS, a community finance platform built with Next.js.";

export const metadata: Metadata = pageMetadata({
  title: "Work | Nirmal Ranpariya",
  description,
  path: "/work",
});

export default function WorkPage() {
  return (
    <>
      <JsonLd
        data={pageJsonLd({ path: "/work", name: "Work | Nirmal Ranpariya", description, crumbs: [{ name: "Work", path: "/work" }] })}
      />
      <PageHead n="01" label="Selected work" title={<>Work, <em>in detail.</em></>}>
        <p className="lead">
          Four products. Each page says what I built, how it fits together and what I did not do, because the honest
          version is the useful one.
        </p>
      </PageHead>
      <div style={{ marginTop: "var(--s-7)" }}>
        {projects.map((p) => (
          <ProjectFeature key={p.slug} p={p} />
        ))}
      </div>
    </>
  );
}
