/**
 * Shapes of portfolio content as stored by the backend (and mirrored by the static
 * fallback). The public site renders only these types.
 */

export interface Img {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
  publicId?: string;
}

export interface FlowLane {
  label: string;
  steps: string[];
}

export interface LabelValue {
  label: string;
  value: string;
}

export interface Link {
  label: string;
  href: string;
}

export interface Project {
  _id?: string;
  slug: string;
  number: string;
  title: string;
  kind: string;
  status: string;
  oneLiner: string;
  spec: LabelValue[];
  links: Link[];
  cover?: Img;
  icon?: Img;
  screens: Img[];
  screenLayout: "phones" | "wide";
  phoneColumns?: 4 | 5;
  context: string[];
  problem?: string[];
  role: { intro: string; items: string[] };
  system?: { title: string; caption: string; lanes: FlowLane[] };
  engineering?: { title: string; body: string }[];
  experience?: string[];
  challenges?: { title: string; body: string }[];
  outcome: string[];
  stack: { group: string; items: string[] }[];
  reflection?: string[];
  seoDescription?: string;
  isVisible?: boolean;
  order?: number;
  updatedAt?: string;
}

export interface ExperienceEntry {
  _id?: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string | null;
  current?: boolean;
  description: string;
  technologies: string[];
  location?: string;
  datesLabel?: string;
  responsibilities: string[];
  systems: { name: string; href: string }[];
  order?: number;
  isVisible?: boolean;
}

export interface Capability {
  group: string;
  items: { name: string; note?: string }[];
}

export interface Faq {
  q: string;
  a: string;
}

/**
 * A search-focused page. "service" pages live at /services/<slug>; "location" pages have fixed
 * addresses (/react-native-developer-surat, /react-native-developer-india) and only their text is editable.
 */
export interface LandingPage {
  slug: string;
  kind: "service" | "location";
  /** Short name used in menus and cards. */
  navLabel: string;
  /** The page's visible H1. */
  heading: string;
  /** <title> shown in Google. Keep under ~60 characters. */
  metaTitle: string;
  /** Snippet shown in Google. Keep under ~155 characters. */
  metaDescription: string;
  /** One-sentence summary used on cards. */
  summary: string;
  intro: string;
  includes: string[];
  sections: { heading: string; body: string }[];
  faqs: Faq[];
  /** Case-study slugs shown as proof. */
  projects: string[];
  isVisible?: boolean;
}

export interface ServicesContent {
  heading: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  engagement: LabelValue[];
  process: { title: string; body: string }[];
  faqs: Faq[];
  pages: LandingPage[];
}

export interface SiteContent {
  identity: {
    firstName: string;
    lastName: string;
    title: string;
    shortRole: string;
    email: string;
    phone: string;
    location: string;
    description: string;
    availability: string;
    photo: { url: string; alt: string; publicId?: string; width?: number; height?: number };
    socials: Link[];
    languages: string;
  };
  home: {
    lead: string;
    specs: LabelValue[];
    workHeading: string;
    workIntro: string;
    buildHeading: string;
    capabilitiesHeading: string;
    capabilitiesIntro: string;
    contactHeading: string;
    contactLead: string;
  };
  about: {
    heading: string;
    headingEmphasis: string;
    lead: string;
    paragraphs: string[];
    pairs: { label: string; body: string }[];
    journey: { year: string; label: string; text: string }[];
    education: { name: string; place: string; when: string }[];
  };
  workPage: { intro: string };
  experiencePage: { intro: string };
  contactPage: { intro: string };
  principles: { title: string; body: string }[];
  capabilities: Capability[];
  services: ServicesContent;
  updatedAt?: string;
}

export interface ResumeInfo {
  title: string;
  fileUrl: string;
  updatedAt?: string;
}

export interface PortfolioData {
  site: SiteContent;
  projects: Project[];
  experience: ExperienceEntry[];
  resume: ResumeInfo | null;
  /** "live" when served by the backend, "fallback" when the static snapshot was used. */
  source: "live" | "fallback";
}
