// End-to-end test of server.mjs against the built ./out.
// Asserts: nothing gated is reachable without a session, no public file contains
// gated content, login/share-link/lockout/cookie-tamper all behave.
import { spawn, execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const PORT = 3900 + Math.floor(Math.random() * 100);
const BASE = `http://127.0.0.1:${PORT}`;
const PASSWORD = "correct horse battery staple";
const TOKEN = "share_token_test_0123456789";
const SENTINEL = /calacanis/i; // appears only in the gated bio

const hash = execFileSync("node", ["scripts/hash-password.mjs"], { env: { ...process.env, PASSWORD } }).toString().trim();
const srv = spawn("node", ["server.mjs"], {
  env: { ...process.env, PORT: String(PORT), SITE_PASSWORD_HASH: hash, SITE_SHARE_TOKENS: TOKEN },
  stdio: ["ignore", "pipe", "inherit"],
});
await new Promise((r) => srv.stdout.once("data", r));

let failed = 0;
function check(name, ok, detail = "") {
  console.log(`${ok ? "ok  " : "FAIL"} ${name}${detail ? ` — ${detail}` : ""}`);
  if (!ok) failed++;
}
const get = (p, opts = {}) => fetch(BASE + p, { redirect: "manual", ...opts });
const cookieOf = (res) => (res.headers.get("set-cookie") || "").split(";")[0];

try {
  // 1. unauth root redirects to login; assets 401
  let r = await get("/", { headers: { accept: "text/html" } });
  check("unauth / → login", r.status === 302 && r.headers.get("location") === "/login?next=%2F");
  r = await get("/resume.pdf");
  check("unauth /resume.pdf → 401", r.status === 401);
  r = await get("/proof/dalton-like.jpg");
  check("unauth proof image → 401", r.status === 401);
  r = await get("/index.html");
  check("unauth /index.html → 401", r.status === 401);
  r = await get("/index.txt");
  check("unauth /index.txt → 401", r.status === 401);
  r = await get("/..%2fpackage.json");
  check("traversal blocked", r.status !== 200);
  r = await get("/nope-does-not-exist");
  check("unknown path unauth → 401 (no enumeration)", r.status === 401);

  // 2. public page works and every file reachable unauth is free of gated content
  r = await get("/bayvisionai", { headers: { accept: "text/html" } });
  check("public /bayvisionai → 200", r.status === 200);
  const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]));
  const files = walk("out").map((f) => "/" + path.relative("out", f).split(path.sep).join("/"));
  const open = [];
  for (const f of files) {
    const res = await get(f);
    if (res.status === 200) {
      const body = await res.text();
      open.push(f);
      check(`public file clean: ${f}`, !SENTINEL.test(body));
    }
  }
  console.log(`   ${open.length}/${files.length} files public: ${open.join(", ")}`);
  check("bayvision html public", open.includes("/bayvisionai.html"));
  check("root page chunk NOT public", !open.some((f) => fs.readFileSync("out" + f, "utf8").match(SENTINEL)));

  // 3. wrong password → 401, right password → cookie → content
  r = await fetch(BASE + "/login", { method: "POST", redirect: "manual", headers: { "content-type": "application/x-www-form-urlencoded" }, body: "password=wrong&next=%2F" });
  check("wrong password → 401", r.status === 401 && (await r.text()).includes("incorrect"));
  r = await fetch(BASE + "/login", { method: "POST", redirect: "manual", headers: { "content-type": "application/x-www-form-urlencoded" }, body: `password=${encodeURIComponent(PASSWORD)}&next=%2Fresume.pdf` });
  const cookie = cookieOf(r);
  check("right password → 302 + cookie", r.status === 302 && r.headers.get("location") === "/resume.pdf" && cookie.startsWith("sos_session="));
  check("cookie HttpOnly + SameSite", /HttpOnly/.test(r.headers.get("set-cookie")) && /SameSite=Lax/.test(r.headers.get("set-cookie")));
  r = await get("/", { headers: { cookie, accept: "text/html" } });
  check("authed / → 200 with bio", r.status === 200 && SENTINEL.test(await r.text()));
  check("authed content no-store", r.headers.get("cache-control") === "private, no-store");
  r = await get("/resume.pdf", { headers: { cookie } });
  check("authed /resume.pdf → 200", r.status === 200 && r.headers.get("content-type") === "application/pdf");

  // 4. tampered cookie rejected; open redirect blocked
  const [name, val] = cookie.split("=");
  const tampered = `${name}=${val.slice(0, -2)}AA`;
  r = await get("/", { headers: { cookie: tampered, accept: "text/html" } });
  check("tampered cookie → login", r.status === 302);
  r = await fetch(BASE + "/login", { method: "POST", redirect: "manual", headers: { "content-type": "application/x-www-form-urlencoded" }, body: `password=${encodeURIComponent(PASSWORD)}&next=//evil.com` });
  check("open redirect blocked", r.headers.get("location") === "/");

  // 5. share link: logs in, strips key; bad key does not
  r = await get("/?key=" + TOKEN);
  check("share link → cookie + clean redirect", r.status === 302 && r.headers.get("location") === "/" && cookieOf(r).startsWith("sos_session="));
  r = await get("/?key=bad_token_bad_token");
  check("bad share key → no cookie", r.status === 302 && !r.headers.get("set-cookie"));

  // 6. lockout after repeated failures (from a distinct IP via XFF)
  const ip = { "x-forwarded-for": "203.0.113.9", "content-type": "application/x-www-form-urlencoded" };
  let last;
  for (let i = 0; i < 5; i++) last = await fetch(BASE + "/login", { method: "POST", redirect: "manual", headers: ip, body: "password=wrong" });
  check("5 fails → lockout message", last.status === 401 && (await last.text()).includes("too many attempts"));
  r = await fetch(BASE + "/login", { method: "POST", redirect: "manual", headers: ip, body: `password=${encodeURIComponent(PASSWORD)}` });
  check("locked IP rejected even with right password", r.status === 429);
  r = await fetch(BASE + "/login", { method: "POST", redirect: "manual", headers: { "content-type": "application/x-www-form-urlencoded" }, body: `password=${encodeURIComponent(PASSWORD)}` });
  check("other IP unaffected", r.status === 302);

  // 7. logout clears
  r = await get("/logout", { headers: { cookie } });
  check("logout clears cookie", /Max-Age=0/.test(r.headers.get("set-cookie")));
} finally {
  srv.kill();
}
console.log(failed ? `\n${failed} FAILED` : "\nall gate tests passed");
process.exit(failed ? 1 : 0);
