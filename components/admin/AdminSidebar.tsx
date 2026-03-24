'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { BarChart3, ExternalLink, FileEdit, LayoutDashboard, LogOut, Newspaper } from 'lucide-react'
import { siteConfig } from '@/config/site'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

const nav = [
  { href: '/admin/blog/new', label: 'New post', icon: FileEdit },
  { href: '/admin/blog', label: 'Posted blogs', icon: Newspaper },
  { href: '/admin/stats', label: 'Usage stats', icon: BarChart3 },
] as const

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'same-origin' })
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-border bg-muted/30 sm:border-b-0 sm:border-r">
      <div className="flex items-center gap-2 border-b border-border/80 px-4 py-4">
        <LayoutDashboard className="h-5 w-5 text-primary" aria-hidden />
        <div>
          <p className="text-sm font-semibold leading-tight">Dashboard</p>
          <p className="text-xs text-muted-foreground">{siteConfig.name}</p>
        </div>
      </div>
      <nav className="flex flex-row gap-1 overflow-x-auto p-2 sm:flex-col sm:overflow-visible">
        {nav.map(({ href, label, icon: Icon }) => {
          const navActive =
            href === '/admin/blog'
              ? pathname === '/admin/blog' ||
                pathname === '/admin/blog/' ||
                pathname.startsWith('/admin/blog/edit/')
              : href === '/admin/blog/new'
                ? pathname.startsWith('/admin/blog/new')
                : pathname === href || pathname.startsWith(`${href}/`)

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-2 whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-colors',
                navActive
                  ? 'bg-primary/15 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden />
              {label}
            </Link>
          )
        })}
      </nav>
      <div className="mt-auto flex flex-col gap-2 border-t border-border/80 p-3">
        <Link
          href="/blog"
          target="_blank"
          rel="noopener noreferrer"
          className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'w-full justify-start gap-2')}
        >
          <ExternalLink className="h-4 w-4" aria-hidden />
          Public blog
        </Link>
        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: 'ghost', size: 'sm' }),
            'w-full justify-start gap-2 text-muted-foreground'
          )}
        >
          <ExternalLink className="h-4 w-4" aria-hidden />
          Home / tool
        </Link>
        <button
          type="button"
          className={cn(
            buttonVariants({ variant: 'outline', size: 'sm' }),
            'w-full justify-start gap-2 border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive'
          )}
          onClick={() => void logout()}
        >
          <LogOut className="h-4 w-4" aria-hidden />
          Sign out
        </button>
      </div>
    </aside>
  )
}
