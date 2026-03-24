/** True when the error is a stale or missing Next.js split chunk (common after deploy + CDN/HTML cache). */
export function isChunkLoadError(message: string): boolean {
  return (
    /Loading chunk \d+ failed/i.test(message) ||
    /ChunkLoadError/i.test(message) ||
    /Failed to fetch dynamically imported module/i.test(message)
  )
}
