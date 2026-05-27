import { COMPANIES } from "@/lib/data";

export default function Companies({ onLaunch }: { onLaunch: (url: string, name: string) => void }) {
  return (
    <div className="p-6">
      <h1 className="font-chicago text-xl mb-1">Companies I started/</h1>
      <p className="text-black/60 text-xs mb-4">Double-click a tile to launch the live site inside the OS.</p>
      <div className="pixel-rule mb-4" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {COMPANIES.map((c) => (
          <div
            key={c.name}
            className="border border-black/60 rounded-lg bg-[#f5f2e8] window-shadow overflow-hidden"
          >
            <div className="px-3 py-1.5 border-b border-black/40 flex items-center justify-between">
              <span className="font-chicago text-[13px]">{c.name}</span>
              <span className="text-[10px] font-mono text-black/60">{c.status}</span>
            </div>
            <div className="p-4 bg-white">
              <p className="text-sm mb-3">{c.tag}</p>
              <ul className="text-[12px] space-y-1 mb-4">
                {c.highlights.map((h, i) => (
                  <li key={i} className="flex gap-2"><span>◆</span>{h}</li>
                ))}
              </ul>
              <div className="flex gap-2">
                <button
                  onClick={() => onLaunch(c.url, c.name)}
                  className="accent-btn text-xs font-chicago px-3 py-1.5 rounded"
                >
                  ▶ Launch in OS
                </button>
                <a
                  href={c.url}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-chrome text-xs font-chicago px-3 py-1.5 rounded"
                >
                  Open in new tab ↗
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
