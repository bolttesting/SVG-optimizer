# SVG Optimizer

A free, client-side SVG optimization tool. Reduce file size by up to 70% while preserving quality. All processing happens in your browser—no uploads, full privacy.

## Features

- **Single & batch upload** — Process up to 20 SVG files at once
- **Live preview** — Toggle between original and optimized views
- **Customizable settings** — Precision, remove comments/metadata, minify IDs, and more
- **Presets** — Max Compression, Balanced, Quality
- **Export options** — Download as SVG or ZIP (batch)
- **Code viewer** — View and copy optimized SVG markup

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- SVGO
- Zustand
- react-dropzone, JSZip, file-saver

## Getting Started

```bash
npm install
npm run dev
```

Then open **http://127.0.0.1:3000** (the dev script uses this host to avoid some Windows / DNS issues).

Use **Node.js 24.x** locally and on Hostinger (select **24** in the Node version dropdown). The repo includes **`.nvmrc`** (`24`) and **`package.json` `engines`** so panels that read them match. If a host’s build still fails on 24, try **20 LTS** as a fallback.

**Production:** [svgoptimizer.site](https://svgoptimizer.site) — canonical URLs, sitemap, and Open Graph default to `https://svgoptimizer.site` when `NEXT_PUBLIC_SITE_URL` is not set.

- **Contact email** defaults to **`info@svgoptimizer.site`** (footer + `/contact` mailto form). Override with `NEXT_PUBLIC_CONTACT_EMAIL` if needed.
- **Optional SMTP (Hostinger, etc.):** set `SMTP_HOST`, `SMTP_PORT` (usually `465`), `SMTP_USER`, `SMTP_PASS` on the server to enable **Send message** on `/contact` (Nodemailer). Hostinger: outgoing **smtp.hostinger.com**, port **465**, SSL. Use the mailbox password for `SMTP_PASS`. Never commit real passwords; set them only in the host’s env UI.
- **Vercel / Hostinger / other:** set `NEXT_PUBLIC_SITE_URL=https://svgoptimizer.site` when the public URL differs from the default.

### 503 Service Unavailable (Node hosting)

Usually **LiteSpeed/nginx cannot reach your Node process** (wrong port, wrong bind address, or the app exited).

1. **Port** — Use **`npm run start`** so the app reads **`PORT`** from the panel (default `3000`). The Node.js screen **Application port** (or similar) must match **`PORT`** (often both should be **3000** unless the host assigns another port).
2. **Do not set a misleading `HOST` env** — Some panels set **`HOST`** to your domain (e.g. `svgoptimizer.site`). That value is **not** a TCP bind address. This project only uses **`LISTEN_HOST`** / **`NEXT_LISTEN_HOST`** if you need to override listening (default **`0.0.0.0`**). If you still see 503, try **`LISTEN_HOST=127.0.0.1`** only when your host’s docs say to bind localhost for the reverse proxy.
3. **Build** — Run **`npm run build`** before start (runs **`next build`** plus **`copy-standalone-assets`**, so **`.next/standalone`** has `public` and static chunks). **`npm run start`** prefers that **standalone `server.js`**; without a successful build the process exits → 503.
4. **Logs** — Check **Node / deployment logs** after “Starting…” for crashes (OOM, errors). If you see **two** “Next.js 14” banners back-to-back, the start command may be running twice—leave **one** process only.
5. **SSH sanity check** (if available): `curl -sI http://127.0.0.1:3000` (use your real **PORT**). If that fails, the proxy is not the problem—Node isn’t listening. If it succeeds but the site still 503, fix the **web server → Node** mapping in the panel.
6. **Restart** the Node app after changing env vars.
7. **503 keeps coming back** — Add **`LISTEN_HOST=127.0.0.1`** in env if LiteSpeed only talks to localhost; match **`PORT`** to the panel. Redeploy/restart.

#### Hostinger startup file (common 503 cause)

- **Application root** must be the repo root (folder with **`package.json`** after `git pull` / deploy).
- **Start** using either **`npm run start`** or set **Application startup file** to **`hostinger-entry.js`** in that same root. Both run `scripts/next-start.cjs` and set **`HOSTNAME`** for the standalone server.
- **Avoid** pointing the panel only at **`.next/standalone/server.js`** unless you also set **`HOSTNAME=127.0.0.1`** (or **`0.0.0.0`**) and **`PORT`** in Environment variables. Otherwise the OS **`HOSTNAME`** (machine name) can be used for binding and LiteSpeed returns **503**.
- After deploy, logs should include **`[svg-optimizer] standalone server.js exists=true`**. If **`exists=false`**, the server did not run a full **`npm run build`** (with the copy step). See **`.next/standalone/HOSTINGER-README.txt`** on the server after build.

### Styles / scripts not loading? (unstyled page, console errors on `layout.css`, `page.js`, `main-app`)

1. **Ad blockers & privacy extensions** — uBlock, AdGuard, Brave Shields, etc. often block Next.js **dev** filenames like `page.js` or `webpack.js`. **Disable them for `127.0.0.1`** or use a private window with extensions off.
2. **Other extensions** — Errors mentioning `share-m…` or unrelated scripts are usually extensions; try **Incognito / InPrivate** with extensions disabled.
3. **Use production mode locally** — Hashed filenames are rarely blocked: `npm run build && npm start` then open http://127.0.0.1:3000
4. **Alternate dev host** — If `127.0.0.1` fails, try `npm run dev:localhost` and open http://localhost:3000
5. **Optional emergency CSS** — `public/styles/fallback.css` is **not** linked by default (keeps Lighthouse/PageSpeed from flagging an extra render-blocking request). If something blocks `/_next/static/...` CSS, you can temporarily add `<link rel="stylesheet" href="/styles/fallback.css" />` to `app/layout.tsx` or open that URL manually for bare-minimum layout.

## Blog

- Posts live in **`content/blog/*.md`** with YAML frontmatter (`title`, `description`, `date`, `category`, optional `tags`, `author`).
- **`/blog`** lists posts; **`/blog/[slug]`** renders Markdown (with `@tailwindcss/typography` prose styles).
- **Sign in:** set `ADMIN_SECRET` in `.env.local`, open **`/admin/login`**, enter that password. You get an **httpOnly cookie** (7 days). The **admin dashboard** is at **`/admin`** (sidebar: New post, Posted blogs, Usage stats).
- **Sign out:** **Sign out** in the sidebar, or `POST /api/auth/logout`.
- **API:** `POST /api/blog` requires a valid admin session cookie (use the UI after login). Programmatic posting would need a cookie from login or a future API key.

## Cookies & analytics

- A **cookie banner** stores consent in `localStorage` + a small cookie (`svg_optimizer_cookie_consent`).
- **Plausible** loads only if the user chooses **Accept all** and you set `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`.

## SEO

- **`/sitemap.xml`** — includes static routes and every blog post (dynamic).
- **`/robots.txt`** — allows crawling, disallows `/api/` and `/admin`.

## Project Structure

- `app/` — Routes and layouts
- `content/blog/` — Markdown blog posts
- `components/tool/` — Main optimizer components
- `components/blog/` — Blog UI
- `lib/blog/` — Load posts from disk
- `components/ui/` — Reusable UI components
- `lib/` — SVGO config, optimization logic
- `store/` — Zustand state

## License

MIT
