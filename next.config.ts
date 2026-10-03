import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "static.tildacdn.com" },
      { protocol: "https", hostname: "www.simplilearn.com" },
      { protocol: "https", hostname: "miro.medium.com" },
      { protocol: "https", hostname: "cdn.dribbble.com" },
      { protocol: "https", hostname: "prezibase.com" },
      { protocol: "https", hostname: "github.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
  async redirects() {
    return [
      { source: "/projects", destination: "/work", permanent: true },
      { source: "/projects/catchat", destination: "/work", permanent: true },
      { source: "/projects/:slug", destination: "/work/:slug", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
      // Private or non-portfolio areas: never index.
      { source: "/me/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
      { source: "/api/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
      { source: "/birthdaywish/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
      // Case-study images change rarely; let the CDN and browsers keep them.
      { source: "/work/:dir/:file(.+\\.(?:jpg|png|webp))", headers: [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" }] },
    ];
  },
  async rewrites() {
    let birthdayWishUrl = process.env.BIRTHDAY_WISH_URL || "https://birthday-wish-eight-pink.vercel.app";
    if (process.env.NODE_ENV === "production" && birthdayWishUrl.includes("localhost")) {
      birthdayWishUrl = "https://birthday-wish-eight-pink.vercel.app";
    }
    return {
      beforeFiles: [
        {
          source: "/birthdaywish",
          destination: `${birthdayWishUrl}/birthdaywish`,
        },
        {
          source: "/birthdaywish/:path*",
          destination: `${birthdayWishUrl}/birthdaywish/:path*`,
        },
      ],
    };
  },
};

export default nextConfig;
