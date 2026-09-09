import { PROFILE } from "@/lib/data";

export default function AboutMe({ onLaunch }: { onLaunch: (url: string, name: string) => void }) {
  const link = (url: string, name: string, label: string) => (
    <button
      onClick={() => onLaunch(url, name)}
      className="text-accent"
    >
      {label}
    </button>
  );

  const ext = (href: string, label: string) => (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="text-accent"
    >
      {label}
    </a>
  );

  // underlined, not orange — for company mentions
  const extu = (href: string, label: string) => (
    <a href={href} target="_blank" rel="noreferrer" className="underline">
      {label}
    </a>
  );

  return (
    <div className="min-h-full bg-black px-6 py-10 font-mono text-[13px] leading-[1.7] text-[#e6e6e6] selection:bg-white/20 sm:px-10 sm:py-12">
      <div className="max-w-[680px]">
        <p>
          hi, world. i&apos;m shaian (pronounced{" "}
          <span className="italic">{PROFILE.pronounce.toLowerCase()}</span>). i live in san
          francisco and spend most of my time building software &amp; hardware products.
        </p>

        <ul className="mt-7 list-disc space-y-5 pl-5 marker:text-[#e6e6e6]">
          <li>
            co-founder and chief AI officer for {link("https://www.loomhealth.ai", "Loom Health", "loom health")}{" "}
            — a HIPAA-compliant clinical customer service agent platform for enterprise healthcare.
            autonomously responds inside the EHR, cuts admin work ~40%.
            <p className="mt-4">
              co-designed with {extu("https://www.joinmidi.com", "midi health")}{" "}across 100K+ secure patient
              messages. received funding term sheets from Jason Calacanis&apos;s LAUNCH fund.
            </p>
          </li>
          <li>
            {link("https://www.loombuilder.ai", "Loom Builder", "loom builder")} — started as OCR, now an
            extreme low-latency AI detection API embedded inside some of the largest incentive processors,
            catching financial fraud in department of energy rebate subsidies. processes thousands of documents a week.
          </li>
          <li>
            {link("https://www.box-intelligence.com", "Box Intelligence", "box intelligence")} — a forward-deployed
            AI consulting shop focused on sovereign AI and AI intranet tooling, embedded within american energy
            companies. box plans to fully hand off its product at the end of its consulting term.
          </li>
          <li>
            and for some consumer finance action —{" "}
            {link("https://www.bananatab.com", "BananaTab", "bananatab")}. an iMessage-based fintech product
            for personal accounting, powered by a forecasting engine that models income, bills, spending, and
            shared expenses to project cash flow and spending capacity with uncertainty ranges. bananatab also
            runs on its own AI-generated content marketing engine.
          </li>
          <li>
            {ext("https://shaianjavaid.com/bayvisionai", "hardware tinkering")} — a custom vision model
            sitting on top of a locally running nvidia jetson nano, pointed out my apartment window, counting
            cars. a project in thermal throttling, detection accuracy, and physical hardware.
          </li>
        </ul>

        <p className="mt-9">previously:</p>
        <ul className="mt-4 list-disc space-y-2 pl-5 marker:text-[#e6e6e6]">
          <li>
            technical product manager @ {extu("https://www.optum.com", "optum")} — founded the AI voice scheduling
            platform, ran NEMT rideshare [100K+ rides/month, 10 states].
          </li>
          <li>
            technical product manager @ {extu("https://www.rallyhealth.com", "rally health")} — shipped virtual
            care &amp; fintech [acquired by UHC-optum].
          </li>
          <li>worked as a SWE at various startups before that.</li>
        </ul>

        <p className="mt-9">elsewhere:</p>
        <ul className="mt-4 list-disc space-y-2 pl-5 marker:text-[#e6e6e6]">
          <li>lifelong swimmer — completed an alcatraz swim recently.</li>
          <li>x is a good time: {ext(PROFILE.links.x, "@shaian_javaid")}.</li>
          <li>linkedin if you must: {ext(PROFILE.links.linkedin, "/in/shaian-javaid")}.</li>
        </ul>

        <p className="mt-9">
          easiest way to reach me is {ext(PROFILE.links.email, "shaianjavaid at gmail.com")}. i answer most emails.
        </p>

        <p className="mt-12 text-[11px] text-white/35">
          private page, shared by link. please don&apos;t repost.
        </p>
      </div>
    </div>
  );
}
