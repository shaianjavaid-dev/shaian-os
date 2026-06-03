"use client";

import { useEffect, useState } from "react";

// The relay (separate always-on Render service the Jetson pushes to). Set this
// in the build env: NEXT_PUBLIC_BAYVISION_URL=https://<your-relay>.onrender.com
const BASE = process.env.NEXT_PUBLIC_BAYVISION_URL || "";

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
};

const n = (v?: number) => (v == null ? "—" : v.toLocaleString());

export default function BayVisionPage() {
  const [d, setD] = useState<Stats | null>(null);
  const [reachable, setReachable] = useState(true);

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
        <div className="stream">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${BASE}/video`} alt="Live stream" />
          {!online && <div className="offline">Stream offline — the Jetson isn&apos;t pushing right now.</div>}
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
            <div className="row"><span>🏍️ Motorcycles</span><span className="num">{n(d?.classes?.motorcycle)}</span></div>
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
  .stream { background:var(--panel); border:1px solid var(--border); border-radius:10px; padding:10px; position:relative; }
  .stream img { width:100%; height:auto; display:block; border-radius:6px; }
  .offline { position:absolute; inset:10px; display:flex; align-items:center; justify-content:center; background:rgba(11,14,20,.85); border-radius:6px; color:var(--muted); font-size:14px; }
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
