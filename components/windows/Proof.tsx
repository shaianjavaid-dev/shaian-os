import { PROOF } from "@/lib/data";

export default function Proof() {
  return (
    <div className="p-6">
      <h1 className="font-chicago text-xl mb-1">Proof/</h1>
      <p className="text-black/60 text-xs mb-4">Receipts. No hand-waving.</p>
      <div className="pixel-rule mb-4" />
      <div className="grid gap-2">
        {PROOF.map((p, i) => (
          <div key={i} className="border border-black/50 bg-[#f5f2e8] rounded px-3 py-2 flex items-center justify-between">
            <div>
              <div className="font-chicago text-[13px]">{p.label}</div>
              <div className="text-xs text-black/60">{p.detail}</div>
            </div>
            <div className="text-black/40 text-xs font-mono">✓ verified</div>
          </div>
        ))}
      </div>
    </div>
  );
}
