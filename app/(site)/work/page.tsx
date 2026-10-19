import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { PageHead, ProjectFeature } from "@/components/site/parts";
import { getPortfolio } from "@/lib/content/api";
import { pageJsonLd, pageMetadata } from "@/lib/seo";

const description =
  "Case studies by Nirmal Ranpariya: React Native apps OpiGo, by.U and SELA, and Collective Ledger, a full-stack savings platform.";

export const metadata: Metadata = pageMetadata({
  title: "React Native & Web Projects | Nirmal Ranpariya",
  description,
  path: "/work",
});

export default async function WorkPage() {
  const { site, projects } = await getPortfolio();
  return (
    <>
      <JsonLd
        data={pageJsonLd({ path: "/work", name: "React Native & Web Projects | Nirmal Ranpariya", description, crumbs: [{ name: "Work", path: "/work" }] })}
      />
      <PageHead n="01" label="Selected work" title={<>Work, <em>in detail.</em></>}>
        {site.workPage.intro && <p className="lead">{site.workPage.intro}</p>}
      </PageHead>
      <div style={{ marginTop: "var(--s-7)" }}>
        {projects.map((p) => (
          <ProjectFeature key={p.slug} p={p} />
        ))}
      </div>
    </>
  );
}
