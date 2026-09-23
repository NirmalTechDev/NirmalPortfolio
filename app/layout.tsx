import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import React from "react";
import { absoluteUrl, nirmalIdentity, PROFILE_IMAGE, SITE_URL } from "@/lib/seo";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        default: "Nirmal Ranpariya | React Native Developer & Software Engineer",
        template: "%s",
    },
    description: nirmalIdentity.description,
    alternates: {
        canonical: absoluteUrl("/"),
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
        },
    },
    openGraph: {
        type: "website",
        url: absoluteUrl("/"),
        siteName: "Nirmal Ranpariya",
        title: "Nirmal Ranpariya | React Native Developer & Software Engineer",
        description: nirmalIdentity.description,
        images: [
            {
                url: absoluteUrl(PROFILE_IMAGE),
                alt: "Nirmal Ranpariya, React Native Developer and Software Engineer",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Nirmal Ranpariya | React Native Developer & Software Engineer",
        description: nirmalIdentity.description,
        images: [absoluteUrl(PROFILE_IMAGE)],
    },
    icons: {
        icon: "/favicon.ico",
        apple: PROFILE_IMAGE,
    },
    verification: {
        google: "Pxd07Sb1Z_mmF3Th9wMF_zVPGuMjA7R_1ecg7KV0sf0",
    },
};

export const viewport: Viewport = {
    themeColor: "#0ea5e9",
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} cz-shortcut-listen="true">
        {children}
      </body>
    </html>
  );
}
