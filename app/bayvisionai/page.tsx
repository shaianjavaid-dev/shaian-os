"use client";

import { useEffect, useRef, useState } from "react";

// The relay (separate always-on Render service the Jetson pushes to). Override
// in the build env: NEXT_PUBLIC_BAYVISION_URL=https://<your-relay>.onrender.com
// Falls back to the known relay so a missing build-time env var can't black out
// the stream (an empty BASE points <img>/fetch at the static host, which 404s).
const BASE =
  process.env.NEXT_PUBLIC_BAYVISION_URL || "https://bayvision-render.onrender.com";

type Stats = {
  total?: number;
  toll?: number;
  classes?: { car: number; truck: number; bus: number; motorcycle: number };
  per_minute?: number;
  per_hour_estimate?: number;
  speed_mph?: number;
  on_span?: number;
  fps?: number;
  cpu_temp?: number;
  gpu_temp?: number;
  power_w?: number;
  uptime_seconds?: number;
  server_time?: string;
  online?: boolean;
  online2?: boolean; // legacy HD cam (visual-only second feed)
};

const n = (v?: number) => (v == null ? "—" : v.toLocaleString());

export default function BayVisionPage() {
  const [d, setD] = useState<Stats | null>(null);
  const [reachable, setReachable] = useState(true);
  const imgRef = useRef<HTMLImageElement>(null);
  const imgRef2 = useRef<HTMLImageElement>(null); // legacy HD cam (visual-only)

  // Stream via single-frame polling instead of an MJPEG <img>. Safari does not
  // render multipart/x-mixed-replace in <img> (stats still work since they're
  // plain JSON), so the video silently failed there. Chained onload prevents
  // request pile-up; the cache-buster defeats caching. Works in all browsers.
  useEffect(() => {
    const img = imgRef.current;
    if (!img || !BASE) return;
    let alive = true;
    let timer: ReturnType<typeof setTimeout>;
    const next = () => {
      if (alive) img.src = `${BASE}/frame?t=${Date.now()}`;
    };
    const onload = () => {
      if (alive) timer = setTimeout(next, 110); // ~9 fps
    };
    const onerror = () => {
      if (alive) timer = setTimeout(next, 800);
    };
    img.addEventListener("load", onload);
    img.addEventListener("error", onerror);
    next();
    return () => {
      alive = false;
      clearTimeout(timer);
      img.removeEventListener("load", onload);
      img.removeEventListener("error", onerror);
    };
  }, []);

  // Secondary feed (legacy HD cam) — same frame-polling trick against /frame2.
  useEffect(() => {
    const img = imgRef2.current;
    if (!img || !BASE) return;
    let alive = true;
    let timer: ReturnType<typeof setTimeout>;
    const next = () => {
      if (alive) img.src = `${BASE}/frame2?t=${Date.now()}`;
    };
    const onload = () => {
      if (alive) timer = setTimeout(next, 130); // ~7.5 fps, matches the push rate
    };
    const onerror = () => {
      if (alive) timer = setTimeout(next, 900);
    };
    img.addEventListener("load", onload);
    img.addEventListener("error", onerror);
    next();
    return () => {
      alive = false;
      clearTimeout(timer);
      img.removeEventListener("load", onload);
      img.removeEventListener("error", onerror);
    };
  }, []);

  useEffect(() => {
    if (!BASE) return;
    let alive = true;
    const tick = async () => {
      try {
        const r = await fetch(`${BASE}/stats`, { cache: "no-store" });
        const j = (await r.json()) as Stats;
        if (alive) {
          setD(j);
          setReachable(true);
        }
      } catch {
        if (alive) setReachable(false);
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  const online = !!d?.online && reachable;
  const online2 = !!d?.online2 && reachable;
  const uptime = (() => {
    const s = d?.uptime_seconds;
    if (s == null) return "—";
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  })();

  if (!BASE) {
    return (
      <div className="wrap">
        <div className="config">
          <h1>BayVision AI</h1>
          <p>
            Set <code>NEXT_PUBLIC_BAYVISION_URL</code> to the relay URL and
            rebuild to go live.
          </p>
        </div>
        <style jsx>{styles}</style>
      </div>
    );
  }

  return (
    <div className="wrap">
      <header>
        <div>
          <h1>
            <span className={`dot ${online ? "" : "off"}`} />
            BayVision AI
          </h1>
          <div className="subtitle">
            Live edge-AI vehicle detection · Bay Bridge, San Francisco
          </div>
        </div>
        <div className="meta">
          NVIDIA Jetson Orin Nano · YOLOv8s · ByteTrack
          <br />
          <span className="clock">{d?.server_time || ""}</span>
        </div>
      </header>

      <main>
        <div className="left">
          <div className="stream">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img ref={imgRef} alt="Live stream" />
            {!online && <div className="offline">Stream offline — the Jetson isn&apos;t pushing right now.</div>}
          </div>

          <div className="stream2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img ref={imgRef2} alt="Legacy HD camera" />
            <div className="cam-label">
              <span className={`dot sm ${online2 ? "" : "off"}`} />
              Legacy HD cam · visual only
            </div>
            {!online2 && <div className="offline sm">Legacy cam offline</div>}
          </div>
        </div>

        <div className="panel">
          <div className="card">
            <div className="card-title">Vehicles Counted</div>
            <div className="big">{n(d?.total)}</div>
            <div className="sub">Westbound → SF · since startup · {uptime}</div>
            <span className="pill">{d?.on_span ?? "—"} on span now</span>
          </div>

          <div className="card">
            <div className="card-title">Toll Revenue (est.)</div>
            <div className="big money">${n(d?.toll)}</div>
            <div className="sub">FasTrak peak rates · westbound equivalent</div>
          </div>

          <div className="card">
            <div className="card-title">By Vehicle Type</div>
            <div className="row"><span>🚗 Cars</span><span className="num">{n(d?.classes?.car)}</span></div>
            <div className="row"><span>🚚 Trucks</span><span className="num">{n(d?.classes?.truck)}</span></div>
            <div className="row"><span>🚌 Buses</span><span className="num">{n(d?.classes?.bus)}</span></div>
          </div>

          <div className="card">
            <div className="card-title">Traffic Rate</div>
            <div className="rrow"><span className="lbl">Per minute</span><span className="num">{n(d?.per_minute)}</span></div>
            <div className="rrow"><span className="lbl">Per hour (est.)</span><span className="num">{n(d?.per_hour_estimate)}</span></div>
            <div className="rrow"><span className="lbl">Flow speed (rough)</span><span className="num">{d?.speed_mph ? `~${d.speed_mph} mph` : "—"}</span></div>
          </div>

          <div className="card">
            <div className="card-title">System</div>
            <div className="srow"><span className="lbl">FPS</span><span className="num">{d?.fps != null ? d.fps.toFixed(1) : "—"}</span></div>
            <div className="srow"><span className="lbl">CPU temp</span><span className="num">{d?.cpu_temp ? `${d.cpu_temp.toFixed(1)}°C` : "—"}</span></div>
            <div className="srow"><span className="lbl">GPU temp</span><span className="num">{d?.gpu_temp ? `${d.gpu_temp.toFixed(1)}°C` : "—"}</span></div>
            <div className="srow"><span className="lbl">Power</span><span className="num">{d?.power_w ? `${d.power_w.toFixed(1)} W` : "—"}</span></div>
          </div>
        </div>
      </main>

      <footer>Built on a NVIDIA Jetson Orin Nano · Edge AI streamed live</footer>
      <style jsx>{styles}</style>
    </div>
  );
}

const styles = `
  .wrap { --bg:#0b0e14; --panel:#161b22; --border:#30363d; --fg:#e6edf3; --muted:#7d8590; --accent:#ffd60a; --green:#3fb950; --red:#f85149; --cyan:#39d0d8;
    position:fixed; inset:0; overflow:auto; background:var(--bg); color:var(--fg); z-index:50;
    font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display",system-ui,sans-serif; }
  .config { display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; text-align:center; gap:8px; }
  .config code { color:var(--cyan); }
  header { padding:18px 28px; border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:center; }
  h1 { margin:0; font-size:17px; font-weight:600; display:flex; align-items:center; }
  .subtitle { color:var(--muted); font-size:12px; margin-top:2px; }
  .dot { display:inline-block; width:8px; height:8px; border-radius:50%; background:var(--green); margin-right:6px; animation:pulse 2s infinite; }
  .dot.off { background:var(--red); animation:none; }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
  .meta { font-size:11px; color:var(--muted); text-align:right; }
  .clock { color:var(--green); font-variant-numeric:tabular-nums; }
  main { display:grid; grid-template-columns:1fr 320px; gap:16px; padding:16px 28px 28px; }
  .left { display:flex; flex-direction:column; gap:16px; min-width:0; }
  .stream { background:var(--panel); border:1px solid var(--border); border-radius:10px; padding:10px; position:relative; }
  .stream img { width:100%; height:auto; display:block; border-radius:6px; }
  .stream2 { background:var(--panel); border:1px solid var(--border); border-radius:10px; padding:10px; position:relative; align-self:flex-start; max-width:360px; width:100%; }
  .stream2 img { width:100%; height:auto; display:block; border-radius:6px; background:#0b0e14; min-height:120px; }
  .cam-label { display:flex; align-items:center; font-size:11px; color:var(--muted); margin-top:8px; }
  .dot.sm { width:6px; height:6px; margin-right:5px; }
  .offline { position:absolute; inset:10px; display:flex; align-items:center; justify-content:center; background:rgba(11,14,20,.85); border-radius:6px; color:var(--muted); font-size:14px; }
  .offline.sm { font-size:12px; bottom:34px; }
  .panel { display:flex; flex-direction:column; gap:12px; }
  .card { background:var(--panel); border:1px solid var(--border); border-radius:10px; padding:14px 16px; }
  .card-title { font-size:11px; color:var(--muted); text-transform:uppercase; letter-spacing:.06em; margin-bottom:10px; }
  .big { font-size:34px; font-weight:700; color:var(--accent); line-height:1; font-variant-numeric:tabular-nums; }
  .big.money { color:var(--green); }
  .sub { font-size:11px; color:var(--muted); margin-top:6px; }
  .pill { display:inline-block; font-size:11px; color:var(--cyan); border:1px solid var(--cyan); border-radius:20px; padding:2px 9px; margin-top:8px; }
  .row { display:flex; justify-content:space-between; align-items:center; padding:6px 0; font-size:14px; }
  .row + .row { border-top:1px solid var(--border); }
  .num { font-variant-numeric:tabular-nums; font-weight:600; }
  .rrow, .srow { display:flex; justify-content:space-between; font-size:13px; padding:3px 0; }
  .lbl { color:var(--muted); }
  footer { padding:14px 28px; color:var(--muted); font-size:11px; border-top:1px solid var(--border); text-align:center; }
  @media (max-width:900px) { main { grid-template-columns:1fr; } }
`;
