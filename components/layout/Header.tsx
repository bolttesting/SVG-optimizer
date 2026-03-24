'use client'

import Link from 'next/link'
import { siteConfig } from '@/config/site'
import { ThemeToggle } from './ThemeToggle'
import { Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

const nav = [
  { href: '/', label: 'Tool' },
  { href: '/blog', label: 'Blog' },
  { href: '/privacy', label: 'Privacy' },
  { href: '/contact', label: 'Contact' },
]

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="group flex items-center gap-2 font-semibold tracking-tight text-foreground"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 text-primary transition group-hover:bg-primary/25">
            <Sparkles className="h-4 w-4" aria-hidden />
          </span>
          <span>{siteConfig.name}</span>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2" aria-label="Main">
          {nav.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors',
                'hover:bg-muted/80 hover:text-foreground',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
              )}
            >
              {label}
            </Link>
          ))}
          <div className="ml-1 border-l border-border/60 pl-2">
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </header>
  )
}
