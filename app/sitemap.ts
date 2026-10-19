import type { MetadataRoute } from "next";
import { getPortfolio } from "@/lib/content/api";
import { absoluteUrl, CONTENT_UPDATED } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { site, projects } = await getPortfolio();
  const lastModified = new Date(site.updatedAt || CONTENT_UPDATED);
  const routes = ["/", "/work", "/about", "/experience", "/contact", ...projects.map((p) => `/work/${p.slug}`)];

  return routes.map((route) => {
    const project = projects.find((p) => route === `/work/${p.slug}`);
    return {
      url: absoluteUrl(route),
      lastModified: project?.updatedAt ? new Date(project.updatedAt) : lastModified,
      changeFrequency: route === "/" ? "monthly" : "yearly",
      priority: route === "/" ? 1 : route === "/work" ? 0.8 : 0.7,
    };
  });
}
