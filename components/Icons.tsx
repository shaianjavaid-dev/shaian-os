// Tiny pixel-ish SVG icons for the desktop.
// Each is designed to read at 48x48.

export const FolderIcon = ({ tint = "#f3c677" }: { tint?: string }) => (
  <svg viewBox="0 0 48 48" className="w-12 h-12">
    <path d="M4 14 h14 l4 4 h22 v26 H4 z" fill={tint} stroke="#1a1a1a" strokeWidth="1.5" />
    <path d="M4 14 h14 l4 4 h22" fill="none" stroke="#1a1a1a" strokeWidth="1.5" />
    <rect x="4" y="20" width="40" height="2" fill="rgba(0,0,0,0.08)" />
  </svg>
);

export const DocIcon = ({ label = "" }: { label?: string }) => (
  <svg viewBox="0 0 48 48" className="w-12 h-12">
    <path d="M10 4 h22 l8 8 v32 H10 z" fill="#ffffff" stroke="#1a1a1a" strokeWidth="1.5" />
    <path d="M32 4 v8 h8" fill="#e7e2d0" stroke="#1a1a1a" strokeWidth="1.5" />
    <line x1="14" y1="20" x2="36" y2="20" stroke="#1a1a1a" strokeWidth="1" />
    <line x1="14" y1="24" x2="36" y2="24" stroke="#1a1a1a" strokeWidth="1" />
    <line x1="14" y1="28" x2="32" y2="28" stroke="#1a1a1a" strokeWidth="1" />
    <line x1="14" y1="32" x2="36" y2="32" stroke="#1a1a1a" strokeWidth="1" />
    <line x1="14" y1="36" x2="28" y2="36" stroke="#1a1a1a" strokeWidth="1" />
    {label && (
      <text x="24" y="44" textAnchor="middle" fontSize="5" fontFamily="monospace" fill="#1a1a1a">
        {label}
      </text>
    )}
  </svg>
);

export const AppIcon = ({ color = "#ff7a1a", glyph }: { color?: string; glyph: string }) => (
  <svg viewBox="0 0 48 48" className="w-12 h-12">
    <rect x="5" y="5" width="38" height="38" rx="7" fill={color} stroke="#1a1a1a" strokeWidth="1.5" />
    <rect x="5" y="5" width="38" height="12" rx="7" fill="rgba(255,255,255,0.2)" />
    <text x="24" y="32" textAnchor="middle" fontSize="18" fontWeight="700" fill="#fff" fontFamily="ui-sans-serif, system-ui">
      {glyph}
    </text>
  </svg>
);

export const TrashIcon = ({ full = false }: { full?: boolean }) => (
  <svg viewBox="0 0 48 48" className="w-12 h-12">
    <path d="M10 14 h28 l-3 28 h-22 z" fill="#e7e2d0" stroke="#1a1a1a" strokeWidth="1.5" />
    <rect x="8" y="10" width="32" height="5" rx="1" fill="#fff" stroke="#1a1a1a" strokeWidth="1.5" />
    <line x1="18" y1="22" x2="18" y2="38" stroke="#1a1a1a" strokeWidth="1" />
    <line x1="24" y1="22" x2="24" y2="38" stroke="#1a1a1a" strokeWidth="1" />
    <line x1="30" y1="22" x2="30" y2="38" stroke="#1a1a1a" strokeWidth="1" />
    {full && <circle cx="34" cy="14" r="3" fill="#ff5f56" stroke="#1a1a1a" />}
  </svg>
);

export const ComputerIcon = () => (
  <svg viewBox="0 0 48 48" className="w-12 h-12">
    <rect x="6" y="6" width="36" height="26" rx="2" fill="#e7e2d0" stroke="#1a1a1a" strokeWidth="1.5" />
    <rect x="9" y="9" width="30" height="18" fill="#0c2a12" />
    <rect x="11" y="11" width="6" height="1.5" fill="#7bf48a" />
    <rect x="11" y="14" width="14" height="1.5" fill="#7bf48a" />
    <rect x="11" y="17" width="10" height="1.5" fill="#7bf48a" />
    <path d="M14 34 h20 l4 8 H10 z" fill="#e7e2d0" stroke="#1a1a1a" strokeWidth="1.5" />
  </svg>
);

export const XIcon = () => (
  <svg viewBox="0 0 48 48" className="w-12 h-12">
    <rect x="4" y="4" width="40" height="40" rx="8" fill="#000" stroke="#1a1a1a" strokeWidth="1.5" />
    <text x="24" y="34" textAnchor="middle" fontFamily="Times, serif" fontStyle="italic" fontWeight="700" fontSize="28" fill="#fff">𝕏</text>
  </svg>
);

export const TerminalIcon = () => (
  <svg viewBox="0 0 48 48" className="w-12 h-12">
    <rect x="4" y="6" width="40" height="36" rx="3" fill="#0b0b0b" stroke="#1a1a1a" strokeWidth="1.5" />
    <rect x="4" y="6" width="40" height="6" fill="#2b2b2b" />
    <circle cx="8" cy="9" r="1" fill="#ff5f56" />
    <circle cx="12" cy="9" r="1" fill="#ffbd2e" />
    <circle cx="16" cy="9" r="1" fill="#27c93f" />
    <text x="8" y="26" fill="#7bf48a" fontSize="10" fontFamily="monospace">{"> _"}</text>
  </svg>
);

export const MailIcon = () => (
  <svg viewBox="0 0 48 48" className="w-12 h-12">
    <rect x="4" y="10" width="40" height="28" rx="2" fill="#ffffff" stroke="#1a1a1a" strokeWidth="1.5" />
    <path d="M4 10 L24 28 L44 10" fill="none" stroke="#1a1a1a" strokeWidth="1.5" />
  </svg>
);

export const TrophyIcon = () => (
  <svg viewBox="0 0 48 48" className="w-12 h-12">
    <path d="M14 6 h20 v10 a10 10 0 0 1 -20 0 z" fill="#f3c677" stroke="#1a1a1a" strokeWidth="1.5" />
    <path d="M34 8 h6 v4 a6 6 0 0 1 -6 6" fill="none" stroke="#1a1a1a" strokeWidth="1.5" />
    <path d="M14 8 h-6 v4 a6 6 0 0 0 6 6" fill="none" stroke="#1a1a1a" strokeWidth="1.5" />
    <rect x="18" y="26" width="12" height="6" fill="#f3c677" stroke="#1a1a1a" strokeWidth="1.5" />
    <rect x="12" y="32" width="24" height="6" fill="#f3c677" stroke="#1a1a1a" strokeWidth="1.5" />
  </svg>
);

export const GlobeIcon = () => (
  <svg viewBox="0 0 48 48" className="w-12 h-12">
    <circle cx="24" cy="24" r="18" fill="#bfe1ff" stroke="#1a1a1a" strokeWidth="1.5" />
    <ellipse cx="24" cy="24" rx="8" ry="18" fill="none" stroke="#1a1a1a" strokeWidth="1" />
    <ellipse cx="24" cy="24" rx="18" ry="8" fill="none" stroke="#1a1a1a" strokeWidth="1" />
    <line x1="6" y1="24" x2="42" y2="24" stroke="#1a1a1a" strokeWidth="1" />
    <line x1="24" y1="6" x2="24" y2="42" stroke="#1a1a1a" strokeWidth="1" />
  </svg>
);
