'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export function ContactSmtpForm() {
  const [from, setFrom] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (honeypot) return
    setStatus('loading')
    setErrorMsg('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from,
          subject,
          message,
          website: honeypot,
        }),
      })
      const data = (await res.json().catch(() => ({}))) as { error?: string }
      if (!res.ok) {
        setStatus('error')
        setErrorMsg(typeof data.error === 'string' ? data.error : 'Send failed')
        return
      }
      setStatus('success')
      setSubject('')
      setMessage('')
    } catch {
      setStatus('error')
      setErrorMsg('Network error')
    }
  }

  return (
    <form onSubmit={(e) => void onSubmit(e)} className="space-y-4">
      <p className="text-sm font-medium text-foreground">Send from this site</p>
      <p className="text-xs text-muted-foreground">
        Sent through our mail server (SMTP). We’ll reply to the address you enter below.
      </p>

      {/* Honeypot — hidden; if filled, server discards silently */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        className="hidden"
        aria-hidden
      />

      <div className="space-y-2">
        <Label htmlFor="smtp-from">Your email (we’ll reply here)</Label>
        <Input
          id="smtp-from"
          type="email"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="smtp-subject">Subject</Label>
        <Input
          id="smtp-subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Question about the optimizer…"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="smtp-message">Message</Label>
        <Textarea
          id="smtp-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={6}
          placeholder="How can we help?"
        />
      </div>
      <Button type="submit" disabled={status === 'loading'}>
        {status === 'loading' ? 'Sending…' : 'Send message'}
      </Button>

      {status === 'success' && (
        <p className="text-sm text-green-600 dark:text-green-400">Sent. We’ll get back to you soon.</p>
      )}
      {status === 'error' && <p className="text-sm text-destructive">{errorMsg}</p>}
    </form>
  )
}
