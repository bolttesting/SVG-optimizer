'use client'

import { useCallback, useEffect, useState } from 'react'
import { saveAs } from 'file-saver'
import { ImageDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  canvasSupportsWebp,
  getSvgIntrinsicSize,
  rasterFileName,
  rasterizeSvgToBlob,
  type RasterFormat,
} from '@/lib/svg-to-raster'
import { cn } from '@/lib/utils'

interface RasterExportPanelProps {
  svg: string | null
  baseFileName: string
  disabled?: boolean
  /** Strip at bottom of a parent card (border-top only). */
  embedded?: boolean
  /** Full card directly under the live preview — wider layout, no clipping. */
  placement?: 'belowPreview'
}

const SCALE_PRESETS = [1, 2, 3, 4] as const

export function RasterExportPanel({ svg, baseFileName, disabled, embedded, placement }: RasterExportPanelProps) {
  const [format, setFormat] = useState<RasterFormat>('png')
  const [scale, setScale] = useState(2)
  const [whiteBackground, setWhiteBackground] = useState(false)
  const [webpOk, setWebpOk] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [intrinsic, setIntrinsic] = useState<{ w: number; h: number } | null>(null)

  useEffect(() => {
    setWebpOk(canvasSupportsWebp())
  }, [])

  useEffect(() => {
    if (!svg) {
      setIntrinsic(null)
      return
    }
    try {
      const { width, height } = getSvgIntrinsicSize(svg)
      setIntrinsic({ w: Math.round(width), h: Math.round(height) })
    } catch {
      setIntrinsic(null)
    }
  }, [svg])

  useEffect(() => {
    if (format === 'webp' && !webpOk) setFormat('png')
  }, [format, webpOk])

  const exportRaster = useCallback(async () => {
    if (!svg || disabled || busy) return
    setError(null)
    setBusy(true)
    try {
      const blob = await rasterizeSvgToBlob(svg, {
        format,
        scale,
        webpQuality: 0.92,
        whiteBackground,
      })
      const name = rasterFileName(baseFileName, blob.type === 'image/webp' ? 'webp' : 'png')
      saveAs(blob, name)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Export failed.')
    } finally {
      setBusy(false)
    }
  }, [svg, disabled, busy, format, scale, whiteBackground, baseFileName])

  if (!svg) return null

  const outW = intrinsic ? Math.round(intrinsic.w * scale) : null
  const outH = intrinsic ? Math.round(intrinsic.h * scale) : null

  const isStrip = embedded === true && placement !== 'belowPreview'
  const shell = isStrip
    ? 'border-t border-border/80 bg-muted/10 px-3 py-3 sm:px-4 sm:py-4 dark:bg-muted/5'
    : 'rounded-2xl border border-border/80 bg-card/60 p-4 shadow-sm backdrop-blur-sm dark:bg-card/40 sm:p-5'

  return (
    <div className={cn(shell, 'min-w-0')}>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-2">
          <ImageDown className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-foreground">Raster export</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              PNG or WebP in your browser—no upload. Transparent by default.
            </p>
          </div>
        </div>
        <details className="shrink-0 text-xs text-muted-foreground">
          <summary className="cursor-pointer select-none font-medium text-primary hover:underline">
            Notes
          </summary>
          <p className="mt-2 max-w-sm leading-relaxed">
            Use white background for social or print. External images inside the SVG may not render in every
            browser.
          </p>
        </details>
      </div>

      {/* Row 1: format + scale + white bg — avoid squashed lg:12-col grid */}
      <div className="flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:items-end">
        <div className="w-full shrink-0 space-y-1.5 lg:w-[10rem] xl:w-[11rem]">
          <Label
            htmlFor="raster-format"
            className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground"
          >
            Format
          </Label>
          <select
            id="raster-format"
            className={cn(
              'h-11 w-full min-w-0 rounded-lg border border-input bg-background px-3 pr-9 text-sm',
              'ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              'disabled:cursor-not-allowed disabled:opacity-50'
            )}
            value={format}
            disabled={disabled || busy}
            onChange={(e) => setFormat(e.target.value as RasterFormat)}
          >
            <option value="png">PNG</option>
            <option value="webp" disabled={!webpOk}>
              WebP {!webpOk ? '(unsupported)' : ''}
            </option>
          </select>
        </div>

        <div className="min-w-0 flex-1 space-y-1.5 lg:min-w-[12rem]">
          <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Scale</Label>
          <div className="flex flex-wrap gap-2">
            {SCALE_PRESETS.map((s) => (
              <button
                key={s}
                type="button"
                disabled={disabled || busy}
                onClick={() => setScale(s)}
                className={cn(
                  'min-h-11 min-w-[3rem] rounded-lg border px-4 text-sm font-semibold tabular-nums transition-colors',
                  scale === s
                    ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                    : 'border-border/80 bg-background hover:bg-muted/60'
                )}
              >
                {s}×
              </button>
            ))}
          </div>
          {intrinsic && outW && outH ? (
            <p className="text-[11px] leading-snug text-muted-foreground">
              <span className="tabular-nums text-foreground">{outW}</span> ×{' '}
              <span className="tabular-nums text-foreground">{outH}</span> px
              <span className="text-muted-foreground/80"> · intrinsic {intrinsic.w} × {intrinsic.h}</span>
            </p>
          ) : null}
        </div>

        <div className="flex w-full min-w-0 items-center justify-between gap-4 rounded-lg border border-border/60 bg-muted/20 px-4 py-3 sm:py-2.5 lg:w-auto lg:min-w-[12rem] xl:min-w-[13.5rem]">
          <Label htmlFor="raster-white-bg" className="cursor-pointer shrink-0 text-sm font-normal whitespace-nowrap">
            White background
          </Label>
          <Switch
            id="raster-white-bg"
            checked={whiteBackground}
            onCheckedChange={setWhiteBackground}
            disabled={disabled || busy}
            className="shrink-0"
          />
        </div>
      </div>

      <Button
        type="button"
        variant="secondary"
        className="mt-4 h-12 w-full px-4 text-sm font-semibold shadow-sm sm:text-base"
        disabled={disabled || busy}
        onClick={() => void exportRaster()}
      >
        <ImageDown className="mr-2 h-4 w-4 shrink-0 opacity-90" aria-hidden />
        <span className="truncate">{busy ? 'Exporting…' : `Download ${format.toUpperCase()}`}</span>
      </Button>

      {error ? <p className="mt-2 text-sm text-destructive">{error}</p> : null}
    </div>
  )
}
