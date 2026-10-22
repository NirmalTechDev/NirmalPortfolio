import Link from "next/link";
import { nav } from "@/content/profile";
import { landingPath } from "@/lib/content/services";
import type { LandingPage, SiteContent } from "@/lib/content/types";

export function SiteFooter({ identity, resumeHref, landing = [] }: { identity: SiteContent["identity"]; resumeHref: string; landing?: LandingPage[] }) {
  const { email, socials: links } = identity;
  return (
    <footer className="footer">
      <div className="frame">
        <p className="footer__name" aria-hidden="true">
          {identity.firstName}
          <br />
          {identity.lastName}
        </p>
        <div className="grid footer__cols">
          <div>
            <p className="meta">Software engineer</p>
            <p>
              {identity.shortRole} · {identity.location}
            </p>
          </div>
          <div>
            <p className="meta">Write</p>
            <a className="tlink" href={`mailto:${email}`}>
              {email}
            </a>
          </div>
          <div>
            <p className="meta">Elsewhere</p>
            <ul>
              {links.map((l) => (
                <li key={l.href}>
                  <a className="tlink" href={l.href} target="_blank" rel="noopener noreferrer">
                    {l.label} <span className="arr" aria-hidden="true">↗</span>
                  </a>
                </li>
              ))}
              <li>
                <a className="tlink" href={resumeHref} target="_blank" rel="noopener noreferrer">
                  Résumé (PDF) <span className="arr" aria-hidden="true">↗</span>
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="meta">Site</p>
            <ul>
              {nav.map((n) => (
                <li key={n.href}>
                  <Link className="tlink" href={n.href}>
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {landing.length > 0 && (
          <nav className="footer__services" aria-label="Services">
            <Link href="/services">Hire a React Native developer</Link>
            {landing.map((p) => (
              <Link key={p.slug} href={landingPath(p)}>
                {p.navLabel}
              </Link>
            ))}
          </nav>
        )}
        <div className="footer__base">
          <p className="meta">
            © {new Date().getFullYear()} {identity.firstName} {identity.lastName}
          </p>
          <p className="meta">Set in Instrument Serif and Geist · Next.js · Hosted on Vercel</p>
        </div>
      </div>
    </footer>
  );
}
