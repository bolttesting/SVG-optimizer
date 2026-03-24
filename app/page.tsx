'use client'

import { useCallback } from 'react'
import { useOptimizerStore } from '@/store/useOptimizerStore'
import { useOptimization } from '@/hooks/useOptimization'
import { formatBytes } from '@/lib/utils'
import { UploadZone } from '@/components/tool/UploadZone'
import { PreviewPane } from '@/components/tool/PreviewPane'
import { ControlsPanel } from '@/components/tool/ControlsPanel'
import { StatsDisplay } from '@/components/tool/StatsDisplay'
import { DownloadButton } from '@/components/tool/DownloadButton'
import { CodeViewer } from '@/components/tool/CodeViewer'

function generateId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

async function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsText(file)
  })
}

export default function HomePage() {
  const {
    files,
    settings,
    viewMode,
    selectedFileId,
    addFiles,
    clearFiles,
    updateFile,
    setSelectedFile,
    setSettings,
    resetSettings,
    applyPreset,
    setViewMode,
  } = useOptimizerStore()

  const { optimize } = useOptimization()

  const processFiles = useCallback(
    async (filesToProcess: File[]) => {
      const newFiles: typeof files = await Promise.all(
        filesToProcess.map(async (file) => {
          const id = generateId()
          const text = await readFileAsText(file).catch(() => '')
          return {
            id,
            file,
            originalSvg: text,
            optimizedSvg: null,
            originalSize: new Blob([text]).size,
            optimizedSize: null,
            status: 'pending' as const,
          }
        })
      )
      addFiles(newFiles)
    },
    [addFiles]
  )

  const runOptimization = useCallback(async () => {
    for (const f of files) {
      if (f.status === 'done' && f.optimizedSvg) continue
      updateFile(f.id, { status: 'optimizing' })
      const result = await optimize(f.originalSvg, settings)
      updateFile(f.id, {
        optimizedSvg: result.optimizedSvg,
        optimizedSize: result.optimizedSize,
        status: result.error ? 'error' : 'done',
        error: result.error,
      })
    }
  }, [files, settings, optimize, updateFile])


  const selectedFile = files.find((f) => f.id === selectedFileId) ?? files[0]
  const isProcessing = files.some((f) => f.status === 'optimizing')

  const hasOptimized = selectedFile?.optimizedSvg && selectedFile?.optimizedSize != null
  const showStats = hasOptimized && selectedFile?.originalSize != null

  return (
    <div className="min-h-screen">
      <section className="border-b border-border/60 py-14 md:py-20">
        <div className="container mx-auto max-w-3xl px-4 text-center">
          <div className="mb-4 inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            Privacy-first · No third-party uploads
          </div>
          <h1 className="mb-4 text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            {files.length > 0 ? 'Optimize your SVGs' : 'Free SVG Optimizer'}
          </h1>
          <p className="mx-auto max-w-xl text-lg text-muted-foreground">
            Shrink SVGs by up to 70% with live preview. Tune precision, presets, and batch export—
            <span className="text-foreground/90"> your files stay under your control.</span>
          </p>
        </div>
      </section>

      <section className="py-10 md:py-14">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="mx-auto max-w-xl space-y-6 lg:max-w-none lg:grid lg:grid-cols-12 lg:gap-8 lg:space-y-0">
            <div className="lg:col-span-4">
              <div className="rounded-2xl border border-border/80 bg-card/60 p-2 shadow-sm backdrop-blur-sm dark:bg-card/40">
                <UploadZone
                  onFilesAccepted={processFiles}
                  isProcessing={isProcessing}
                  hasFiles={files.length > 0}
                  onClear={clearFiles}
                />
              </div>
            </div>

            <div className="space-y-6 lg:col-span-5">
              {files.length > 1 && (
                <div className="flex flex-wrap gap-2">
                  {files.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setSelectedFile(f.id)}
                      className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-all ${
                        selectedFileId === f.id
                          ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                          : 'border-border/80 bg-muted/50 hover:border-primary/30 hover:bg-muted'
                      }`}
                    >
                      {f.file.name}
                    </button>
                  ))}
                </div>
              )}

              <div className="rounded-2xl border border-border/80 bg-card/60 p-4 shadow-sm backdrop-blur-sm dark:bg-card/40 sm:p-5">
              <PreviewPane
                originalSvg={selectedFile?.originalSvg ?? null}
                optimizedSvg={selectedFile?.optimizedSvg ?? null}
                originalSize={selectedFile?.originalSize ?? null}
                optimizedSize={selectedFile?.optimizedSize ?? null}
                fileName={selectedFile?.file.name ?? ''}
                isOptimizing={isProcessing}
                viewMode={viewMode}
                onToggleView={setViewMode}
                formatBytes={formatBytes}
              />
              </div>

              {showStats && (
                <StatsDisplay
                  originalSize={selectedFile!.originalSize}
                  optimizedSize={selectedFile!.optimizedSize!}
                />
              )}

              {files.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={runOptimization}
                    disabled={isProcessing}
                    className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-md transition hover:bg-primary/90 disabled:opacity-50"
                  >
                    {isProcessing ? 'Optimizing…' : 'Run optimization'}
                  </button>
                  <DownloadButton files={files} disabled={isProcessing} />
                </div>
              )}

              <div className="rounded-2xl border border-border/80 bg-muted/20 p-4 dark:bg-muted/10">
                <CodeViewer code={selectedFile?.optimizedSvg ?? selectedFile?.originalSvg ?? null} />
              </div>
            </div>

            <div className="lg:col-span-3 lg:sticky lg:top-20 lg:self-start">
              <ControlsPanel
                settings={settings}
                onSettingsChange={setSettings}
                onReset={resetSettings}
                onApplyPreset={applyPreset}
                isProcessing={isProcessing}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
