'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ExternalLink, Pencil, Trash2 } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function AdminBlogPostRowActions({ slug, title }: { slug: string; title: string }) {
  const router = useRouter()
  const [pending, setPending] = useState(false)

  async function onDelete() {
    const ok = window.confirm(
      `Delete “${title}” (${slug})? This removes the post from Supabase and/or content/blog if present.`
    )
    if (!ok) return
    setPending(true)
    try {
      const res = await fetch('/api/blog', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ slug }),
      })
      const data = (await res.json()) as { error?: string }
      if (!res.ok) {
        window.alert(data.error ?? 'Delete failed')
        if (res.status === 401) {
          router.push(`/admin/login?from=${encodeURIComponent(`/admin/blog`)}`)
        }
        return
      }
      router.refresh()
    } catch {
      window.alert('Network error')
    } finally {
      setPending(false)
    }
  }

  const editHref = `/admin/blog/edit/${encodeURIComponent(slug)}`

  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <Link
        href={`/blog/${encodeURIComponent(slug)}`}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'inline-flex gap-1')}
      >
        <ExternalLink className="h-3.5 w-3.5" aria-hidden />
        View
      </Link>
      <Link
        href={editHref}
        className={cn(buttonVariants({ variant: 'secondary', size: 'sm' }), 'inline-flex gap-1')}
      >
        <Pencil className="h-3.5 w-3.5" aria-hidden />
        Edit
      </Link>
      <Button
        type="button"
        variant="destructive"
        size="sm"
        className="inline-flex gap-1"
        disabled={pending}
        onClick={() => void onDelete()}
      >
        <Trash2 className="h-3.5 w-3.5" aria-hidden />
        {pending ? '…' : 'Delete'}
      </Button>
    </div>
  )
}
