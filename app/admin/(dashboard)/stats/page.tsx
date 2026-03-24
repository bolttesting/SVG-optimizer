import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ADMIN_SESSION_COOKIE } from '@/lib/auth/constants'
import { getAdminSecret } from '@/lib/auth/get-admin-secret'
import { verifyAdminJwt } from '@/lib/auth/verify-admin-jwt'
import { createSupabaseService } from '@/lib/supabase/blog-client'
import { siteConfig } from '@/config/site'

type SummaryRow = {
  total_records: number
  unique_visitors: number
  visits_last_7d: number
  visits_last_24h: number
}

export default async function AdminStatsPage() {
  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN?.trim() ?? ''
  let siteHost = 'svgoptimizer.site'
  try {
    siteHost = new URL(siteConfig.url).hostname
  } catch {
    /* keep default */
  }

  const secret = getAdminSecret()
  const token = cookies().get(ADMIN_SESSION_COOKIE)?.value
  if (!secret || !(await verifyAdminJwt(token, secret))) {
    redirect('/admin/login?from=/admin/stats')
  }

  const supabase = createSupabaseService()
  let summary: SummaryRow | null = null
  let fetchError: string | null = null

  if (supabase) {
    const { data, error } = await supabase.rpc('get_analytics_summary')
    if (error) {
      fetchError = error.message
    } else if (data && Array.isArray(data) && data[0]) {
      const r = data[0] as Record<string, number>
      summary = {
        total_records: Number(r.total_records ?? 0),
        unique_visitors: Number(r.unique_visitors ?? 0),
        visits_last_7d: Number(r.visits_last_7d ?? 0),
        visits_last_24h: Number(r.visits_last_24h ?? 0),
      }
    }
  }

  return (
    <div className="w-full max-w-3xl px-4 py-8 md:px-8 md:py-10">
      <h1 className="mb-2 text-2xl font-bold tracking-tight">Usage stats</h1>
      <p className="mb-8 text-sm text-muted-foreground">
        Anonymous cookie, at most <strong>one log per browser per UTC day</strong> on public pages. Run{' '}
        <code className="rounded bg-muted px-1 text-xs">002_analytics_sessions.sql</code> if this stays empty.
      </p>

      {!supabase ? (
        <Card>
          <CardHeader>
            <CardTitle>Supabase not configured</CardTitle>
            <CardDescription>
              Set <code className="text-xs">SUPABASE_SERVICE_ROLE_KEY</code> and URL keys.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : fetchError ? (
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle>Could not load stats</CardTitle>
            <CardDescription className="text-destructive">{fetchError}</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Apply <code className="text-xs">analytics_sessions</code> +{' '}
            <code className="text-xs">get_analytics_summary</code> migration.
          </CardContent>
        </Card>
      ) : summary ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Unique browsers</CardDescription>
              <CardTitle className="text-3xl tabular-nums">{summary.unique_visitors}</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              Distinct anonymous IDs (cookie). Two devices = two visitors.
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Logged visit-days</CardDescription>
              <CardTitle className="text-3xl tabular-nums">{summary.total_records}</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              Total rows (~ one per browser per day they visited).
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Last 7 days</CardDescription>
              <CardTitle className="text-3xl tabular-nums">{summary.visits_last_7d}</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">Logs in the past week.</CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Last 24 hours</CardDescription>
              <CardTitle className="text-3xl tabular-nums">{summary.visits_last_24h}</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">Since this time yesterday.</CardContent>
          </Card>
        </div>
      ) : (
        <p className="text-muted-foreground">No summary returned.</p>
      )}

      <p className="mt-8 text-xs text-muted-foreground">
        <strong className="font-medium text-foreground">Public page analytics:</strong> optional Plausible
        loads on <code className="rounded bg-muted px-1">{siteHost}</code> only after visitors accept
        analytics.{' '}
        {plausibleDomain ? (
          <>
            Configured Plausible domain:{' '}
            <code className="rounded bg-muted px-1">{plausibleDomain}</code>.
          </>
        ) : (
          <>No Plausible site domain is set in this deployment—the script will not load.</>
        )}{' '}
        You can also use analytics from your hosting provider if available.
      </p>
    </div>
  )
}
