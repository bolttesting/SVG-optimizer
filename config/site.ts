/**
 * Canonical production URL when `NEXT_PUBLIC_SITE_URL` is not set (sitemap, robots, OG, JSON-LD).
 * Override on Vercel with env for previews or domain changes.
 */
const DEFAULT_SITE_URL = 'https://svgoptimizer.site'

function siteUrlFromEnv(): string {
  const v = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  return v && v.length > 0 ? v.replace(/\/$/, '') : DEFAULT_SITE_URL
}

export const siteConfig = {
  name: 'SVG Optimizer',
  title: 'SVG Optimizer — Free SVG Compression & Optimization Tool',
  description:
    'Optimize, minify, and compress SVG files online for free. Reduce file size by up to 70% while preserving quality. Batch processing, React component export, and live preview.',
  url: siteUrlFromEnv(),
  ogImage: '/images/og/home-og.png',
  /** Set NEXT_PUBLIC_TWITTER_HANDLE (e.g. @yourbrand) to enable X links and tweet metadata. */
  twitterHandle: (process.env.NEXT_PUBLIC_TWITTER_HANDLE ?? '').trim(),
  keywords: 'svg optimizer, svg minifier, svg compressor, optimize svg, svg tool, svg online',
  author: 'SVG Optimizer',
  /** Set in .env.local — enables mailto + contact form on /contact */
  contactEmail: (process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? '').trim(),
  contactGithubUrl: (process.env.NEXT_PUBLIC_CONTACT_GITHUB ?? '').trim(),
}

export function twitterProfileUrl(): string | null {
  const h = siteConfig.twitterHandle.replace(/^@/, '').trim()
  if (!h) return null
  return `https://twitter.com/${h}`
}
