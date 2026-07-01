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
    <div className="min-h-full bg-black px-10 py-12 font-mono text-[13px] leading-[1.7] text-[#e6e6e6] selection:bg-white/20">
      <div className="max-w-[680px]">
        <p>
          hi, world. i&apos;m shaian (pronounced{" "}
          <span className="italic">{PROFILE.pronounce.toLowerCase()}</span>). i live in san
          francisco and spend a lot of my time building software
          AI products, and in my free time, hardware products.
        </p>

        <ul className="mt-7 list-disc space-y-5 pl-5 marker:text-[#e6e6e6]">
          <li>
            co-founder and chief AI officer for {link("https://www.loomhealth.ai", "Loom Health", "loom health")}{" "}
            — headless HIPAA-compliant AI for enterprise healthcare. autonomously responds inside the
            EHR, cuts admin work ~40%.
            <p className="mt-4">
              co-designed with {extu("https://www.joinmidi.com", "midi health")}{" "}across 100K+ secure patient
              messages. received funding term sheets from jason calacanis&apos;s LAUNCH fund.
            </p>
          </li>
          <li>
            {link("https://www.loombuilder.ai", "Loom Builder", "loom builder")} — a forward-deployed OCR
            platform embedded inside some of the largest incentive processors, detecting financial fraud in
            department of energy rebate subsidies. actively processes nearly ~4,000 documents a month.
          </li>
          <li>
            and for fun, to change up the pace from B2B —{" "}
            {link("https://www.bananatab.com", "BananaTab", "bananatab")}. a textable agent
            that earns you points on venmo requests.
          </li>
          <li>
            {ext("https://www.shaianjavaid.com/bayvisionai", "hardware tinkering")} — counting every car
            that comes into the city with a vision model running locally on an nvidia jetson nano.
          </li>
        </ul>

        <p className="mt-9">previously:</p>
        <ul className="mt-4 list-disc space-y-2 pl-5 marker:text-[#e6e6e6]">
          <li>
            technical PM @ {extu("https://www.optum.com", "optum")} — founded the AI voice scheduling
            platform, ran NEMT rideshare [100K+ rides/month, 10 states].
          </li>
          <li>
            shipped virtual care &amp; fintech @ {extu("https://www.rallyhealth.com", "rally health")}{" "}
            [acquired by UHC-optum].
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
      </div>
    </div>
  );
}
