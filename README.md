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
