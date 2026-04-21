"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import Window from "./Window";
import DesktopIcon from "./DesktopIcon";
import {
  AppIcon,
  ComputerIcon,
  ContactIcon,
  DocIcon,
  FolderIcon,
  GlobeIcon,
  MailIcon,
  TerminalIcon,
  TrashIcon,
  XIcon,
} from "./Icons";
import AboutMe from "./windows/AboutMe";
import Resume from "./windows/Resume";
import Experience from "./windows/Experience";
import Companies from "./windows/Companies";
import Tweets from "./windows/Tweets";
import Contact from "./windows/Contact";
import Terminal from "./windows/Terminal";
import Browser from "./windows/Browser";
import Inbox from "./windows/Inbox";
import Trash from "./windows/Trash";
import Screensaver from "./windows/Screensaver";

type WinState = {
  id: string;
  title: string;
  x: number;
  y: number;
  w: number;
  h?: number;
  z: number;
  min: boolean;
  kind: "about" | "resume" | "experience" | "companies" | "inbox" | "tweets" | "contact" | "terminal" | "browser" | "trash" | "screensaver";
  meta?: { url?: string; name?: string };
};

const INITIAL = (): WinState[] => {
  const cx = typeof window !== "undefined" ? window.innerWidth / 2 : 600;
  const cy = typeof window !== "undefined" ? window.innerHeight / 2 : 400;
  return [
    {
      id: "about",
      title: "About Me.rtf",
      kind: "about",
      x: Math.max(60, cx - 340),
      y: 40,
      w: 680,
      h: Math.min(cy - 80, 460),
      z: 10,
      min: false,
    },
  ];
};

