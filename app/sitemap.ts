import type { MetadataRoute } from "next";
import { projects } from "@/app/component/projects/projects.data";
import { absoluteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const staticRoutes = ["/", "/about", "/projects", "/contact"];
  const projectRoutes = projects.map((project) => `/projects/${project.slug}`);

  return [...staticRoutes, ...projectRoutes].map((route) => ({
    url: absoluteUrl(route),
    lastModified,
    changeFrequency: route === "/" ? "monthly" : "yearly",
    priority: route === "/" ? 1 : route === "/projects" ? 0.8 : 0.7,
  }));
}
