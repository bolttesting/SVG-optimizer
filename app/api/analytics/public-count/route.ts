import { NextResponse } from 'next/server'
import { createSupabaseService } from '@/lib/supabase/blog-client'

/** Public aggregate for landing page (unique visitors from analytics_sessions). */
export const dynamic = 'force-dynamic'

export async function GET() {
  const supabase = createSupabaseService()
  if (!supabase) {
    return NextResponse.json(
      { ok: false, uniqueVisitors: null },
      { headers: { 'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=300' } }
    )
  }

  const { data, error } = await supabase.rpc('get_analytics_summary')
  if (error || !data || !Array.isArray(data) || !data[0]) {
    return NextResponse.json(
      { ok: false, uniqueVisitors: null },
      { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' } }
    )
  }

  const r = data[0] as Record<string, unknown>
  const n = Number(r.unique_visitors ?? 0)
  const uniqueVisitors = Number.isFinite(n) ? Math.max(0, Math.floor(n)) : 0

  return NextResponse.json(
    { ok: true, uniqueVisitors },
    { headers: { 'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=300' } }
  )
}
