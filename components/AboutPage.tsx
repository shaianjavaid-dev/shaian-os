"use client";

import AboutMe from "./windows/AboutMe";

export default function AboutPage() {
  const launch = (url: string) => window.open(url, "_blank");

  return (
    <div className="min-h-screen bg-black">
      <AboutMe onLaunch={launch} />
    </div>
  );
}
