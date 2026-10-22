import type { Metadata } from "next";

export const SITE_URL = "https://nirmalranpariya.in";
export const PERSON_ID = `${SITE_URL}/#person`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
/** Bump when page content changes; used for sitemap lastModified instead of the build time. */
export const CONTENT_UPDATED = "2026-10-03";
export const PROFILE_IMAGE = "/nirmal-ranpariya-portrait.jpg";

export const professionalProfiles = {
  github: "https://github.com/NirmalTechDev",
  linkedin: "https://www.linkedin.com/in/nirmal-ranpariya-625766266",
  upwork: "https://www.upwork.com/freelancers/~0139b1b97fb2cf2377",
};

export const nirmalIdentity = {
  name: "Nirmal Ranpariya",
  title: "React Native Developer & Software Engineer",
  email: "nirmaltech.dev@gmail.com",
  phone: "+919664648614",
  location: "Surat, India",
  description:
    "Nirmal Ranpariya is a React Native developer and software engineer in Surat, India, building mobile apps, APIs and release pipelines.",
  skills: [
    "React Native",
    "React Native app development",
    "Android app development",
    "iOS app development",
    "Expo",
    "Push notifications",
    "Firebase Cloud Messaging",
    "TypeScript",
    "JavaScript",
    "React",
    "Next.js",
    "Node.js",
    "Firebase",
    "REST APIs",
    "Mobile app development",
    "Android",
    "iOS",
  ],
};

export function absoluteUrl(path = "/") {
  if (/^https?:\/\//i.test(path)) return path;
  if (path === "/") return `${SITE_URL}/`;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function pageMetadata({
  title,
  description,
  path = "/",
  image = "/opengraph-image",
}: {
  title: string;
  description: string;
  path?: string;
  image?: string;
}): Metadata {
  const url = absoluteUrl(path);
  const imageUrl = absoluteUrl(image);

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      url,
      siteName: "Nirmal Ranpariya",
      locale: "en_IN",
      title,
      description,
      ...(imageUrl ? { images: [{ url: imageUrl, alt: title }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(imageUrl ? { images: [imageUrl] } : {}),
    },
  };
}

export function personJsonLd() {
  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: nirmalIdentity.name,
    url: absoluteUrl("/"),
    jobTitle: nirmalIdentity.title,
    image: absoluteUrl(PROFILE_IMAGE),
    email: `mailto:${nirmalIdentity.email}`,
    telephone: nirmalIdentity.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Surat",
      addressRegion: "Gujarat",
      addressCountry: "IN",
    },
    worksFor: {
      "@type": "Organization",
      name: "Ofniinfo Software Solutions Pvt. Ltd.",
    },
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "Saurashtra University",
    },
    knowsAbout: nirmalIdentity.skills,
    hasOccupation: {
      "@type": "Occupation",
      name: "React Native Developer",
      occupationLocation: { "@type": "City", name: "Surat" },
      skills: nirmalIdentity.skills.join(", "),
    },
    makesOffer: { "@id": SERVICE_ID },
    sameAs: Object.values(professionalProfiles),
  };
}

export const SERVICE_ID = `${SITE_URL}/services#service`;

const AREAS: Record<string, unknown[]> = {
  surat: [
    { "@type": "City", name: "Surat" },
    { "@type": "State", name: "Gujarat" },
  ],
  india: [{ "@type": "Country", name: "India" }, "Worldwide"],
  default: [{ "@type": "City", name: "Surat" }, { "@type": "Country", name: "India" }, "Worldwide"],
};

/** The freelance practice itself: who offers what, where. Used on /services. */
export function professionalServiceJsonLd(offers: { name: string; path: string; description: string }[]) {
  return {
    "@type": "ProfessionalService",
    "@id": SERVICE_ID,
    name: "Nirmal Ranpariya — React Native App Development",
    url: absoluteUrl("/services"),
    image: absoluteUrl(PROFILE_IMAGE),
    email: nirmalIdentity.email,
    telephone: nirmalIdentity.phone,
    address: { "@type": "PostalAddress", addressLocality: "Surat", addressRegion: "Gujarat", addressCountry: "IN" },
    areaServed: AREAS.default,
    founder: { "@id": PERSON_ID },
    knowsAbout: nirmalIdentity.skills,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "React Native development services",
      itemListElement: offers.map((o) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: o.name, url: absoluteUrl(o.path), description: o.description },
      })),
    },
  };
}

