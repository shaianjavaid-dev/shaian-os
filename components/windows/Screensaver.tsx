"use client";

import { useEffect, useRef, useState } from "react";

type Mode = "stars" | "mystify" | "pipes";

export default function Screensaver() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState<Mode>("stars");
  const modeRef = useRef<Mode>("stars");

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const dpr = window.devicePixelRatio || 1;
    const resize = () => {
      const { clientWidth: w, clientHeight: h } = canvas;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // STARFIELD
    const STAR_COUNT = 220;
    const stars = Array.from({ length: STAR_COUNT }, () => ({
      x: (Math.random() - 0.5) * 2,
      y: (Math.random() - 0.5) * 2,
      z: Math.random(),
    }));

    // MYSTIFY — two bouncing polygons with trails
    const mkPoly = (hue: number) => ({
      hue,
      pts: Array.from({ length: 4 }, () => ({
        x: Math.random(),
        y: Math.random(),
        vx: (Math.random() - 0.5) * 0.004,
        vy: (Math.random() - 0.5) * 0.004,
      })),
      history: [] as { x: number; y: number }[][],
    });
    const mystify = [mkPoly(200), mkPoly(320)];

    // PIPES — simple 2D pipes grid
    type PipeSeg = { x: number; y: number; dir: 0 | 1 | 2 | 3; hue: number };
    let pipes: PipeSeg[] = [];
    let pipeTick = 0;

    let raf = 0;
    const loop = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const m = modeRef.current;

      if (m === "stars") {
        ctx.fillStyle = "rgba(0,0,0,0.35)";
        ctx.fillRect(0, 0, w, h);
        const cx = w / 2;
        const cy = h / 2;
        for (const s of stars) {
          s.z -= 0.006;
          if (s.z <= 0.01) {
            s.x = (Math.random() - 0.5) * 2;
            s.y = (Math.random() - 0.5) * 2;
            s.z = 1;
          }
          const k = 0.5 / s.z;
          const sx = cx + s.x * k * w;
          const sy = cy + s.y * k * h;
          if (sx < 0 || sx > w || sy < 0 || sy > h) continue;
          const size = Math.max(0.4, (1 - s.z) * 2.4);
          const bright = Math.min(1, (1 - s.z) * 1.4);
          ctx.fillStyle = `rgba(255,255,255,${bright})`;
          ctx.fillRect(sx, sy, size, size);
        }
      } else if (m === "mystify") {
        ctx.fillStyle = "rgba(0,0,0,0.12)";
        ctx.fillRect(0, 0, w, h);
        for (const poly of mystify) {
          for (const p of poly.pts) {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x <= 0 || p.x >= 1) p.vx *= -1;
            if (p.y <= 0 || p.y >= 1) p.vy *= -1;
          }
          poly.history.push(poly.pts.map((p) => ({ x: p.x, y: p.y })));
          if (poly.history.length > 14) poly.history.shift();
          poly.history.forEach((frame, i) => {
            const alpha = (i + 1) / poly.history.length;
            ctx.strokeStyle = `hsla(${poly.hue},95%,65%,${alpha * 0.8})`;
            ctx.lineWidth = 1.25;
            ctx.beginPath();
            frame.forEach((p, j) => {
              const x = p.x * w;
              const y = p.y * h;
              if (j === 0) ctx.moveTo(x, y);
              else ctx.lineTo(x, y);
            });
            ctx.closePath();
            ctx.stroke();
          });
        }
      } else {
        // pipes
        pipeTick++;
        if (pipeTick % 2 === 0) {
          if (pipes.length === 0 || Math.random() < 0.02) {
            pipes.push({
              x: Math.floor(Math.random() * (w / 8)),
              y: Math.floor(Math.random() * (h / 8)),
              dir: Math.floor(Math.random() * 4) as 0 | 1 | 2 | 3,
              hue: Math.floor(Math.random() * 360),
            });
          }
          pipes = pipes.map((p) => {
            const turn = Math.random() < 0.06 ? (Math.random() < 0.5 ? -1 : 1) : 0;
            const nd = (((p.dir + turn) % 4) + 4) % 4;
            const nx = p.x + (nd === 1 ? 1 : nd === 3 ? -1 : 0);
            const ny = p.y + (nd === 0 ? -1 : nd === 2 ? 1 : 0);
            ctx.fillStyle = `hsl(${p.hue},70%,55%)`;
            ctx.fillRect(nx * 8, ny * 8, 7, 7);
            return { ...p, x: nx, y: ny, dir: nd as 0 | 1 | 2 | 3 };
          });
          pipes = pipes.filter(
            (p) => p.x >= 0 && p.y >= 0 && p.x * 8 < w && p.y * 8 < h
          );
        }
      }
      raf = requestAnimationFrame(loop);
    };

    // Fill pipes bg black on switch
    const onModeSwitch = () => {
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    };
    onModeSwitch();

    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <div className="h-full flex flex-col bg-black">
      <canvas ref={canvasRef} className="flex-1 w-full" />
      <div className="flex items-center gap-1 px-2 py-1.5 bg-[#f5f2e8] border-t border-black/40">
        <span className="text-[10px] font-mono text-black/60 mr-2">SSSTARS.SCR</span>
        {(["stars", "mystify", "pipes"] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`text-[11px] font-chicago px-2 py-0.5 rounded border ${
              mode === m
                ? "bg-black text-white border-black"
                : "btn-chrome"
            }`}
          >
            {m === "stars" ? "Starfield" : m === "mystify" ? "Mystify" : "Pipes"}
          </button>
        ))}
      </div>
    </div>
  );
}
