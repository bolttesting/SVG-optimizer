import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import { revalidatePath } from 'next/cache'
import matter from 'gray-matter'
import { ADMIN_SESSION_COOKIE } from '@/lib/auth/constants'
import { getAdminSecret } from '@/lib/auth/get-admin-secret'
import { verifyAdminJwt } from '@/lib/auth/verify-admin-jwt'
import { sanitizeSlugForBlog } from '@/lib/blog/slug'
import { createSupabaseService } from '@/lib/supabase/blog-client'

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

function pickStr(v: unknown): string {
  return typeof v === 'string' ? v.trim() : ''
}

function parseKeywords(body: Record<string, unknown>): string[] {
  if (Array.isArray(body.keywords)) {
    return body.keywords.map((k) => String(k).trim()).filter(Boolean)
  }
  return pickStr(body.keywords)
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

function supabaseWriteEnabled(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
}

export async function POST(request: NextRequest) {
  const adminSecret = getAdminSecret()
  if (!adminSecret) {
    return NextResponse.json(
      {
        error:
          'Blog publishing is not configured. Set ADMIN_SECRET in .env.local. On Vercel, use Supabase (see .env.local.example) or commit markdown under content/blog.',
      },
      { status: 503 }
    )
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const session = request.cookies.get(ADMIN_SESSION_COOKIE)?.value
  if (!(await verifyAdminJwt(session, adminSecret))) {
    return NextResponse.json({ error: 'Unauthorized — sign in at /admin/login' }, { status: 401 })
  }

  const title = pickStr(body.title)
  const description = pickStr(body.description)
  const content = pickStr(body.content)
  const category =
    pickStr(body.category)
      .replace(/[^a-z0-9-]/gi, '-')
      .toLowerCase() || 'general'

  const rawSlug = body.slug != null ? String(body.slug) : title
  const slug = sanitizeSlugForBlog(rawSlug)
  if (!slug) {
    return NextResponse.json({ error: 'Invalid or missing slug/title' }, { status: 400 })
  }
  if (!title || !description || !content) {
    return NextResponse.json({ error: 'title, description, and content are required' }, { status: 400 })
  }

  const tags = Array.isArray(body.tags)
    ? body.tags.map((t) => String(t).trim()).filter(Boolean)
    : []
  const author = pickStr(body.author) || 'Admin'
  const date = pickStr(body.date) || new Date().toISOString().slice(0, 10)
  if (!ISO_DATE.test(date)) {
    return NextResponse.json({ error: 'date must be YYYY-MM-DD' }, { status: 400 })
  }

  let updated: string | undefined = pickStr(body.updated)
  if (updated && !ISO_DATE.test(updated)) {
    return NextResponse.json({ error: 'updated must be YYYY-MM-DD when provided' }, { status: 400 })
  }
  if (!updated) updated = undefined

  const keywords = parseKeywords(body)
  const metaTitle = pickStr(body.metaTitle) || undefined
  const ogTitle = pickStr(body.ogTitle) || undefined
  const ogDescription = pickStr(body.ogDescription) || undefined
  const ogImage = pickStr(body.ogImage) || undefined
  const twitterImage = pickStr(body.twitterImage) || undefined
  const canonical = pickStr(body.canonical) || undefined
  const robots = pickStr(body.robots) || undefined

  const supabase = createSupabaseService()
  if (supabaseWriteEnabled() && supabase) {
    const { error } = await supabase.from('blog_posts').upsert(
      {
        slug,
        title,
        description,
        body: content,
        category,
        tags,
        author,
        published_on: date,
        updated_on: updated ?? null,
        meta_title: metaTitle ?? null,
        keywords: keywords.length ? keywords : null,
        og_title: ogTitle ?? null,
        og_description: ogDescription ?? null,
        og_image: ogImage ?? null,
        twitter_image: twitterImage ?? null,
        canonical_url: canonical ?? null,
        robots: robots ?? null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'slug' }
    )

    if (error) {
      return NextResponse.json(
        { error: error.message, hint: 'Check Supabase table blog_posts and RLS (see supabase/migrations).' },
        { status: 500 }
      )
    }

    revalidatePath('/blog')
    revalidatePath(`/blog/${slug}`)
    revalidatePath('/sitemap.xml')

    return NextResponse.json({ ok: true, slug, storage: 'supabase' as const })
  }

  const frontmatter: Record<string, unknown> = {
    title,
    description,
    date,
    category,
    author,
  }

  if (updated) frontmatter.updated = updated
  if (tags.length) frontmatter.tags = tags
  if (keywords.length) frontmatter.keywords = keywords
  if (metaTitle) frontmatter.metaTitle = metaTitle
  if (ogTitle) frontmatter.ogTitle = ogTitle
  if (ogDescription) frontmatter.ogDescription = ogDescription
  if (ogImage) frontmatter.ogImage = ogImage
  if (twitterImage) frontmatter.twitterImage = twitterImage
  if (canonical) frontmatter.canonical = canonical
  if (robots) frontmatter.robots = robots

  const fileContent = matter.stringify(content, frontmatter)

  const dir = path.join(process.cwd(), 'content', 'blog')
  await fs.mkdir(dir, { recursive: true })
  const filePath = path.join(dir, `${slug}.md`)

  try {
    await fs.writeFile(filePath, fileContent, 'utf8')
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Write failed'
    return NextResponse.json(
      {
        error: message,
        hint: 'Filesystem write failed. On Vercel, set NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY + NEXT_PUBLIC_SUPABASE_ANON_KEY and run the SQL migration.',
      },
      { status: 500 }
    )
  }

  revalidatePath('/blog')
  revalidatePath(`/blog/${slug}`)
  revalidatePath('/sitemap.xml')

  return NextResponse.json({ ok: true, slug, path: `content/blog/${slug}.md`, storage: 'filesystem' as const })
}

export async function DELETE(request: NextRequest) {
  const adminSecret = getAdminSecret()
  if (!adminSecret) {
    return NextResponse.json({ error: 'ADMIN_SECRET is not configured' }, { status: 503 })
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const session = request.cookies.get(ADMIN_SESSION_COOKIE)?.value
  if (!(await verifyAdminJwt(session, adminSecret))) {
    return NextResponse.json({ error: 'Unauthorized — sign in at /admin/login' }, { status: 401 })
  }

  const slug = sanitizeSlugForBlog(pickStr(body.slug))
  if (!slug) {
    return NextResponse.json({ error: 'Invalid slug' }, { status: 400 })
  }

  let removed = false
  const supabase = createSupabaseService()
  if (supabaseWriteEnabled() && supabase) {
    const { data, error } = await supabase.from('blog_posts').delete().eq('slug', slug).select('slug')
    if (!error && data && data.length > 0) removed = true
  }

  const filePath = path.join(process.cwd(), 'content', 'blog', `${slug}.md`)
  try {
    await fs.unlink(filePath)
    removed = true
  } catch {
    // file missing is fine if DB row was deleted
  }

  if (!removed) {
    return NextResponse.json({ error: 'Post not found in Supabase or content/blog' }, { status: 404 })
  }

  revalidatePath('/blog')
  revalidatePath(`/blog/${slug}`)
  revalidatePath('/sitemap.xml')
  revalidatePath('/admin/blog')

  return NextResponse.json({ ok: true, slug })
}
