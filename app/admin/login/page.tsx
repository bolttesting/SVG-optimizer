'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

function AdminLoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const from = searchParams.get('from') || '/admin/blog/new'
  const configError = searchParams.get('error') === 'config'

  const [password, setPassword] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setMessage('')
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
        credentials: 'same-origin',
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setStatus('error')
        setMessage(typeof data.error === 'string' ? data.error : 'Login failed')
        return
      }
      router.push(from.startsWith('/admin') ? from : '/admin/blog/new')
      router.refresh()
    } catch {
      setStatus('error')
      setMessage('Network error')
    }
  }

  return (
    <Card className="border-border/80 shadow-lg">
      <CardHeader>
        <CardTitle>Admin sign in</CardTitle>
        <CardDescription>
          Use the password configured as <code className="text-xs">ADMIN_SECRET</code> in your server
          environment (e.g. <code className="text-xs">.env.local</code>).
        </CardDescription>
      </CardHeader>
      <CardContent>
        {configError && (
          <p className="mb-4 rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            The server doesn’t see <code className="text-xs">ADMIN_SECRET</code>. Add it to{' '}
            <code className="text-xs">.env.local</code> in the <code className="text-xs">svg-optimizer</code>{' '}
            folder, then <strong>stop and restart</strong> <code className="text-xs">npm run dev</code> and
            open{' '}
            <Link href="/admin/login" className="underline">
              /admin/login
            </Link>{' '}
            again (or delete the <code className="text-xs">.next</code> folder once).
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" disabled={status === 'loading' || configError} className="w-full">
            {status === 'loading' ? 'Signing in…' : 'Sign in'}
          </Button>
          {message && <p className="text-sm text-destructive">{message}</p>}
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link href="/" className="text-primary underline-offset-4 hover:underline">
            ← Back to site
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}

export default function AdminLoginPage() {
  return (
    <Container className="flex min-h-[70vh] max-w-md flex-col justify-center py-12">
      <Suspense fallback={<p className="text-center text-muted-foreground">Loading…</p>}>
        <AdminLoginForm />
      </Suspense>
    </Container>
  )
}
