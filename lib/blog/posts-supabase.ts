import type { BlogPost, BlogPostMeta } from '@/lib/blog/types'
import { readingTimeFromText } from '@/lib/blog/read-time'
import { createSupabaseReader } from '@/lib/supabase/blog-client'

type BlogRow = {
  slug: string
  title: string
  description: string
  body: string
  category: string
  tags: string[] | null
  author: string | null
  published_on: string
  updated_on: string | null
  meta_title: string | null
  keywords: string[] | null
  og_title: string | null
  og_description: string | null
  og_image: string | null
  twitter_image: string | null
  canonical_url: string | null
  robots: string | null
}

function rowToPost(row: BlogRow): BlogPost {
  const content = row.body
  const date =
    typeof row.published_on === 'string'
      ? row.published_on.slice(0, 10)
      : String(row.published_on).slice(0, 10)
  const updated =
    row.updated_on == null
      ? undefined
      : typeof row.updated_on === 'string'
        ? row.updated_on.slice(0, 10)
        : String(row.updated_on).slice(0, 10)

  return {
    slug: row.slug,
    title: row.title,
    description: row.description,
    date,
    updated,
    category: row.category || 'general',
    tags: row.tags?.filter(Boolean).length ? row.tags : undefined,
    author: row.author ?? undefined,
    readingTime: readingTimeFromText(content),
    metaTitle: row.meta_title ?? undefined,
    keywords: row.keywords?.filter(Boolean).length ? row.keywords : undefined,
    ogTitle: row.og_title ?? undefined,
    ogDescription: row.og_description ?? undefined,
    ogImage: row.og_image ?? undefined,
    twitterImage: row.twitter_image ?? undefined,
    canonical: row.canonical_url ?? undefined,
    robots: row.robots ?? undefined,
    content,
  }
}

function rowToMeta(row: BlogRow): BlogPostMeta {
  const p = rowToPost(row)
  const { content: _, ...meta } = p
  return meta
}

export async function fetchAllPostsFromSupabase(): Promise<BlogPostMeta[]> {
  const client = createSupabaseReader()
  if (!client) return []

  const { data, error } = await client.from('blog_posts').select('*').order('published_on', {
    ascending: false,
  })

  if (error || !data?.length) return []

  return (data as BlogRow[]).map((row) => rowToMeta(row))
}

export async function fetchPostFromSupabase(slug: string): Promise<BlogPost | null> {
  const client = createSupabaseReader()
  if (!client) return null

  const { data, error } = await client.from('blog_posts').select('*').eq('slug', slug).maybeSingle()

  if (error || !data) return null
  return rowToPost(data as BlogRow)
}

export async function fetchAllSlugsFromSupabase(): Promise<string[]> {
  const client = createSupabaseReader()
  if (!client) return []

  const { data, error } = await client.from('blog_posts').select('slug')

  if (error || !data) return []
  return data.map((r: { slug: string }) => r.slug)
}
