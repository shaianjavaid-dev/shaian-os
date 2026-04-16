import { TWEETS, PROFILE } from "@/lib/data";

export default function Tweets() {
  return (
    <div className="p-6 max-w-2xl">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h1 className="font-chicago text-xl">𝕏 / @shaian_javaid</h1>
          <p className="text-xs text-black/60">Real posts. Follow for more.</p>
        </div>
        <a href={PROFILE.links.x} target="_blank" className="accent-btn text-xs font-chicago px-3 py-1.5 rounded">Follow →</a>
      </div>
      <div className="pixel-rule mb-4" />
      <div className="space-y-3">
        {TWEETS.map((t, i) => (
          <div key={i} className="border border-black/50 rounded bg-white p-4">
            {t.replyTo && (
              <div className="mb-3 pb-3 border-b border-black/10">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-neutral-600 to-neutral-800 text-white text-[10px] flex items-center justify-center font-chicago">DC</div>
                  <div className="text-xs">
                    <span className="font-chicago">{t.replyTo.name}</span>
                    <span className="text-blue-600 ml-1">✓</span>
                    <span className="text-black/50 ml-1">{t.replyTo.handle}</span>
                  </div>
                </div>
                <p className="text-[13px] text-black/75 pl-9">{t.replyTo.text}</p>
                <p className="text-[10px] text-black/40 pl-9 mt-1">Replying to ↓</p>
              </div>
            )}
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white text-xs font-chicago">SJ</div>
              <div className="text-sm flex-1">
                <div className="font-chicago flex items-center gap-1">
                  Shaian Javaid <span className="text-blue-600 text-xs">✓</span>
                </div>
                <div className="text-[11px] text-black/50">@shaian_javaid · {t.date}</div>
              </div>
            </div>
            <p className="text-[15px] leading-relaxed">{t.text}</p>
            {t.stats && (
              <div className="flex gap-4 mt-3 text-[11px] text-black/50 font-mono">
                {t.stats.likes != null && <span>♥ {t.stats.likes}</span>}
                {t.stats.views && <span>👁 {t.stats.views} views</span>}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
