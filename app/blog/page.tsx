import Link from 'next/link'
import { Container } from '@/components/layout/Container'
import { BlogCard } from '@/components/blog/BlogCard'
import { getAllPosts } from '@/lib/blog/posts'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'Blog',
  description: 'Articles on SVG optimization, web performance, and frontend tooling.',
}

export default async function BlogIndexPage() {
  const posts = await getAllPosts()

  return (
    <div className="relative overflow-hidden border-b bg-gradient-to-b from-primary/[0.07] to-transparent">
      <Container className="relative py-14 md:py-20">
        <Link
          href="/"
          className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'mb-8 -ml-2 inline-flex gap-1')}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to tool
        </Link>
        <p className="mb-2 text-sm font-medium uppercase tracking-widest text-primary">Blog</p>
        <h1 className="mb-4 max-w-2xl text-4xl font-bold tracking-tight md:text-5xl">
          Guides & updates
        </h1>
        <p className="mb-12 max-w-xl text-lg text-muted-foreground">
          Practical posts on shrinking SVGs, performance, and how to get the most out of the
          optimizer.
        </p>

        {posts.length === 0 ? (
          <p className="text-muted-foreground">
            No posts yet. Add markdown under <code className="text-xs">content/blog</code> or publish from
            the admin dashboard (with Supabase configured on your host).
          </p>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <li key={post.slug}>
                <BlogCard post={post} />
              </li>
            ))}
          </ul>
        )}
      </Container>
    </div>
  )
}
