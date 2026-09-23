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
  email: "nirmatech.dev@gmail.com",
  phone: "+919664648614",
  location: "India",
  description:
    "Nirmal Ranpariya is a React Native Developer and Software Engineer specializing in mobile applications, React Native, TypeScript, Node.js, Firebase, APIs, and modern product development.",
  skills: [
    "React Native",
    "React.js",
    "Next.js",
    "TypeScript",
    "JavaScript",
    "Node.js",
    "Firebase",
    "MongoDB",
    "REST APIs",
    "Mobile app development",
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
  image = PROFILE_IMAGE,
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
      images: [
        {
          url: imageUrl,
          alt: "Nirmal Ranpariya, React Native Developer and Software Engineer",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
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
      addressCountry: "IN",
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
