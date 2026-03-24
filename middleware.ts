import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { ADMIN_SESSION_COOKIE } from '@/lib/auth/constants'
import { verifyAdminJwt } from '@/lib/auth/verify-admin-jwt'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (!pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  const secret = process.env.ADMIN_SECRET

  if (pathname === '/admin/login' || pathname.startsWith('/admin/login/')) {
    const existing = request.cookies.get(ADMIN_SESSION_COOKIE)?.value
    if (await verifyAdminJwt(existing, secret)) {
      return NextResponse.redirect(new URL('/admin/blog', request.url))
    }
    return NextResponse.next()
  }

  if (!secret) {
    const url = new URL('/admin/login', request.url)
    url.searchParams.set('error', 'config')
    return NextResponse.redirect(url)
  }

  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value
  const ok = await verifyAdminJwt(token, secret)

  if (!ok) {
    const login = new URL('/admin/login', request.url)
    login.searchParams.set('from', pathname)
    return NextResponse.redirect(login)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
}
