'use client'

import { isChunkLoadError } from '@/lib/chunk-load-error'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const msg = error.message || ''
  const chunkStale = isChunkLoadError(msg)

  return (
    <div
      style={{
        padding: '2rem',
        maxWidth: 560,
        margin: '0 auto',
        fontFamily: 'system-ui, sans-serif',
        background: '#fafafa',
        color: '#0f172a',
      }}
    >
      <h1 style={{ fontSize: '1.25rem', marginBottom: 8 }}>Something went wrong</h1>
      {chunkStale && (
        <p style={{ fontSize: 14, lineHeight: 1.5, marginBottom: 12, opacity: 0.9 }}>
          This usually means the site was updated while this tab was open, so the browser asked for an
          old script that no longer exists. Do a <strong>full reload</strong> (Ctrl+Shift+R or
          Cmd+Shift+R) or use <strong>Reload page</strong> below.
        </p>
      )}
      <pre
        style={{
          fontSize: 13,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          marginBottom: 16,
          opacity: 0.85,
        }}
      >
        {msg}
      </pre>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {chunkStale && (
          <button
            type="button"
            onClick={() => window.location.reload()}
            style={{
              padding: '8px 16px',
              fontSize: 14,
              cursor: 'pointer',
              borderRadius: 8,
              border: '1px solid #2563eb',
              background: '#2563eb',
              color: '#fff',
            }}
          >
            Reload page
          </button>
        )}
        <button
          type="button"
          onClick={() => reset()}
          style={{
            padding: '8px 16px',
            fontSize: 14,
            cursor: 'pointer',
            borderRadius: 8,
            border: '1px solid #cbd5e1',
            background: '#fff',
          }}
        >
          Try again
        </button>
      </div>
    </div>
  )
}
