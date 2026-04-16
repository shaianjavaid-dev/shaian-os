export const PROFILE = {
  name: "Shaian Javaid",
  pronounce: "Shy-on",
  tagline: "Shipping AI products and musing about living on a farm.",
  location: "San Francisco, CA",
  email: "shaianjavaid@gmail.com",
  links: {
    x: "https://x.com/Shaian_javaid",
    linkedin: "https://www.linkedin.com/in/shaian-javaid",
    email: "mailto:shaianjavaid@gmail.com",
  },
};

export const EXPERIENCE = [
  {
    role: "Co-Founder & CEO",
    company: "Loom Health AI",
    when: "Jul 2025 – Present",
    where: "San Francisco, CA",
    bullets: [
      "Loom is a headless HIPAA-compliant AI platform for enterprise healthcare companies — autonomously processes, responds to, and handles tasks inside the EHR on inbound patient messages, cutting admin workload ~40%.",
      "Automated 50% of the clinical inbox. Average patient response time: 48 hours → seconds.",
      "Term sheet from Jason Calacanis's LAUNCH Fund. Co-designed with Midi Health (1M+ lives, $1B+ valuation) across 100,000+ secure patient messages.",
      "Leading product, sales, engineering, and fundraising.",
    ],
  },
  {
    role: "Founder",
    company: "Loom Builder AI",
    when: "2026 – Autonomous side project",
    where: "San Francisco, CA",
    bullets: [
      "Vision AI platform that processes W-2s and aerial photography to detect fraud in the energy rebate industry.",
      "Bootstrapped and fully autonomous — processes ~10K rebates / month.",
    ],
  },
  {
    role: "Lead Technical PM — AI Voice Scheduling",
    company: "Optum",
    when: "Dec 2024 – Jun 2025",
    where: "San Francisco, CA",
    bullets: [
      "Founded Optum's AI-powered voice scheduling platform across the health-system network.",
      "0→1 initiative: owned product strategy, roadmap, and cross-functional coordination.",
    ],
  },
  {
    role: "Senior Technical PM — Medical Rideshare",
    company: "Optum",
    when: "Jul 2023 – Dec 2024",
    where: "San Francisco, CA",
    bullets: [
      "Led product for Optum's non-emergency medical transportation (NEMT) rideshare experience.",
      "100K+ rides/month to Medicaid members across 10 states.",
    ],
  },
  {
    role: "Senior Technical PM — Homepage & Navigation",
    company: "Optum",
    when: "Jul 2022 – Jul 2023",
    where: "San Francisco, CA",
    bullets: ["Drove redesign of core homepage and navigation across Optum digital properties."],
  },
  {
    role: "Product Manager — Virtual Care & Rally Pay",
    company: "Rally Health (Exited to UHC-Optum)",
    when: "Aug 2020 – Jan 2022",
    where: "San Francisco, CA",
    bullets: ["Launched virtual care and fintech payment products. Rally Health was acquired by UHC-Optum."],
  },
  {
    role: "Software Engineer",
    company: "Gener8 Ads & EGIA",
    when: "Mar 2018 – Apr 2020",
    where: "London, UK",
    bullets: [],
  },
  {
    role: "Support Engineer (Contract)",
    company: "Stripe",
    when: "Jan 2017 – Mar 2018",
    where: "San Francisco, CA",
    bullets: [],
  },
];

export const COMPANIES = [
  {
    name: "Loom Health",
    url: "https://www.loomhealth.ai",
    tag: "Autonomous clinical AI governance for enterprise healthcare.",
    status: "Active · CEO",
    highlights: [
      "Co-designed with Midi Health — 1M+ lives",
      "100,000+ secure patient messages processed",
      "LAUNCH Fund (Calacanis) term sheet",
      "48hr → seconds response time",
    ],
  },
  {
    name: "Loom Builder",
    url: "https://www.loombuilder.ai",
    tag: "Vision AI for W-2 + aerial imagery fraud detection in energy rebates.",
    status: "Active · Solo / bootstrapped",
    highlights: [
      "~10K rebates processed monthly",
      "Fully autonomous pipeline",
      "Bootstrapped & profitable",
    ],
  },
];

export const PROOF = [
  { label: "LAUNCH Fund term sheet", detail: "Jason Calacanis's fund — Loom Health AI" },
  { label: "Midi Health pilot", detail: "$1B+ valuation co-design partner, 1M+ lives" },
  { label: "100,000+ patient messages", detail: "Processed via Loom in production" },
  { label: "40% admin workload reduction", detail: "MA-team routine workflow automation" },
  { label: "100K+ rides/month", detail: "NEMT rideshare at Optum, 10 states" },
  { label: "Rally Health → UHC-Optum", detail: "Acquisition outcome" },
];

export const SKILLS = {
  "AI & Observability": ["Clinical AI governance", "LLM orchestration", "Evaluations", "OpenAI", "Anthropic"],
  "Domain Expertise": ["Health AI", "Vision AI", "Enterprise SaaS AI", "Usage-Based Billing", "Deepfake Analysis"],
};

export const EDUCATION = [{ school: "University of London", degree: "BSc Computer Science" }];

export const TWEETS: {
  text: string;
  date: string;
  replyTo?: { handle: string; name: string; text: string };
  stats?: { likes?: number; views?: string };
}[] = [
  {
    replyTo: { handle: "@daltonc", name: "Dalton Caldwell", text: "One of the reasons \u201Cjust don\u2019t die\u201D works as startup advice is that organizations are Lindy." },
    text: "E.g Replit",
    date: "2026-02-17",
    stats: { likes: 1, views: "572" },
  },
];
