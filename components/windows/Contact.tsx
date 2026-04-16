import { PROFILE } from "@/lib/data";

export default function Contact() {
  return (
    <div className="p-8">
      <h1 className="font-chicago text-2xl mb-2">Say hi.</h1>
      <p className="text-sm text-black/70 mb-6">I read everything. I ship responses. 48 hours → seconds.</p>
      <div className="pixel-rule mb-6" />
      <div className="grid gap-3 max-w-md">
        <a href={PROFILE.links.email} className="btn-chrome rounded px-4 py-3 font-chicago text-sm flex justify-between items-center">
          <span>✉  Email</span>
          <span className="text-xs font-mono text-black/60">{PROFILE.email}</span>
        </a>
        <a href={PROFILE.links.x} target="_blank" className="btn-chrome rounded px-4 py-3 font-chicago text-sm flex justify-between items-center">
          <span>𝕏  Twitter</span>
          <span className="text-xs font-mono text-black/60">@Shaian_javaid</span>
        </a>
        <a href={PROFILE.links.linkedin} target="_blank" className="btn-chrome rounded px-4 py-3 font-chicago text-sm flex justify-between items-center">
          <span>in  LinkedIn</span>
          <span className="text-xs font-mono text-black/60">shaian-javaid</span>
        </a>
      </div>
    </div>
  );
}
