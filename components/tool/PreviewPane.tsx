'use client'

import { useMemo } from 'react'
import { cn } from '@/lib/utils'

interface PreviewPaneProps {
  originalSvg: string | null
  optimizedSvg: string | null
  originalSize: number | null
  optimizedSize: number | null
  fileName: string
  isOptimizing: boolean
  viewMode: 'original' | 'optimized'
  onToggleView: (view: 'original' | 'optimized') => void
  formatBytes: (bytes: number) => string
}

export function PreviewPane({
  originalSvg,
  optimizedSvg,
  originalSize,
  optimizedSize,
  fileName,
  isOptimizing,
  viewMode,
  onToggleView,
  formatBytes,
}: PreviewPaneProps) {
  const displaySvg = viewMode === 'original' ? originalSvg : optimizedSvg ?? originalSvg
  const displaySize = viewMode === 'original' ? originalSize : optimizedSize ?? originalSize

  const svgContent = useMemo(() => {
    if (!displaySvg) return null
    try {
      return (
        <div
          className="flex min-h-[200px] items-center justify-center p-4"
          dangerouslySetInnerHTML={{ __html: displaySvg }}
        />
      )
    } catch {
      return (
        <div className="flex min-h-[200px] items-center justify-center p-4 text-muted-foreground">
          Invalid or malformed SVG
        </div>
      )
    }
  }, [displaySvg])

  if (!originalSvg && !optimizedSvg) {
    return (
      <div className="flex min-h-[280px] flex-col items-center justify-center rounded-lg border border-dashed bg-muted/30 p-8">
        <p className="text-sm text-muted-foreground">Upload an SVG to preview</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onToggleView('original')}
          className={cn(
            'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
            viewMode === 'original'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          )}
        >
          Original
        </button>
        <button
          type="button"
          onClick={() => onToggleView('optimized')}
          disabled={!optimizedSvg || isOptimizing}
          className={cn(
            'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
            viewMode === 'optimized'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground hover:bg-muted/80 disabled:opacity-50'
          )}
        >
          Optimized
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border bg-card">
        <div className="overflow-auto [&_svg]:max-h-[400px] [&_svg]:w-full [&_svg]:object-contain">
          {isOptimizing && viewMode === 'optimized' ? (
            <div className="flex min-h-[200px] items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : (
            svgContent
          )}
        </div>
        <div className="border-t px-4 py-2 text-xs text-muted-foreground">
          {fileName}
          {displaySize != null && ` • ${formatBytes(displaySize)}`}
        </div>
      </div>
    </div>
  )
}
