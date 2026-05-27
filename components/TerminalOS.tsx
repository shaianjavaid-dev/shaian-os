"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { COMPANIES, EXPERIENCE, PROFILE } from "@/lib/data";

type Line = { kind: "in" | "out"; text?: string; node?: ReactNode };

const GREEN = "#00ff41";

const OPEN_TARGETS: Record<string, string> = {
  loomhealth: "https://www.loomhealth.ai",
  loombuilder: "https://www.loombuilder.ai",
  linkedin: PROFILE.links.linkedin,
  x: PROFILE.links.x,
  twitter: PROFILE.links.x,
  email: PROFILE.links.email,
};

const HELP = [
  "available commands:",
  "  help            show this list",
  "  about           print the readme (about shaian)",
  "  whoami          one-line summary",
  "  ls              list files",
  "  cat resume      print resume summary",
  "  companies       list ventures",
  "  contact         show email",
  "  open <target>   open a link (loomhealth | loombuilder | linkedin | x | email)",
  "  clear           clear the screen",
];

function link(href: string, label: string) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="underline underline-offset-2 hover:text-white"
    >
      {label}
    </a>
  );
}

function Bio() {
  return (
    <div className="max-w-[760px] whitespace-normal">
      <p>
        hey, world. i&apos;m shaian (pronounced{" "}
        <span className="italic">{PROFILE.pronounce.toLowerCase()}</span>). i live in san francisco
        and spend most of my hours shipping AI products.
      </p>

      <ul className="mt-5 list-disc space-y-4 pl-5 marker:text-[#00ff41]">
        <li>
          co-founder &amp; ceo @ {link("https://www.loomhealth.ai", "loom health")} — headless
          HIPAA-compliant AI for enterprise healthcare. autonomously responds inside the EHR, cuts
          admin work ~40%.
          <p className="mt-3">
            co-designed with midi health [1M+ lives, $1B+ valuation] across 100K+ secure patient
            messages. term sheet from jason calacanis&apos;s LAUNCH fund.
          </p>
        </li>
        <li>
          on the side, {link("https://www.loombuilder.ai", "loom builder")} — AI that fights fraud
          in grants handed out by the department of energy.
        </li>
      </ul>

      <p className="mt-6">previously:</p>
      <ul className="mt-3 list-disc space-y-2 pl-5 marker:text-[#00ff41]">
        <li>
          technical PM @ <span className="italic">optum</span> — founded the AI voice scheduling
          platform, ran NEMT rideshare [100K+ rides/month, 10 states].
        </li>
        <li>
          shipped virtual care &amp; fintech @ <span className="italic">rally health</span> [acquired
          by UHC-optum].
        </li>
        <li>
          started in engineering @ <span className="italic">stripe</span> and{" "}
          <span className="italic">gener8 ads</span> in london.
        </li>
      </ul>

      <p className="mt-6">elsewhere:</p>
      <ul className="mt-3 list-disc space-y-2 pl-5 marker:text-[#00ff41]">
        <li>lifelong swimmer — just swam from alcatraz recently.</li>
        <li>
          currently hacking on a jetson orin nano — a self-contained edge node that counts cars on
          the bay bridge in real time. mostly a project to manage power draw and thermal throttling
          with AI.
        </li>
        <li>x is a good time: {link(PROFILE.links.x, "@shaian_javaid")}.</li>
        <li>linkedin if you must: {link(PROFILE.links.linkedin, "/in/shaian-javaid")}.</li>
      </ul>

      <p className="mt-6">
        easiest way to reach me is {link(PROFILE.links.email, PROFILE.email)}. i answer most emails.
      </p>
    </div>
  );
}

const BOOT: Line[] = [
  { kind: "out", text: "shaian-os 1.0 — welcome." },
  { kind: "in", text: "cat about.txt" },
  { kind: "out", node: <Bio /> },
  { kind: "out", text: "" },
  { kind: "out", text: "type 'help' for a list of commands." },
];

export default function TerminalOS() {
  const [history, setHistory] = useState<Line[]>(BOOT);
  const [value, setValue] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  function run(raw: string) {
    const cmd = raw.trim().toLowerCase();
    const echo: Line = { kind: "in", text: raw };
    const out = (lines: (string | ReactNode)[]) =>
      setHistory((h) => [
        ...h,
        echo,
        ...lines.map((l) =>
          typeof l === "string" ? { kind: "out" as const, text: l } : { kind: "out" as const, node: l }
        ),
      ]);

    if (!cmd) return setHistory((h) => [...h, { kind: "in", text: "" }]);
    if (cmd === "clear") return setHistory([]);
    if (cmd === "help") return out(HELP);
    if (cmd === "about" || cmd === "readme" || cmd === "cat about" || cmd === "cat about.txt" || cmd === "cat readme")
      return out([<Bio key="bio" />]);
    if (cmd === "whoami") return out([`${PROFILE.name} (${PROFILE.pronounce}) — ${PROFILE.tagline}`]);
    if (cmd === "ls") return out(["about.txt   resume   companies   contact"]);
    if (cmd === "cat resume")
      return out(EXPERIENCE.slice(0, 6).map((e) => `${e.when.padEnd(26)} ${e.role} @ ${e.company}`));
    if (cmd === "companies") return out(COMPANIES.map((c) => `• ${c.name.padEnd(14)} ${c.url}`));
    if (cmd === "contact" || cmd === "email")
      return out([`email: ${PROFILE.email}`, "run 'open email' to compose."]);
    if (cmd.startsWith("open ")) {
      const target = cmd.slice(5).trim();
      if (OPEN_TARGETS[target]) {
        window.open(OPEN_TARGETS[target], "_blank");
        return out([`opening ${OPEN_TARGETS[target]} ...`]);
      }
      return out([`open: unknown target '${target}'`]);
    }
    if (cmd === "sudo hire me")
      return out([`permission granted. drop a line at ${PROFILE.email} — i reply faster than you'd expect.`]);
    if (cmd === "exit") return out(["there is no exit. it's terminals all the way down."]);
    return out([`command not found: ${cmd}. type 'help'.`]);
  }

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className="fixed inset-0 overflow-auto bg-black px-5 py-6 font-mono text-[13px] leading-[1.7] sm:px-8"
      style={{ color: GREEN, cursor: "text" }}
    >
      <div className="mx-auto max-w-[900px]">
        {history.map((l, i) =>
          l.kind === "in" ? (
            <div key={i}>
              <span className="text-white">shaian@os:~$ </span>
              {l.text}
            </div>
          ) : l.node ? (
            <div key={i} className="my-1">
              {l.node}
            </div>
          ) : (
            <div key={i} className="whitespace-pre-wrap">
              {l.text || " "}
            </div>
          )
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            run(value);
            setValue("");
          }}
          className="flex items-center gap-2"
        >
          <span className="text-white">shaian@os:~$</span>
          <input
            ref={inputRef}
            autoFocus
            value={value}
            onChange={(e) => setValue(e.target.value)}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            className="flex-1 bg-transparent outline-none"
            style={{ color: GREEN, caretColor: GREEN }}
          />
          <span className="blink">▌</span>
        </form>
        <div ref={endRef} />
      </div>
    </div>
  );
}
