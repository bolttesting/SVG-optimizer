import type { BlogPost, BlogPostAdminMeta, BlogPostMeta } from '@/lib/blog/types'
import { getAllPostsFromFiles, getAllSlugsFromFiles, getPostBySlugFromFiles } from '@/lib/blog/posts-files'
import {
  fetchAllPostsFromSupabase,
  fetchAllSlugsFromSupabase,
  fetchPostFromSupabase,
} from '@/lib/blog/posts-supabase'
import { isSupabaseBlogEnabled } from '@/lib/supabase/blog-client'

export type { BlogPost, BlogPostAdminMeta, BlogPostMeta } from '@/lib/blog/types'

function mergeBySlug(files: BlogPostMeta[], db: BlogPostMeta[]): BlogPostMeta[] {
  const map = new Map<string, BlogPostMeta>()
  for (const p of files) map.set(p.slug, p)
  for (const p of db) map.set(p.slug, p)
  return Array.from(map.values()).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
}

/** All posts: markdown in `content/blog` plus Supabase rows when configured (DB wins on same slug). */
export async function getAllPosts(): Promise<BlogPostMeta[]> {
  const fromFiles = getAllPostsFromFiles()
  if (!isSupabaseBlogEnabled()) return fromFiles
  const fromDb = await fetchAllPostsFromSupabase()
  return mergeBySlug(fromFiles, fromDb)
}

/** Single post: Supabase first, then markdown file. */
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  if (!slug || slug.includes('..') || slug.includes('/') || slug.includes('\\')) return null

  if (isSupabaseBlogEnabled()) {
    const fromDb = await fetchPostFromSupabase(slug)
    if (fromDb) return fromDb
  }
  return getPostBySlugFromFiles(slug)
}

export async function getAllSlugs(): Promise<string[]> {
  const slugs = new Set(getAllSlugsFromFiles())
  if (isSupabaseBlogEnabled()) {
    for (const s of await fetchAllSlugsFromSupabase()) slugs.add(s)
  }
  return Array.from(slugs)
}

/** Merged post list with storage flags for admin (edit/delete). */
export async function getAdminPosts(): Promise<BlogPostAdminMeta[]> {
  const fromFiles = getAllPostsFromFiles()
  const fileSlugs = new Set(fromFiles.map((p) => p.slug))
  const dbPosts = isSupabaseBlogEnabled() ? await fetchAllPostsFromSupabase() : []
  const dbSlugs = new Set(dbPosts.map((p) => p.slug))
  const merged = mergeBySlug(fromFiles, dbPosts)
  return merged.map((meta) => ({
    ...meta,
    sources: { supabase: dbSlugs.has(meta.slug), filesystem: fileSlugs.has(meta.slug) },
  }))
}
