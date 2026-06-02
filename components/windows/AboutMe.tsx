import { PROFILE } from "@/lib/data";

export default function AboutMe({ onLaunch }: { onLaunch: (url: string, name: string) => void }) {
  const link = (url: string, name: string, label: string) => (
    <button
      onClick={() => onLaunch(url, name)}
      className="underline underline-offset-2 hover:text-accent"
    >
      {label}
    </button>
  );

  const ext = (href: string, label: string) => (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="underline underline-offset-2 hover:text-accent"
    >
      {label}
    </a>
  );

  return (
    <div className="min-h-full bg-black px-10 py-12 font-mono text-[13px] leading-[1.7] text-[#e6e6e6] selection:bg-white/20">
      <div className="max-w-[680px]">
        <p>
          hey, world. i&apos;m shaian (pronounced{" "}
          <span className="italic">{PROFILE.pronounce.toLowerCase()}</span>). i live in san
          francisco and spend most of my hours building AI products.
        </p>

        <ul className="mt-7 list-disc space-y-5 pl-5 marker:text-[#e6e6e6]">
          <li>
            co-founder &amp; ceo @ {link("https://www.loomhealth.ai", "Loom Health", "loom health")}{" "}
            — headless HIPAA-compliant AI for enterprise healthcare. autonomously responds inside the
            EHR, cuts admin work ~40%.
            <p className="mt-4">
              co-designed with midi health [1M+ lives, $1B+ valuation] across 100K+ secure patient
              messages. term sheet from jason calacanis&apos;s LAUNCH fund.
            </p>
          </li>
          <li>
            on the side, {link("https://www.loombuilder.ai", "Loom Builder", "loom builder")} — AI that
            fights fraud in grants handed out by the department of energy.
          </li>
        </ul>

        <p className="mt-9">previously:</p>
        <ul className="mt-4 list-disc space-y-2 pl-5 marker:text-[#e6e6e6]">
          <li>
            technical PM @ <span className="italic">optum</span> — founded the AI voice scheduling
            platform, ran NEMT rideshare [100K+ rides/month, 10 states].
          </li>
          <li>
            shipped virtual care &amp; fintech @ <span className="italic">rally health</span>{" "}
            [acquired by UHC-optum].
          </li>
          <li>
            started in engineering @ <span className="italic">stripe</span> and{" "}
            <span className="italic">gener8 ads</span> in london.
          </li>
        </ul>

        <p className="mt-9">elsewhere:</p>
        <ul className="mt-4 list-disc space-y-2 pl-5 marker:text-[#e6e6e6]">
          <li>lifelong swimmer — just swam from alcatraz recently.</li>
          <li>
            currently hacking on a jetson orin nano — a self-contained edge node that counts cars on
            the bay bridge in real time. mostly a project to manage power draw and thermal throttling
            with AI from my apartment.
          </li>
          <li>x is a good time: {ext(PROFILE.links.x, "@shaian_javaid")}.</li>
          <li>linkedin if you must: {ext(PROFILE.links.linkedin, "/in/shaian-javaid")}.</li>
        </ul>

        <p className="mt-9">
          easiest way to reach me is {ext(PROFILE.links.email, PROFILE.email)}. i answer most emails.
          go click around. launch something.
        </p>
      </div>
    </div>
  );
}
