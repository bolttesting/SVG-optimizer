import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const postsDirectory = path.join(process.cwd(), 'content', 'blog')

export interface BlogPostMeta {
  slug: string
  title: string
  description: string
  date: string
  updated?: string
  category: string
  tags?: string[]
  author?: string
  readingTime?: number
  /** Shown in &lt;title&gt; / OG when set; falls back to `title`. */
  metaTitle?: string
  /** Extra search hints (also used in JSON-LD keywords when present). */
  keywords?: string[]
  /** Open Graph / social title override. */
  ogTitle?: string
  /** Open Graph / social description override. */
  ogDescription?: string
  /** Featured / OG image URL or site-relative path (e.g. /images/post.jpg). */
  ogImage?: string
  /** Twitter card image if different from ogImage. */
  twitterImage?: string
  /** Full URL override for canonical link. */
  canonical?: string
  /** e.g. "index, follow" or "noindex, nofollow" */
  robots?: string
}

export interface BlogPost extends BlogPostMeta {
  content: string
}

function asStringArray(v: unknown): string[] | undefined {
  if (Array.isArray(v)) {
    const out = v.map((x) => String(x).trim()).filter(Boolean)
    return out.length ? out : undefined
  }
  if (typeof v === 'string' && v.trim()) {
    return v.split(',').map((s) => s.trim()).filter(Boolean)
  }
  return undefined
}

function readingTimeFromText(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}

function metaFromData(data: Record<string, unknown>, slug: string, content: string): BlogPostMeta {
  return {
    slug,
    title: String(data.title ?? slug),
    description: String(data.description ?? ''),
    date: String(data.date ?? new Date().toISOString().slice(0, 10)),
    updated: data.updated ? String(data.updated) : undefined,
    category: String(data.category ?? 'general'),
    tags: asStringArray(data.tags),
    author: data.author ? String(data.author) : undefined,
    readingTime: readingTimeFromText(content),
    metaTitle: data.metaTitle ? String(data.metaTitle) : undefined,
    keywords: asStringArray(data.keywords),
    ogTitle: data.ogTitle ? String(data.ogTitle) : undefined,
    ogDescription: data.ogDescription ? String(data.ogDescription) : undefined,
    ogImage: data.ogImage ? String(data.ogImage) : undefined,
    twitterImage: data.twitterImage ? String(data.twitterImage) : undefined,
    canonical: data.canonical ? String(data.canonical) : undefined,
    robots: data.robots ? String(data.robots) : undefined,
  }
}

export function getAllPosts(): BlogPostMeta[] {
  if (!fs.existsSync(postsDirectory)) return []

  const files = fs.readdirSync(postsDirectory).filter((f) => f.endsWith('.md'))

  const posts = files.map((filename) => {
    const slug = filename.replace(/\.md$/, '')
    const fullPath = path.join(postsDirectory, filename)
    const raw = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(raw)
    return metaFromData(data as Record<string, unknown>, slug, content)
  })

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getPostBySlug(slug: string): BlogPost | null {
  if (!slug || slug.includes('..') || slug.includes('/') || slug.includes('\\')) return null

  const fullPath = path.join(postsDirectory, `${slug}.md`)
  if (!fs.existsSync(fullPath)) return null

  const raw = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(raw)

  return {
    ...metaFromData(data as Record<string, unknown>, slug, content),
    content,
  }
}

export function getAllSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) return []
  return fs
    .readdirSync(postsDirectory)
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace(/\.md$/, ''))
}
