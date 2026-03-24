/**
 * HS256 JWT sign — Node only (API routes). Do not import from Edge middleware.
 */

import { createHmac } from 'crypto'

export function signAdminJwt(secret: string): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString(
    'base64url'
  )
  const now = Math.floor(Date.now() / 1000)
  const payload = Buffer.from(
    JSON.stringify({
      sub: 'admin',
      iat: now,
      exp: now + 60 * 60 * 24 * 7,
    })
  ).toString('base64url')
  const signingInput = `${header}.${payload}`
  const sig = createHmac('sha256', secret).update(signingInput).digest('base64url')
  return `${signingInput}.${sig}`
}
