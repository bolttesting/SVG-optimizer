'use client'

import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem('theme') as 'light' | 'dark' | null
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const resolved = stored ?? (prefersDark ? 'dark' : 'light')
    setTheme(resolved)
    document.documentElement.classList.toggle('dark', resolved === 'dark')
  }, [])

  const toggle = () => {
    const next = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
    localStorage.setItem('theme', next)
    document.documentElement.classList.toggle('dark', next === 'dark')
  }

  /* Stable SSR + first paint avoids hydration mismatch (React #425) from theme icon swap */
  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" disabled aria-hidden className="shrink-0 opacity-50" tabIndex={-1}>
        <Moon className="h-4 w-4" />
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
      title="Dark / light mode"
      className="shrink-0"
    >
      {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
    </Button>
  )
}
