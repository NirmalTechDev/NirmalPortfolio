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
  /** Small app icon shown beside the title (mobile apps). */
  icon?: Img;
  screens: Img[];
  screenLayout: "phones" | "wide";
  /** How many phone screens the gallery shows in one row. Defaults to 4. */
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
  src: `/work/collective/ledger-v2-${n}.jpg`,
  alt,
  width: 1266,
  height: 950,
  caption,
});

const sela = (n: number, alt: string): Img => ({
  src: `/work/sela/sela-${n}.jpg`,
  alt,
  width: 660,
  height: 1170,
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
    title: "Collective Ledger",
    kind: "Community finance · Web",
    status: "Live on Vercel",
    oneLiner:
      "A shared ledger for community savings: monthly installments, late fees, investments and admin votes, open to every member.",
    spec: [
      ["Type", "Independent product"],
      ["Year", "2026"],
      ["Platform", "Web, responsive"],
      ["Stack", "Next.js · Express · MongoDB"],
      ["My role", "Design and full-stack development"],
    ],
    links: [{ label: "collective-sandy.vercel.app", href: "https://collective-sandy.vercel.app/" }],
    cover: ledger(1, "Collective Ledger landing page: “A ledger every member can read.”"),
    screens: [
      ledger(2, "Collective Ledger member dashboard with total paid, pending, penalties and the monthly installment"),
      ledger(3, "Collective Ledger admin console with collected, pending and available-to-invest figures"),
      ledger(4, "Collective Ledger admin election screen with live vote counts"),
      ledger(5, "Collective Ledger investments screen listing each position with its risk level"),
      ledger(6, "Collective Ledger transactions screen listing recorded payments"),
      ledger(7, "Collective Ledger member dashboard in the light theme"),
    ],
    screenLayout: "wide",
    context: [
      "Collective Ledger runs the money of small savings communities. Members pay a monthly installment, the server works out any late fee, and the admin records what is invested, so every figure is something any member can check.",
      "Beyond payments it covers governance: join requests the admin approves or declines, an admin the members elect once the community grows past five, and an audit log of admin actions. The screens shown here use sample data.",
    ],
    problem: [
      "Community savings usually live in a spreadsheet and a group chat. Totals drift, late fees are argued about, and nobody can see what the admin did with the money.",
    ],
    role: {
      intro: "This is my own product. I designed and built it end to end:",
      items: [
        "Designed the interface and the brand, including the logo, a dark and light theme, and a layout that works at phone width.",
        "Built the Next.js (App Router) frontend with Zustand stores and a typed API client.",
        "Built the Express and MongoDB API: members, communities, installments, payments, investments, votes and audit logs.",
        "Implemented JWT sign-in with email one-time-code verification, and role checks on every admin action.",
        "Wrote the money rules on the server: whole-paise arithmetic and the per-day late fee.",
        "Set up search metadata, structured data, a sitemap and deployment on Vercel.",
      ],
    },
    system: {
      title: "How money moves through the product",
      caption: "The workflow as built: from setting up a community to a record any member can read.",
      lanes: [
        { label: "Setup", steps: ["Register community", "Set first-month amount and growth range", "Invite or approve members"] },
        { label: "Money", steps: ["Monthly installment", "Late fee after the 10th", "Admin confirms payment", "Ledger and totals"] },
        { label: "Trust", steps: ["Role checks", "Admin vote above five members", "Audit log", "CSV export"] },
      ],
    },
    engineering: [
      {
        title: "Money in whole paise",
        body: "Every amount is stored and calculated as an integer number of paise, never as a floating-point rupee value, so totals cannot drift by a fraction and the member and the admin always see the same figure.",
      },
      {
        title: "Late fees as a server rule",
        body: "Installments are due by the 10th, and after that the server adds ₹20 for every day late. The rule lives in one place, so it applies to every member the same way.",
      },
      {
        title: "Approval and election flows",
        body: "Join requests wait up to three minutes for the admin, then the member confirms their email with a one-time code. Once a community has more than five members, the admin role goes to whoever wins the vote.",
      },
      {
        title: "Everything scoped to a community",
        body: "Each request carries the community it belongs to, and the API scopes reads and writes to it. An audit log records admin actions, and payments, investments and the log export as CSV.",
      },
    ],
    experience: [
      "The design is deliberately quiet: a serif display face, one accent colour and tabular figures, so numbers line up and the page reads like a ledger. Dues and contributions stay readable on a phone as well as a desktop.",
    ],
    challenges: [
      {
        title: "Keeping the member's number and the admin's number identical",
        body: "Both screens read the same server-calculated amounts, including late fees, so there is no second formula to disagree with.",
      },
      {
        title: "Transparency without overwhelming people",
        body: "Non-technical members need to verify the numbers without learning accounting. The workflow stays linear: set up, pay, confirm, review.",
      },
    ],
    outcome: [
      "A deployed, working product with dashboards, an admin console, voting, investments, audit logs and CSV export.",
      "It has no published user numbers, and none are claimed here.",
    ],
    stack: [
      { group: "Frontend", items: ["Next.js (App Router)", "React", "TypeScript", "Tailwind CSS", "Zustand", "Framer Motion", "Recharts"] },
      { group: "Backend", items: ["Node.js", "Express", "MongoDB", "Mongoose"] },
      { group: "Auth", items: ["JWT", "Email one-time code"] },
      { group: "Delivery", items: ["Vercel"] },
    ],
    reflection: [
      "Money has to be designed in from the first model. Choosing integer paise on day one removed a whole class of bugs.",
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
      "A mobile-first classifieds app for buying, selling and trading locally, with a live map, real-time chat and seller ratings.",
    spec: [
      ["Type", "Client product"],
      ["Company", "Ofniinfo Software Solutions"],
      ["Platform", "React Native"],
      ["Status", "Developed, not published to the stores"],
      ["My role", "Sole React Native developer"],
    ],
    links: [],
    cover: sela(1, "SELA home screen: a grid of nearby listings with a search bar and a distance filter"),
    icon: {
      src: "/work/sela/sela-icon.jpg",
      alt: "SELA app icon",
      width: 512,
      height: 512,
    },
    screens: [
      sela(2, "SELA post-item screen with photo selection, title and description, in a three-step flow"),
      sela(3, "SELA My Items screen with promote, mark sold, archive and sell-similar actions"),
      sela(4, "SELA item detail screen showing photos, price, condition, seller and approximate location"),
      sela(5, "SELA account screen with ratings, policy and safety tips, and settings"),
    ],
    screenLayout: "phones",
    phoneColumns: 5,
    context: [
      "SELA is a mobile-first classifieds marketplace in the spirit of OLX. People buy, sell and trade products near them: they browse listings around their location, chat with the seller, and manage what they have posted.",
      "The screens shown are from a test build with test data.",
    ],
    problem: [
      "Local buying and selling needs three things to work together: finding what is nearby, trusting the person on the other end, and keeping your own listings under control.",
    ],
    role: {
      intro: "I developed the core marketplace in React Native, as the only React Native developer on it:",
      items: [
        "Listings with image upload, pricing, descriptions and categories, in a three-step post, details and finish flow.",
        "Location-based discovery: a grid of listings around the user, with a search bar and a selectable distance.",
        "Real-time in-app chat between buyers and sellers.",
        "Item management: promote a listing, mark it sold, archive it, or sell a similar item.",
        "Listing pages with price, condition, delivery option, seller profile and reviews, and an approximate location to protect the seller's privacy.",
        "Account screens: buys and sold counts, ratings, followed and blocked users, notifications, language, theme, and policy and safety tips.",
      ],
    },
    system: {
      title: "Listing to conversation",
      caption: "The three core flows in the app.",
      lanes: [
        { label: "Selling", steps: ["Photos", "Title and description", "Details", "Publish", "Promote or mark sold"] },
        { label: "Buying", steps: ["Nearby listings", "Listing details", "Chat with seller", "Save or share"] },
        { label: "Trust", steps: ["Seller profile and reviews", "Report or block", "Safety tips"] },
      ],
    },
    engineering: [
      {
        title: "Performance on image-heavy lists",
        body: "Lazy loading, image caching and efficient data querying keep the listing grid responsive even when every card is a photo.",
      },
      {
        title: "Location without exposing the seller",
        body: "Discovery uses GPS to find nearby listings, while the listing page shows only an approximate location.",
      },
      {
        title: "A short path to posting",
        body: "Posting is split into three short steps, with photos first, so a seller can list something quickly from the phone that took the photo.",
      },
    ],
    outcome: ["The app is developed but has not been published to the stores, so there is nothing public to link to."],
    stack: [
      { group: "Mobile", items: ["React Native"] },
      { group: "Capabilities", items: ["GPS", "Real-time chat", "Image upload", "Image caching"] },
    ],
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
