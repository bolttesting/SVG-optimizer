import { NextResponse } from 'next/server'
import { optimize } from 'svgo'
import { getSvgoConfig } from '@/lib/svgo/config'
import { DEFAULT_SETTINGS } from '@/lib/svgo/presets'
import type { OptimizationSettings } from '@/types'

export async function POST(request: Request) {
  try {
    const { svg, settings } = (await request.json()) as {
      svg: string
      settings: OptimizationSettings
    }

    if (!svg || typeof svg !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Invalid SVG data' },
        { status: 400 }
      )
    }

    const fullSettings: OptimizationSettings = { ...DEFAULT_SETTINGS, ...settings }
    const config = getSvgoConfig(fullSettings)
    const result = optimize(svg, config)
    const originalSize = new Blob([svg]).size
    const optimizedSize = new Blob([result.data]).size

    return NextResponse.json({
      success: true,
      optimized: result.data,
      originalSize,
      optimizedSize,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Optimization failed'
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}
