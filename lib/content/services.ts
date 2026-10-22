/**
 * Built-in text for the hiring/services pages (editable from the dashboard: Profile & pages → Services).
 * Each page targets one group of searches — see SEO_KEYWORDS.md. Keep it honest: only claim work
 * that is shown in the case studies.
 */
import type { LandingPage, ServicesContent } from "./types";

/** Location pages have fixed addresses; their text is editable, their slug is not. */
export const LOCATION_SLUGS = ["react-native-developer-surat", "react-native-developer-india"] as const;

export const landingPath = (p: Pick<LandingPage, "kind" | "slug">) => (p.kind === "location" ? `/${p.slug}` : `/services/${p.slug}`);

const pages: LandingPage[] = [
  {
    slug: "react-native-app-development",
    kind: "service",
    navLabel: "React Native app development",
    heading: "React Native app development",
    metaTitle: "React Native App Development Services | Nirmal Ranpariya",
    metaDescription:
      "React Native app development for Android and iOS: TypeScript, Node.js or Firebase backend, store releases and over-the-air updates for apps that ship.",
    summary: "A complete Android and iOS app from one TypeScript codebase, with the backend and release pipeline it needs.",
    intro:
      "I build React Native apps in TypeScript for Android and iOS from a single codebase — and the parts around the screens that decide whether an app works in the real world: the API, push notifications, native modules, and the release pipeline that gets a fix to users the same day.",
    includes: [
      "Android and iOS app from one React Native + TypeScript codebase",
      "Screens, navigation and state that stay predictable as the app grows",
      "API integration, or a Node.js / Firebase backend built for the app",
      "Push notifications, deep links, analytics and crash reporting",
      "Native modules in Java, Kotlin or Swift when JavaScript isn't enough",
      "Play Store and App Store release, plus over-the-air updates",
    ],
    sections: [
      {
        heading: "Why React Native",
        body: "One codebase for Android and iOS means one team, one set of business rules and features that ship to both platforms on the same day. For most product apps — fintech, social, marketplaces, telecom self-care, internal tools — it gives native-feeling performance at a fraction of the cost of two separate apps.",
      },
      {
        heading: "Apps I've built with it",
        body: "OpiGo, a social trading app, and by.U, Telkomsel's all-digital telecom app in Indonesia, are both live on Google Play and the App Store. SELA is a location-based classifieds marketplace with real-time chat. Each case study on this site explains what I built and the engineering decisions behind it.",
      },
      {
        heading: "How the work is structured",
        body: "We start from the user journey — onboarding, payment, notification, the return visit — not from a list of screens. I agree the first release with you, ship it to internal testers early, and keep a working build in your hands every week, so you see progress instead of hearing about it.",
      },
    ],
    faqs: [
      {
        q: "Is React Native good enough for a production app?",
        a: "Yes. React Native powers large production apps, and the apps I've worked on — OpiGo and by.U — are live on both stores. Where a feature needs the device directly (camera, background work, permissions) I write a native module in Java, Kotlin or Swift.",
      },
      {
        q: "Do you use Expo or the bare React Native CLI?",
        a: "Either. Expo is the faster start for most new apps and supports custom native code through development builds; the bare CLI is right when an app already exists or needs unusual native setup. I'll recommend one for your project and explain why.",
      },
      {
        q: "Can you build the backend too?",
        a: "Yes. I build APIs in Node.js and Express with MongoDB, or use Firebase (Auth, Firestore, Cloud Messaging) when that fits better. Collective Ledger on this site is a full product I built end to end.",
      },
    ],
    projects: ["opigo", "byu", "sela"],
  },
  {
    slug: "ios-android-app-development",
    kind: "service",
    navLabel: "iOS & Android apps",
    heading: "iOS and Android app development",
    metaTitle: "iOS & Android App Developer | Nirmal Ranpariya",
    metaDescription:
      "One app for iPhone and Android with React Native: Swift and Kotlin native modules, App Store and Play Store releases, TestFlight and review handled.",
    summary: "One app that feels right on iPhone and Android — and gets through App Store and Play Store review.",
    intro:
      "You need your app on iPhone and Android, and it has to feel at home on both. I build cross-platform apps with React Native, write platform code where the device demands it, and take care of the store side: signing, TestFlight, Play Console tracks and review.",
    includes: [
      "Cross-platform app with platform-correct navigation, gestures and permissions",
      "Native modules in Swift / Objective-C and Kotlin / Java",
      "Camera, location, biometrics, files and background tasks",
      "App Store Connect, TestFlight and Google Play Console setup",
      "Store listing, screenshots checklist and review guidance",
      "Release builds, signing and versioning that don't break on update",
    ],
    sections: [
      {
        heading: "Two platforms, one feel",
        body: "For by.U the app is the only channel customers have, so it had to feel smooth on every Android and iOS device. The work is in the details: lists that scroll smoothly, permissions asked at the right moment, and layouts that respect each platform's conventions.",
      },
      {
        heading: "Getting through review",
        body: "Store rejections usually come from privacy declarations, permission wording, login requirements or missing account deletion. I prepare for those before submitting and handle the back-and-forth with reviewers if it happens.",
      },
    ],
    faqs: [
      {
        q: "Will the app look the same on iPhone and Android?",
        a: "It will share your brand and most of its code, but each platform keeps the behaviour its users expect — back navigation on Android, swipe gestures on iOS, native date pickers and permission dialogs.",
      },
      {
        q: "Can you publish the app to the stores for me?",
        a: "Yes. I set up signing, TestFlight and Play Console testing tracks, and submit the release. The developer accounts stay in your name so you own the app.",
      },
      {
        q: "My app was rejected by Apple. Can you help?",
        a: "Yes — send me the rejection message. Most rejections are fixable with a change to permissions text, privacy details or a login flow, and I can make the change and resubmit.",
      },
    ],
    projects: ["byu", "opigo"],
  },
  {
    slug: "app-maintenance-bug-fixing",
    kind: "service",
    navLabel: "Bug fixing & upgrades",
    heading: "React Native bug fixing, upgrades and app maintenance",
    metaTitle: "React Native Bug Fixing & Upgrades | Nirmal Ranpariya",
    metaDescription:
      "Fix crashes, failing builds and slow screens in a React Native app. Version upgrades, New Architecture migration, performance and maintenance.",
    summary: "Crashes, failing builds, slow screens or an outdated React Native version in an app you already have.",
    intro:
      "Already have a React Native app that crashes, won't build, feels slow or is several versions behind? I take over existing codebases, find the cause rather than patching the symptom, and leave the project easier to work on than I found it.",
    includes: [
      "Crash fixes on Android and iOS, with crash reporting set up so they stay fixed",
      "Failing builds: Gradle, CocoaPods, Xcode and dependency conflicts",
      "React Native version upgrades and New Architecture migration",
      "Performance: slow lists, heavy images, memory use and start-up time",
      "Code review and a written report of risks in the codebase",
      "Monthly maintenance for OS updates, store policy changes and small features",
    ],
    sections: [
      {
        heading: "Taking over someone else's code",
        body: "The first step is always reading: how state flows, where side effects live, what is native and what is JavaScript. You get a short written summary of what I found and what I'd fix first, before any large change.",
      },
      {
        heading: "Performance that holds up",
        body: "On SELA every listing card is a photo, so lazy loading, image caching and lean queries were part of the feature, not a later pass. The same approach fixes slow screens in existing apps: measure first, then fix the real bottleneck.",
      },
    ],
    faqs: [
      {
        q: "Can you fix an app someone else built?",
        a: "Yes. Most maintenance work starts with code I didn't write. I begin with a short review so we both know what we're dealing with before I change anything.",
      },
      {
        q: "How long does a React Native upgrade take?",
        a: "It depends on how far behind the app is and how many native libraries it uses. A small jump can take a day or two; several major versions with the New Architecture can take a couple of weeks. I'll estimate after looking at the project.",
      },
      {
        q: "My Android build fails after updating a library. Can you help quickly?",
        a: "Yes — build failures (Gradle, Kotlin version, CocoaPods, Xcode) are usually quick to diagnose. Send the error output through the contact form.",
      },
    ],
    projects: ["sela", "opigo"],
  },
  {
    slug: "push-notifications-firebase",
    kind: "service",
    navLabel: "Push notifications & Firebase",
    heading: "React Native push notifications, Firebase and over-the-air updates",
    metaTitle: "React Native Push Notifications & Firebase Setup",
    metaDescription:
      "React Native push notifications that arrive on Android and iOS, Firebase (FCM, Auth, Firestore, Crashlytics), deep links and over-the-air updates.",
    summary: "Notifications that actually arrive, Firebase set up properly, and fixes that reach users without a store release.",
    intro:
      "Push notifications are where many apps quietly break: they arrive on one platform but not the other, fail when the app is closed, or stop after an Android update. I set up Firebase Cloud Messaging and the device side properly, plus deep links and over-the-air updates so fixes reach users the same day.",
    includes: [
      "Firebase Cloud Messaging for Android and APNs for iOS",
      "Foreground, background and closed-app notifications, with channels and permissions",
      "Deep links from a notification to the right screen",
      "Firebase Auth, Firestore, Analytics and Crashlytics",
      "Over-the-air JavaScript updates (CodePush / Expo Updates)",
      "Server-side sending from Node.js, including topics and targeting",
    ],
    sections: [
      {
        heading: "Notifications on more than one channel",
        body: "On OpiGo, real-time updates reach users in the app and through WhatsApp, so an update doesn't depend on the app being open. On by.U, push notifications are tied to the customer's live account state — usage, recharge and plan changes.",
      },
      {
        heading: "Ship fixes without waiting for review",
        body: "JavaScript changes can go out over the air with CodePush or Expo Updates, while native changes still travel through store releases. Sorting every change by which side of that line it lives on is what lets a team ship a fix the same day.",
      },
    ],
    faqs: [
      {
        q: "Why are my React Native push notifications not working on Android?",
        a: "The usual causes are the Android 13+ notification permission, a missing notification channel, battery optimisation killing background work, or a data-only message the app never displays. I check each in order and fix the one that applies.",
      },
      {
        q: "Do notifications work on iOS without extra setup?",
        a: "No — iOS needs an APNs key in Firebase, the push capability in Xcode, and a permission prompt at a sensible moment. I set all three up and test on real devices.",
      },
      {
        q: "Can you update the app without a new store release?",
        a: "For JavaScript changes, yes, with CodePush or Expo Updates. Changes to native code or permissions still need a store release, and I'll tell you which kind each change is.",
      },
    ],
    projects: ["opigo", "byu"],
  },
  {
    slug: "mvp-app-development",
    kind: "service",
    navLabel: "MVP apps for startups",
    heading: "MVP app development for startups",
    metaTitle: "MVP App Development for Startups | Nirmal Ranpariya",
    metaDescription:
      "Turn an app idea into a first version on the App Store and Play Store: a tightly scoped React Native MVP with a Node.js or Firebase backend.",
    summary: "From an idea to a first version in real users' hands — scoped tightly, built to grow.",
    intro:
      "You have an idea and need a first version in real users' hands — without paying for features nobody uses yet. I help you cut the scope to the one journey that proves the idea, then build it properly with React Native and a simple backend, so the MVP becomes version two instead of being thrown away.",
    includes: [
      "Scoping session: the one user journey the first version must nail",
      "React Native app for Android and iOS",
      "Backend with Node.js + MongoDB or Firebase",
      "Login, payments or subscriptions, notifications — only what the MVP needs",
      "Store release and analytics to learn from the first users",
      "Clean handover: documented code your next developer can pick up",
    ],
    sections: [
      {
        heading: "Small scope, real product",
        body: "Collective Ledger, which I designed and built end to end, shows the approach: one core journey — a member pays an installment and everyone can see it on the shared ledger — with late fees, investments and admin votes built around it. Starting from one journey and building outward is how an MVP stays affordable and still becomes the real product.",
      },
      {
        heading: "What you get at the end",
        body: "An app in the stores (or in testers' hands), a backend you own, analytics that show what users actually do, and a short list of what to build next based on that data.",
      },
    ],
    faqs: [
      {
        q: "How long does an MVP app take?",
        a: "Most focused MVPs take between four and ten weeks, depending on the features and whether a backend already exists. A scoping call gives you a realistic estimate before any commitment.",
      },
      {
        q: "Will I own the code and the app?",
        a: "Yes. The code, the store accounts and the backend are yours from day one.",
      },
      {
        q: "Do you work with non-technical founders?",
        a: "Yes. I explain decisions in plain language and keep a working build in your hands every week, so you always know where the product stands.",
      },
    ],
    projects: ["collective-ledger", "sela"],
  },
  {
    slug: "react-native-developer-surat",
    kind: "location",
    navLabel: "React Native developer in Surat",
    heading: "React Native developer in Surat",
    metaTitle: "React Native Developer in Surat, Gujarat | Nirmal Ranpariya",
    metaDescription:
      "React Native developer in Surat building Android and iOS apps for businesses and startups in Surat, Gujarat and across India. Meet in person or remotely.",
    summary: "Based in Surat — available to meet businesses in Surat and work with teams across Gujarat.",
    intro:
      "I'm Nirmal Ranpariya, a React Native developer based in Surat, Gujarat. I build Android and iOS apps for businesses and startups in Surat and across India — and because I'm local, we can sit at the same table to plan the app, then keep working remotely.",
    includes: [
      "Android and iOS apps for Surat businesses and startups",
      "In-person planning meetings in Surat, remote work afterwards",
      "Apps for textiles, diamonds, retail, services and trading businesses",
      "App maintenance and bug fixing for apps built by other agencies",
      "Backend and admin panel with Node.js or Firebase",
      "Available to teams in Ahmedabad, Vadodara, Rajkot and across Gujarat",
    ],
    sections: [
      {
        heading: "A Surat developer with apps in both stores",
        body: "I work as a React Native developer at Ofniinfo Software Solutions in Surat, where I've shipped OpiGo and by.U — both live on Google Play and the App Store. I take on select freelance and contract projects alongside that.",
      },
      {
        heading: "Why work with a local developer",
        body: "Some things are faster in person: understanding how your business actually runs, sketching the first version on paper, testing on the phones your customers use. After that, everything continues on WhatsApp, email and shared builds.",
      },
    ],
    faqs: [
      {
        q: "Can we meet in Surat to discuss the app?",
        a: "Yes. For projects in Surat I'm happy to meet in person for the planning stage; the rest of the work continues remotely with regular builds you can install.",
      },
      {
        q: "Do you work with businesses outside Surat?",
        a: "Yes — across Gujarat (Ahmedabad, Vadodara, Rajkot) and the rest of India, as well as international clients, entirely remotely.",
      },
      {
        q: "Are you an agency?",
        a: "No. I'm an individual developer, so you talk directly to the person writing the code — no account managers in between.",
      },
    ],
    projects: ["opigo", "byu", "collective-ledger"],
  },
  {
    slug: "react-native-developer-india",
    kind: "location",
    navLabel: "Hire a React Native developer in India",
    heading: "Hire a React Native developer in India",
    metaTitle: "Hire a React Native Developer in India | Nirmal Ranpariya",
    metaDescription:
      "Remote React Native developer in India for startups in the US, UK, Europe, Australia and the Middle East. Clear communication, apps live in both stores.",
    summary: "A remote React Native developer in India for teams in the US, UK, Europe, Australia and the Middle East.",
    intro:
      "Looking for a React Native developer in India who communicates clearly and ships? I work remotely with startups and product teams abroad — building new apps, taking over existing ones and joining teams on contract — from Surat, India (IST, UTC+5:30).",
    includes: [
      "Remote contract or project work on React Native apps",
      "Overlap with UK / European mornings and US evenings",
      "Written updates, pull requests and a working build every week",
      "Joining an existing team's repo, process and code review",
      "Android, iOS, Node.js and Firebase in one person",
      "Contracts through Upwork or directly",
    ],
    sections: [
      {
        heading: "Experience with international products",
        body: "by.U is Telkomsel's all-digital telecom app for Indonesia, used by customers for everything from ordering a SIM to topping up. Working on it means working to another company's standards, release process and review — the same way I work with remote clients.",
      },
      {
        heading: "How remote work runs",
        body: "We agree the scope and the first milestone, then you get a short written update, a pull request and an installable build every week. Calls are scheduled in your working hours.",
      },
    ],
    faqs: [
      {
        q: "Which time zones do you work with?",
        a: "I'm in India (IST, UTC+5:30). That overlaps with UK and European mornings, the Middle East all day, Australia's afternoon, and US evenings or early mornings for calls.",
      },
      {
        q: "Can you work through Upwork?",
        a: "Yes, I have an Upwork profile, or we can contract directly — whichever you prefer.",
      },
      {
        q: "Can you join our existing team?",
        a: "Yes. I can work in your repository, follow your branching and code-review process, and take tickets from your board like any other team member.",
      },
    ],
    projects: ["byu", "opigo", "sela"],
  },
];

