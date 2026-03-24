'use client'

import { useCallback } from 'react'
import { optimizeSvg, getByteSize } from '@/lib/optimization/core'
import type { OptimizationSettings } from '@/types'

export function useOptimization() {
  const optimize = useCallback(
    async (svgString: string, settings: OptimizationSettings) => {
      const originalSize = getByteSize(svgString)
      const { data: optimizedSvg, error } = await optimizeSvg(svgString, settings)
      const optimizedSize = error ? originalSize : getByteSize(optimizedSvg)
      return {
        optimizedSvg: error ? svgString : optimizedSvg,
        originalSize,
        optimizedSize,
        error,
      }
    },
    []
  )

  return { optimize }
}
