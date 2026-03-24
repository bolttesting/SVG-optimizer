import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { ADMIN_SESSION_COOKIE } from '@/lib/auth/constants'
import { getAdminSecret } from '@/lib/auth/get-admin-secret'
import { verifyAdminJwt } from '@/lib/auth/verify-admin-jwt'
import { createSupabaseService } from '@/lib/supabase/blog-client'

const ALLOWED = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
])

const MAX_BYTES = 5 * 1024 * 1024

function safeFileName(name: string): string {
  const base = name.replace(/[/\\]/g, '').split(/[/\\]/).pop() || 'image'
  return base.replace(/[^a-zA-Z0-9._-]/g, '-').slice(0, 80) || 'image'
}

export async function POST(request: NextRequest) {
  const adminSecret = getAdminSecret()
  if (!adminSecret) {
    return NextResponse.json({ error: 'ADMIN_SECRET not configured' }, { status: 503 })
  }

  const session = request.cookies.get(ADMIN_SESSION_COOKIE)?.value
  if (!(await verifyAdminJwt(session, adminSecret))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createSupabaseService()
  if (!supabase) {
    return NextResponse.json(
      {
        error:
          'Supabase storage not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY, create the `blog` bucket (see supabase/migrations).',
      },
      { status: 503 }
    )
  }

  let formData: FormData
  try {
    formData = await request.formData()
  } catch {
    return NextResponse.json({ error: 'Expected multipart form data' }, { status: 400 })
  }

  const file = formData.get('file')
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: 'Missing file field' }, { status: 400 })
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'File too large (max 5 MB)' }, { status: 400 })
  }

  const type = file.type || 'application/octet-stream'
  if (!ALLOWED.has(type)) {
    return NextResponse.json(
      { error: 'Unsupported type. Use JPEG, PNG, WebP, GIF, or SVG.' },
      { status: 400 }
    )
  }

  const path = `${randomUUID()}-${safeFileName(file.name)}`
  const buffer = Buffer.from(await file.arrayBuffer())

  const { error: uploadError } = await supabase.storage.from('blog').upload(path, buffer, {
    contentType: type,
    upsert: false,
  })

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 })
  }

  const { data } = supabase.storage.from('blog').getPublicUrl(path)
  return NextResponse.json({ ok: true, url: data.publicUrl, path })
}
