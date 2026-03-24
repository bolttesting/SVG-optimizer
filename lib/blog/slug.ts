/** Shared slug rules for admin preview + API. */
export function sanitizeSlugForBlog(input: string): string | null {
  const s = input
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
  if (!s || s.length > 120) return null
  return s
}
