'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

/** Keep hero count close to /admin/stats (same RPC); 30s limits stale 1-off mismatches. */
const POLL_MS = 30_000
const FETCH_TIMEOUT_MS = 8_000

/**
 * Unique visitors from Supabase (GET /api/analytics/public-count).
 * Polls on an interval and when the tab becomes visible so the number keeps up with new visitors.
 */
export function UsageCountUp() {
  const [target, setTarget] = useState<number | null>(null)
  const [display, setDisplay] = useState(0)
  const displayRef = useRef(0)

  useEffect(() => {
    displayRef.current = display
  }, [display])

  const applyCount = useCallback((n: number) => {
    if (n < 1) return
    setTarget((prev) => (prev !== n ? n : prev))
  }, [])

  const fetchCount = useCallback(() => {
    const ac = new AbortController()
    const tid = window.setTimeout(() => ac.abort(), FETCH_TIMEOUT_MS)
    return fetch('/api/analytics/public-count', {
      signal: ac.signal,
      cache: 'no-store',
    })
      .then((res) => res.json())
      .then((d: { ok?: boolean; uniqueVisitors?: number }) => {
        if (!d.ok || typeof d.uniqueVisitors !== 'number') return
        applyCount(d.uniqueVisitors)
      })
      .catch(() => {})
      .finally(() => clearTimeout(tid))
  }, [applyCount])

  useEffect(() => {
    void fetchCount()
    const id = window.setInterval(() => void fetchCount(), POLL_MS)
    const onVis = () => {
      if (document.visibilityState === 'visible') void fetchCount()
    }
    document.addEventListener('visibilitychange', onVis)
    return () => {
      clearInterval(id)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [fetchCount])

  useEffect(() => {
    if (target == null) return
    const from = displayRef.current
    const to = target
    if (from === to) return

    // Same source as admin; small deltas are usually new visitors or rounding — show immediately.
    if (Math.abs(to - from) <= 3) {
      setDisplay(to)
      displayRef.current = to
      return
    }

    const start = performance.now()
    const duration = from === 0 ? 1400 : 900
    let raf = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - (1 - t) ** 3
      const v = Math.round(from + (to - from) * eased)
      setDisplay(v)
      if (t < 1) raf = requestAnimationFrame(tick)
      else displayRef.current = to
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target])

  if (target == null) return null

  return (
    <p className="mt-5 animate-fade-in text-balance text-sm text-muted-foreground">
      <span className="font-semibold tabular-nums text-foreground">{display.toLocaleString()}</span>
      {' '}
      unique visitors have used this tool
    </p>
  )
}
