"use client";

import { useEffect, useRef, useState } from "react";
import { COMPANIES, EXPERIENCE, PROFILE } from "@/lib/data";

type Line = { kind: "in" | "out"; text: string };

const HELP = [
  "Available commands:",
  "  help            Show this list",
  "  about           Who is Shaian?",
  "  ls              List files on this desktop",
  "  cat resume      Print resume summary",
  "  companies       List ventures",
  "  open <name>     Open a URL (loomhealth | loombuilder | linkedin | x)",
  "  whoami          ",
  "  sudo hire me    ",
  "  clear           Clear the terminal",
];

export default function Terminal() {
  const [history, setHistory] = useState<Line[]>([
    { kind: "out", text: "shaian-os terminal v1.0 — type 'help' for commands." },
  ]);
  const [value, setValue] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  function run(raw: string) {
    const cmd = raw.trim().toLowerCase();
    const push = (lines: string[]) =>
      setHistory((h) => [...h, { kind: "in", text: raw }, ...lines.map((t) => ({ kind: "out" as const, text: t }))]);

    if (!cmd) return setHistory((h) => [...h, { kind: "in", text: "" }]);

    if (cmd === "clear") return setHistory([]);
    if (cmd === "help") return push(HELP);
    if (cmd === "whoami") return push([PROFILE.name + " (" + PROFILE.pronounce + ")", PROFILE.tagline]);
    if (cmd === "about") return push([PROFILE.tagline, "Type 'companies' or 'cat resume' to dig in."]);
    if (cmd === "ls") return push(["About.rtf  Resume.pdf  Experience/  Companies/  Proof/  Twitter.app  Contact.app"]);
    if (cmd === "companies") return push(COMPANIES.map((c) => `• ${c.name.padEnd(16)} ${c.url}`));
    if (cmd === "cat resume") return push(EXPERIENCE.slice(0, 4).map((e) => `${e.when}  ${e.role} @ ${e.company}`));
    if (cmd.startsWith("open ")) {
      const target = cmd.slice(5).trim();
      const map: Record<string, string> = {
        loomhealth: "https://www.loomhealth.ai",
        loombuilder: "https://www.loombuilder.ai",
        linkedin: PROFILE.links.linkedin,
        x: PROFILE.links.x,
        twitter: PROFILE.links.x,
      };
      if (map[target]) {
        window.open(map[target], "_blank");
        return push([`Opened ${map[target]}`]);
      }
      return push([`open: unknown target '${target}'`]);
    }
    if (cmd === "sudo hire me") return push(["Permission granted. Email sent to " + PROFILE.email + " — I'll reply faster than you expect."]);
    if (cmd === "exit") return push(["Nice try. You can't leave the OS."]);
    return push([`command not found: ${cmd}`]);
  }

  return (
    <div className="p-4 bg-black text-[#7bf48a] font-mono text-[12.5px] leading-6 h-[420px] flex flex-col">
      <div className="flex-1 overflow-auto scrollbar-retro">
        {history.map((l, i) =>
          l.kind === "in" ? (
            <div key={i}><span className="text-white">shaian@os:~$ </span>{l.text}</div>
          ) : (
            <div key={i} className="whitespace-pre-wrap">{l.text}</div>
          )
        )}
        <div ref={endRef} />
      </div>
      <form
        onSubmit={(e) => { e.preventDefault(); run(value); setValue(""); }}
        className="flex items-center gap-2 pt-1"
      >
        <span className="text-white">shaian@os:~$</span>
        <input
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="flex-1 bg-transparent outline-none text-[#7bf48a]"
        />
        <span className="blink">▌</span>
      </form>
    </div>
  );
}
