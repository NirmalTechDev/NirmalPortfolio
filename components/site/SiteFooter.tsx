import Link from "next/link";
import { email, links, nav, RESUME_HREF } from "@/content/profile";

export function SiteFooter() {
  return (
    <footer className="footer">
      <div className="frame">
        <p className="footer__name" aria-hidden="true">
          Nirmal
          <br />
          Ranpariya
        </p>
        <div className="grid footer__cols">
          <div>
            <p className="meta">Software engineer</p>
            <p>React Native · Surat, India</p>
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
                <a className="tlink" href={RESUME_HREF} target="_blank" rel="noopener noreferrer">
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
        <div className="footer__base">
          <p className="meta">© {new Date().getFullYear()} Nirmal Ranpariya</p>
          <p className="meta">Set in Instrument Serif and Geist · Next.js · Hosted on Vercel</p>
        </div>
      </div>
    </footer>
  );
}
