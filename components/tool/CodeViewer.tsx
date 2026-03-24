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
    <div className="relative">
      <pre className="max-h-[300px] overflow-auto rounded-lg border bg-muted/50 p-4 text-xs">
        <code className="break-all">{code}</code>
      </pre>
      <Button
        variant="secondary"
        size="sm"
        className="absolute right-2 top-2"
        onClick={handleCopy}
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-600" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </Button>
    </div>
  )
}
