import { DEFAULT_SETTINGS } from '@/lib/svgo/presets'
import type { OptimizationSettings } from '@/types'

export async function optimizeSvg(
  svgString: string,
  settings: OptimizationSettings
): Promise<{ data: string; error?: string }> {
  try {
    const res = await fetch('/api/optimize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        svg: svgString,
        settings: settings ?? DEFAULT_SETTINGS,
      }),
    })

    const json = await res.json()
    if (!res.ok) {
      return { data: svgString, error: json.error ?? 'Optimization failed' }
    }
    return { data: json.optimized }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Optimization failed'
    return { data: svgString, error: message }
  }
}

export function getByteSize(str: string): number {
  return new Blob([str]).size
}
