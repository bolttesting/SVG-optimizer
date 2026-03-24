import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { siteConfig } from '@/config/site'

const MAX_MSG = 8000
const MAX_SUB = 200

function basicEmailOk(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)
}

export async function POST(request: Request) {
  const host = process.env.SMTP_HOST?.trim()
  const user = process.env.SMTP_USER?.trim()
  const pass = process.env.SMTP_PASS?.trim()
  const port = Number(process.env.SMTP_PORT || 465)

  if (!host || !user || !pass) {
    return NextResponse.json(
      { error: 'Server email is not configured (set SMTP_HOST, SMTP_USER, SMTP_PASS).' },
      { status: 503 }
    )
  }

  let body: { from?: string; subject?: string; message?: string; website?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (body.website) {
    return NextResponse.json({ ok: true })
  }

  const fromEmail = (body.from ?? '').trim()
  const subject = (body.subject ?? '').trim().slice(0, MAX_SUB)
  const message = (body.message ?? '').trim()

  if (!fromEmail || !basicEmailOk(fromEmail)) {
    return NextResponse.json({ error: 'A valid reply-to email is required.' }, { status: 400 })
  }
  if (!message || message.length > MAX_MSG) {
    return NextResponse.json(
      { error: `Message is required (max ${MAX_MSG} characters).` },
      { status: 400 }
    )
  }

  const to = process.env.CONTACT_SMTP_TO?.trim() || siteConfig.contactEmail
  if (!to) {
    return NextResponse.json({ error: 'No inbox address configured.' }, { status: 503 })
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    })

    await transporter.sendMail({
      from: `"${siteConfig.name}" <${user}>`,
      to,
      replyTo: fromEmail,
      subject: subject || `${siteConfig.name} — contact form`,
      text: [
        `Reply to: ${fromEmail}`,
        '',
        message,
        '',
        `--- Sent via ${siteConfig.url}/contact`,
      ].join('\n'),
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('contact/smtp', err)
    return NextResponse.json(
      { error: 'Could not send. Check SMTP settings or use the mailto link.' },
      { status: 500 }
    )
  }
}
