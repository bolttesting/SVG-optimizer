'use client'

import { formatBytes, calculateReduction } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface StatsDisplayProps {
  originalSize: number
  optimizedSize: number
  animated?: boolean
  /** Sit inside a parent card: no outer radius, bottom border only. */
  flush?: boolean
}

export function StatsDisplay({ originalSize, optimizedSize, animated = true, flush }: StatsDisplayProps) {
  const reduction = calculateReduction(originalSize, optimizedSize)
  const saved = originalSize - optimizedSize

  return (
    <div
      className={cn(
        'grid grid-cols-1 divide-y divide-border bg-card sm:grid-cols-3 sm:divide-x sm:divide-y-0',
        flush
          ? 'rounded-none border-0 border-b border-border/80 bg-muted/15 dark:bg-muted/10'
          : 'rounded-lg border'
      )}
    >
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
