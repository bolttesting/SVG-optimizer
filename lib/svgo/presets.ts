import type { OptimizationSettings } from '@/types'

export const DEFAULT_SETTINGS: OptimizationSettings = {
  precision: 2,
  removeComments: true,
  removeMetadata: true,
  minifyIds: true,
  mergePaths: true,
  removeTitle: true,
  removeDesc: true,
  preserveViewBox: true,
  collapseGroups: true,
  convertToPath: true,
}

export const PRESETS: Record<string, OptimizationSettings> = {
  'max-compression': {
    precision: 0,
    removeComments: true,
    removeMetadata: true,
    minifyIds: true,
    mergePaths: true,
    removeTitle: true,
    removeDesc: true,
    preserveViewBox: true,
    collapseGroups: true,
    convertToPath: true,
  },
  balanced: {
    precision: 2,
    removeComments: true,
    removeMetadata: true,
    minifyIds: true,
    mergePaths: true,
    removeTitle: true,
    removeDesc: true,
    preserveViewBox: true,
    collapseGroups: true,
    convertToPath: true,
  },
  quality: {
    precision: 5,
    removeComments: true,
    removeMetadata: false,
    minifyIds: false,
    mergePaths: false,
    removeTitle: false,
    removeDesc: false,
    preserveViewBox: true,
    collapseGroups: false,
    convertToPath: false,
  },
}
