import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { JsonLd } from "@/app/components/JsonLd";
import {
  nirmalIdentity,
  pageMetadata,
  professionalProfiles,
  profilePageJsonLd,
  PROFILE_IMAGE,
} from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "About Nirmal Ranpariya | React Native Developer & Software Engineer",
  description:
    "Learn about Nirmal Ranpariya, a React Native Developer and Software Engineer focused on mobile applications, full-stack products, APIs, Firebase, and TypeScript.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <main>
      <JsonLd data={profilePageJsonLd()} />
      <section className="section wrap hero">
        <div className="hero-image reveal in">
          <Image
            src={PROFILE_IMAGE}
            alt="Nirmal Ranpariya, React Native Developer and Software Engineer"
            width={420}
            height={420}
            priority
          />
        </div>
        <div className="hero-content reveal in">
          <p className="muted" style={{ letterSpacing: ".28em", textTransform: "uppercase", fontSize: 12 }}>
            About Nirmal Ranpariya
          </p>
          <h1>Nirmal Ranpariya</h1>
          <p className="muted">
            React Native Developer and Software Engineer building mobile apps, full-stack web products,
            backend APIs, Firebase workflows, and polished product experiences.
          </p>
          <div className="cta">
            <Link className="btn primary" href="/projects">
              View Nirmal Ranpariya&apos;s projects
            </Link>
            <Link className="btn" href="/contact">
              Contact Nirmal Ranpariya
            </Link>
          </div>
        </div>
      </section>

      <section className="section wrap">
        <div className="home-grid">
          <article className="home-card">
            <h2>Professional Profile</h2>
            <p>
              Nirmal focuses on practical product engineering across React Native, React.js, Next.js,
              Node.js, Firebase, MongoDB, and TypeScript. His portfolio highlights mobile-first apps,
              full-stack dashboards, realtime features, authentication, and API-backed product flows.
            </p>
          </article>
          <article className="home-card">
            <h2>Engineering Focus</h2>
            <p>
              His work centers on performant cross-platform mobile interfaces, responsive web
              experiences, clean REST APIs, realtime data, secure authentication, and product features
              that are easy to use on mobile and desktop.
            </p>
          </article>
          <article className="home-card">
            <h2>Current Focus</h2>
            <p>
              Nirmal is focused on React Native apps, TypeScript product development, Firebase-backed
              workflows, Node.js APIs, and full-stack tools for finance, social, commerce, and community
              software.
            </p>
          </article>
        </div>
      </section>

      <section className="section wrap">
        <h2 style={{ fontSize: "var(--subtitle)", marginBottom: "var(--gap)" }}>Technologies</h2>
        <div className="gallery">
          {nirmalIdentity.skills.map((skill) => (
            <div className="tile" key={skill}>
              <div className="tile-content">
                <h3>{skill}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section wrap">
        <div className="home-grid">
          <article className="home-card">
            <h2>Professional Links</h2>
            <p>
              Connect with Nirmal through verified public profiles:{" "}
              <a href={professionalProfiles.linkedin} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
              ,{" "}
              <a href={professionalProfiles.github} target="_blank" rel="noreferrer">
                GitHub
              </a>
              , and{" "}
              <a href={professionalProfiles.upwork} target="_blank" rel="noreferrer">
                Upwork
              </a>
              .
            </p>
          </article>
          <article className="home-card">
            <h2>Contact</h2>
            <p>
              For professional inquiries, email{" "}
              <a href={`mailto:${nirmalIdentity.email}`}>{nirmalIdentity.email}</a> or use the
              contact form.
            </p>
            <Link className="btn primary" href="/contact" style={{ marginTop: 18 }}>
              Contact Nirmal Ranpariya
            </Link>
          </article>
        </div>
      </section>
    </main>
  );
}
