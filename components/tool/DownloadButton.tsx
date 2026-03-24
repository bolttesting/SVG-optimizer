'use client'

import { saveAs } from 'file-saver'
import JSZip from 'jszip'
import { Download } from 'lucide-react'
import { Button, type ButtonProps } from '@/components/ui/button'
import type { UploadedFile } from '@/types'

interface DownloadButtonProps {
  files: UploadedFile[]
  disabled?: boolean
  variant?: ButtonProps['variant']
  className?: string
}

export function DownloadButton({ files, disabled, variant = 'default', className }: DownloadButtonProps) {
  const optimizedFiles = files.filter((f) => f.optimizedSvg && f.status === 'done')

  const downloadSingle = (file: UploadedFile) => {
    if (!file.optimizedSvg) return
    const blob = new Blob([file.optimizedSvg], { type: 'image/svg+xml' })
    const name = file.file.name.replace(/\.svg$/i, '.optimized.svg') || 'optimized.svg'
    saveAs(blob, name)
  }

  const downloadAll = async () => {
    if (optimizedFiles.length === 0) return
    if (optimizedFiles.length === 1) {
      downloadSingle(optimizedFiles[0])
      return
    }

    const zip = new JSZip()
    optimizedFiles.forEach((file) => {
      if (file.optimizedSvg) {
        const name = file.file.name.replace(/\.svg$/i, '.optimized.svg') || 'optimized.svg'
        zip.file(name, file.optimizedSvg)
      }
    })

    const blob = await zip.generateAsync({ type: 'blob' })
    saveAs(blob, 'optimized-svgs.zip')
  }

  return (
    <Button
      variant={variant}
      onClick={downloadAll}
      disabled={disabled || optimizedFiles.length === 0}
      className={className ?? 'w-full sm:w-auto'}
    >
      <Download className="mr-2 h-4 w-4" />
      {optimizedFiles.length <= 1
        ? 'Download optimized'
        : `Download ${optimizedFiles.length} files (ZIP)`}
    </Button>
  )
}
