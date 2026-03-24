/**
 * HS256 JWT verify with Web Crypto — safe for Edge middleware and Node.
 */

function base64UrlDecodeToBytes(s: string): Uint8Array {
  const pad = s.length % 4 === 0 ? '' : '='.repeat(4 - (s.length % 4))
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/') + pad
  const bin = atob(b64)
  const out = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i)
  return out
}

export async function verifyAdminJwt(
  token: string | undefined,
  secret: string | undefined
): Promise<boolean> {
  try {
    if (!token || !secret) return false
    const parts = token.split('.')
    if (parts.length !== 3) return false
    const [h, p, s] = parts
    const signingInput = `${h}.${p}`
    let sigBytes: Uint8Array
    try {
      sigBytes = base64UrlDecodeToBytes(s)
    } catch {
      return false
    }
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    )
    const signature = new Uint8Array(sigBytes)
    const ok = await crypto.subtle.verify(
      'HMAC',
      key,
      signature,
      new TextEncoder().encode(signingInput)
    )
    if (!ok) return false
    try {
      const payloadJson = new TextDecoder().decode(base64UrlDecodeToBytes(p))
      const payload = JSON.parse(payloadJson) as { exp?: number; sub?: string }
      if (payload.sub !== 'admin') return false
      if (typeof payload.exp !== 'number') return false
      return payload.exp > Math.floor(Date.now() / 1000)
    } catch {
      return false
    }
  } catch {
    return false
  }
}
