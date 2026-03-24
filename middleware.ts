import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { ADMIN_SESSION_COOKIE } from '@/lib/auth/constants'
import { getAdminSecret } from '@/lib/auth/get-admin-secret'
import { verifyAdminJwt } from '@/lib/auth/verify-admin-jwt'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (!pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  const secret = getAdminSecret()

  if (pathname === '/admin/login' || pathname.startsWith('/admin/login/')) {
    const existing = request.cookies.get(ADMIN_SESSION_COOKIE)?.value
    let loggedIn = false
    try {
      loggedIn = await verifyAdminJwt(existing, secret)
    } catch {
      loggedIn = false
    }
    if (loggedIn) {
      return NextResponse.redirect(new URL('/admin/blog/new', request.url))
    }
    return NextResponse.next()
  }

  if (!secret) {
    const url = new URL('/admin/login', request.url)
    url.searchParams.set('error', 'config')
    return NextResponse.redirect(url)
  }

  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value
  let ok = false
  try {
    ok = await verifyAdminJwt(token, secret)
  } catch {
    ok = false
  }

  if (!ok) {
    const login = new URL('/admin/login', request.url)
    login.searchParams.set('from', pathname)
    return NextResponse.redirect(login)
  }

  if (pathname === '/admin' || pathname === '/admin/') {
    return NextResponse.redirect(new URL('/admin/blog/new', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
}
