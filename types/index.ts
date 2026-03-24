export type PresetType = 'max-compression' | 'balanced' | 'quality'

export interface OptimizationSettings {
  precision: number
  removeComments: boolean
  removeMetadata: boolean
  minifyIds: boolean
  mergePaths: boolean
  removeTitle: boolean
  removeDesc: boolean
  preserveViewBox: boolean
  collapseGroups: boolean
  convertToPath: boolean
}

export interface UploadedFile {
  id: string
  file: File
  originalSvg: string
  optimizedSvg: string | null
  originalSize: number
  optimizedSize: number | null
  status: 'pending' | 'optimizing' | 'done' | 'error'
  error?: string
}

