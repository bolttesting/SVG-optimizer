'use client'

import { formatBytes, calculateReduction } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface StatsDisplayProps {
  originalSize: number
  optimizedSize: number
  animated?: boolean
}

export function StatsDisplay({ originalSize, optimizedSize, animated = true }: StatsDisplayProps) {
  const reduction = calculateReduction(originalSize, optimizedSize)
  const saved = originalSize - optimizedSize

  return (
    <div className="grid grid-cols-1 divide-y divide-border rounded-lg border bg-card sm:grid-cols-3 sm:divide-x sm:divide-y-0">
      <div className="space-y-1 p-4">
        <p className="text-xs font-medium text-muted-foreground">Original</p>
        <p className="text-lg font-semibold tabular-nums">{formatBytes(originalSize)}</p>
      </div>
      <div className="space-y-1 p-4">
        <p className="text-xs font-medium text-muted-foreground">Optimized</p>
        <p className={cn('text-lg font-semibold tabular-nums', animated && 'animate-fade-in')}>
          {formatBytes(optimizedSize)}
        </p>
      </div>
      <div className="space-y-1 p-4">
        <p className="text-xs font-medium text-muted-foreground">Saved</p>
        <p
          className={cn(
            'text-lg font-semibold tabular-nums text-green-600 dark:text-green-500',
            animated && 'animate-fade-in'
          )}
        >
          {formatBytes(saved)} ({reduction}%)
        </p>
      </div>
    </div>
  )
}
