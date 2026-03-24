'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { siteConfig } from '@/config/site'
import { ThemeToggle } from './ThemeToggle'
import { Menu, Sparkles, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const nav = [
  { href: '/', label: 'Tool' },
  { href: '/blog', label: 'Blog' },
  { href: '/privacy', label: 'Privacy' },
  { href: '/contact', label: 'Contact' },
]

const linkClass =
  'rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:py-2'

export function Header() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!menuOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [menuOpen])

  return (
    <header className="sticky top-0 z-50 w-full max-w-full min-w-0 overflow-x-clip border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-14 max-w-full min-w-0 items-center justify-between gap-2 sm:h-16 sm:gap-3">
        <Link
          href="/"
          className="group flex min-w-0 items-center gap-2 font-semibold tracking-tight text-foreground"
          onClick={() => setMenuOpen(false)}
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary transition group-hover:bg-primary/25">
            <Sparkles className="h-4 w-4" aria-hidden />
          </span>
          <span className="truncate">{siteConfig.name}</span>
        </Link>

        <nav className="hidden min-w-0 items-center gap-1 lg:flex" aria-label="Main">
          {nav.map(({ href, label }) => (
            <Link key={href} href={href} className={linkClass}>
              {label}
            </Link>
          ))}
          <div className="ml-1 border-l border-border/60 pl-2">
            <ThemeToggle />
          </div>
        </nav>

        <div className="flex shrink-0 items-center gap-2 lg:hidden">
          <ThemeToggle />
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border/60 bg-background text-foreground transition hover:bg-muted/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <>
          <button
            type="button"
            className="fixed inset-0 top-14 z-40 bg-background/60 backdrop-blur-sm sm:top-16 lg:hidden"
            aria-hidden
            tabIndex={-1}
            onClick={() => setMenuOpen(false)}
          />
          <div
            id="mobile-nav"
            className="relative z-50 border-t border-border/60 bg-background/95 shadow-lg backdrop-blur-xl lg:hidden"
          >
            <nav className="container flex flex-col gap-0.5 py-3" aria-label="Main">
              {nav.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    linkClass,
                    pathname === href && 'bg-muted/80 text-foreground'
                  )}
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </>
      ) : null}
    </header>
  )
}
