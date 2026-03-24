'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CodeViewerProps {
  code: string | null
  onCopy?: () => void
}

export function CodeViewer({ code, onCopy }: CodeViewerProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (!code) return
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      onCopy?.()
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Ignore
    }
  }

  if (!code) {
    return (
      <div className="rounded-lg border bg-muted/30 p-4 text-sm text-muted-foreground">
        Optimize an SVG to view its code
      </div>
    )
  }

  return (
    <div className="space-y-2 sm:relative sm:space-y-0">
      <div className="flex justify-end sm:absolute sm:right-2 sm:top-2 sm:z-10">
        <Button
          variant="secondary"
          size="sm"
          className="min-h-10 w-full sm:min-h-9 sm:w-auto"
          onClick={handleCopy}
          aria-label={copied ? 'Copied' : 'Copy code'}
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-600" aria-hidden />
          ) : (
            <Copy className="h-4 w-4" aria-hidden />
          )}
        </Button>
      </div>
      <pre className="max-h-[min(280px,50svh)] overflow-auto rounded-lg border bg-muted/50 p-3 text-[11px] leading-relaxed sm:max-h-[300px] sm:p-4 sm:pr-14 sm:text-xs">
        <code className="break-all">{code}</code>
      </pre>
    </div>
  )
}
