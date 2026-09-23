import type { Metadata } from "next";

export const SITE_URL = "https://nirmalranpariya.in";
export const PERSON_ID = `${SITE_URL}/#person`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const PROFILE_IMAGE = "/Nirmal-Ranpariya-React-Native-Developer.jpg";

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
    "Nirmal Ranpariya is a React Native Developer and Software Engineer specializing in mobile applications, React Native, TypeScript, Node.js, Firebase, APIs, and modern product development.",
  skills: [
    "React Native",
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
    sameAs: Object.values(professionalProfiles),
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
