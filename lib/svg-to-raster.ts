/** Client-side SVG → PNG/WebP via canvas (no server upload). */

const MAX_OUTPUT_EDGE = 8192

export type RasterFormat = 'png' | 'webp'

export interface SvgRasterSize {
  width: number
  height: number
}

function clampDimension(n: number): number {
  if (!Number.isFinite(n) || n < 1) return 1
  return Math.min(Math.round(n), MAX_OUTPUT_EDGE)
}

/**
 * Intrinsic size from viewBox (preferred) and/or width/height attributes.
 */
export function getSvgIntrinsicSize(svgText: string): SvgRasterSize {
  const doc = new DOMParser().parseFromString(svgText, 'image/svg+xml')
  const svg = doc.documentElement
  if (!svg || svg.nodeName.toLowerCase() !== 'svg') {
    throw new Error('Invalid SVG document')
  }

  let vw = 0
  let vh = 0
  const vb = svg.getAttribute('viewBox')
  if (vb) {
    const parts = vb.trim().split(/[\s,]+/)
    if (parts.length >= 4) {
      vw = parseFloat(parts[2]!)
      vh = parseFloat(parts[3]!)
    }
  }

  const parseLen = (attr: string | null): number => {
    if (!attr) return 0
    const t = attr.trim()
    if (t.endsWith('%')) return 0
    const n = parseFloat(t)
    return Number.isFinite(n) && n > 0 ? n : 0
  }

  const wAttr = parseLen(svg.getAttribute('width'))
  const hAttr = parseLen(svg.getAttribute('height'))

  let width = vw > 0 ? vw : wAttr
  let height = vh > 0 ? vh : hAttr

  if (width <= 0 && height <= 0) {
    width = 512
    height = 512
  } else if (width <= 0 && height > 0 && vw > 0 && vh > 0) {
    width = (height * vw) / vh
  } else if (height <= 0 && width > 0 && vw > 0 && vh > 0) {
    height = (width * vh) / vw
  } else if (width <= 0) width = height
  else if (height <= 0) height = width

  return {
    width: Math.max(1, width),
    height: Math.max(1, height),
  }
}

function prepareSvgForRaster(
  svgText: string,
  outW: number,
  outH: number,
  intrinsic: SvgRasterSize
): string {
  const doc = new DOMParser().parseFromString(svgText, 'image/svg+xml')
  const svg = doc.documentElement
  if (!svg || svg.nodeName.toLowerCase() !== 'svg') {
    throw new Error('Invalid SVG document')
  }

  if (!svg.getAttribute('xmlns')) {
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
  }

  if (!svg.getAttribute('viewBox')) {
    svg.setAttribute('viewBox', `0 0 ${intrinsic.width} ${intrinsic.height}`)
  }

  svg.setAttribute('width', String(outW))
  svg.setAttribute('height', String(outH))

  return new XMLSerializer().serializeToString(svg)
}

function loadSvgAsImage(svgMarkup: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const blob = new Blob([svgMarkup], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Could not load SVG for raster export (invalid or unsupported SVG).'))
    }
    img.decoding = 'async'
    img.src = url
  })
}

function canvasToBlob(canvas: HTMLCanvasElement, format: RasterFormat, webpQuality: number): Promise<Blob> {
  const mime = format === 'webp' ? 'image/webp' : 'image/png'
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob)
        else reject(new Error(format === 'webp' ? 'WebP export is not supported in this browser.' : 'PNG export failed.'))
      },
      mime,
      format === 'webp' ? webpQuality : undefined
    )
  })
}

export function canvasSupportsWebp(): boolean {
  if (typeof document === 'undefined') return false
  try {
    const c = document.createElement('canvas')
    c.width = 1
    c.height = 1
    return c.toDataURL('image/webp').startsWith('data:image/webp')
  } catch {
    return false
  }
}

export interface RasterizeOptions {
  format: RasterFormat
  /** Multiply intrinsic width/height (e.g. 2 for “2×”). */
  scale: number
  /** WebP quality 0–1 (ignored for PNG). */
  webpQuality?: number
  /** Fill canvas with white before drawing (opaque JPEG-like result; default transparent). */
  whiteBackground?: boolean
}

/**
 * Rasterize SVG string to PNG or WebP blob. Runs entirely in the browser.
 */
export async function rasterizeSvgToBlob(svgText: string, options: RasterizeOptions): Promise<Blob> {
  const { format, scale, whiteBackground = false } = options
  const q = options.webpQuality ?? 0.92

  if (scale <= 0 || !Number.isFinite(scale)) {
    throw new Error('Scale must be a positive number.')
  }

  const intrinsic = getSvgIntrinsicSize(svgText)
  let outW = clampDimension(intrinsic.width * scale)
  let outH = clampDimension(intrinsic.height * scale)

  const maxEdge = Math.max(outW, outH)
  if (maxEdge > MAX_OUTPUT_EDGE) {
    const f = MAX_OUTPUT_EDGE / maxEdge
    outW = clampDimension(outW * f)
    outH = clampDimension(outH * f)
  }

  const prepared = prepareSvgForRaster(svgText, outW, outH, intrinsic)
  const img = await loadSvgAsImage(prepared)

  const canvas = document.createElement('canvas')
  canvas.width = outW
  canvas.height = outH
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas is not available.')

  if (whiteBackground) {
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, outW, outH)
  } else {
    ctx.clearRect(0, 0, outW, outH)
  }
  try {
    ctx.drawImage(img, 0, 0, outW, outH)
  } catch (e) {
    if (e instanceof DOMException && e.name === 'SecurityError') {
      throw new Error(
        'This SVG cannot be rasterized (the browser blocked drawing—often due to external images or embedded scripts).'
      )
    }
    throw e
  }

  try {
    return await canvasToBlob(canvas, format, q)
  } catch (e) {
    if (format === 'webp') {
      return await canvasToBlob(canvas, 'png', q)
    }
    if (e instanceof DOMException && e.name === 'SecurityError') {
      throw new Error(
        'This SVG cannot be exported (the canvas was blocked—often due to external images in the file).'
      )
    }
    throw e
  }
}

export function rasterFileName(baseName: string, format: RasterFormat): string {
  const stem = baseName.replace(/\.svg$/i, '') || 'export'
  const ext = format === 'webp' ? 'webp' : 'png'
  return `${stem}.${ext}`
}
