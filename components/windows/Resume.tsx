export default function Resume() {
  return (
    <div className="h-full flex flex-col bg-[#2a2a2a]">
      <div className="flex items-center justify-between px-3 py-2 bg-[#f5f2e8] border-b border-black/30">
        <div className="text-xs font-chicago">Resume.pdf</div>
        <a
          href="/resume.pdf"
          download="Shaian_Javaid_Resume.pdf"
          className="btn-chrome px-3 py-1 text-xs font-chicago rounded"
        >
          ↓ Download
        </a>
      </div>
      <iframe src="/resume.pdf#toolbar=0&navpanes=0" className="flex-1 w-full bg-white" title="Resume PDF" />
    </div>
  );
}
