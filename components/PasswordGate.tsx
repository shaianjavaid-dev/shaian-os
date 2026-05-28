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
const EXPECTED_HASHES = [
  "a63422b7dbe8e2b2c95ca16f223abdceeabd96f8d2c8b558e9e0ae6de1b4c8cc",
  "a250aaaf106ed8996bc509d98c668188791705ee7a110ed9dd24ba5a2a61cb7d",
];

const SESSION_KEY = "__sos_auth";

export default function PasswordGate({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const s = sessionStorage.getItem(SESSION_KEY);
    if (s && EXPECTED_HASHES.includes(s)) setAuthed(true);
    setChecking(false);
  }, []);

  useEffect(() => {
    if (!checking && !authed) inputRef.current?.focus();
  }, [checking, authed]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    const hash = await sha256(input.trim());
    if (EXPECTED_HASHES.includes(hash)) {
      sessionStorage.setItem(SESSION_KEY, hash);
      setAuthed(true);
    } else {
      setError(true);
      setInput("");
    }
  }

  if (checking) return null;
  if (authed) return <>{children}</>;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black font-mono text-[13px] text-[#e6e6e6]">
      <form onSubmit={handleSubmit} className="w-full max-w-[280px] px-6">
        <input
          ref={inputRef}
          type="password"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setError(false);
          }}
          autoFocus
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          placeholder="password"
          className="w-full border-b border-white/25 bg-transparent pb-1 text-center outline-none placeholder:text-white/30 focus:border-white/60"
        />
        {error && <p className="mt-3 text-center text-[12px] text-red-400/80">incorrect</p>}
      </form>
    </div>
  );
}
