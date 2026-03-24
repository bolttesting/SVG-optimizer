import { notFound } from 'next/navigation'
import { AdminBlogPostForm } from '@/components/admin/AdminBlogPostForm'
import type { AdminBlogPostFormInitial } from '@/components/admin/AdminBlogPostForm'
import { getPostBySlug } from '@/lib/blog/posts'

export default async function AdminEditBlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug)
  if (!post) notFound()

  const initial: AdminBlogPostFormInitial = {
    title: post.title,
    description: post.description,
    content: post.content,
    metaTitle: post.metaTitle ?? '',
    keywords: post.keywords?.length ? post.keywords.join(', ') : '',
    robots: post.robots ?? '',
    ogTitle: post.ogTitle ?? '',
    ogDescription: post.ogDescription ?? '',
    ogImage: post.ogImage ?? '',
    twitterImage: post.twitterImage ?? '',
    canonical: post.canonical ?? '',
    author: post.author ?? 'Admin',
    date: post.date,
    updated: post.updated ?? '',
    category: post.category,
    tags: post.tags?.length ? post.tags.join(', ') : '',
  }

  return <AdminBlogPostForm mode="edit" lockedSlug={post.slug} initial={initial} />
}