export const fallbackServices: ServicesContent = {
  heading: "Hire a React Native developer",
  metaTitle: "Hire a React Native Developer | Nirmal Ranpariya",
  metaDescription:
    "Hire a freelance React Native developer for Android and iOS apps, bug fixing, upgrades and MVPs. Based in Surat, India; working with clients worldwide.",
  intro:
    "I'm a React Native developer in Surat, India, available for freelance and contract work. I build new Android and iOS apps, fix and upgrade existing ones, and handle the parts around the screens — APIs, notifications and releases — so the app works for real users, not just in a demo.",
  engagement: [
    { label: "Project", value: "A fixed scope — an MVP, a feature or an upgrade — with an agreed estimate." },
    { label: "Contract", value: "Part-time or full-time on your team, working in your repo and process." },
    { label: "Maintenance", value: "A monthly arrangement for fixes, OS updates and small features." },
  ],
  process: [
    { title: "Tell me about the app", body: "Use the contact form: what you're building, who it's for, and where it hurts today." },
    { title: "Scope and estimate", body: "I reply by email with questions, then a written scope, a first milestone and an estimate." },
    { title: "Build in small steps", body: "You get an installable build and a short written update every week." },
    { title: "Release and hand over", body: "Store release, documentation and a clean handover — or ongoing maintenance if you want it." },
  ],
  faqs: [
    {
      q: "Are you available for freelance React Native work?",
      a: "Yes. I work full-time as a React Native developer in Surat and take on select freelance and contract projects alongside it. Tell me about your project and I'll say honestly whether I'm the right fit.",
    },
    {
      q: "What kind of apps do you build?",
      a: "Product apps for Android and iOS: fintech and trading, social, marketplaces and classifieds, telecom self-care, and internal tools — plus the Node.js or Firebase backend they need.",
    },
    {
      q: "How do you charge?",
      a: "Fixed-scope projects get a written estimate after a short scoping conversation; contract and maintenance work is billed hourly or monthly. Use the contact form and I'll come back with a clear number.",
    },
    {
      q: "Do I own the code?",
      a: "Yes — the code, the store accounts and the backend are yours.",
    },
  ],
  pages,
};

