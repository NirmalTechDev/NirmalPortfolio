import React from "react";
import "./site.css";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Rail } from "@/components/site/Rail";
import { getPortfolio, RESUME_HREF } from "@/lib/content/api";
import { visiblePages } from "@/lib/content/services";

/** Applies the saved theme before paint so there is no light/dark flash. */
const themeScript = `try{var t=localStorage.getItem("site-theme");if(t==="dark"||t==="light")document.documentElement.dataset.siteTheme=t;}catch(e){}`;

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const { site } = await getPortfolio();
  const { identity } = site;
  return (
    <div className="site">
      <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      <a className="skip" href="#main">
        Skip to content
      </a>
      <SiteHeader name={`${identity.firstName} ${identity.lastName}`} availability={identity.availability} location={identity.location} />
      <Rail />
      <main id="main">{children}</main>
      <SiteFooter identity={identity} resumeHref={RESUME_HREF} landing={visiblePages(site.services)} />
    </div>
  );
}
