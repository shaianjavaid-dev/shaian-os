# shaian-os

Personal site at https://www.shaianjavaid.com — a Next.js static export served by a
small Node gate (`server.mjs`) that requires a password for everything except the
public BayVision page.

## Run locally

```bash
npm install
NEXT_PUBLIC_BAYVISION_URL=https://bayvision-render.onrender.com npm run build
SITE_PASSWORD_HASH="$(npm run -s hash-password)" PORT=3460 npm start
```

## Password protection

- `npm run hash-password` prints a scrypt hash → set as `SITE_PASSWORD_HASH` on Render.
- `SITE_SHARE_TOKENS` (optional): comma-separated random tokens. Any URL with
  `?key=<token>` logs the visitor in and redirects to the clean URL.
- Sessions are HMAC-signed HttpOnly cookies (7 days). Set `SESSION_SECRET` so
  sessions survive deploys.
- 5 wrong guesses per IP → 15-minute lockout; 30 failures/min site-wide → 1-minute pause.
- `PUBLIC_PAGES` (default `/bayvisionai`): pages served without login, plus exactly
  the asset chunks those pages reference. Everything else (bio, resume.pdf, proof
  images, RSC payloads) returns 401 / redirects to `/login`.
- `npm run test:gate` builds nothing; it boots the server against `out/` and proves
  no gated file is reachable and no public file contains the bio.
