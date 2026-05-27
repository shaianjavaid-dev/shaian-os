export type Email = {
  id: string;
  from: string;
  fromEmail: string;
  subject: string;
  date: string;
  preview: string;
  body: string; // plain text with \n
  attachments?: { name: string; src: string; kind: "image" | "pdf" }[];
  starred?: boolean;
  unread?: boolean;
  label?: "INVESTOR" | "PILOT" | "PRESS" | "CUSTOMER" | "TEAM";
};

export const INBOX: Email[] = [
  {
    id: "launch-offer",
    from: "LAUNCH Fund",
    fromEmail: "investments@launch.co",
    subject: "Accelerator Offer — $125K for Loom Health",
    date: "2025-11-12",
    preview: "The LAUNCH investment team is excited about what you're building…",
    label: "INVESTOR",
    starred: true,
    unread: false,
    body: `Hi Shaian,

The LAUNCH investment team is excited about what you're building, and we're thrilled to share that we'd like to invest $125K to be part of your journey!

Looking forward to what Loom Health becomes.

— The LAUNCH Team`,
    attachments: [
      { name: "launch-offer.png", src: "/proof/launch-offer.png", kind: "image" },
    ],
  },
  {
    id: "loom-builder-mrr",
    from: "Stripe",
    fromEmail: "no-reply@stripe.com",
    subject: "Monthly summary — Loom Builder",
    date: "2026-04-15",
    preview: "$12.7K gross volume Jan–Apr. Bootstrapped. Fully autonomous.",
    label: "CUSTOMER",
    starred: true,
    body: `Your Stripe Reports overview for Loom Builder.

Gross volume (Jan 2026 – Apr 2026): $12.7K
Net volume from sales:              $12.7K
Peak month:                         $7,100
Pipeline:                           fully autonomous
Ops overhead:                       ~0

Bootstrapped. No investors. Built on the side.`,
    attachments: [
      { name: "stripe-reports.jpg", src: "/proof/loombuilder-revenue.jpg", kind: "image" },
    ],
  },
  {
    id: "dalton-a16z",
    from: "𝕏 Notifications",
    fromEmail: "noreply@x.com",
    subject: "Dalton Caldwell (a16z) liked your reply",
    date: "2026-02-17",
    preview: "One of the reasons 'just don't die' works as startup advice is that organizations are Lindy…",
    label: "PRESS",
    starred: true,
    body: `Dalton Caldwell (General Partner @ Andreessen Horowitz, YC alum, Forbes Midas List) liked your reply.

Original post — @daltonc:
  "One of the reasons 'just don't die' works as startup advice is that organizations are Lindy."
  300 likes · 39K views

Your reply — @shaian_javaid:
  "E.g Replit"
  39K impressions via the thread.

Receipts attached.`,
    attachments: [
      { name: "x-reply-thread.png", src: "/proof/dalton-reply-thread.png", kind: "image" },
      { name: "dalton-like-notification.jpg", src: "/proof/dalton-like.jpg", kind: "image" },
    ],
  },
];
