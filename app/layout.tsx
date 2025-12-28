import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import React from "react";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Nirmal Ranpariya ✦ Full-Stack Software Developer Portfolio",
    description:
        "Nirmal Ranpariya | Full-Stack Software Developer (React Native, React.js, Node.js). 2+ years of crafting high-performance, scalable applications.",
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
