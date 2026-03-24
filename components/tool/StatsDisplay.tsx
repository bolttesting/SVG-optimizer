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
    <div className="flex flex-wrap items-center gap-4 rounded-lg border bg-card p-4">
      <div className="space-y-1">
        <p className="text-xs font-medium text-muted-foreground">Original</p>
        <p className="text-lg font-semibold">{formatBytes(originalSize)}</p>
      </div>
      <div className="h-10 w-px bg-border" />
      <div className="space-y-1">
        <p className="text-xs font-medium text-muted-foreground">Optimized</p>
        <p className={cn('text-lg font-semibold', animated && 'animate-fade-in')}>
          {formatBytes(optimizedSize)}
        </p>
      </div>
      <div className="h-10 w-px bg-border" />
      <div className="space-y-1">
        <p className="text-xs font-medium text-muted-foreground">Saved</p>
        <p
          className={cn(
            'text-lg font-semibold text-green-600 dark:text-green-500',
            animated && 'animate-fade-in'
          )}
        >
          {formatBytes(saved)} ({reduction}%)
        </p>
      </div>
    </div>
  )
}
