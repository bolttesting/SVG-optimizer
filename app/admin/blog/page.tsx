'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { sanitizeSlugForBlog } from '@/lib/blog/slug'
import { cn } from '@/lib/utils'

function CharMeter({
  length,
  idealMin,
  idealMax,
  label,
  optional,
}: {
  length: number
  idealMin: number
  idealMax: number
  label: string
  optional?: boolean
}) {
  if (optional && length === 0) {
    return (
      <p className="text-xs text-muted-foreground">
        Optional — when set, aim for ~{idealMin}–{idealMax} chars ({label})
      </p>
    )
  }
  const inRange = length >= idealMin && length <= idealMax
  return (
    <p
      className={cn(
        'text-xs',
        inRange ? 'text-muted-foreground' : 'text-amber-600 dark:text-amber-400'
      )}
    >
      {length} characters — {label}
      {!inRange && (
        <span className="ml-1">(aim for ~{idealMin}–{idealMax})</span>
      )}
    </p>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="border-b border-border pb-2 text-sm font-semibold tracking-tight">{children}</h3>
  )
}

export default function AdminBlogPage() {
  const router = useRouter()
  const siteBase = (process.env.NEXT_PUBLIC_SITE_URL || 'http://127.0.0.1:3000').replace(/\/$/, '')

  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [metaTitle, setMetaTitle] = useState('')
  const [keywords, setKeywords] = useState('')
  const [robots, setRobots] = useState('')
  const [ogTitle, setOgTitle] = useState('')
  const [ogDescription, setOgDescription] = useState('')
  const [ogImage, setOgImage] = useState('')
  const [twitterImage, setTwitterImage] = useState('')
  const [canonical, setCanonical] = useState('')
  const [author, setAuthor] = useState('Admin')
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [updated, setUpdated] = useState('')
  const [category, setCategory] = useState('general')
  const [tags, setTags] = useState('')
  const [content, setContent] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const resolvedSlug = useMemo(() => sanitizeSlugForBlog(slug || title), [slug, title])
  const previewUrl = resolvedSlug ? `${siteBase}/blog/${resolvedSlug}` : null

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'same-origin' })
    router.push('/admin/login')
    router.refresh()
  }

  function resetForm() {
    setTitle('')
    setSlug('')
    setDescription('')
    setMetaTitle('')
    setKeywords('')
    setRobots('')
    setOgTitle('')
    setOgDescription('')
    setOgImage('')
    setTwitterImage('')
    setCanonical('')
    setAuthor('Admin')
    setDate(new Date().toISOString().slice(0, 10))
    setUpdated('')
    setCategory('general')
    setTags('')
    setContent('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setMessage('')
    try {
      const keywordList = keywords
        .split(',')
        .map((k) => k.trim())
        .filter(Boolean)
      const res = await fetch('/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({
          title,
          slug: slug || undefined,
          description,
          metaTitle: metaTitle || undefined,
          keywords: keywordList.length ? keywordList : undefined,
          robots: robots || undefined,
          ogTitle: ogTitle || undefined,
          ogDescription: ogDescription || undefined,
          ogImage: ogImage || undefined,
          twitterImage: twitterImage || undefined,
          canonical: canonical || undefined,
          author,
          date,
          updated: updated || undefined,
          category,
          tags: tags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean),
          content,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setStatus('error')
        setMessage(data.error ?? data.hint ?? 'Request failed')
        if (res.status === 401) {
          router.push('/admin/login?from=/admin/blog')
        }
        return
      }
      setStatus('success')
      setMessage(`Published: ${data.slug} → ${data.path}`)
      resetForm()
    } catch {
      setStatus('error')
      setMessage('Network error')
    }
  }

  return (
    <Container className="max-w-3xl py-12 md:py-16">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/blog"
          className="inline-flex text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          ← Back to blog
        </Link>
        <Button type="button" variant="outline" size="sm" onClick={() => void logout()}>
          Sign out
        </Button>
      </div>
      <Card className="border-border/80 shadow-lg">
        <CardHeader>
          <CardTitle>Publish blog post</CardTitle>
          <CardDescription>
            Fill in SEO and social fields so search engines and link previews look right. Posts save to{' '}
            <code className="text-xs">content/blog/</code>. On serverless hosts, disk writes may not persist—commit
            files or use a database in production.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="space-y-5">
              <SectionTitle>Article &amp; URL</SectionTitle>
              <div className="space-y-2">
                <Label htmlFor="title">Title (H1 on the page)</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">URL slug (optional)</Label>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="auto from title if empty"
                />
                {previewUrl && (
                  <p className="text-xs text-muted-foreground">
                    Live URL:{' '}
                    <code className="rounded bg-muted px-1 py-0.5 text-[11px]">{previewUrl}</code>
                  </p>
                )}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="author">Author</Label>
                  <Input id="author" value={author} onChange={(e) => setAuthor(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g. tutorials"
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="date">Published date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="updated">Last updated (optional)</Label>
                  <Input
                    id="updated"
                    type="date"
                    value={updated}
                    onChange={(e) => setUpdated(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma-separated, shown on the post)</Label>
                <Input
                  id="tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="svg, performance, frontend"
                />
              </div>
            </div>

            <div className="space-y-5">
              <SectionTitle>SEO &amp; search</SectionTitle>
              <div className="space-y-2">
                <Label htmlFor="description">Meta description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={3}
                  placeholder="1–2 sentences: what the post is about. Used in Google snippets and OG if you leave social description empty."
                />
                <CharMeter
                  length={description.length}
                  idealMin={120}
                  idealMax={165}
                  label="good range for Google snippets"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="metaTitle">Browser tab / Google title (optional)</Label>
                <Input
                  id="metaTitle"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder="defaults to H1 title if empty"
                />
                <CharMeter
                  optional
                  length={metaTitle.length}
                  idealMin={45}
                  idealMax={60}
                  label="visible length in results"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="keywords">Focus keywords (comma-separated)</Label>
                <Input
                  id="keywords"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="svg optimization, core web vitals"
                />
                <p className="text-xs text-muted-foreground">
                  Stored for metadata &amp; structured data; use natural phrases you want to be found for.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="canonical">Canonical URL (optional)</Label>
                <Input
                  id="canonical"
                  value={canonical}
                  onChange={(e) => setCanonical(e.target.value)}
                  placeholder="https://… only if this post lives at another canonical URL"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="robots">Search engine robots</Label>
                <select
                  id="robots"
                  value={robots}
                  onChange={(e) => setRobots(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Default (index, follow)</option>
                  <option value="index, follow">Explicit index, follow</option>
                  <option value="noindex, nofollow">noindex, nofollow (hide from search)</option>
                </select>
              </div>
            </div>

            <div className="space-y-5">
              <SectionTitle>Social &amp; Open Graph</SectionTitle>
              <p className="text-xs text-muted-foreground">
                Used when the post is shared on X, LinkedIn, Slack, etc. Leave overrides empty to reuse SEO title
                / description.
              </p>
              <div className="space-y-2">
                <Label htmlFor="ogImage">Featured / OG image URL</Label>
                <Input
                  id="ogImage"
                  value={ogImage}
                  onChange={(e) => setOgImage(e.target.value)}
                  placeholder="https://… or /images/my-post.png (from public/)"
                />
                <p className="text-xs text-muted-foreground">
                  ~1200×630px works well. Shown on the post and blog cards when set.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ogTitle">OG title override (optional)</Label>
                <Input
                  id="ogTitle"
                  value={ogTitle}
                  onChange={(e) => setOgTitle(e.target.value)}
                  placeholder="defaults from meta title → H1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ogDescription">OG description override (optional)</Label>
                <Textarea
                  id="ogDescription"
                  value={ogDescription}
                  onChange={(e) => setOgDescription(e.target.value)}
                  rows={2}
                  placeholder="defaults to meta description"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="twitterImage">Twitter image (optional)</Label>
                <Input
                  id="twitterImage"
                  value={twitterImage}
                  onChange={(e) => setTwitterImage(e.target.value)}
                  placeholder="only if different from OG image"
                />
              </div>
            </div>

            <div className="space-y-5">
              <SectionTitle>Content (Markdown)</SectionTitle>
              <details className="rounded-md border border-border/80 bg-muted/30 px-3 py-2 text-sm">
                <summary className="cursor-pointer font-medium text-foreground">Markdown quick reference</summary>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
                  <li>
                    Headings: <code className="text-xs">## H2</code>, <code className="text-xs">### H3</code>
                  </li>
                  <li>
                    Bold / italic: <code className="text-xs">**bold**</code>, <code className="text-xs">*italic*</code>
                  </li>
                  <li>
                    Link: <code className="text-xs">[text](https://…)</code>
                  </li>
                  <li>
                    List: lines starting with <code className="text-xs">- </code> or <code className="text-xs">1. </code>
                  </li>
                  <li>
                    Code: <code className="text-xs">`inline`</code> or fenced blocks with{' '}
                    <code className="text-xs">```</code>
                  </li>
                </ul>
              </details>
              <div className="space-y-2">
                <Label htmlFor="content">Post body</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  rows={18}
                  className="min-h-[320px] font-mono text-[13px] leading-relaxed"
                  placeholder={'## Intro\n\nWrite your article in Markdown…'}
                />
                <p className="text-xs text-muted-foreground">
                  Reading time is calculated automatically from word count (~200 wpm).
                </p>
              </div>
            </div>

            <Button type="submit" disabled={status === 'loading'}>
              {status === 'loading' ? 'Publishing…' : 'Publish post'}
            </Button>
            {message && (
              <p
                className={
                  status === 'success'
                    ? 'text-sm text-green-600 dark:text-green-400'
                    : 'text-sm text-destructive'
                }
              >
                {message}
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </Container>
  )
}
