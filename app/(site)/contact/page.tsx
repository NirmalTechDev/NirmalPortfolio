import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { ContactForm } from "@/components/site/ContactForm";
import { PageHead } from "@/components/site/parts";
import { getPortfolio } from "@/lib/content/api";
import { pageJsonLd, pageMetadata } from "@/lib/seo";

const description =
  "Hire Nirmal Ranpariya for React Native, mobile app development, Node.js, Firebase and product engineering work.";

export const metadata: Metadata = pageMetadata({
  title: "Contact Nirmal Ranpariya | Start a React Native Project",
  description,
  path: "/contact",
});

export default async function ContactPage() {
  const { site } = await getPortfolio();
  const { email, socials: links } = site.identity;
  return (
    <>
      <JsonLd
        data={{
          ...pageJsonLd({ path: "/contact", name: "Contact Nirmal Ranpariya | Start a React Native Project", description, crumbs: [{ name: "Contact", path: "/contact" }] }),
        }}
      />
      <PageHead n="04" label="Contact" title={<>Have a product problem? <em>Let&apos;s talk about the system.</em></>}>
        <p className="lead">
          {site.contactPage.intro || "Tell me what you are building and where it hurts. I read every message and reply by email."}
        </p>
      </PageHead>

      <section className="frame band" data-rail="Write to me">
        <div className="grid" style={{ rowGap: "var(--s-7)" }}>
          <div style={{ gridColumn: "1 / -1" }} className="contact-form">
            <ContactForm />
          </div>
          <aside style={{ gridColumn: "1 / -1" }} aria-label="Other ways to reach me">
            <div className="grid pair" style={{ borderTop: "1px solid var(--ink)" }}>
              <div className="pair__l">
                <h2 className="meta"><b>Email</b></h2>
              </div>
              <p className="pair__r">
                <a className="tlink" href={`mailto:${email}`}>{email}</a>
              </p>
            </div>
            <div className="grid pair">
              <div className="pair__l">
                <h2 className="meta"><b>Elsewhere</b></h2>
              </div>
              <ul className="pair__r plain-list">
                {links.map((l) => (
                  <li key={l.href}>
                    <a className="tlink" href={l.href} target="_blank" rel="noopener noreferrer">
                      {l.label} <span className="arr" aria-hidden="true">↗</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
