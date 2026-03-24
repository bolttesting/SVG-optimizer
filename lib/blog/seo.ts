import type { Metadata } from 'next'

/** Turn stored image path or URL into an absolute URL for OG / Twitter. */
export function absolutePostImage(image: string | undefined, siteUrl: string): string | undefined {
  if (!image?.trim()) return undefined
  const u = image.trim()
  if (u.startsWith('http://') || u.startsWith('https://')) return u
  const base = siteUrl.replace(/\/$/, '')
  return `${base}${u.startsWith('/') ? u : `/${u}`}`
}

export function postCanonicalUrl(siteUrl: string, slug: string, canonicalOverride?: string): string {
  if (canonicalOverride?.trim()) {
    const c = canonicalOverride.trim()
    if (c.startsWith('http://') || c.startsWith('https://')) return c
  }
  const base = siteUrl.replace(/\/$/, '')
  return `${base}/blog/${slug}`
}

/** Map frontmatter robots string to Next Metadata. */
export function robotsFromString(robots: string | undefined): Metadata['robots'] | undefined {
  if (!robots?.trim()) return undefined
  const lower = robots.toLowerCase()
  const noindex = lower.includes('noindex')
  const nofollow = lower.includes('nofollow')
  return {
    index: !noindex,
    follow: !nofollow,
  }
}