/** One service or location page: the Service plus its FAQ. */
export function serviceJsonLd(p: { name: string; path: string; description: string; serviceType: string; area?: "surat" | "india" }) {
  return {
    "@type": "Service",
    "@id": `${absoluteUrl(p.path)}#service`,
    name: p.name,
    serviceType: p.serviceType,
    description: p.description,
    url: absoluteUrl(p.path),
    provider: { "@id": PERSON_ID },
    areaServed: AREAS[p.area || "default"],
    isRelatedTo: { "@id": SERVICE_ID },
  };
}

export function faqJsonLd(path: string, faqs: { q: string; a: string }[]) {
  return {
    "@type": "FAQPage",
    "@id": `${absoluteUrl(path)}#faq`,
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}

export function homeJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: absoluteUrl("/"),
        name: "Nirmal Ranpariya",
        alternateName: ["Nirmal Ranpariya Portfolio", "nirmalranpariya.in"],
        publisher: {
          "@id": PERSON_ID,
        },
      },
      {
        "@type": "WebPage",
        "@id": `${absoluteUrl("/")}#webpage`,
        url: absoluteUrl("/"),
        name: "Nirmal Ranpariya | React Native Developer & Software Engineer",
        isPartOf: {
          "@id": WEBSITE_ID,
        },
        about: {
          "@id": PERSON_ID,
        },
        mainEntity: {
          "@id": PERSON_ID,
        },
      },
      personJsonLd(),
    ],
  };
}

export function profilePageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfilePage",
        "@id": `${absoluteUrl("/about")}#profilepage`,
        url: absoluteUrl("/about"),
        name: "About Nirmal Ranpariya",
        isPartOf: {
          "@id": WEBSITE_ID,
        },
        about: {
          "@id": PERSON_ID,
        },
        mainEntity: {
          "@id": PERSON_ID,
        },
      },
      personJsonLd(),
    ],
  };
}

/** WebPage (+ optional breadcrumb) graph for inner pages. */
export function pageJsonLd({
  path,
  name,
  description,
  crumbs = [],
}: {
  path: string;
  name: string;
  description: string;
  crumbs?: { name: string; path: string }[];
}) {
  const url = absoluteUrl(path);
  const graph: Record<string, unknown>[] = [
    {
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      url,
      name,
      description,
      isPartOf: { "@id": WEBSITE_ID },
      about: { "@id": PERSON_ID },
      author: { "@id": PERSON_ID },
    },
  ];
  if (crumbs.length) {
    graph.push({
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: [{ name: "Home", path: "/" }, ...crumbs].map((c, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: c.name,
        item: absoluteUrl(c.path),
      })),
    });
  }
  return { "@context": "https://schema.org", "@graph": graph };
}

/** Structured data for a case study: the work itself, linked to the person and the breadcrumb. */
export function projectJsonLd(p: {
  slug: string;
  title: string;
  oneLiner: string;
  kind: string;
  cover?: { src: string };
  links: { label: string; href: string }[];
  independent: boolean;
  mobile: boolean;
}) {
  const url = absoluteUrl(`/work/${p.slug}`);
  return {
    "@type": p.mobile ? "MobileApplication" : "WebApplication",
    "@id": `${url}#work`,
    name: p.title,
    description: p.oneLiner,
    url,
    applicationCategory: p.mobile ? "LifestyleApplication" : "FinanceApplication",
    operatingSystem: p.mobile ? "Android, iOS" : "Web",
    ...(p.cover ? { image: absoluteUrl(p.cover.src) } : {}),
    ...(p.links.length ? { sameAs: p.links.map((l) => l.href) } : {}),
    // Credit as author only where the product is my own; elsewhere I contributed.
    ...(p.independent ? { author: { "@id": PERSON_ID } } : { contributor: { "@id": PERSON_ID } }),
    mainEntityOfPage: `${url}#webpage`,
  };
}
