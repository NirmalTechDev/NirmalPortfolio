import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";
import { absoluteUrl, CONTENT_UPDATED } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(CONTENT_UPDATED);
  const routes = ["/", "/work", "/about", "/experience", "/contact", ...projects.map((p) => `/work/${p.slug}`)];

  return routes.map((route) => ({
    url: absoluteUrl(route),
    lastModified,
    changeFrequency: route === "/" ? "monthly" : "yearly",
    priority: route === "/" ? 1 : route === "/work" ? 0.8 : 0.7,
  }));
}
