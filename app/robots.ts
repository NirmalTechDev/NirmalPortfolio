import type { MetadataRoute } from "next";
import { absoluteUrl, SITE_URL } from "@/lib/seo";

// Private areas are kept out of results with noindex (meta tag and X-Robots-Tag header, see next.config.ts).
// Only paths with nothing to index are blocked here, because a blocked page cannot show its noindex.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/birthdaywish"],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: SITE_URL,
  };
}
