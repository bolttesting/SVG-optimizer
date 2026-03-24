import { NextResponse } from 'next/server'
import { createSupabaseService } from '@/lib/supabase/blog-client'
import { withTimeout } from '@/lib/with-timeout'

/** Public aggregate for landing page (unique visitors from analytics_sessions). */
export const dynamic = 'force-dynamic'

/** Match admin stats tolerance; avoid false timeouts on slow Supabase from shared hosts. */
const RPC_MS = 15_000

/** Never allow CDN/proxy to cache this JSON — stale counts made the landing page disagree with /admin/stats. */
const NO_STORE = { 'Cache-Control': 'no-store, must-revalidate' } as const

export async function GET() {
  const supabase = createSupabaseService()
  if (!supabase) {
    return NextResponse.json({ ok: false, uniqueVisitors: null }, { headers: NO_STORE })
  }

  let data: unknown
  let error: unknown
  try {
    const res = await withTimeout(Promise.resolve(supabase.rpc('get_analytics_summary')), RPC_MS)
    data = res.data
    error = res.error
  } catch {
    return NextResponse.json({ ok: false, uniqueVisitors: null }, { headers: NO_STORE })
  }
  if (error || !data || !Array.isArray(data) || !data[0]) {
    return NextResponse.json({ ok: false, uniqueVisitors: null }, { headers: NO_STORE })
  }

  const r = data[0] as Record<string, unknown>
  const raw = r.unique_visitors
  const n = typeof raw === 'bigint' ? Number(raw) : Number(raw ?? 0)
  const uniqueVisitors = Number.isFinite(n) ? Math.max(0, Math.floor(n)) : 0

  return NextResponse.json({ ok: true, uniqueVisitors }, { headers: NO_STORE })
}
