'use client'

import { useEffect, useState } from 'react'

/**
 * Count-up of unique visitors (Supabase analytics_sessions via /api/analytics/public-count).
 * Hidden until data loads; hidden if count is 0 or API unavailable.
 */
export function UsageCountUp() {
  const [target, setTarget] = useState<number | null>(null)
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    let cancelled = false
    void fetch('/api/analytics/public-count')
      .then((res) => res.json())
      .then((d: { ok?: boolean; uniqueVisitors?: number }) => {
        if (cancelled || !d.ok || typeof d.uniqueVisitors !== 'number' || d.uniqueVisitors < 1) return
        setTarget(d.uniqueVisitors)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (target == null) return
    const start = performance.now()
    const duration = 1400
    let raf = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - (1 - t) ** 3
      setDisplay(Math.round(target * eased))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target])

  if (target == null) return null

  return (
    <p className="mt-5 animate-fade-in text-sm text-muted-foreground">
      <span className="font-semibold tabular-nums text-foreground">{display.toLocaleString()}</span>
      {' '}
      unique visitors have used this tool
    </p>
  )
}
