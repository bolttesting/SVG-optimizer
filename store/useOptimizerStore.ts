'use client'

import { create } from 'zustand'
import {
  DEFAULT_SETTINGS,
  PRESETS,
} from '@/lib/svgo/presets'
import type { OptimizationSettings, PresetType, UploadedFile } from '@/types'

interface OptimizerState {
  files: UploadedFile[]
  settings: OptimizationSettings
  viewMode: 'original' | 'optimized'
  selectedFileId: string | null

  setFiles: (files: UploadedFile[]) => void
  addFiles: (newFiles: UploadedFile[]) => void
  removeFile: (id: string) => void
  clearFiles: () => void
  updateFile: (id: string, updates: Partial<UploadedFile>) => void
  setSelectedFile: (id: string | null) => void

  setSettings: (settings: OptimizationSettings) => void
  resetSettings: () => void
  applyPreset: (preset: PresetType) => void

  setViewMode: (mode: 'original' | 'optimized') => void
}

export const useOptimizerStore = create<OptimizerState>((set) => ({
  files: [],
  settings: DEFAULT_SETTINGS,
  viewMode: 'optimized',
  selectedFileId: null,

  setFiles: (files) => set({ files, selectedFileId: files[0]?.id ?? null }),
  addFiles: (newFiles) =>
    set((state) => {
      const combined = [...state.files, ...newFiles]
      const selected = state.selectedFileId ?? combined[0]?.id ?? null
      return { files: combined, selectedFileId: selected }
    }),
  removeFile: (id) =>
    set((state) => {
      const files = state.files.filter((f) => f.id !== id)
      const selected =
        state.selectedFileId === id
          ? files[0]?.id ?? null
          : state.selectedFileId
      return { files, selectedFileId: selected }
    }),
  clearFiles: () => set({ files: [], selectedFileId: null }),
  updateFile: (id, updates) =>
    set((state) => ({
      files: state.files.map((f) =>
        f.id === id ? { ...f, ...updates } : f
      ),
    })),

  setSelectedFile: (id) => set({ selectedFileId: id }),

  setSettings: (settings) => set({ settings }),
  resetSettings: () => set({ settings: DEFAULT_SETTINGS }),
  applyPreset: (preset) => set({ settings: PRESETS[preset] ?? DEFAULT_SETTINGS }),

  setViewMode: (viewMode) => set({ viewMode }),
}))
