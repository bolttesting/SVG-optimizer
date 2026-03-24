import Link from 'next/link'
import type { BlogPostMeta } from '@/lib/blog/types'
import { siteConfig } from '@/config/site'
import { absolutePostImage } from '@/lib/blog/seo'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

interface BlogCardProps {
  post: BlogPostMeta
}

export function BlogCard({ post }: BlogCardProps) {
  const thumb = absolutePostImage(post.ogImage, siteConfig.url)

  return (
    <Link href={`/blog/${post.slug}`} className="group block h-full">
      <Card className="h-full overflow-hidden border-border/80 bg-card/80 shadow-sm transition-all duration-200 hover:border-primary/40 hover:shadow-md">
        {thumb && (
          <div className="relative aspect-[1.91/1] w-full overflow-hidden bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={thumb}
              alt=""
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              loading="lazy"
            />
          </div>
        )}
        <CardHeader className="pb-2">
          <span className="text-xs font-medium uppercase tracking-wide text-primary">
            {post.category.replace(/-/g, ' ')}
          </span>
          <h2 className="text-xl font-semibold tracking-tight transition-colors group-hover:text-primary">
            {post.title}
          </h2>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground line-clamp-2">{post.description}</p>
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <time dateTime={post.date}>{post.date}</time>
            {post.readingTime != null && <span>· {post.readingTime} min read</span>}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
