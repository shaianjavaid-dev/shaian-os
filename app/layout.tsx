import type { Metadata } from "next";
import PostHogInit from "./PostHogInit";
import "./globals.css";

export const metadata: Metadata = {
  title: "Shaian Javaid — ShaianOS",
  description:
    "Ex-founder, founder again. Co-Founder & CEO of Loom Health AI. Shipping autonomous AI into places it wasn't supposed to work yet.",
  // keep the site out of search results — shareable by link, not discoverable by name
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full antialiased">
        <PostHogInit />
        {children}
      </body>
    </html>
  );
}
