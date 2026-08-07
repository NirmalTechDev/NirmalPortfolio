import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
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
