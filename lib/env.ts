import "server-only";

/**
 * Server-side configuration. No secret has a hard-coded fallback: in production a
 * missing value disables the feature that needs it (fail closed) instead of silently
 * using a known default.
 */
const isProd = process.env.NODE_ENV === "production";

const read = (name: string) => {
  const v = process.env[name];
  return v && v.trim() ? v.trim() : undefined;
};

/** Backend base URL, e.g. https://collective-onc6.onrender.com/api/v1 */
export const API_URL = (
  read("COLLECTIVE_API_URL") ||
  read("NEXT_PUBLIC_COLLECTIVE_API_URL") ||
  "https://collective-onc6.onrender.com/api/v1"
).replace(/\/$/, "");

export const SITE_URL = (read("NEXT_PUBLIC_SITE_URL") || "https://nirmalranpariya.in").replace(/\/$/, "");

/** Signs the dashboard session cookie. Required (min 32 chars) in production. */
export function getAuthSecret(): string | null {
  const v = read("AUTH_SECRET");
  const insecure = ["nirmal_cmd_secret_key_2026_prod"];
  if (!v || insecure.includes(v) || v.length < 32) {
    if (isProd) return null;
    // Development only: a per-process random secret (sessions reset on restart).
    const g = globalThis as unknown as { __devAuthSecret?: string };
    if (!g.__devAuthSecret) g.__devAuthSecret = crypto.randomUUID() + crypto.randomUUID();
    return g.__devAuthSecret;
  }
  return v;
}

export const env = {
  GITHUB_TOKEN: read("GITHUB_TOKEN"),
  GITHUB_USERNAME: read("GITHUB_USERNAME") || "NirmalTechDev",
  COLLECTIVE_ADMIN_EMAIL: read("COLLECTIVE_ADMIN_EMAIL"),
  COLLECTIVE_ADMIN_PASSWORD: read("COLLECTIVE_ADMIN_PASSWORD"),
  /** Where the gallery and birthday apps live (for "view" links and cache refresh). */
  /** Gallery app origin (it serves everything under /LovedOnesGallery). */
  GALLERY_URL: (read("GALLERY_URL") || "https://dinky-n.vercel.app").replace(/\/$/, ""),
  BIRTHDAY_URL: (read("BIRTHDAY_WISH_URL") || "https://birthday-wish-eight-pink.vercel.app").replace(/\/$/, ""),
  /** Shared secret for the gallery/birthday apps' /api/revalidate endpoint. */
  REVALIDATE_SECRET: read("REVALIDATE_SECRET"),
};

export const config = { isProd };
