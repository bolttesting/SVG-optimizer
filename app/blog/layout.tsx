/** Fresh reads for Supabase-backed posts without waiting for a redeploy. */
export const dynamic = 'force-dynamic'

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
