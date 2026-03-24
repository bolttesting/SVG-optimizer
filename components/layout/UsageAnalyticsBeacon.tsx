'use client'

import { useEffect } from 'react'

/**
 * Records at most one visit per browser per UTC calendar day (localStorage key).
 * Skips /admin. Requires Supabase + SUPABASE_SERVICE_ROLE_KEY on the server.
 */
export function UsageAnalyticsBeacon() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    const pathname = window.location.pathname
    if (pathname.startsWith('/admin')) return

    const day = new Date().toISOString().slice(0, 10)
    const key = `svgo_usage_${day}`
    try {
      if (localStorage.getItem(key)) return
    } catch {
      return
    }

    const send = () => {
      void fetch('/api/analytics/track', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: pathname }),
      })
        .then((res) => {
          if (res.ok) {
            try {
              localStorage.setItem(key, '1')
            } catch {
              /* ignore */
            }
          }
        })
        .catch(() => {})
    }

    const ric = window.requestIdleCallback
    if (typeof ric === 'function') {
      const id = ric(send, { timeout: 4000 })
      return () => window.cancelIdleCallback(id)
    }
    const t = window.setTimeout(send, 1)
    return () => clearTimeout(t)
  }, [])

  return null
}
