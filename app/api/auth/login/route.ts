import { NextResponse } from 'next/server'
import { ADMIN_SESSION_COOKIE } from '@/lib/auth/constants'
import { getAdminSecret } from '@/lib/auth/get-admin-secret'
import { signAdminJwt } from '@/lib/auth/sign-admin-jwt'

export async function POST(request: Request) {
  const secret = getAdminSecret()
  if (!secret) {
    return NextResponse.json(
      { error: 'Server is not configured for admin login (missing ADMIN_SECRET).' },
      { status: 503 }
    )
  }

  let body: { password?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const password = (body.password ?? '').trim()
  if (!password || password !== secret) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  }

  try {
    const token = signAdminJwt(secret)
    const res = NextResponse.json({ ok: true })
    res.cookies.set(ADMIN_SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })
    return res
  } catch {
    return NextResponse.json({ error: 'Could not create session' }, { status: 500 })
  }
}
