import { NextResponse } from 'next/server'

/** Lightweight check that the Node process handles HTTP (useful when debugging 503 / proxy issues). */
export const dynamic = 'force-dynamic'

export function GET() {
  return NextResponse.json({ ok: true })
}
