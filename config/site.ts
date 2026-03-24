export const siteConfig = {
  name: 'SVG Optimizer',
  title: 'SVG Optimizer — Free SVG Compression & Optimization Tool',
  description:
    'Optimize, minify, and compress SVG files online for free. Reduce file size by up to 70% while preserving quality. Batch processing, React component export, and live preview.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://yoursite.com',
  ogImage: '/images/og/home-og.png',
  twitterHandle: '@yourhandle',
  keywords: 'svg optimizer, svg minifier, svg compressor, optimize svg, svg tool, svg online',
  author: 'Your Name',
  /** Set in .env.local — enables mailto + contact form on /contact */
  contactEmail: (process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? '').trim(),
  contactGithubUrl: (process.env.NEXT_PUBLIC_CONTACT_GITHUB ?? '').trim(),
}

export function twitterProfileUrl(): string | null {
  const h = siteConfig.twitterHandle.replace(/^@/, '').trim()
  if (!h || /^yourhandle$/i.test(h)) return null
  return `https://twitter.com/${h}`
}
