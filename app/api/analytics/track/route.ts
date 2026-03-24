import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { createSupabaseService } from '@/lib/supabase/blog-client'
import { VISITOR_COOKIE, VISITOR_COOKIE_MAX_AGE } from '@/lib/analytics/constants'
import { withTimeout } from '@/lib/with-timeout'

const INSERT_MS = 6_000

function pickPath(body: unknown): string {
  if (body && typeof body === 'object' && 'path' in body) {
    const p = String((body as { path: unknown }).path ?? '/').slice(0, 200)
    if (!p.startsWith('/')) return '/'
    if (p.startsWith('/admin')) return '/'
    return p
  }
  return '/'
}

export async function POST(request: NextRequest) {
  const supabase = createSupabaseService()
  if (!supabase || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return new NextResponse(null, { status: 204 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    body = {}
  }

  const path = pickPath(body)

  const existing = request.cookies.get(VISITOR_COOKIE)?.value
  const isNewVisitor = !existing || !/^[0-9a-f-]{36}$/i.test(existing)
  const visitorId: string = isNewVisitor ? randomUUID() : existing!

  let error: unknown
  try {
    const res = await withTimeout(
      Promise.resolve(
        supabase.from('analytics_sessions').insert({
          visitor_id: visitorId,
          path,
        })
      ),
      INSERT_MS
    )
    error = res.error
  } catch {
    return NextResponse.json({ ok: false }, { status: 504 })
  }

  if (error) {
    return NextResponse.json({ ok: false }, { status: 500 })
  }

  const res = NextResponse.json({ ok: true })
  if (isNewVisitor) {
    res.cookies.set(VISITOR_COOKIE, visitorId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: VISITOR_COOKIE_MAX_AGE,
    })
  }
  return res
}
