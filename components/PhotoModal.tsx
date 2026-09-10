"use client";

import { useEffect } from "react";

export default function PhotoModal({
  src,
  alt,
  caption,
  onClose,
}: {
  src: string;
  alt: string;
  caption?: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 font-mono text-[12px] text-[#e6e6e6] sm:p-8"
    >
      <figure className="max-h-full max-w-[1100px]" onClick={(e) => e.stopPropagation()}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="max-h-[80vh] w-auto max-w-full border border-white/15"
        />
        {caption && (
          <figcaption className="mt-3 flex items-baseline justify-between gap-6 text-white/60">
            <span>{caption}</span>
            <button onClick={onClose} className="shrink-0 text-white/40 hover:text-white">
              close [esc]
            </button>
          </figcaption>
        )}
      </figure>
    </div>
  );
}
