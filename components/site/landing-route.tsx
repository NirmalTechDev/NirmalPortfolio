import "server-only";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { getPortfolio } from "@/lib/content/api";
import { landingPath } from "@/lib/content/services";
import type { LandingPage } from "@/lib/content/types";
import { faqJsonLd, pageJsonLd, pageMetadata, serviceJsonLd } from "@/lib/seo";
import { LandingView } from "./Landing";

async function findPage(slug: string, kind: LandingPage["kind"]) {
  const { site, projects } = await getPortfolio();
  const page = site.services.pages.find((p) => p.slug === slug && p.kind === kind && p.isVisible !== false);
  return page ? { page, services: site.services, projects } : null;
}

export async function landingMetadata(slug: string, kind: LandingPage["kind"] = "service"): Promise<Metadata> {
  const found = await findPage(slug, kind);
  if (!found) return {};
  const { page } = found;
  return pageMetadata({ title: page.metaTitle || page.heading, description: page.metaDescription, path: landingPath(page) });
}

export async function LandingRoute({ slug, kind = "service" }: { slug: string; kind?: LandingPage["kind"] }) {
  const found = await findPage(slug, kind);
  if (!found) notFound();
  const { page, services, projects } = found;
  const path = landingPath(page);
  const crumbs =
    page.kind === "location" ? [{ name: page.navLabel, path }] : [{ name: "Services", path: "/services" }, { name: page.navLabel, path }];
  const base = pageJsonLd({ path, name: page.metaTitle || page.heading, description: page.metaDescription, crumbs });
  const graph = [
    ...(base["@graph"] as Record<string, unknown>[]),
    serviceJsonLd({
      name: page.heading,
      path,
      description: page.metaDescription,
      serviceType: page.kind === "location" ? "React Native app development" : page.navLabel,
      area: slug.endsWith("-surat") ? "surat" : slug.endsWith("-india") ? "india" : undefined,
    }),
    ...(page.faqs.length ? [faqJsonLd(path, page.faqs)] : []),
  ];
  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@graph": graph }} />
      <LandingView page={page} services={services} projects={projects} />
    </>
  );
}
