import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import React from "react";
import { absoluteUrl, nirmalIdentity, SITE_URL } from "@/lib/seo";

const sans = Geist({ variable: "--font-sans", subsets: ["latin"], display: "swap" });
const mono = Geist_Mono({ variable: "--font-mono", subsets: ["latin"], display: "swap" });
const display = Instrument_Serif({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const TITLE = "Nirmal Ranpariya | React Native Developer & Software Engineer";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: TITLE, template: "%s" },
  description: nirmalIdentity.description,
  alternates: { canonical: absoluteUrl("/") },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  openGraph: {
    type: "website",
    url: absoluteUrl("/"),
    siteName: "Nirmal Ranpariya",
    title: TITLE,
    description: nirmalIdentity.description,
    images: [{ url: absoluteUrl("/opengraph-image"), alt: TITLE }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: nirmalIdentity.description },
  verification: { google: "Pxd07Sb1Z_mmF3Th9wMF_zVPGuMjA7R_1ecg7KV0sf0" },
};

export const viewport: Viewport = { themeColor: "#efebe1" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable} ${display.variable}`}>
      <body>{children}</body>
    </html>
  );
}
