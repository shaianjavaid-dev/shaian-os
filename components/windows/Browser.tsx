"use client";

import { useState } from "react";

export default function Browser({ initialUrl, initialName }: { initialUrl: string; initialName: string }) {
  const [url, setUrl] = useState(initialUrl);
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 px-2 py-1.5 border-b border-black/40 bg-[#f5f2e8]">
        <div className="flex gap-1">
          <button onClick={() => history.back()} className="btn-chrome text-xs px-2 py-0.5 rounded font-chicago">◀</button>
          <button onClick={() => history.forward()} className="btn-chrome text-xs px-2 py-0.5 rounded font-chicago">▶</button>
          <button onClick={() => setUrl(url + "?r=" + Date.now())} className="btn-chrome text-xs px-2 py-0.5 rounded font-chicago">↻</button>
        </div>
        <div className="flex-1 font-mono text-[11px] bg-white border border-black/30 rounded px-2 py-1 truncate">{url}</div>
        <a href={url} target="_blank" className="btn-chrome text-xs px-2 py-0.5 rounded font-chicago">↗</a>
      </div>
      <iframe src={url} title={initialName} className="flex-1 w-full bg-white" />
      <div className="text-[10px] text-black/50 px-2 py-0.5 border-t border-black/20 bg-[#f5f2e8] font-mono">
        Some sites block embedding. Click ↗ to open in a new tab.
      </div>
    </div>
  );
}
