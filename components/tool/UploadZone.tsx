'use client'

import { useCallback } from 'react'
import { useDropzone, type FileRejection, ErrorCode } from 'react-dropzone'
import { Upload, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const MAX_FILES = 20
const MAX_SIZE = 5 * 1024 * 1024 // 5MB

/** Prefer .svg extension; also allow known XML/SVG MIME types (some exports omit extension). */
function isSvgFile(file: File): boolean {
  if (/\.svg$/i.test(file.name)) return true
  const t = (file.type || '').toLowerCase()
  return t === 'image/svg+xml' || t === 'text/xml' || t === 'application/xml'
}

interface UploadZoneProps {
  onFilesAccepted: (files: File[]) => void
  onFileRejected?: (rejections: FileRejection[]) => void
  isProcessing: boolean
  maxFiles?: number
  maxSize?: number
  hasFiles?: boolean
  onClear?: () => void
}

export function UploadZone({
  onFilesAccepted,
  onFileRejected,
  isProcessing,
  maxFiles = MAX_FILES,
  maxSize = MAX_SIZE,
  hasFiles = false,
  onClear,
}: UploadZoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFilesAccepted(acceptedFiles)
      }
    },
    [onFilesAccepted]
  )

  const onDropRejected = useCallback(
    (rejections: FileRejection[]) => {
      onFileRejected?.(rejections)
    },
    [onFileRejected]
  )

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    onDropRejected,
    // Do not rely on MIME-only accept — Windows often reports wrong/empty types for SVG
    validator: (file) => {
      if (isSvgFile(file)) return null
      return {
        code: ErrorCode.FileInvalidType,
        message: 'Only SVG files (.svg) are supported',
      }
    },
    maxFiles,
    maxSize,
    disabled: isProcessing,
    multiple: true,
    useFsAccessApi: false,
  })

  return (
    <div className="space-y-3">
      <div
        {...getRootProps()}
        className={cn(
          'relative flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border/80 p-8 transition-colors',
          'hover:border-primary/40 hover:bg-primary/[0.03]',
          isDragActive && 'border-primary bg-primary/5',
          isProcessing && 'pointer-events-none opacity-60'
        )}
      >
        <input
          {...getInputProps({
            accept: '.svg,image/svg+xml,text/xml,application/xml',
          })}
        />
        <Upload className="mb-4 h-12 w-12 text-muted-foreground" strokeWidth={1.5} />
        <p className="mb-1 text-center text-sm font-medium">
          {isDragActive ? 'Drop SVG files here' : 'Drag & drop SVG files'}
        </p>
        <p className="mb-2 text-center text-xs text-muted-foreground">
          max {maxFiles} files • {maxSize / 1024 / 1024}MB each
        </p>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="pointer-events-auto touch-manipulation min-h-[44px] min-w-[44px]"
          disabled={isProcessing}
          onClick={(e) => {
            e.stopPropagation()
            open()
          }}
        >
          Browse SVG files
        </Button>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          Or click anywhere in this area
        </p>
      </div>
      {hasFiles && onClear && (
        <Button variant="outline" size="sm" onClick={onClear} className="w-full">
          <X className="mr-2 h-4 w-4" />
          Clear selection
        </Button>
      )}
    </div>
  )
}
