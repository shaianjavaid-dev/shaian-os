"use client";

import { ReactNode } from "react";

type Props = {
  label: string;
  icon: ReactNode;
  onOpen: () => void;
  selected?: boolean;
  onSelect?: () => void;
};

export default function DesktopIcon({ label, icon, onOpen, selected, onSelect }: Props) {
  return (
    <button
      onClick={onSelect}
      onDoubleClick={onOpen}
      data-selected={selected || undefined}
      className="icon-ring group flex flex-col items-center gap-1 w-20 px-1 py-1.5 rounded-md transition-colors"
    >
      <div className="w-12 h-12 flex items-center justify-center drop-shadow-sm">
        {icon}
      </div>
      <div className="text-[11px] font-chicago text-center leading-tight text-ink bg-transparent px-1 rounded-sm max-w-full truncate">
        {label}
      </div>
    </button>
  );
}
