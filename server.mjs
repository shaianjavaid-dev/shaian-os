// Password-gated static server for the Next.js static export in ./out.
//
// Everything is private by default. Only the pages listed in PUBLIC_PAGES (and
// the exact asset chunks those pages reference) are served without a session.
// Auth is server-side: no gated byte leaves the box without a valid cookie.
//
// Env:
//   SITE_PASSWORD_HASH  required. scrypt hash from `npm run hash-password`.
//   SITE_SHARE_TOKENS   optional. comma-separated share tokens; `?key=<token>`
//                       on any URL logs the visitor in and strips the param.
//   SESSION_SECRET      optional. HMAC key for cookies; random per boot if unset
//                       (sessions then reset on every deploy/restart).
//   PUBLIC_PAGES        optional. comma-separated paths, default "/bayvisionai".
//   PORT                default 10000 (Render's default).

import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "out");
const PORT = Number(process.env.PORT || 10000);
const PASSWORD_HASH = (process.env.SITE_PASSWORD_HASH || "").trim();
const SHARE_TOKENS = (process.env.SITE_SHARE_TOKENS || "")
  .split(",")
  .map((s) => s.trim())
  .filter((s) => s.length >= 12); // refuse weak tokens outright
const SESSION_SECRET = process.env.SESSION_SECRET || crypto.randomBytes(32).toString("hex");
const SESSION_TTL_S = 7 * 24 * 3600;
const COOKIE = "sos_session";
const PUBLIC_PAGES = (process.env.PUBLIC_PAGES ?? "/bayvisionai")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

// Brute-force limits
const MAX_FAILS_PER_IP = 5; // then locked for LOCKOUT_MS
const LOCKOUT_MS = 15 * 60 * 1000;
const GLOBAL_FAILS_PER_MIN = 30; // distributed attempts: pause all logins briefly
const GLOBAL_PAUSE_MS = 60 * 1000;

// ---------- boot guards (fail closed) ----------
if (!fs.existsSync(path.join(ROOT, "index.html"))) {
  console.error("out/index.html missing — run `npm run build` first");
  process.exit(1);
}
const HASH = parseHash(PASSWORD_HASH);
if (!HASH) {
  console.error("SITE_PASSWORD_HASH missing or malformed — run `npm run hash-password`");
  process.exit(1);
}

function parseHash(s) {
  const m = /^scrypt\$(\d+)\$([0-9a-f]{32})\$([0-9a-f]{128})$/.exec(s);
  if (!m) return null;
  return { N: Number(m[1]), salt: Buffer.from(m[2], "hex"), key: Buffer.from(m[3], "hex") };
}

function verifyPassword(pw) {
  return new Promise((resolve) => {
    crypto.scrypt(pw, HASH.salt, 64, { N: HASH.N, r: 8, p: 1, maxmem: 256 * 1024 * 1024 }, (err, derived) => {
      if (err) return resolve(false);
      resolve(crypto.timingSafeEqual(derived, HASH.key));
    });
  });
}

function safeEq(a, b) {
  const ab = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  if (ab.length !== bb.length) {
    crypto.timingSafeEqual(ab, ab); // burn comparable time
    return false;
  }
  return crypto.timingSafeEqual(ab, bb);
}

function matchesShareToken(t) {
  let ok = false;
  for (const tok of SHARE_TOKENS) if (safeEq(t, tok)) ok = true;
  return ok;
}

// ---------- sessions (HMAC-signed, HttpOnly) ----------
function sign(payload) {
  return crypto.createHmac("sha256", SESSION_SECRET).update(payload).digest("base64url");
}
function newSession() {
  const exp = Math.floor(Date.now() / 1000) + SESSION_TTL_S;
  const payload = `${exp}.${crypto.randomBytes(16).toString("base64url")}`;
  return `${payload}.${sign(payload)}`;
}
function validSession(cookieHeader) {
  if (!cookieHeader) return false;
  const m = new RegExp(`(?:^|;\\s*)${COOKIE}=([^;]+)`).exec(cookieHeader);
  if (!m) return false;
  const parts = m[1].split(".");
  if (parts.length !== 3) return false;
  const [exp, nonce, sig] = parts;
  if (!/^\d+$/.test(exp) || Number(exp) < Date.now() / 1000) return false;
  return safeEq(sig, sign(`${exp}.${nonce}`));
}
function sessionCookie(req, value, maxAge) {
  const secure = isHttps(req) ? "; Secure" : "";
  return `${COOKIE}=${value}; Path=/; Max-Age=${maxAge}; HttpOnly; SameSite=Lax${secure}`;
}
function isHttps(req) {
  return req.headers["x-forwarded-proto"] === "https";
}

