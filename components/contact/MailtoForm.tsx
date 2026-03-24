'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface MailtoFormProps {
  to: string
}

export function MailtoForm({ to }: MailtoFormProps) {
  const [from, setFrom] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')

  function openMailClient(e: React.FormEvent) {
    e.preventDefault()
    const body = [`(Sent via ${typeof window !== 'undefined' ? window.location.origin : ''}/contact)`, '', from ? `Reply-to: ${from}` : '', '', message].join('\n')
    const href = `mailto:${to}?subject=${encodeURIComponent(subject || 'SVG Optimizer — contact')}&body=${encodeURIComponent(body)}`
    window.location.href = href
  }

  return (
    <form onSubmit={openMailClient} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="contact-from">Your email (for reply)</Label>
        <Input
          id="contact-from"
          type="email"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="contact-subject">Subject</Label>
        <Input
          id="contact-subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Question about the optimizer…"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="contact-message">Message</Label>
        <Textarea
          id="contact-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={6}
          placeholder="How can we help?"
        />
      </div>
      <Button type="submit">Send</Button>
      <p className="text-xs text-muted-foreground">
        Opens your default mail app with a draft. Nothing is sent from our servers.
      </p>
    </form>
  )
}
