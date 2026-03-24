'use client'

import { useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { sanitizeSlugForBlog } from '@/lib/blog/slug'
import { cn } from '@/lib/utils'

export type AdminBlogPostFormInitial = {
  title: string
  description: string
  content: string
  metaTitle?: string
  keywords?: string
  robots?: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  twitterImage?: string
  canonical?: string
  author?: string
  date: string
  updated?: string
  category: string
  tags?: string
}

export type AdminBlogPostFormProps = {
  mode: 'create' | 'edit'
  lockedSlug?: string
  initial?: AdminBlogPostFormInitial
}

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

export function AdminBlogPostForm({ mode, lockedSlug, initial }: AdminBlogPostFormProps) {
  const router = useRouter()
  const siteBase = (process.env.NEXT_PUBLIC_SITE_URL || 'http://127.0.0.1:3000').replace(/\/$/, '')
  const loginFrom =
    mode === 'edit' && lockedSlug
      ? `/admin/blog/edit/${encodeURIComponent(lockedSlug)}`
      : '/admin/blog/new'

  const [title, setTitle] = useState(initial?.title ?? '')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [metaTitle, setMetaTitle] = useState(initial?.metaTitle ?? '')
  const [keywords, setKeywords] = useState(initial?.keywords ?? '')
  const [robots, setRobots] = useState(initial?.robots ?? '')
  const [ogTitle, setOgTitle] = useState(initial?.ogTitle ?? '')
  const [ogDescription, setOgDescription] = useState(initial?.ogDescription ?? '')
  const [ogImage, setOgImage] = useState(initial?.ogImage ?? '')
  const [twitterImage, setTwitterImage] = useState(initial?.twitterImage ?? '')
  const [canonical, setCanonical] = useState(initial?.canonical ?? '')
  const [author, setAuthor] = useState(initial?.author ?? 'Admin')
  const [date, setDate] = useState(initial?.date ?? new Date().toISOString().slice(0, 10))
  const [updated, setUpdated] = useState(initial?.updated ?? '')
  const [category, setCategory] = useState(initial?.category ?? 'general')
  const [tags, setTags] = useState(initial?.tags ?? '')
  const [content, setContent] = useState(initial?.content ?? '')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [imageUpload, setImageUpload] = useState<'idle' | 'loading' | 'error'>('idle')
  const [imageUploadMsg, setImageUploadMsg] = useState('')
  const featuredFileRef = useRef<HTMLInputElement>(null)

  const resolvedSlug = useMemo(() => {
    if (lockedSlug) return lockedSlug
    return sanitizeSlugForBlog(slug || title) ?? ''
  }, [lockedSlug, slug, title])

  const previewUrl = resolvedSlug ? `${siteBase}/blog/${resolvedSlug}` : null

  async function onFeaturedFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setImageUpload('loading')
    setImageUploadMsg('')
    try {
      const fd = new FormData()
      fd.set('file', file)
      const res = await fetch('/api/blog/upload', {
        method: 'POST',
        body: fd,
        credentials: 'same-origin',
      })
      const data = (await res.json()) as { error?: string; url?: string }
      if (!res.ok) throw new Error(data.error ?? 'Upload failed')
      if (data.url) setOgImage(data.url)
      setImageUpload('idle')
    } catch (err) {
      setImageUpload('error')
      setImageUploadMsg(err instanceof Error ? err.message : 'Upload failed')
    }
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
    setImageUpload('idle')
    setImageUploadMsg('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setMessage('')
    const slugPayload = lockedSlug ?? (slug.trim() ? slug : undefined)
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
          slug: slugPayload,
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
          router.push(`/admin/login?from=${encodeURIComponent(loginFrom)}`)
        }
        return
      }
      setStatus('success')
      setMessage(
        mode === 'edit'
          ? data.storage === 'supabase'
            ? `Saved to Supabase: ${data.slug}`
            : `Saved: ${data.slug} → ${data.path ?? 'content/blog'}`
          : data.storage === 'supabase'
            ? `Published to Supabase: ${data.slug}`
            : `Published: ${data.slug} → ${data.path ?? 'content/blog'}`
      )
      if (mode === 'create') {
        resetForm()
      }
      router.refresh()
    } catch {
      setStatus('error')
      setMessage('Network error')
    }
  }

  const heading = mode === 'edit' ? 'Edit blog post' : 'New blog post'
  const submitLabel =
    status === 'loading' ? (mode === 'edit' ? 'Saving…' : 'Publishing…') : mode === 'edit' ? 'Save changes' : 'Publish post'

  return (
    <div className="w-full max-w-3xl px-4 pb-10 pt-4 md:px-8 md:pb-12 md:pt-6">
      <h1 className="mb-6 text-2xl font-bold tracking-tight">{heading}</h1>
      <Card className="border-border/80 shadow-lg">
        <CardHeader>
          <CardTitle>{mode === 'edit' ? 'Update post' : 'Publish'}</CardTitle>
          <CardDescription>
            If Supabase env vars are set, posts and uploads go to your project; otherwise markdown is saved under{' '}
            <code className="text-xs">content/blog/</code>.
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
                <Label htmlFor="slug">URL slug {lockedSlug ? '(fixed for this post)' : '(optional)'}</Label>
                <Input
                  id="slug"
                  value={lockedSlug ?? slug}
                  onChange={(e) => !lockedSlug && setSlug(e.target.value)}
                  placeholder={lockedSlug ? undefined : 'auto from title if empty'}
                  readOnly={!!lockedSlug}
                  disabled={!!lockedSlug}
                  className={lockedSlug ? 'bg-muted/50' : undefined}
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
                <Label htmlFor="tags">Tags (comma-separated)</Label>
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
                  placeholder="1–2 sentences: what the post is about."
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
              </div>
              <div className="space-y-2">
                <Label htmlFor="canonical">Canonical URL (optional)</Label>
                <Input
                  id="canonical"
                  value={canonical}
                  onChange={(e) => setCanonical(e.target.value)}
                  placeholder="https://…"
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
                  <option value="noindex, nofollow">noindex, nofollow</option>
                </select>
              </div>
            </div>

            <div className="space-y-5">
              <SectionTitle>Social &amp; Open Graph</SectionTitle>
              <div className="space-y-2">
                <Label htmlFor="ogImage">Featured / OG image URL</Label>
                <Input
                  id="ogImage"
                  value={ogImage}
                  onChange={(e) => setOgImage(e.target.value)}
                  placeholder="https://… or /images/…"
                />
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    ref={featuredFileRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
                    className="sr-only"
                    onChange={(e) => void onFeaturedFileChange(e)}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    disabled={imageUpload === 'loading'}
                    onClick={() => featuredFileRef.current?.click()}
                  >
                    {imageUpload === 'loading' ? 'Uploading…' : 'Upload image (Supabase)'}
                  </Button>
                  <span className="text-xs text-muted-foreground">Max 5 MB</span>
                </div>
                {imageUploadMsg ? <p className="text-xs text-destructive">{imageUploadMsg}</p> : null}
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
                <summary className="cursor-pointer font-medium">Markdown quick reference</summary>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
                  <li>
                    Headings: <code className="text-xs">## H2</code>, <code className="text-xs">### H3</code>
                  </li>
                  <li>
                    Bold: <code className="text-xs">**bold**</code> · Link:{' '}
                    <code className="text-xs">[text](url)</code>
                  </li>
                  <li>
                    Code: <code className="text-xs">`inline`</code> or <code className="text-xs">```</code>{' '}
                    blocks
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
              </div>
            </div>

            <Button type="submit" disabled={status === 'loading'}>
              {submitLabel}
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
    </div>
  )
}
