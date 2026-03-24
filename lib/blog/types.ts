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
  metaTitle?: string
  keywords?: string[]
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  twitterImage?: string
  canonical?: string
  robots?: string
}

export interface BlogPost extends BlogPostMeta {
  content: string
}

/** Admin list: where the post is stored (both can be true if slug exists in DB and on disk). */
export interface BlogPostAdminMeta extends BlogPostMeta {
  sources: { supabase: boolean; filesystem: boolean }
}
