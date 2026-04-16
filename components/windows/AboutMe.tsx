import { PROFILE } from "@/lib/data";

export default function AboutMe({ onLaunch }: { onLaunch: (url: string, name: string) => void }) {
  return (
    <div className="p-8 font-sans text-[14px] leading-relaxed">
      <div className="flex items-start gap-6 mb-6">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-300 to-orange-600 border-2 border-black flex items-center justify-center text-white text-2xl font-chicago shrink-0">
          SJ
        </div>
        <div>
          <h1 className="text-3xl font-chicago tracking-tight">{PROFILE.name}</h1>
          <p className="text-sm text-black/60 italic">({PROFILE.pronounce})</p>
          <p className="mt-2 text-base">{PROFILE.tagline}</p>
          <p className="mt-1 text-xs text-black/60">{PROFILE.location} · {PROFILE.email}</p>
        </div>
      </div>
      <div className="pixel-rule my-4" />
      <p>
        Currently Co-Founder &amp; CEO of{" "}
        <button
          onClick={() => onLaunch("https://www.loomhealth.ai", "Loom Health")}
          className="underline decoration-dotted hover:text-accent"
        >
          Loom Health AI
        </button>
        , building autonomous clinical AI governance infrastructure for enterprise healthcare. Co-designed
        with Midi Health (1M+ lives, $1B+ valuation), and received a funding term sheet from Jason
        Calacanis&apos;s LAUNCH Fund.
      </p>
      <p className="mt-3">
        Before Loom I was a technical product leader at Optum — founding Optum&apos;s AI-powered voice
        scheduling platform, running the NEMT rideshare product (100K+ rides/month across 10 states), and
        before that shipping virtual care &amp; fintech at Rally Health (acquired by UHC-Optum). I started in
        engineering at Stripe and Gener8 Ads in London.
      </p>
      <p className="mt-3">
        On the side I run{" "}
        <button
          onClick={() => onLaunch("https://www.loombuilder.ai", "Loom Builder")}
          className="underline decoration-dotted hover:text-accent"
        >
          Loom Builder
        </button>
        — a vision AI platform processing ~10K energy-rebate applications per month, fully autonomous and
        bootstrapped.
      </p>
      <p className="mt-3">Reach out. Go click around. Launch something.</p>

      <div className="pixel-rule my-4" />
      <div className="flex flex-wrap gap-2">
        <a href={PROFILE.links.x} target="_blank" className="btn-chrome px-3 py-1.5 text-xs font-chicago rounded">𝕏 / Twitter</a>
        <a href={PROFILE.links.linkedin} target="_blank" className="btn-chrome px-3 py-1.5 text-xs font-chicago rounded">LinkedIn</a>
        <a href={PROFILE.links.email} className="accent-btn px-3 py-1.5 text-xs font-chicago rounded">Email me</a>
      </div>
    </div>
  );
}
