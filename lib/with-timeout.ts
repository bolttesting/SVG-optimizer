/** Reject if `promise` does not settle within `ms` (does not cancel the underlying work). */
export function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  let id: ReturnType<typeof setTimeout> | undefined
  const timeout = new Promise<never>((_, reject) => {
    id = setTimeout(() => reject(new Error('timeout')), ms)
  })
  return Promise.race([
    promise.finally(() => {
      if (id != null) clearTimeout(id)
    }),
    timeout,
  ])
}
