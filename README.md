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

**Production:** [svgoptimizer.site](https://svgoptimizer.site) — canonical URLs, sitemap, and Open Graph default to `https://svgoptimizer.site` when `NEXT_PUBLIC_SITE_URL` is not set.

- **Contact email** defaults to **`info@svgoptimizer.site`** (footer + `/contact` mailto form). Override with `NEXT_PUBLIC_CONTACT_EMAIL` if needed.
- **Optional SMTP (Hostinger, etc.):** set `SMTP_HOST`, `SMTP_PORT` (usually `465`), `SMTP_USER`, `SMTP_PASS` on the server to enable **Send message** on `/contact` (Nodemailer). Hostinger: outgoing **smtp.hostinger.com**, port **465**, SSL. Use the mailbox password for `SMTP_PASS`. Never commit real passwords; set them only in the host’s env UI.
- **Vercel / Hostinger / other:** set `NEXT_PUBLIC_SITE_URL=https://svgoptimizer.site` when the public URL differs from the default.

### 503 Service Unavailable (Node hosting)

Usually the **reverse proxy cannot reach your app** (nothing listening on the port it expects).

1. **Port** — `npm start` uses the **`PORT`** environment variable when your host sets it (default `3000`). If you overrode the start command with `next start -p 3000` only, switch back to **`npm start`** or **`npm run start`** so `PORT` is respected.
2. **Build** — Run **`npm run build`** before start; missing `.next` → process exits → 503.
3. **Logs** — In Hostinger (or your panel), open **application / Node logs** for crash messages (out-of-memory, missing env, etc.).
4. **Restart** — After changing env vars, **restart** the Node application.

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
