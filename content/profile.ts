import { professionalProfiles, nirmalIdentity } from "@/lib/seo";

export const RESUME_HREF = "/Nirmal_Ranpariya_Resume.pdf";

export const nav = [
  { n: "01", label: "Work", href: "/work" },
  { n: "02", label: "About", href: "/about" },
  { n: "03", label: "Experience", href: "/experience" },
  { n: "04", label: "Contact", href: "/contact" },
] as const;

export const links = [
  { label: "LinkedIn", href: professionalProfiles.linkedin },
  { label: "GitHub", href: professionalProfiles.github },
  { label: "Upwork", href: professionalProfiles.upwork },
] as const;

export const email = nirmalIdentity.email;

export const principles = [
  {
    title: "Start with the journey, not the screen.",
    body: "A screen is the last link in a long chain: onboarding, payment, notification, the return trip. I map the chain before I open an editor.",
  },
  {
    title: "Keep state boring.",
    body: "Predictable state beats clever state. Side effects live in one place, so when something breaks there is one place to look.",
  },
  {
    title: "Treat the device as a constraint.",
    body: "Phones differ, networks fail, lists get long. Lazy loading, image caching and lean queries are part of the feature, not a later pass.",
  },
  {
    title: "Know where JavaScript stops.",
    body: "Camera, push and permissions live at the platform boundary. I am comfortable crossing into Java and Swift when the device demands it.",
  },
  {
    title: "Release is part of the product.",
    body: "Store submissions and over-the-air updates decide how fast a fix reaches people. I plan for that from the start.",
  },
  {
    title: "Leave it readable.",
    body: "The next engineer will not have my context. Clear names, small modules and a structure they can follow without asking me.",
  },
] as const;

/**
 * Capability map. Categories follow how a mobile product is actually built.
 * `note` marks honest depth where it matters; there are no percentages.
 */
export const capabilities: { group: string; items: { name: string; note?: string }[] }[] = [
  {
    group: "Mobile",
    items: [
      { name: "React Native" },
      { name: "Expo" },
      { name: "Android" },
      { name: "iOS" },
      { name: "Native modules", note: "Java, Swift (basic)" },
      { name: "React Navigation" },
    ],
  },
  {
    group: "Application",
    items: [
      { name: "TypeScript" },
      { name: "JavaScript", note: "ES6+" },
      { name: "React" },
      { name: "Next.js", note: "working" },
      { name: "Redux / Redux Saga" },
    ],
  },
  {
    group: "Backend",
    items: [
      { name: "REST API integration" },
      { name: "Node.js", note: "working" },
      { name: "Express" },
      { name: "RabbitMQ", note: "messaging" },
    ],
  },
  {
    group: "Realtime",
    items: [{ name: "Firebase Cloud Messaging" }, { name: "Socket.IO" }, { name: "Push notifications" }],
  },
  {
    group: "Data",
    items: [
      { name: "Firebase Firestore" },
      { name: "PostgreSQL" },
      { name: "MySQL" },
      { name: "MongoDB" },
    ],
  },
  {
    group: "Delivery",
    items: [
      { name: "Google Play" },
      { name: "App Store" },
      { name: "OTA", note: "Expo, CodePush" },
      { name: "Deep linking" },
      { name: "Git" },
      { name: "CI/CD", note: "working" },
    ],
  },
  {
    group: "AI",
    items: [{ name: "AI-assisted development" }, { name: "AI-integrated app features" }],
  },
];

export const role = {
  company: "Ofniinfo Software Solutions Pvt. Ltd.",
  title: "React Native Developer",
  dates: "June 2024 — Present",
  location: "Surat, India",
  responsibilities: [
    "Develop and maintain cross-platform mobile applications with React Native and TypeScript.",
    "Integrate REST APIs and Firebase services: Authentication, Firestore and Cloud Messaging.",
    "Build navigation with React Navigation and manage application state with Redux Saga.",
    "Work with UI/UX designers to build responsive, high-performance interfaces.",
    "Write native modules and platform-specific code in Java and Swift for camera, push notifications and permissions.",
    "Take part in deployments to Google Play and the App Store.",
  ],
  systems: [
    { name: "OpiGo", href: "/work/opigo" },
    { name: "by.U", href: "/work/byu" },
    { name: "SELA", href: "/work/sela" },
  ],
  tech: ["React Native", "TypeScript", "Redux Saga", "React Navigation", "Firebase", "Java", "Swift", "CodePush"],
};

export const journey = [
  {
    year: "2019 — 2021",
    label: "Groundwork",
    text: "Finished secondary school in 2019 and higher secondary in 2021, in Upleta, Gujarat.",
  },
  {
    year: "2022",
    label: "Foundation",
    text: "Started a BSc in IT (Computer Science) at Saurashtra University, Rajkot.",
  },
  {
    year: "2024",
    label: "Mobile systems",
    text: "Joined Ofniinfo Software Solutions in Surat as a React Native developer. Work there includes OpiGo, by.U and SELA.",
  },
  {
    year: "2026",
    label: "Whole products",
    text: "Designed and built Collective Ledger OS end to end, from the finance engine to the interface, and deployed it.",
  },
] as const;

export const education = [
  { name: "BSc IT (Computer Science)", place: "Saurashtra University, Rajkot", when: "Started 2022" },
  { name: "Higher Secondary (HSC)", place: "Delta Science School, Upleta", when: "May 2021" },
  { name: "Secondary (SSC)", place: "Krishna School, Upleta", when: "March 2019" },
];

export const languages = "English (intermediate) · Hindi (fluent) · Gujarati (fluent)";
