import type { GallerySummary } from "./types";

/** Public base address of the gallery app (forwarded by this website). */
export const GALLERY_BASE = "/LovedOnesGallery";

export const slugify = (v: string) => v.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "").slice(0, 60);

/** Address visitors use: the main gallery opens at the base, private ones need the key. */
export const galleryHref = (g: Pick<GallerySummary, "slug" | "isDefault" | "visibility" | "shareKey">) =>
  g.visibility === "private" ? `${GALLERY_BASE}/${g.slug}?key=${encodeURIComponent(g.shareKey)}` : g.isDefault ? GALLERY_BASE : `${GALLERY_BASE}/${g.slug}`;

/** Square thumbnail via Cloudinary; other URLs pass through. */
export const thumb = (url: string, size = 320) =>
  url.includes("res.cloudinary.com") && url.includes("/upload/") ? url.replace("/upload/", `/upload/c_fill,w_${size},h_${size},q_auto,f_auto/`) : url;
