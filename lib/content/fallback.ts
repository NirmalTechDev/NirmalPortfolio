/**
 * Static snapshot of the portfolio, built from the original hand-written content files.
 * Used (1) as the seed for the database migration and (2) as a safety net so the public
 * site still renders if the backend is unreachable or not yet migrated.
 */
import { capabilities, education, journey, languages, links, principles, role, RESUME_HREF } from "@/content/profile";
import { projects as legacyProjects } from "@/content/projects";
import { nirmalIdentity, PROFILE_IMAGE } from "@/lib/seo";
import { fallbackServices } from "./services";
import type { ExperienceEntry, Project, ResumeInfo, SiteContent } from "./types";

export const fallbackSite: SiteContent = {
  identity: {
    firstName: "Nirmal",
    lastName: "Ranpariya",
    title: nirmalIdentity.title,
    shortRole: "React Native",
    email: nirmalIdentity.email,
    phone: nirmalIdentity.phone,
    location: nirmalIdentity.location,
    description: nirmalIdentity.description,
    availability: "Open to select projects",
    photo: { url: PROFILE_IMAGE, alt: "Portrait of Nirmal Ranpariya", width: 1000, height: 1000 },
    socials: links.map((l) => ({ label: l.label, href: l.href })),
    languages,
  },
  home: {
    lead: "I build mobile products, and the systems behind the screen: the APIs, notifications, native modules and release pipeline that get a change to real people.",
    specs: [
      { label: "Now", value: "React Native developer at Ofniinfo Software Solutions, Surat" },
      { label: "Shipped", value: "OpiGo and by.U, both on Google Play and the App Store" },
      { label: "Works in", value: "React Native · TypeScript · Node.js · Firebase" },
    ],
    workHeading: "Two apps in the stores, one product I built alone.",
    workIntro: "Each entry is a case study: what the product does, what I built, and how it reaches users.",
    buildHeading: "Six habits I work by.",
    capabilitiesHeading: "What I work with, by where it sits in a product.",
    capabilitiesIntro: "Where my depth is limited, the entry says so. There are no scores.",
    contactHeading: "Have a product problem?",
    contactLead: "Let's talk about the system, not just the screen.",
  },
  about: {
    heading: "An engineer who cares what happens",
    headingEmphasis: "after the screen.",
    lead: "I'm Nirmal Ranpariya, a software engineer from Gujarat, India. I work mostly in React Native, building Android and iOS apps.",
    paragraphs: [
      "Day to day that means the app and the parts around it: API integration, Firebase, push notifications, native modules and getting builds into the stores. I studied IT and computer science, and I keep building whole things rather than pieces. Collective Ledger, which I designed and shipped end to end, is the clearest example.",
      "That habit shapes how I think about mobile work. A feature is not done when the screen renders. It is done when it holds up on a slow network, on an older phone, and after the next release.",
    ],
    pairs: [
      {
        label: "Problems I enjoy",
        body: "Flows where state, network and the device all meet: onboarding, ordering, recharge, real-time updates and notifications. Places where a small decision in the data layer decides whether the screen feels calm or broken.",
      },
      {
        label: "Exploring now",
        body: "AI-assisted development and AI-integrated app features, and taking whole products from data model to deployment, as with Collective Ledger.",
      },
      {
        label: "How I work",
        body: "I start from the user's journey, keep state predictable and treat the release process as part of the product. The six habits are on the home page.",
      },
    ],
    journey: journey.map((j) => ({ year: j.year, label: j.label, text: j.text })),
    education: education.map((e) => ({ ...e })),
  },
  workPage: {
    intro: "Four products. Each page says what I built, how it fits together and what I did not do, because the honest version is the useful one.",
  },
  experiencePage: { intro: "One role so far, and I've tried to describe it plainly." },
  contactPage: { intro: "" },
  principles: principles.map((p) => ({ title: p.title, body: p.body })),
  capabilities: capabilities.map((c) => ({ group: c.group, items: c.items.map((i) => ({ ...i })) })),
  services: fallbackServices,
};

export const fallbackProjects: Project[] = legacyProjects.map((p, index) => ({
  slug: p.slug,
  number: p.number,
  title: p.title,
  kind: p.kind,
  status: p.status,
  oneLiner: p.oneLiner,
  spec: p.spec.map(([label, value]) => ({ label, value })),
  links: p.links.map((l) => ({ ...l })),
  cover: p.cover ? { ...p.cover } : undefined,
  icon: p.icon ? { ...p.icon } : undefined,
  screens: p.screens.map((s) => ({ ...s })),
  screenLayout: p.screenLayout,
  phoneColumns: p.phoneColumns,
  context: [...p.context],
  problem: p.problem ? [...p.problem] : undefined,
  role: { intro: p.role.intro, items: [...p.role.items] },
  system: p.system ? { ...p.system, lanes: p.system.lanes.map((l) => ({ label: l.label, steps: [...l.steps] })) } : undefined,
  engineering: p.engineering?.map((e) => ({ ...e })),
  experience: p.experience ? [...p.experience] : undefined,
  challenges: p.challenges?.map((c) => ({ ...c })),
  outcome: [...p.outcome],
  stack: p.stack.map((s) => ({ group: s.group, items: [...s.items] })),
  reflection: p.reflection ? [...p.reflection] : undefined,
  order: index,
  isVisible: true,
}));

export const fallbackExperience: ExperienceEntry[] = [
  {
    company: role.company,
    position: role.title,
    startDate: "2024-06-01",
    endDate: null,
    current: true,
    description: role.responsibilities[0],
    technologies: [...role.tech],
    location: role.location,
    datesLabel: role.dates,
    responsibilities: [...role.responsibilities],
    systems: role.systems.map((s) => ({ ...s })),
    order: 0,
    isVisible: true,
  },
];

export const fallbackResume: ResumeInfo = { title: "Résumé", fileUrl: RESUME_HREF };
