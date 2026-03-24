import { MetadataRoute } from 'next'
import { siteConfig } from '@/config/site'
import { getAllPosts } from '@/lib/blog/posts'

/** Regenerate when new markdown posts exist (local / writable deploys). */
export const dynamic = 'force-dynamic'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url.replace(/\/$/, '')

  const staticPages: MetadataRoute.Sitemap = [
    '',
    '/blog',
    '/privacy',
    '/terms',
    '/contact',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? ('weekly' as const) : ('weekly' as const),
    priority: route === '' ? 1 : 0.85,
  }))

  const posts = getAllPosts().map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updated ?? post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...staticPages, ...posts]
}
