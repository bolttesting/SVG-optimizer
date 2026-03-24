import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { BlogPost, BlogPostMeta } from '@/lib/blog/types'
import { readingTimeFromText } from '@/lib/blog/read-time'

const postsDirectory = path.join(process.cwd(), 'content', 'blog')

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

export function getAllPostsFromFiles(): BlogPostMeta[] {
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

export function getPostBySlugFromFiles(slug: string): BlogPost | null {
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

export function getAllSlugsFromFiles(): string[] {
  if (!fs.existsSync(postsDirectory)) return []
  return fs
    .readdirSync(postsDirectory)
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace(/\.md$/, ''))
}
