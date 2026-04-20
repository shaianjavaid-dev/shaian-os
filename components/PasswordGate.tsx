"use client";

import { useEffect, useRef, useState } from "react";

async function sha256(msg: string): Promise<string> {
  const data = new TextEncoder().encode(msg);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Precomputed SHA-256 — plaintext never appears in bundle
const EXPECTED_HASH =
  "a63422b7dbe8e2b2c95ca16f223abdceeabd96f8d2c8b558e9e0ae6de1b4c8cc";

const SESSION_KEY = "__sos_auth";
const LOCKOUT_KEY = "__sos_lockout";
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 60_000;

const BOOT_LINES = [
  "POST ................ OK",
  "Memory (640K)  ....... OK",
  "Loading kernel ....... OK",
  "Mounting /home/shaian  ...",
  "Initializing Loom/    ...",
  "Initializing Companies/ ...",
  "Starting Finder ......",
  "",
  "Authenticate to continue:",
];

export default function PasswordGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(false);
  const [bootIndex, setBoot] = useState(0);
  const [booting, setBooting] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  // Check session on mount
  useEffect(() => {
    const s = sessionStorage.getItem(SESSION_KEY);
    if (s === EXPECTED_HASH) {
      setAuthed(true);
    }
    setChecking(false);

    // Check lockout
    const lockUntil = localStorage.getItem(LOCKOUT_KEY);
    if (lockUntil && Date.now() < Number(lockUntil)) {
      setLocked(true);
      const remaining = Number(lockUntil) - Date.now();
      setTimeout(() => {
        setLocked(false);
        localStorage.removeItem(LOCKOUT_KEY);
      }, remaining);
    }
  }, []);

  // Boot text animation
  useEffect(() => {
    if (authed || checking) return;
    if (bootIndex < BOOT_LINES.length) {
      const t = setTimeout(
        () => setBoot((i) => i + 1),
        BOOT_LINES[bootIndex] === "" ? 200 : 40 + Math.random() * 60
      );
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => {
        setBooting(false);
        inputRef.current?.focus();
      }, 300);
      return () => clearTimeout(t);
    }
  }, [bootIndex, authed, checking]);

  // Block dev tools shortcuts + right-click while locked
  useEffect(() => {
    if (authed) return;
    const handler = (e: KeyboardEvent) => {
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(e.key)) ||
        (e.ctrlKey && e.key === "u") ||
        (e.metaKey && e.altKey && ["I", "J", "C"].includes(e.key)) ||
        (e.metaKey && e.key === "u")
      ) {
        e.preventDefault();
      }
    };
    const ctxHandler = (e: MouseEvent) => e.preventDefault();
    window.addEventListener("keydown", handler);
    window.addEventListener("contextmenu", ctxHandler);
    return () => {
      window.removeEventListener("keydown", handler);
      window.removeEventListener("contextmenu", ctxHandler);
    };
  }, [authed]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (locked || !input.trim()) return;

    const hash = await sha256(input.trim());

    if (hash === EXPECTED_HASH) {
      sessionStorage.setItem(SESSION_KEY, hash);
      setAuthed(true);
      setError("");
    } else {
      const next = attempts + 1;
      setAttempts(next);
      setInput("");
      if (next >= MAX_ATTEMPTS) {
        setLocked(true);
        const until = Date.now() + LOCKOUT_MS;
        localStorage.setItem(LOCKOUT_KEY, String(until));
        setError(
          `Too many failed attempts. System locked for 60 seconds.`
        );
        setTimeout(() => {
          setLocked(false);
          setAttempts(0);
          localStorage.removeItem(LOCKOUT_KEY);
          setError("Enter password:");
        }, LOCKOUT_MS);
      } else {
        setError(
          `ACCESS DENIED — ${MAX_ATTEMPTS - next} attempt${MAX_ATTEMPTS - next === 1 ? "" : "s"} remaining`
        );
      }
    }
  }

  if (checking) return null;
  if (authed) return <>{children}</>;

  return (
    <div
      className="fixed inset-0 bg-black z-[99999] flex items-center justify-center overflow-hidden"
      style={{ cursor: "default" }}
    >
      <div className="w-full max-w-[600px] px-6 font-mono text-[#00ff41] text-[13px] leading-relaxed">
        {/* Boot lines */}
        <div className="mb-2 select-none">
          {BOOT_LINES.slice(0, bootIndex).map((line, i) => (
            <div key={i}>
              {line || "\u00A0"}
            </div>
          ))}
        </div>

        {/* Input area */}
        {!booting && (
          <form onSubmit={handleSubmit} className="select-none">
            {error && (
              <div className="mb-2 text-red-400">
                {error}
              </div>
            )}
            <div className="flex items-center gap-2">
              <span>password:</span>
              <input
                ref={inputRef}
                type="password"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={locked}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
                className="flex-1 bg-transparent border-none outline-none text-[#00ff41] font-mono text-[13px] caret-[#00ff41]"
              />
              <span className="blink">▌</span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
