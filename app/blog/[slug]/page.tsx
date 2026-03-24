import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Container } from '@/components/layout/Container'
import { MarkdownBody } from '@/components/blog/MarkdownBody'
import { getAllPosts, getPostBySlug } from '@/lib/blog/posts'
import { siteConfig } from '@/config/site'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'
import Script from 'next/script'
import { absolutePostImage, postCanonicalUrl, robotsFromString } from '@/lib/blog/seo'

interface PageProps {
  params: { slug: string }
}

export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = params
  const post = await getPostBySlug(slug)
  if (!post) return { title: 'Post not found' }

  const metaTitle = post.metaTitle || post.title
  const ogTitle = post.ogTitle || metaTitle
  const ogDescription = post.ogDescription || post.description
  const canonical = postCanonicalUrl(siteConfig.url, slug, post.canonical)
  const ogImageUrl =
    absolutePostImage(post.twitterImage || post.ogImage, siteConfig.url) ??
    absolutePostImage(post.ogImage, siteConfig.url)

  return {
    title: metaTitle,
    description: post.description,
    keywords: post.keywords?.length ? post.keywords : undefined,
    alternates: { canonical },
    robots: robotsFromString(post.robots),
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
      url: canonical,
      images: ogImageUrl ? [{ url: ogImageUrl }] : undefined,
    },
    twitter: {
      card: ogImageUrl ? 'summary_large_image' : 'summary',
      title: ogTitle,
      description: ogDescription,
      images: ogImageUrl ? [ogImageUrl] : undefined,
      ...(siteConfig.twitterHandle ? { creator: siteConfig.twitterHandle } : {}),
    },
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = params
  const post = await getPostBySlug(slug)
  if (!post) notFound()

  const heroSrc = absolutePostImage(post.ogImage, siteConfig.url)

  return (
    <article className="relative border-b bg-gradient-to-b from-primary/[0.05] to-transparent">
      <Container className="max-w-3xl py-12 md:py-16">
        <Link
          href="/blog"
          className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'mb-8 -ml-2 inline-flex gap-1')}
        >
          <ArrowLeft className="h-4 w-4" />
          All posts
        </Link>
        <header className="mb-10">
          <p className="mb-2 text-sm font-medium uppercase tracking-wide text-primary">
            {post.category.replace(/-/g, ' ')}
          </p>
          <h1 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">{post.title}</h1>
          <p className="text-lg text-muted-foreground">{post.description}</p>
          {post.tags && post.tags.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-2" aria-label="Tags">
              {post.tags.map((t) => (
                <li
                  key={t}
                  className="rounded-md bg-muted/60 px-2 py-0.5 text-xs font-medium text-muted-foreground"
                >
                  {t}
                </li>
              ))}
            </ul>
          )}
          <div className="mt-4 flex flex-wrap gap-3 text-sm text-muted-foreground">
            <time dateTime={post.date}>Published {post.date}</time>
            {post.updated && post.updated !== post.date && (
              <time dateTime={post.updated}>Updated {post.updated}</time>
            )}
            {post.readingTime != null && <span>{post.readingTime} min read</span>}
            {post.author && <span>By {post.author}</span>}
          </div>
        </header>
        {heroSrc && (
          <figure className="mb-10 overflow-hidden rounded-xl border border-border/80 bg-muted/20 shadow-sm">
            {/* External OG URLs allowed — no fixed remotePatterns list */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={heroSrc}
              alt={post.title}
              className="aspect-video w-full object-cover"
              width={1200}
              height={630}
            />
          </figure>
        )}
        <MarkdownBody content={post.content} />
        <Script
          id="json-ld-article"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BlogPosting',
              headline: post.title,
              description: post.description,
              datePublished: post.date,
              dateModified: post.updated ?? post.date,
              author: { '@type': 'Organization', name: post.author ?? siteConfig.name },
              publisher: { '@type': 'Organization', name: siteConfig.name },
              mainEntityOfPage: postCanonicalUrl(siteConfig.url, slug, post.canonical),
              ...(absolutePostImage(post.ogImage, siteConfig.url)
                ? { image: [absolutePostImage(post.ogImage, siteConfig.url)] }
                : {}),
              ...(post.keywords?.length
                ? { keywords: post.keywords.join(', ') }
                : {}),
            }),
          }}
        />
      </Container>
    </article>
  )
}