// ---------- rate limiting ----------
const fails = new Map(); // ip -> { n, first, lockedUntil }
let globalWindowStart = Date.now();
let globalFails = 0;
let globalPausedUntil = 0;

function clientIp(req) {
  const xff = req.headers["x-forwarded-for"];
  if (typeof xff === "string" && xff.length) return xff.split(",")[0].trim();
  return req.socket.remoteAddress || "?";
}
function lockedFor(ip) {
  const now = Date.now();
  if (now < globalPausedUntil) return globalPausedUntil - now;
  const rec = fails.get(ip);
  if (rec && rec.lockedUntil > now) return rec.lockedUntil - now;
  return 0;
}
function recordFail(ip) {
  const now = Date.now();
  if (now - globalWindowStart > 60_000) {
    globalWindowStart = now;
    globalFails = 0;
  }
  if (++globalFails >= GLOBAL_FAILS_PER_MIN) globalPausedUntil = now + GLOBAL_PAUSE_MS;

  const rec = fails.get(ip) || { n: 0, first: now, lockedUntil: 0 };
  if (now - rec.first > LOCKOUT_MS) Object.assign(rec, { n: 0, first: now });
  rec.n += 1;
  if (rec.n >= MAX_FAILS_PER_IP) rec.lockedUntil = now + LOCKOUT_MS;
  fails.set(ip, rec);
}
function clearFails(ip) {
  fails.delete(ip);
}
setInterval(() => {
  const now = Date.now();
  for (const [ip, rec] of fails) if (now - rec.first > LOCKOUT_MS && rec.lockedUntil < now) fails.delete(ip);
}, 5 * 60 * 1000).unref();

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---------- public allowlist ----------
// Exactly the files a public page needs, discovered from its HTML and (transitively)
// from the chunks it loads. Nothing else is reachable without a session.
function computePublic() {
  const set = new Set(["/healthz", "/robots.txt", "/favicon.ico"]);
  const jsQueue = [];
  for (const page of PUBLIC_PAGES) {
    const p = page.replace(/\/+$/, "") || "/";
    const htmlFile = p === "/" ? "index.html" : `${p.slice(1)}.html`;
    const html = readSafe(htmlFile);
    if (html == null) {
      console.error(`PUBLIC_PAGES: ${p} → out/${htmlFile} not found`);
      process.exit(1);
    }
    set.add(p);
    set.add(`${p}.html`);
    set.add(`${p}.txt`);
    for (const ref of html.matchAll(/(?:src|href)="(\/[^"?#]+)/g)) {
      const u = ref[1];
      if (!fs.existsSync(path.join(ROOT, u))) continue;
      set.add(u);
      if (u.endsWith(".js")) jsQueue.push(u);
    }
  }
  while (jsQueue.length) {
    const js = readSafe(jsQueue.pop().slice(1)) || "";
    for (const m of js.matchAll(/static\/chunks\/[\w.-]+\.(?:js|css)/g)) {
      const u = `/_next/${m[0]}`;
      if (set.has(u) || !fs.existsSync(path.join(ROOT, u))) continue;
      set.add(u);
      if (u.endsWith(".js")) jsQueue.push(u);
    }
  }
  return set;
}
function readSafe(rel) {
  try {
    return fs.readFileSync(path.join(ROOT, rel), "utf8");
  } catch {
    return null;
  }
}
const PUBLIC = computePublic();

// ---------- static files ----------
const MIME = {
  ".html": "text/html; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".pdf": "application/pdf",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
};

// Resolve a URL path to a file under ROOT, or null. Handles /foo -> foo.html.
function resolveFile(urlPath) {
  let p = decodeURIComponent(urlPath);
  if (p.includes("\0")) return null;
  if (p.endsWith("/") && p !== "/") p = p.slice(0, -1);
  const candidates = p === "/" ? ["index.html"] : [p.slice(1), `${p.slice(1)}.html`, `${p.slice(1)}/index.html`];
  for (const c of candidates) {
    const abs = path.resolve(ROOT, c);
    if (!abs.startsWith(ROOT + path.sep)) return null;
    try {
      const st = fs.statSync(abs);
      if (st.isFile()) return { abs, size: st.size };
    } catch {
      /* try next */
    }
  }
  return null;
}

function baseHeaders(req, extra = {}) {
  const h = {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "same-origin",
    "X-Robots-Tag": "noindex, nofollow, noarchive",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    ...extra,
  };
  if (isHttps(req)) h["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains";
  return h;
}

function send(req, res, status, body, extra = {}) {
  const buf = Buffer.isBuffer(body) ? body : Buffer.from(body ?? "");
  res.writeHead(status, baseHeaders(req, { "Content-Length": buf.length, ...extra }));
  res.end(req.method === "HEAD" ? undefined : buf);
}

function sendFile(req, res, file, urlPath, isPublic) {
  const ext = path.extname(file.abs).toLowerCase();
  const immutable = urlPath.startsWith("/_next/static/");
  const cache = isPublic
    ? immutable
      ? "public, max-age=31536000, immutable"
      : "public, max-age=60"
    : "private, no-store";
  res.writeHead(200, baseHeaders(req, {
    "Content-Type": MIME[ext] || "application/octet-stream",
    "Content-Length": file.size,
    "Cache-Control": cache,
    ...(isPublic ? {} : { Vary: "Cookie" }),
  }));
  if (req.method === "HEAD") return res.end();
  fs.createReadStream(file.abs).pipe(res);
}

function redirect(req, res, to, extra = {}) {
  send(req, res, 302, "", { Location: to, "Cache-Control": "no-store", ...extra });
}

// Only same-origin absolute paths are valid post-login destinations.
function safeNext(s) {
  if (typeof s !== "string" || !s.startsWith("/") || s.startsWith("//") || s.startsWith("/\\")) return "/";
  if (s.startsWith("/login") || s.startsWith("/logout")) return "/";
  return s;
}

// ---------- login page ----------
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

function loginPage({ next = "/", error = "", lockMs = 0 } = {}) {
  const msg = lockMs > 0 ? `too many attempts — try again in ${Math.ceil(lockMs / 60000)} min` : error;
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow"><title>Shaian Javaid</title>
<style>
html,body{height:100%;margin:0;background:#000;color:#e6e6e6;font:13px/1.7 "JetBrains Mono",ui-monospace,SFMono-Regular,Menlo,monospace;-webkit-font-smoothing:antialiased}
.w{position:fixed;inset:0;display:flex;align-items:center;justify-content:center}
form{width:100%;max-width:280px;padding:0 24px}
input{width:100%;box-sizing:border-box;background:transparent;border:0;border-bottom:1px solid rgba(255,255,255,.25);color:#e6e6e6;font:inherit;text-align:center;padding:0 0 4px;outline:none;border-radius:0}
input::placeholder{color:rgba(255,255,255,.3)}
input:focus{border-bottom-color:rgba(255,255,255,.6)}
p{margin:12px 0 0;text-align:center;font-size:12px;color:rgba(248,113,113,.8)}
.h{margin-top:28px;text-align:center;font-size:11px;color:rgba(255,255,255,.28)}
</style></head><body><div class="w">
<form method="post" action="/login" autocomplete="off">
<input type="hidden" name="next" value="${esc(next)}">
<input type="password" name="password" placeholder="password" autofocus autocapitalize="off" autocorrect="off" spellcheck="false" ${lockMs > 0 ? "disabled" : ""}>
${msg ? `<p>${esc(msg)}</p>` : ""}
<div class="h">private page · shaian javaid</div>
</form></div></body></html>`;
}

function readBody(req, limit = 4096) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on("data", (c) => {
      size += c.length;
      if (size > limit) {
        reject(new Error("too large"));
        req.destroy();
      } else chunks.push(c);
    });
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

// ---------- request handler ----------
async function handle(req, res) {
  const url = new URL(req.url, "http://x");
  const p = url.pathname;
  const ip = clientIp(req);

  if (req.method !== "GET" && req.method !== "HEAD" && !(req.method === "POST" && p === "/login")) {
    return send(req, res, 405, "method not allowed", { Allow: "GET, HEAD" });
  }

  if (p === "/healthz") return send(req, res, 200, "ok", { "Cache-Control": "no-store" });

  if (p === "/logout") {
    return redirect(req, res, "/login", { "Set-Cookie": sessionCookie(req, "", 0) });
  }

  // Share link: ?key=<token> on any URL. Log in, then redirect to the clean URL so
  // the token never lingers in history, referrers, or analytics.
  const key = url.searchParams.get("key");
  if (key != null) {
    url.searchParams.delete("key");
    const clean = url.pathname + (url.search || "");
    if (lockedFor(ip) === 0 && matchesShareToken(key)) {
      clearFails(ip);
      return redirect(req, res, clean, { "Set-Cookie": sessionCookie(req, newSession(), SESSION_TTL_S) });
    }
    recordFail(ip);
    await sleep(300 + Math.random() * 400);
    return redirect(req, res, clean);
  }

  const authed = validSession(req.headers.cookie);

  if (p === "/login") {
    if (req.method === "POST") {
      const lock = lockedFor(ip);
      if (lock > 0) {
        return send(req, res, 429, loginPage({ lockMs: lock }), { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store", "Retry-After": String(Math.ceil(lock / 1000)) });
      }
      let params;
      try {
        params = new URLSearchParams(await readBody(req));
      } catch {
        return send(req, res, 413, "too large");
      }
      const next = safeNext(params.get("next"));
      const pw = (params.get("password") || "").trim();
      if (pw && pw.length <= 256 && (await verifyPassword(pw))) {
        clearFails(ip);
        return redirect(req, res, next, { "Set-Cookie": sessionCookie(req, newSession(), SESSION_TTL_S) });
      }
      recordFail(ip);
      await sleep(300 + Math.random() * 400);
      const lockAfter = lockedFor(ip);
      return send(req, res, 401, loginPage({ next, error: "incorrect", lockMs: lockAfter }), { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" });
    }
    if (authed) return redirect(req, res, safeNext(url.searchParams.get("next")));
    return send(req, res, 200, loginPage({ next: safeNext(url.searchParams.get("next")), lockMs: lockedFor(ip) }), { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" });
  }

  const normalized = p.length > 1 && p.endsWith("/") ? p.slice(0, -1) : p;
  const isPublic = PUBLIC.has(normalized);

  if (!authed && !isPublic) {
    const wantsHtml = (req.headers.accept || "").includes("text/html");
    if (wantsHtml) return redirect(req, res, `/login?next=${encodeURIComponent(p + (url.search || ""))}`);
    return send(req, res, 401, "", { "Cache-Control": "no-store" });
  }

  const file = resolveFile(p);
  if (!file) {
    const nf = resolveFile("/404.html") || resolveFile("/_not-found");
    if (nf) {
      res.writeHead(404, baseHeaders(req, { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" }));
      return req.method === "HEAD" ? res.end() : fs.createReadStream(nf.abs).pipe(res);
    }
    return send(req, res, 404, "not found");
  }
  return sendFile(req, res, file, normalized, isPublic);
}

const server = http.createServer((req, res) => {
  handle(req, res).catch((err) => {
    console.error(err);
    if (!res.headersSent) send(req, res, 500, "error");
    else res.end();
  });
});
server.listen(PORT, () => {
  console.log(`shaian-os gate on :${PORT} — public: ${PUBLIC_PAGES.join(", ") || "(none)"} (${PUBLIC.size} files), share tokens: ${SHARE_TOKENS.length}`);
});
