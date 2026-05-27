const TRASHED = [
  { name: "uber-for-dogs.pitch", size: "12 KB", date: "2019-03" },
  { name: "blockchain-for-healthcare.key", size: "44 MB", date: "2021-08" },
  { name: "startup_name_ideas_v47.txt", size: "3 KB", date: "2025-06" },
  { name: "cold_email_template_that_didnt_work.eml", size: "1 KB", date: "2024-02" },
  { name: "response-to-harsh-VC.draft", size: "2 KB", date: "2025-11" },
  { name: "work-life-balance.pdf", size: "0 KB", date: "2025-07" },
  { name: "sleep_schedule.ics", size: "0 KB", date: "2025-09" },
  { name: "weekend.app", size: "— corrupt —", date: "2025-10" },
  { name: "another-ai-wrapper.idea", size: "0 KB", date: "2023-11" },
  { name: "excuses_not_to_ship.md", size: "1 KB", date: "2024-12" },
];

export default function Trash() {
  return (
    <div className="p-5 font-sans text-[13px]">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h1 className="font-chicago text-lg">Trash</h1>
          <p className="text-xs text-black/55">{TRASHED.length} items · {"81.3 GB"} available</p>
        </div>
        <button className="btn-chrome px-3 py-1 text-xs font-chicago rounded opacity-60 cursor-not-allowed" disabled>
          Empty Trash…
        </button>
      </div>
      <div className="pixel-rule mb-3" />
      <div className="border border-black/40 rounded overflow-hidden">
        <div className="grid grid-cols-[1fr_80px_90px] bg-[#f5f2e8] border-b border-black/30 px-3 py-1.5 text-[11px] font-chicago">
          <div>Name</div>
          <div>Size</div>
          <div>Deleted</div>
        </div>
        {TRASHED.map((f, i) => (
          <div
            key={f.name}
            className={`grid grid-cols-[1fr_80px_90px] px-3 py-1.5 text-[12px] border-b border-black/10 last:border-0 ${
              i % 2 ? "bg-white" : "bg-[#fafaf3]"
            }`}
          >
            <div className="flex items-center gap-2 truncate">
              <span className="text-black/40">📄</span>
              <span className="truncate line-through decoration-black/30">{f.name}</span>
            </div>
            <div className="text-black/55 font-mono text-[11px]">{f.size}</div>
            <div className="text-black/55 font-mono text-[11px]">{f.date}</div>
          </div>
        ))}
      </div>
      <p className="text-center text-[11px] text-black/45 mt-3 italic">
        Everything here was a stepping stone. Ship more, delete more.
      </p>
    </div>
  );
}