/**
 * Resolves the services content for the public site: saved values win, but any page the owner
 * hasn't saved yet (or a location page removed by mistake) falls back to the built-in text.
 */
/** Saved value if it has content; otherwise the built-in one. (Empty lists/strings are what the
 *  database stores for sections that were never filled in, so they must not hide the built-in text.) */
const pick = <T,>(saved: T | undefined, builtIn: T): T => {
  if (saved === undefined || saved === null) return builtIn;
  if (typeof saved === "string" && !saved.trim()) return builtIn;
  if (Array.isArray(saved) && saved.length === 0) return builtIn;
  return saved;
};

/**
 * Resolves the services content for the public site and the dashboard: saved values win, but
 * anything empty or missing (never saved, or a location page removed by mistake) falls back to
 * the built-in text.
 */
export function resolveServices(saved: Partial<ServicesContent> | undefined): ServicesContent {
  const s = saved || {};
  const merged: ServicesContent = {
    ...fallbackServices,
    heading: pick(s.heading, fallbackServices.heading),
    metaTitle: pick(s.metaTitle, fallbackServices.metaTitle),
    metaDescription: pick(s.metaDescription, fallbackServices.metaDescription),
    intro: pick(s.intro, fallbackServices.intro),
    engagement: pick(s.engagement, fallbackServices.engagement),
    process: pick(s.process, fallbackServices.process),
    faqs: pick(s.faqs, fallbackServices.faqs),
    pages: [],
  };
  const savedPages = Array.isArray(s.pages) && s.pages.length ? s.pages : fallbackServices.pages;
  const builtInBySlug = new Map(fallbackServices.pages.map((p) => [p.slug, p]));
  const bySlug = new Map(savedPages.map((p) => [p.slug, p]));
  for (const slug of LOCATION_SLUGS) {
    if (!bySlug.has(slug)) {
      const builtIn = builtInBySlug.get(slug);
      if (builtIn) bySlug.set(slug, builtIn);
    }
  }
  merged.pages = [...bySlug.values()].map((p) => {
    const b = builtInBySlug.get(p.slug);
    return {
      ...(b || {}),
      ...p,
      heading: pick(p.heading, b?.heading ?? ""),
      metaTitle: pick(p.metaTitle, b?.metaTitle ?? ""),
      metaDescription: pick(p.metaDescription, b?.metaDescription ?? ""),
      intro: pick(p.intro, b?.intro ?? ""),
      includes: pick(p.includes, b?.includes ?? []),
      sections: pick(p.sections, b?.sections ?? []),
      faqs: pick(p.faqs, b?.faqs ?? []),
      projects: pick(p.projects, b?.projects ?? []),
      kind: (LOCATION_SLUGS as readonly string[]).includes(p.slug) ? "location" : "service",
    } as LandingPage;
  });
  return merged;
}

export const visiblePages = (s: ServicesContent, kind?: LandingPage["kind"]) =>
  s.pages.filter((p) => p.isVisible !== false && (!kind || p.kind === kind));
