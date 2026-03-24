import { AdminSidebar } from '@/components/admin/AdminSidebar'

export const dynamic = 'force-dynamic'

/**
 * Grid keeps the main column beside the sidebar (not stacked under it). `items-start` avoids
 * stretching cells to the full row height, which was pushing content down with flex + `flex-1`.
 */
export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid w-full grid-cols-1 items-start gap-0 bg-background sm:grid-cols-[14rem_minmax(0,1fr)]">
      <AdminSidebar />
      <div className="min-w-0 w-full">{children}</div>
    </div>
  )
}
