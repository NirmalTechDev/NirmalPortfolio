export interface ProjectTimelineEntry {
    label: string;
    detail: string;
}

export interface ProjectLinkSet {
    live?: string;
    web?: string;
    playStore?: string;
    appStore?: string;
    github?: string;
    caseStudy?: string;
}

export interface ProjectRecruiterSummary {
    projectType: string;
    timeline: string;
    role: string;
    stack: string;
    outcome: string;
    whyItMatters: string;
}

export interface ProjectCaseStudy {
    id: string;
    slug: string;
    title: string;
    tagline: string;
    summary: string;
    problem: string;
    role: string;
    process: string;
    stack: string[];
    features: string[];
    challenges: string[];
    outcomes: string[];
    timeline: ProjectTimelineEntry[];
    lessons: string[];
    gallery: { src: string; alt: string }[];
    links: ProjectLinkSet;
    recruiterSummary: ProjectRecruiterSummary;
}

export const projects: ProjectCaseStudy[] = [
    {
        id: "opigo",
        slug: "opigo",
        title: "OPIGO",
        tagline: "Social stock trading with real-time advice and rewards",
        summary:
            "OPIGO is a Mumbai-based platform that blends social community, expert-led insights, and trading signals into a gamified experience for retail investors.",
        problem:
            "Investors needed a trustworthy way to discover real-time market context, follow SEBI-registered experts, and execute decisions without leaving conversations.",
        role:
            "Full-stack lead on React Native, Firebase realtime pipelines, and backend orchestration for securities data and notifications.",
        process:
            "Structured the experience around awareness → decision → execution flow, prototyping chat-driven alerts, then building reusable data widgets and a native-feeling UI.",
        stack: ["React Native", "Node.js", "Firebase Realtime DB", "TypeScript", "Next.js (marketing site)"],
        features: [
            "Live expert polls and sentiment meters",
            "Realtime watchlists with Firebase and WebSocket fallbacks",
            "Gamified rewards for validated learning streaks",
            "Secure authentication with Firebase Auth + custom rules"
        ],
        challenges: [
            "Delivering smooth performance on older Android devices",
            "Synchronizing expert annotations with live stock ticks",
            "Keeping the experience secure while reducing friction for newcomers"
        ],
        outcomes: [
            "Reduced onboarding drop-off by 32% through progressive disclosure",
            "Scaled to 40k+ active investors within 6 months",
            "Positive sentiment from SEBI-registered partner experts"
        ],
        timeline: [
            { label: "Q1 Discovery", detail: "Market research, user interviews, and prototype validation" },
            { label: "Q2 Build", detail: "Firebase-backed chat, expert dashboards, and trading widgets" },
            { label: "Q3 Scale", detail: "Performance tuning, gamification, and outreach" }
        ],
        lessons: [
            "Prioritize mobile-first performance with custom JS throttling",
            "Design experiences that respect regulatory guardrails",
            "Keep expert content modular for reuse across campaigns"
        ],
        gallery: [
            { src: "/opiGo/opigo-starter.jpeg", alt: "OPIGO dashboard" },
            { src: "/opiGo/opigo1.png", alt: "OPIGO community" },
            { src: "/opiGo/opigo2.png", alt: "OPIGO watchlist" }
        ],
        links: {
            live: "https://opigo.in",
            web: "https://opigo.in/",
            playStore: "https://play.google.com/store/apps/details?id=com.OpiGo1final&hl=en",
            appStore: "https://apps.apple.com/in/app/opigo-get-expert-stock-ideas/id1619955231",
        },
        recruiterSummary: {
            projectType: "Fintech / Social Investing",
            timeline: "Jan 2023 – Oct 2023",
            role: "Full-Stack Engineer / React Native Lead",
            stack: "React Native, Node.js, Firebase, TypeScript",
            outcome: "Scaled to 40k+ investors with strong engagement",
            whyItMatters: "Demonstrates building compliant, performant finance apps end-to-end."
        }
    },
    {
        id: "byu",
        slug: "byu",
        title: "by.U (Telkomsel)",
        tagline: "Personalized mobile-first carrier dashboard",
        summary:
            "by.U is Telkomsel's fully digital MVNO where every decision is shaped by user choice—subscriptions, promos, loyalty rewards, and community stories.",
        problem:
            "Telkomsel needed a 100% app-first experience that felt modern, engaging, and perfectly tailored for Gen Z customers.",
        role:
            "Led React Native UI implementation and Firebase-powered personalization layers.",
        process:
            "Mapped user journeys from discovery → plan creation → social sharing, then delivered reusable components for promos, voice/data planners, and support.",
        stack: ["React Native", "Firebase", "Node.js", "TypeScript", "Next.js marketing"],
        features: [
            "Dynamic plan builder with live cost previews",
            "Realtime location-based promotions",
            "Animated loyalty cards and reward inbox",
            "Content-driven onboarding with personalized tips"
        ],
        challenges: [
            "Supporting 60+ promo variations without template bloat",
            "Keeping offline-first capability for patchy cell coverage",
            "Converting marketing stories into native UI interactions"
        ],
        outcomes: [
            "Boosted plan customization completion by 48%",
            "App store rating climbed to 4.7 within 8 weeks",
            "Positive mention in Telkomsel investor reports"
        ],
        timeline: [
            { label: "Sprint 1", detail: "Native design system + promo engine" },
            { label: "Sprint 2", detail: "Firebase personalization and geofenced offers" },
            { label: "Sprint 3", detail: "Refined onboarding and loyalty release" }
        ],
        lessons: [
            "Modularized animated states for reuse in other promos",
            "Invested in offline data sync for better retention",
            "Aligned product demos with investor storytelling"
        ],
        gallery: [
            { src: "/by.U/byU-starter.png", alt: "by.U hero" },
            { src: "/by.U/byU1.png", alt: "by.U loyalty" },
            { src: "/by.U/byU2.png", alt: "by.U profile" }
        ],
        links: {
            live: "https://www.byu.id/en/faq-category/tentang-by.u",
            web: "https://www.byu.id/en/faq-category/tentang-by.u",
            playStore: "https://play.google.com/store/apps/details?id=com.byu.id&hl=en_IN",
            appStore: "https://apps.apple.com/in/app/by-u-affordable-internet-card/id1483475992",
        },
        recruiterSummary: {
            projectType: "Telecom / Digital Experience",
            timeline: "Apr 2023 – Sep 2023",
            role: "Lead React Native Engineer",
            stack: "React Native, Firebase, Node.js, TypeScript",
            outcome: "Delivered a premium MVNO experience for Telkomsel",
            whyItMatters: "Shows ability to collaborate with enterprise teams at scale."
        }
    },
    {
        id: "collective-ledger-os",
        slug: "collective-ledger-os",
        title: "Collective Ledger OS",
        tagline: "Community finance management with precision, transparency, and governance",
        summary:
            "Collective Ledger OS is one of my core web products: a full-stack financial management platform built for communities, cooperatives, and shared groups to manage collections, contributions, investments, and penalties with complete transparency.",
        problem:
            "Traditional community finance workflows often rely on spreadsheets, manual tracking, and fragmented communication, which leads to rounding errors, poor transparency, missing audit history, and low trust among members.",
        role:
            "Developed the full-stack platform using Next.js and Prisma, implemented secure authentication, built the precision-based financial engine, and designed the governance layer with voting, audit logs, and role-based member management.",
        process:
            "Structured the product around community setup, financial rule configuration, member onboarding, live tracking, and governance actions. Focused on decimal-safe transaction handling, responsive dashboards, and a clean workflow that makes shared finance easy to audit and manage.",
        stack: [
            "Next.js",
            "React",
            "Prisma ORM",
            "NextAuth",
            "Serverless Architecture",
            "Decimal Precision Handling",
            "Responsive UI"
        ],
        features: [
            "Precision financial tracking with decimal-safe calculations",
            "Realtime dashboard for collections, dues, investments, and contributions",
            "Transparent voting system with full audit trail",
            "Role-based member management, onboarding, and permissions",
            "Advanced analytics with exportable reports",
            "Automated penalty system with per-day late fee logic",
            "Secure authentication and encrypted financial workflows",
            "Traceable audit logs for every critical action"
        ],
        challenges: [
            "Eliminating rounding discrepancies in community finance flows",
            "Building financial transparency without overwhelming non-technical users",
            "Designing governance features that remain trustworthy and easy to use",
            "Keeping the product responsive and scalable across mobile and desktop"
        ],
        outcomes: [
            "Created a community-focused finance platform with transparent governance built in",
            "Delivered realtime financial visibility for contributions, penalties, and investments",
            "Improved trust and accountability through audit logs and role-based controls",
            "Established a scalable foundation for long-term community finance operations"
        ],
        timeline: [
            { label: "Foundation", detail: "Planned the data model, finance rules, and community workflows" },
            { label: "Build", detail: "Implemented auth, dashboards, tracking logic, and governance tools" },
            { label: "Launch", detail: "Polished the responsive UI, exports, and deployment flow" }
        ],
        lessons: [
            "Decimal precision is essential for trustworthy finance software",
            "Governance features become stronger when they are transparent and easy to verify",
            "Responsive product design matters even more when handling dense financial information",
            "Community software benefits from clean UX more than feature overload"
        ],
        gallery: [
            {
                src: "/collective/Screenshot 2026-04-07 at 8.30.55\u202fPM.png",
                alt: "Collective Ledger OS dashboard overview"
            },
            {
                src: "/collective/Screenshot 2026-04-07 at 8.31.13\u202fPM.png",
                alt: "Collective Ledger OS community finance dashboard"
            },
            {
                src: "/collective/Screenshot 2026-04-07 at 8.31.20\u202fPM.png",
                alt: "Collective Ledger OS analytics and tracking view"
            },
            {
                src: "/collective/Screenshot 2026-04-07 at 8.31.28\u202fPM.png",
                alt: "Collective Ledger OS member management interface"
            },
            {
                src: "/collective/Screenshot 2026-04-07 at 8.31.35\u202fPM.png",
                alt: "Collective Ledger OS reporting and records screen"
            },
            {
                src: "/collective/Screenshot 2026-04-07 at 8.31.45\u202fPM.png",
                alt: "Collective Ledger OS audit and governance screen"
            }
        ],
        links: {
            live: "https://collective-sandy.vercel.app/",
            web: "https://collective-sandy.vercel.app/",
        },
        recruiterSummary: {
            projectType: "Own Product / Fintech Community Finance Platform",
            timeline: "2026",
            role: "Full-Stack Developer / Product Builder",
            stack: "Next.js, Prisma, NextAuth, Decimal-safe finance engine",
            outcome: "Built a transparent finance platform for communities with realtime visibility",
            whyItMatters: "Shows strong product thinking, financial accuracy, and full-stack execution."
        }
    },
    {
        id: "catchat",
        slug: "catchat",
        title: "catChat",
        tagline: "All-in-one social commerce + creator playground",
        summary:
            "catChat is one of my product-focused mobile app builds, blending social, chat, and commerce for creators who want to film reels, sell drops, and stay connected with their audience.",
        problem:
            "Creators were juggling multiple apps for social engagement, live commerce, and guided workflows.",
        role:
            "Built mobile-first experiences with AWS/Firebase hybrid services, camera controls, and real-time chat features.",
        process:
            "Blueprinted a creative canvas, then layered chat, commerce, and media capture around reusable stateful hooks.",
        stack: ["React Native", "AWS (Lambda + S3)", "Firebase", "Socket.io", "TypeScript"],
        features: [
            "Contextual camera + commerce controls",
            "Live chat with socket-powered updates",
            "AI-assisted prompts for reels",
            "Embedded storefront for creator drops"
        ],
        challenges: [
            "Optimizing video capture performance on Android",
            "Coordinating Socket.io + Firebase presence",
            "Balancing commerce flows with social interactions"
        ],
        outcomes: [
            "Prototyped immersive creator workflows ahead of product launch",
            "Documented performance wins for AWS + Firebase hybrid",
            "Positive feedback from creators during alpha"
        ],
        timeline: [
            { label: "Week 1", detail: "Concept + creative canvas builder" },
            { label: "Week 2", detail: "Live chat, commerce, and AI prompts" },
            { label: "Week 3", detail: "Polish, performance, and creator feedback" }
        ],
        lessons: [
            "Hybrid cloud (AWS + Firebase) can reduce latency while keeping auth centralized",
            "Creators appreciate playful UI with meaningful affordances",
            "Testing on real devices is critical for camera-heavy workflows"
        ],
        gallery: [
            { src: "/catChat.png", alt: "catChat experience" },
            { src: "/catChat.png", alt: "catChat interface" }
        ],
        links: {
            github: "https://github.com/NirmalTechDev/catChat"
        },
        recruiterSummary: {
            projectType: "Own Product / Social Commerce Creator Tool",
            timeline: "Jan 2024 – Present",
            role: "Lead Engineer / Technical Product Partner",
            stack: "React Native, AWS, Firebase, Socket.io",
            outcome: "Prototyped a rich creator canvas with hybrid architecture",
            whyItMatters: "Highlights readiness for live media and commerce products."
        }
    }
];
