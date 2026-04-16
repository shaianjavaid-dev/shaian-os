"use client";

import { useState } from "react";
import { INBOX, type Email } from "@/lib/inbox";

const LABEL_COLOR: Record<NonNullable<Email["label"]>, string> = {
  INVESTOR: "bg-orange-200 text-orange-900 border-orange-700",
  PILOT: "bg-green-200 text-green-900 border-green-700",
  PRESS: "bg-purple-200 text-purple-900 border-purple-700",
  CUSTOMER: "bg-blue-200 text-blue-900 border-blue-700",
  TEAM: "bg-yellow-200 text-yellow-900 border-yellow-700",
};

export default function Inbox() {
  const [selected, setSelected] = useState<string>(INBOX[0].id);
  const email = INBOX.find((e) => e.id === selected)!;

  return (
    <div className="h-[560px] flex text-[13px]">
      {/* Sidebar */}
      <aside className="w-40 border-r border-black/30 bg-[#f5f2e8] text-[12px] font-chicago">
        <div className="px-3 py-2 border-b border-black/20 text-black/60 text-[10px] uppercase">Mailboxes</div>
        <ul>
          <li className="px-3 py-1.5 bg-black text-white">📥 Recent <span className="text-[10px] opacity-70">({INBOX.length})</span></li>
          <li className="px-3 py-1.5 hover:bg-black/10 cursor-default">⭐ Starred</li>
          <li className="px-3 py-1.5 hover:bg-black/10 cursor-default">📤 Sent</li>
          <li className="px-3 py-1.5 hover:bg-black/10 cursor-default">🗑 Trash</li>
        </ul>
        <div className="px-3 py-2 mt-3 border-t border-black/20 text-black/60 text-[10px] uppercase">Labels</div>
        <ul className="text-[11px]">
          <li className="px-3 py-1 flex items-center gap-2"><span className="w-2 h-2 bg-orange-500 rounded-full" /> Investor</li>
          <li className="px-3 py-1 flex items-center gap-2"><span className="w-2 h-2 bg-green-500 rounded-full" /> Pilot</li>
          <li className="px-3 py-1 flex items-center gap-2"><span className="w-2 h-2 bg-blue-500 rounded-full" /> Customer</li>
          <li className="px-3 py-1 flex items-center gap-2"><span className="w-2 h-2 bg-yellow-500 rounded-full" /> Team</li>
        </ul>
      </aside>

      {/* Email list */}
      <div className="w-64 border-r border-black/30 overflow-auto scrollbar-retro">
        {INBOX.map((e) => (
          <button
            key={e.id}
            onClick={() => setSelected(e.id)}
            className={`w-full text-left border-b border-black/10 px-3 py-2 block ${
              selected === e.id ? "bg-[#ffe8c7]" : "bg-white hover:bg-black/[0.04]"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-chicago text-[12px] truncate">{e.from}</span>
              <span className="text-[10px] text-black/50 shrink-0">{e.date.slice(5)}</span>
            </div>
            <div className="text-[12px] truncate flex items-center gap-1.5">
              {e.starred && <span className="text-orange-500">★</span>}
              <span className="font-medium">{e.subject}</span>
            </div>
            <div className="text-[11px] text-black/55 truncate">{e.preview}</div>
          </button>
        ))}
      </div>

      {/* Reading pane */}
      <div className="flex-1 overflow-auto scrollbar-retro bg-white">
        <div className="px-6 py-5 border-b border-black/15">
          <div className="flex items-start justify-between gap-3 mb-1">
            <h2 className="font-chicago text-lg">{email.subject}</h2>
            {email.label && (
              <span className={`text-[10px] border rounded px-1.5 py-0.5 font-chicago ${LABEL_COLOR[email.label]}`}>
                {email.label}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-[12px]">
            <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-[11px] font-chicago">
              {email.from.slice(0, 1)}
            </div>
            <div>
              <div className="font-chicago">{email.from} <span className="text-black/50 font-sans text-[11px]">&lt;{email.fromEmail}&gt;</span></div>
              <div className="text-black/50 text-[11px]">to me · {email.date}</div>
            </div>
          </div>
        </div>

        <div className="px-6 py-5 whitespace-pre-wrap font-sans text-[14px] leading-relaxed">
          {email.body}
        </div>

        {email.attachments && email.attachments.length > 0 && (
          <div className="px-6 pb-6">
            <div className="pixel-rule mb-3" />
            <div className="text-[11px] font-chicago text-black/60 mb-2">
              {email.attachments.length} attachment{email.attachments.length > 1 ? "s" : ""}
            </div>
            <div className="grid gap-3">
              {email.attachments.map((a) =>
                a.kind === "image" ? (
                  <a key={a.name} href={a.src} target="_blank" className="block border border-black/40 rounded overflow-hidden bg-[#f5f2e8] hover:bg-[#efe8d0]">
                    <img src={a.src} alt={a.name} className="w-full max-h-80 object-contain bg-black" />
                    <div className="px-3 py-1.5 text-[11px] font-mono flex justify-between">
                      <span>📎 {a.name}</span>
                      <span className="text-black/50">click to open</span>
                    </div>
                  </a>
                ) : null
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
