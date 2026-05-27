import { EXPERIENCE } from "@/lib/data";

export default function Experience() {
  return (
    <div className="p-6 text-[13px] leading-relaxed">
      <h1 className="font-chicago text-xl mb-1">Experience.txt</h1>
      <p className="text-black/60 text-xs mb-4">A chronological record. Scroll for history.</p>
      <div className="pixel-rule mb-4" />
      <ol className="space-y-5">
        {EXPERIENCE.map((e, i) => (
          <li key={i} className="grid grid-cols-[120px_1fr] gap-4">
            <div className="text-[11px] font-mono text-black/60 pt-0.5">{e.when}</div>
            <div>
              <div className="font-chicago text-[15px]">{e.role}</div>
              <div className="text-sm text-black/70">{e.company} · {e.where}</div>
              {e.bullets.length > 0 && (
                <ul className="mt-1.5 list-disc ml-5 space-y-1 text-[13px]">
                  {e.bullets.map((b, j) => <li key={j}>{b}</li>)}
                </ul>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