export default function Desktop() {
  const [booted, setBooted] = useState(false);
  const [windows, setWindows] = useState<WinState[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [now, setNow] = useState(new Date());
  const [trashFull, setTrashFull] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setBooted(true);
      setWindows(INITIAL());
    }, 2200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);

  const topZ = useMemo(() => windows.reduce((m, w) => Math.max(m, w.z), 10), [windows]);

  function focus(id: string) {
    setWindows((ws) => ws.map((w) => (w.id === id ? { ...w, z: topZ + 1, min: false } : w)));
  }
  function close(id: string) {
    setWindows((ws) => ws.filter((w) => w.id !== id));
    if (id !== "trash") setTrashFull(true);
  }
  function minimize(id: string) {
    setWindows((ws) => ws.map((w) => (w.id === id ? { ...w, min: true } : w)));
  }
  function maximize(id: string) {
    setWindows((ws) =>
      ws.map((w) =>
        w.id === id
          ? { ...w, x: 30, y: 40, w: Math.min(window.innerWidth - 60, 1200), h: window.innerHeight - 100 }
          : w
      )
    );
  }
  function move(id: string, x: number, y: number) {
    setWindows((ws) => ws.map((w) => (w.id === id ? { ...w, x, y } : w)));
  }

  function open(win: Omit<WinState, "z" | "min">) {
    setWindows((ws) => {
      const exists = ws.find((w) => w.id === win.id);
      if (exists) return ws.map((w) => (w.id === win.id ? { ...w, z: topZ + 1, min: false } : w));
      return [...ws, { ...win, z: topZ + 1, min: false }];
    });
  }

  function openKind(kind: WinState["kind"], meta?: WinState["meta"]) {
    const id = kind === "browser" ? `browser:${meta?.url}` : kind;
    const defaults: Record<WinState["kind"], Omit<WinState, "z" | "min" | "id" | "kind">> = {
      about: { title: "About Me.rtf", x: 80, y: 70, w: 680, h: 540 },
      resume: { title: "Resume.pdf", x: 140, y: 90, w: 780, h: 620 },
      experience: { title: "Experience.txt", x: 180, y: 110, w: 720, h: 560 },
      companies: { title: "Companies I started/", x: 220, y: 130, w: 760, h: 560 },
      inbox: { title: "Inbox.app — Recent messages", x: 150, y: 70, w: 900, h: 620 },
      tweets: { title: "Twitter.app", x: 300, y: 90, w: 640, h: 560 },
      contact: { title: "Contact.app", x: 340, y: 130, w: 540, h: 440 },
      terminal: { title: "Terminal — /bin/zsh", x: 360, y: 160, w: 660, h: 460 },
      browser: { title: `Safari — ${meta?.name ?? ""}`, x: 120, y: 60, w: 980, h: 640 },
      trash: { title: "Trash", x: 400, y: 180, w: 480, h: 360 },
      screensaver: { title: "SSSTARS.SCR", x: 0, y: 0, w: 360, h: 260 },
    };
    open({ id, kind, meta, ...defaults[kind] });
  }

  function launchBrowser(url: string, name: string) {
    openKind("browser", { url, name });
  }

  return (
    <div className="fixed inset-0 overflow-hidden scanlines">
      {/* Boot sequence */}
      <AnimatePresence>
        {!booted && (
          <motion.div
            key="boot"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 bg-black z-[10000] flex items-center justify-center font-mono text-[#7bf48a] text-[13px]"
          >
            <div className="w-[520px]">
              <div className="text-white font-chicago text-xl mb-4">ShaianOS 1.0</div>
              <pre className="whitespace-pre-wrap">{`POST ................ OK
Memory (640K)  ....... OK
Loading kernel ....... OK
Mounting /home/shaian  ...
Initializing Loom/    ...
Initializing Companies/ ...
Starting Finder ......
`}</pre>
              <div>ready<span className="blink">▌</span></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Menubar */}
      <div className="absolute top-0 inset-x-0 h-6 bg-white/95 border-b border-black/50 flex items-center px-3 gap-4 text-[12px] font-chicago z-[5000] backdrop-blur">
        <div className="font-bold">🟧 Shaian</div>
        <div className="hover:bg-black hover:text-white px-2 rounded cursor-default">File</div>
        <div className="hover:bg-black hover:text-white px-2 rounded cursor-default">Edit</div>
        <div className="hover:bg-black hover:text-white px-2 rounded cursor-default">View</div>
        <div className="hover:bg-black hover:text-white px-2 rounded cursor-default">Special</div>
        <div className="hover:bg-black hover:text-white px-2 rounded cursor-default" onClick={() => openKind("terminal")}>Terminal</div>
        <div className="flex-1" />
        <div className="text-xs text-black/70 font-mono">
          {now.toLocaleString("en-US", { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
        </div>
      </div>

      {/* Desktop body */}
      <div className={`absolute inset-0 pt-8 ${booted ? "crt-on" : ""}`}>
        {/* Center icons */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex gap-8">
            <DesktopIcon
              label="Companies I've started"
              icon={<FolderIcon />}
              selected={selected === "companies"}
              onSelect={() => setSelected("companies")}
              onOpen={() => openKind("companies")}
            />
            <DesktopIcon
              label="Twitter.app"
              icon={<XIcon />}
              selected={selected === "tweets"}
              onSelect={() => setSelected("tweets")}
              onOpen={() => openKind("tweets")}
            />
            <DesktopIcon
              label="Cool.Recently.Inbox"
              icon={<MailIcon />}
              selected={selected === "inbox"}
              onSelect={() => setSelected("inbox")}
              onOpen={() => openKind("inbox")}
            />
            <DesktopIcon
              label="Contact"
              icon={<ContactIcon />}
              selected={selected === "contact"}
              onSelect={() => setSelected("contact")}
              onOpen={() => openKind("contact")}
            />
            <DesktopIcon
              label="Technical Product Resume"
              icon={<DocIcon />}
              selected={selected === "resume"}
              onSelect={() => setSelected("resume")}
              onOpen={() => openKind("resume")}
            />
          </div>
        </div>

        {/* Windows */}
        <AnimatePresence>
          {windows.map((w) => (
            <Window
              key={w.id}
              id={w.id}
              title={w.title}
              x={w.x}
              y={w.y}
              width={w.w}
              height={w.h}
              z={w.z}
              minimized={w.min}
              onFocus={() => focus(w.id)}
              onClose={() => close(w.id)}
              onMinimize={() => minimize(w.id)}
              onMaximize={() => maximize(w.id)}
              onMove={(x, y) => move(w.id, x, y)}
            >
              {w.kind === "about" && <AboutMe onLaunch={launchBrowser} />}
              {w.kind === "resume" && <Resume />}
              {w.kind === "experience" && <Experience />}
              {w.kind === "companies" && <Companies onLaunch={launchBrowser} />}
              {w.kind === "inbox" && <Inbox />}
              {w.kind === "tweets" && <Tweets />}
              {w.kind === "contact" && <Contact />}
              {w.kind === "terminal" && <Terminal />}
              {w.kind === "browser" && w.meta?.url && (
                <Browser initialUrl={w.meta.url} initialName={w.meta.name || ""} />
              )}
              {w.kind === "trash" && <Trash />}
              {w.kind === "screensaver" && <Screensaver />}
            </Window>
          ))}
        </AnimatePresence>

        {/* Minimized dock */}
        {windows.some((w) => w.min) && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 bg-white/80 backdrop-blur border border-black/40 rounded-lg px-2 py-1 z-[4000]">
            {windows.filter((w) => w.min).map((w) => (
              <button
                key={w.id}
                onClick={() => focus(w.id)}
                className="btn-chrome px-3 py-1 text-xs font-chicago rounded"
              >
                {w.title}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
