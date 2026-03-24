# SVG Optimizer

A free, client-side SVG optimization tool. Reduce file size by up to 70% while preserving quality. All processing happens in your browser—no uploads, full privacy.

## Features

- **Single & batch upload** — Process up to 20 SVG files at once
- **Live preview** — Toggle between original and optimized views
- **Customizable settings** — Precision, remove comments/metadata, minify IDs, and more
- **Presets** — Max Compression, Balanced, Quality
- **Export options** — Download as SVG or ZIP (batch); **PNG / WebP** raster export in the browser (canvas)
- **Code viewer** — View and copy optimized SVG markup

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- SVGO
- Zustand
- react-dropzone, JSZip, file-saver

### Versions (important)

| Piece | Version | Notes |
|--------|---------|--------|
| **Next.js** | **14.2.x** (see `package.json`) | There is **no** “Next.js 24”. Major lines are 14, 15, … |
| **Node.js** | **24.x required** (`.nvmrc` = `24`) | **`engines.node`** is **`24.x`** so Vercel, Hostinger, and local installs stay on the same major line. |

## Getting Started

```bash
npm install
npm run dev
```

Then open **http://127.0.0.1:3000** (the dev script uses this host to avoid some Windows / DNS issues).

If the browser shows **Internal Server Error** or missing `*.js` chunks, stop the dev server, run **`npm run dev:clean`** (deletes `.next` then starts dev), and try again. Avoid running **`npm start`** without a successful **`npm run build`** first.

**Production:** [svgoptimizer.site](https://svgoptimizer.site) — canonical URLs, sitemap, and Open Graph default to `https://svgoptimizer.site` when `NEXT_PUBLIC_SITE_URL` is not set.

- **Contact email** defaults to **`info@svgoptimizer.site`** (footer + `/contact` mailto form). Override with `NEXT_PUBLIC_CONTACT_EMAIL` if needed.
- **Optional SMTP (Hostinger, etc.):** set `SMTP_HOST`, `SMTP_PORT` (usually `465`), `SMTP_USER`, `SMTP_PASS` on the server to enable **Send message** on `/contact` (Nodemailer). Hostinger: outgoing **smtp.hostinger.com**, port **465**, SSL. Use the mailbox password for `SMTP_PASS`. Never commit real passwords; set them only in the host’s env UI.
- **Vercel / Hostinger / other:** set `NEXT_PUBLIC_SITE_URL=https://svgoptimizer.site` when the public URL differs from the default.
- **Vercel:** the build disables **`output: 'standalone'`** automatically (`VERCEL=1`). Hostinger and other Node hosts still get the standalone bundle when you run **`npm run build`** locally or on the server without that env var.

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

#### Git / CI deploy: “Entry file” and “Output directory” (build looks fine but deploy fails)

Some panels default to a **static** site template. Next.js is **not** static-export here: there is no publish folder like `dist` or `out` for the host to serve as plain files.

- Set the project type to **Node.js** / **Next.js** (or whatever your host calls a **server** app), **not** “static HTML” or a generic framework with custom entry/output.
- **Remove** or **leave blank** **Entry file** and **Output directory** if the docs say they do not apply to Next.js—those fields are for other stacks. This repo’s runtime is **`npm run start`** (or **`hostinger-entry.js`** on Hostinger), and the build writes to **`.next`** and **`.next/standalone`** automatically.
- **Build command:** `npm ci && npm run build` (or `npm run build` if dependencies are installed separately).
- **Start command:** `npm run start`
- **Root directory:** the folder that contains **`package.json`** (repository root for this project).

If the build log shows a successful **`next build`** but the platform still errors, the failure is almost always **run/start** or **wrong app type**, not missing source.

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
