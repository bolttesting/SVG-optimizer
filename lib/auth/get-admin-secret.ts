/**
 * Single source for ADMIN_SECRET. Trims whitespace/newlines — common when pasting into Vercel or .env files.
 */
export function getAdminSecret(): string {
  const v = process.env.ADMIN_SECRET
  if (v == null || typeof v !== 'string') return ''
  return v.trim()
}
