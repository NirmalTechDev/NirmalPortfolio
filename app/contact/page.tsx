import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/app/component/ContactForm";
import { nirmalIdentity, pageMetadata, professionalProfiles } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Contact Nirmal Ranpariya",
  description:
    "Contact Nirmal Ranpariya for React Native, mobile app, full-stack web, Node.js, Firebase, and product development work.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <main>
      <section className="section wrap">
        <p className="muted" style={{ letterSpacing: ".28em", textTransform: "uppercase", fontSize: 12 }}>
          Contact
        </p>
        <h1 style={{ fontSize: "var(--title)", margin: "12px 0" }}>Contact Nirmal Ranpariya</h1>
        <p className="muted" style={{ maxWidth: 760, fontSize: "var(--lead)" }}>
          Reach out for React Native apps, full-stack web products, APIs, Firebase workflows, and
          product development collaborations.
        </p>
      </section>

      <section className="section wrap">
        <div className="home-grid">
          <div className="home-card" style={{ gridColumn: "span 7" }}>
            <ContactForm />
          </div>
          <aside className="home-card" style={{ gridColumn: "span 5" }}>
            <h2>Direct Links</h2>
            <p>
              Email: <a href={`mailto:${nirmalIdentity.email}`}>{nirmalIdentity.email}</a>
            </p>
            <p>
              Phone: <a href={`tel:${nirmalIdentity.phone}`}>{nirmalIdentity.phone}</a>
            </p>
            <p>
              LinkedIn:{" "}
              <a href={professionalProfiles.linkedin} target="_blank" rel="noreferrer">
                Nirmal Ranpariya
              </a>
            </p>
            <p>
              GitHub:{" "}
              <a href={professionalProfiles.github} target="_blank" rel="noreferrer">
                NirmalTechDev
              </a>
            </p>
            <Link className="btn" href="/about" style={{ marginTop: 18 }}>
              About Nirmal Ranpariya
            </Link>
          </aside>
        </div>
      </section>
    </main>
  );
}
