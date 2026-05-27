"use client";

import { motion, useDragControls } from "framer-motion";
import { ReactNode, useRef } from "react";

type Props = {
  id: string;
  title: string;
  children: ReactNode;
  x: number;
  y: number;
  width: number;
  height?: number;
  z: number;
  minimized?: boolean;
  onFocus: () => void;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize?: () => void;
  onMove: (x: number, y: number) => void;
};

export default function Window({
  title,
  children,
  x,
  y,
  width,
  height,
  z,
  minimized,
  onFocus,
  onClose,
  onMinimize,
  onMaximize,
  onMove,
}: Props) {
  const dragControls = useDragControls();
  const constraintsRef = useRef<HTMLDivElement>(null);

  if (minimized) return null;

  return (
    <>
      <div ref={constraintsRef} className="fixed inset-0 pointer-events-none" />
      <motion.div
        drag
        dragListener={false}
        dragControls={dragControls}
        dragMomentum={false}
        dragConstraints={{ left: -width + 120, right: typeof window !== "undefined" ? window.innerWidth - 120 : 1200, top: 24, bottom: typeof window !== "undefined" ? window.innerHeight - 80 : 800 }}
        onMouseDown={onFocus}
        onDragEnd={(_, info) => onMove(x + info.offset.x, y + info.offset.y)}
        initial={{ x, y, opacity: 0, scale: 0.96 }}
        animate={{ x, y, opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ type: "spring", stiffness: 420, damping: 32 }}
        style={{ width, height, zIndex: z }}
        className="fixed top-0 left-0 bg-chrome rounded-[10px] window-shadow overflow-hidden border border-black/60 flex flex-col"
      >
        {/* Title bar */}
        <div
          onPointerDown={(e) => dragControls.start(e)}
          onDoubleClick={onMaximize}
          className="relative flex items-center h-7 px-2 gap-2 cursor-grab active:cursor-grabbing border-b border-black/60 bg-[#f5f2e8]"
        >
          {/* pinstripes */}
          <div className="absolute inset-x-14 top-1 bottom-1 titlebar-stripes opacity-70" />
          <div className="flex gap-1.5 relative z-10">
            <button
              onClick={onClose}
              aria-label="Close"
              className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#c0392b] hover:brightness-110"
            />
            <button
              onClick={onMinimize}
              aria-label="Minimize"
              className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#b88515] hover:brightness-110"
            />
            <button
              onClick={onMaximize}
              aria-label="Zoom"
              className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#18923b] hover:brightness-110"
            />
          </div>
          <div className="flex-1 text-center text-[13px] font-chicago relative z-10 bg-[#f5f2e8] px-2">
            {title}
          </div>
          <div className="w-12 relative z-10" />
        </div>
        {/* Body */}
        <div className="flex-1 overflow-auto scrollbar-retro bg-white">
          {children}
        </div>
      </motion.div>
    </>
  );
}
