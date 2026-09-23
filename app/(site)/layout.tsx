import React from "react";
import "./site.css";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Rail } from "@/components/site/Rail";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="site">
      <a className="skip" href="#main">
        Skip to content
      </a>
      <SiteHeader />
      <Rail />
      <main id="main">{children}</main>
      <SiteFooter />
    </div>
  );
}
