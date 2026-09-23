/**
 * Project content. Every statement here must trace back to the resume PDF,
 * the live product, or the public repositories. Sections that are not yet
 * backed by real information are left out on purpose; the case-study page
 * renders only what exists.
 */

export interface Img {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
}

export interface FlowLane {
  label: string;
  steps: string[];
}

export interface Project {
  slug: string;
  number: string;
  title: string;
  kind: string;
  status: string;
  oneLiner: string;
  spec: [label: string, value: string][];
  links: { label: string; href: string }[];
  cover?: Img;
  screens: Img[];
  screenLayout: "phones" | "wide";
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
}

const opigo = (n: number, caption?: string): Img => ({
  src: `/work/opigo/opigo-${n}.jpg`,
  alt: `OpiGo app screen ${n}`,
  width: 662,
  height: 1170,
  caption,
});

const byu = (n: number): Img => ({
  src: `/work/byu/byu-${n}.jpg`,
  alt: `by.U app screen ${n}`,
  width: 660,
  height: 1170,
});

const ledger = (n: number, alt: string, caption?: string): Img => ({
  src: `/work/collective/ledger-${n}.jpg`,
  alt,
  width: 1266,
  height: 860,
  caption,
});

export const projects: Project[] = [
  {
    slug: "opigo",
    number: "01",
    title: "OpiGo",
    kind: "Social trading · Mobile",
    status: "Live on Google Play and the App Store",
    oneLiner:
      "A social trading app where market opinions, polls and expert-curated strategies live in one place.",
    spec: [
      ["Type", "Company product"],
      ["Company", "Ofniinfo Software Solutions"],
      ["Platform", "Android · iOS (web support for Decks)"],
      ["My role", "React Native developer"],
    ],
    links: [
      { label: "Google Play", href: "https://play.google.com/store/apps/details?id=com.OpiGo1final&hl=en" },
      { label: "App Store", href: "https://apps.apple.com/in/app/opigo-get-expert-stock-ideas/id1619955231" },
      { label: "opigo.in", href: "https://opigo.in/" },
    ],
    cover: opigo(1),
    screens: [opigo(2), opigo(3), opigo(4), opigo(5)],
    screenLayout: "phones",
    context: [
      "OpiGo is a Mumbai-based social trading platform. People share market opinions, create polls and follow stock-market insight from other traders.",
      "Its Decks feature lets users subscribe to curated short-term and long-term investment strategies and receive stock recommendations from SEBI-registered experts.",
    ],
    problem: [
      "Retail investors tend to find market context, expert opinion and the means to act in different places. OpiGo puts the conversation and the decision in the same app.",
    ],
    role: {
      intro: "I work on OpiGo as a React Native developer at Ofniinfo Software Solutions. My contributions:",
      items: [
        "Built and extended cross-platform mobile features in React Native.",
        "Developed the opinion-sharing and polling features.",
        "Implemented the Decks subscription system for short-term and long-term strategies.",
        "Integrated real-time updates and notifications, delivered in-app and over WhatsApp.",
        "Rolled features out over the air with Microsoft CodePush.",
        "Collaborated on web support for Decks so mobile and web behave consistently.",
      ],
    },
    system: {
      title: "How a change reaches a user",
      caption:
        "A simplified view of the release and delivery paths I work with on OpiGo. It describes the delivery model, not the full backend.",
      lanes: [
        { label: "Native change", steps: ["Code", "Native build", "Play Store / App Store"] },
        { label: "JavaScript change", steps: ["Code", "JS bundle", "CodePush", "Installed apps"] },
        { label: "Alert or update", steps: ["Event", "In-app notification", "WhatsApp message"] },
      ],
    },
    engineering: [
      {
        title: "Ship JavaScript without waiting on a store review",
        body: "Feature rollouts go out over the air with Microsoft CodePush. Native changes still travel through Play Store and App Store releases, so every change is sorted by which side of that line it lives on.",
      },
      {
        title: "Notifications on more than one channel",
        body: "Real-time updates and notifications reach users in the app and through WhatsApp, so an update does not depend on the app being open.",
      },
      {
        title: "Web and mobile stay in step",
        body: "Decks also exists on the web. I collaborated on that support so a subscription behaves the same wherever it is used.",
      },
    ],
    outcome: [
      "OpiGo is live on Google Play and the App Store.",
      "I do not publish usage figures for it. I would rather leave a number out than estimate one.",
    ],
    stack: [
      { group: "Mobile", items: ["React Native", "TypeScript"] },
      { group: "Realtime", items: ["Firebase"] },
      { group: "Delivery", items: ["Microsoft CodePush", "Google Play", "App Store"] },
    ],
  },
  {
    slug: "byu",
    number: "02",
    title: "by.U",
    kind: "Telecom · Mobile",
    status: "Live on Google Play and the App Store",
    oneLiner:
      "Indonesia's first all-digital telecom service, operated by Telkomsel, where everything happens in the app.",
    spec: [
      ["Type", "Company product"],
      ["Company", "Ofniinfo Software Solutions"],
      ["Operator", "Telkomsel"],
      ["Platform", "Android · iOS · web"],
      ["My role", "React Native developer"],
    ],
    links: [
      { label: "Google Play", href: "https://play.google.com/store/apps/details?id=com.byu.id&hl=en_IN" },
      { label: "App Store", href: "https://apps.apple.com/in/app/by-u-affordable-internet-card/id1483475992" },
      { label: "byu.id", href: "https://www.byu.id/en/faq-category/tentang-by.u" },
    ],
    cover: byu(1),
    screens: [byu(2), byu(3), byu(4), byu(5)],
    screenLayout: "phones",
    context: [
      "by.U is Indonesia's first all-digital telecom service, operated by Telkomsel. Ordering a SIM, choosing a number, building a plan and topping up all happen in the app.",
      "Plans are personal: users pick a base amount of data and add “toppings” for apps such as YouTube and Spotify.",
    ],
    problem: [
      "A telecom with no stores depends on its app for everything. Onboarding, ordering, plan changes and usage all have to make sense without anyone to ask.",
    ],
    role: {
      intro: "On by.U I develop and maintain user-facing features in React Native. My contributions:",
      items: [
        "Built the customizable plan flow: base data plus app add-ons.",
        "Implemented onboarding, SIM ordering, number selection and in-app plan management.",
        "Integrated real-time data-usage tracking, recharge flows and push notifications.",
        "Kept the app responsive on both Android and iOS.",
        "Supported OTA updates and app releases.",
      ],
    },
    system: {
      title: "The customer journey, as flows",
      caption:
        "The main flows in the app, taken from the features I built. It is a user-flow map, not a system architecture.",
      lanes: [
        { label: "Getting started", steps: ["Onboarding", "Number selection", "SIM order"] },
        { label: "Building a plan", steps: ["Base data", "App toppings", "Confirm plan"] },
        { label: "Day to day", steps: ["Usage tracking", "Recharge", "Push notifications"] },
      ],
    },
    engineering: [
      {
        title: "Two platforms, one feel",
        body: "The work was keeping the app smooth and responsive on both Android and iOS, since the app is the only channel customers have.",
      },
      {
        title: "Live account state",
        body: "Usage tracking, recharge and push notifications tie the app to the customer's current allowance instead of a stale snapshot.",
      },
      {
        title: "Continuous delivery",
        body: "OTA updates and regular app releases let features reach customers continuously, not only on store-release days.",
      },
    ],
    experience: [
      "The brief was a clean, intuitive interface for a Gen Z audience, and I worked on improving the user-facing flows toward that.",
    ],
    outcome: [
      "by.U is live on Google Play and the App Store, with a web presence at byu.id.",
    ],
    stack: [
      { group: "Mobile", items: ["React Native", "TypeScript"] },
      { group: "Realtime", items: ["Firebase Cloud Messaging"] },
      { group: "Delivery", items: ["OTA updates", "Google Play", "App Store"] },
    ],
  },
  {
    slug: "collective-ledger",
    number: "03",
    title: "Collective Ledger OS",
    kind: "Community finance · Web",
    status: "Live on Vercel",
    oneLiner:
      "A finance platform for communities and cooperatives: contributions, penalties, governance and an audit trail.",
    spec: [
      ["Type", "Independent product"],
      ["Year", "2026"],
      ["Platform", "Web, responsive"],
      ["My role", "Design and full-stack development"],
    ],
    links: [{ label: "collective-sandy.vercel.app", href: "https://collective-sandy.vercel.app/" }],
    cover: ledger(1, "Collective Ledger OS landing page"),
    screens: [
      ledger(2, "Collective Ledger OS features overview"),
      ledger(3, "Collective Ledger OS how-it-works section"),
      ledger(4, "Collective Ledger OS dashboard and analytics view"),
      ledger(5, "Collective Ledger OS member and records screen"),
    ],
    screenLayout: "wide",
    context: [
      "Collective Ledger OS is a full-stack platform for communities, cooperatives and shared groups to manage collections, contributions, investments and penalties with complete transparency.",
      "It also covers governance: transparent voting, role-based members and an audit log for critical actions.",
    ],
    problem: [
      "Community finance often lives in spreadsheets, manual tracking and scattered messages. That produces rounding errors, weak audit history and low trust between members.",
    ],
    role: {
      intro: "This is my own product. I designed and built it end to end:",
      items: [
        "Built the full-stack platform with Next.js and Prisma.",
        "Implemented authentication with NextAuth.",
        "Built the decimal-safe financial engine, including per-day late-fee logic.",
        "Designed the governance layer: voting, audit logs and role-based member management.",
        "Deployed it on Vercel.",
      ],
    },
    system: {
      title: "How money moves through the product",
      caption: "The product workflow as designed: from setting up a community to an auditable record.",
      lanes: [
        { label: "Setup", steps: ["Register community", "Set financial rules", "Onboard members"] },
        { label: "Money", steps: ["Contributions and dues", "Late-fee rule", "Ledger"] },
        { label: "Trust", steps: ["Role-based access", "Voting", "Audit log"] },
      ],
    },
    engineering: [
      {
        title: "Decimal-safe money",
        body: "Amounts are calculated with decimal arithmetic (Decimal.js and Prisma decimals) instead of floating point, so totals do not drift by fractions.",
      },
      {
        title: "Penalties as a rule, not a spreadsheet formula",
        body: "Late fees are computed per day by the system, so the same rule applies to every member.",
      },
      {
        title: "An audit trail for every critical action",
        body: "Governance actions and financial changes are logged, and roles decide who may perform them.",
      },
    ],
    experience: [
      "Financial data is dense. The dashboards are responsive so members can read dues and contributions on a phone as well as a desktop, and the interface avoids feature overload for non-technical users.",
    ],
    challenges: [
      {
        title: "Rounding discrepancies",
        body: "Handled by treating money as decimals throughout the stack.",
      },
      {
        title: "Transparency without overwhelming people",
        body: "Non-technical members need to verify numbers without learning accounting. The product keeps the workflow linear: setup, tracking, governance.",
      },
    ],
    outcome: [
      "A deployed, working product with dashboards, exports, voting and audit logs.",
      "It has no published user numbers, and none are claimed here.",
    ],
    stack: [
      { group: "Application", items: ["Next.js (App Router)", "React", "Zustand"] },
      { group: "Data", items: ["Prisma ORM", "Decimal.js"] },
      { group: "Auth", items: ["NextAuth"] },
      { group: "Delivery", items: ["Vercel"] },
    ],
    reflection: [
      "Decimal precision is not optional in finance software; it has to be designed in from the first model.",
      "Governance features earn trust when they are easy to verify, not when they are elaborate.",
    ],
  },
  {
    slug: "sela",
    number: "04",
    title: "SELA",
    kind: "Classifieds marketplace · Mobile",
    status: "Developed · not yet published",
    oneLiner:
      "A mobile-first classifieds app for buying, selling and trading locally, with real-time chat.",
    spec: [
      ["Type", "Mobile app"],
      ["Platform", "React Native"],
      ["Status", "Developed, not published to the stores"],
    ],
    links: [],
    screens: [],
    screenLayout: "phones",
    context: [
      "SELA is a mobile-first classifieds marketplace in the spirit of OLX. People buy, sell and trade products locally.",
    ],
    role: {
      intro: "I developed the core marketplace features in React Native:",
      items: [
        "Listings with image uploads, pricing, descriptions and categories.",
        "Real-time in-app chat between buyers and sellers.",
        "Location-based discovery that surfaces nearby listings using GPS.",
      ],
    },
    system: {
      title: "Listing to conversation",
      caption: "The two core flows in the app.",
      lanes: [
        { label: "Selling", steps: ["Photos", "Price and description", "Category", "Publish"] },
        { label: "Buying", steps: ["GPS location", "Nearby listings", "Chat with seller"] },
      ],
    },
    engineering: [
      {
        title: "Performance on image-heavy lists",
        body: "Lazy loading, image caching and efficient data querying keep listing feeds responsive.",
      },
    ],
    outcome: ["The app is developed but has not been published to the stores, so there is nothing public to link to."],
    stack: [
      { group: "Mobile", items: ["React Native"] },
      { group: "Capabilities", items: ["GPS", "Real-time chat", "Image upload"] },
    ],
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
