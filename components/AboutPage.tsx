"use client";

import AboutMe from "./windows/AboutMe";

export default function AboutPage() {
  const launch = (url: string) => window.open(url, "_blank");

  return (
    <div className="fixed inset-0 overflow-hidden scanlines bg-bg">
      <div className="absolute inset-2 sm:inset-4 flex flex-col rounded-[10px] window-shadow overflow-hidden border border-black/60 bg-chrome">
        {/* Title bar */}
        <div className="relative flex h-7 shrink-0 items-center gap-2 border-b border-black/60 bg-[#f5f2e8] px-2">
          <div className="titlebar-stripes absolute inset-x-14 top-1 bottom-1 opacity-70" />
          <div className="relative z-10 flex gap-1.5">
            <span className="h-3 w-3 rounded-full border border-[#c0392b] bg-[#ff5f56]" />
            <span className="h-3 w-3 rounded-full border border-[#b88515] bg-[#ffbd2e]" />
            <span className="h-3 w-3 rounded-full border border-[#18923b] bg-[#27c93f]" />
          </div>
          <div className="relative z-10 flex-1 bg-[#f5f2e8] px-2 text-center font-chicago text-[13px]">
            About Me.rtf
          </div>
          <div className="relative z-10 w-12" />
        </div>
        {/* Body */}
        <div className="scrollbar-retro flex-1 overflow-auto bg-white">
          <AboutMe onLaunch={launch} />
        </div>
      </div>
    </div>
  );
}
