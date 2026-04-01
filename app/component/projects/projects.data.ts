export interface ProjectTimelineEntry {
    label: string;
    detail: string;
}

export interface ProjectLinkSet {
    live?: string;
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
            live: "https://byu.id",
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
        id: "catchat",
        slug: "catchat",
        title: "catChat",
        tagline: "All-in-one social commerce + creator playground",
        summary:
            "catChat blends social, chat, and commerce for creators who want to film reels, sell drops, and stay connected with their audience.",
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
            projectType: "Social Commerce / Creator Tool",
            timeline: "Jan 2024 – Present",
            role: "Lead Engineer / Technical Product Partner",
            stack: "React Native, AWS, Firebase, Socket.io",
            outcome: "Prototyped a rich creator canvas with hybrid architecture",
            whyItMatters: "Highlights readiness for live media and commerce products."
        }
    }
];
