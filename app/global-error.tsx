'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          padding: 24,
          fontFamily: 'system-ui, sans-serif',
          background: '#ffffff',
          color: '#0f172a',
        }}
      >
        <h1 style={{ fontSize: '1.25rem', marginBottom: 8 }}>Application error</h1>
        <pre
          style={{
            fontSize: 13,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            marginBottom: 16,
            opacity: 0.85,
          }}
        >
          {error.message}
        </pre>
        <button
          type="button"
          onClick={() => reset()}
          style={{
            padding: '8px 16px',
            fontSize: 14,
            cursor: 'pointer',
            borderRadius: 8,
            border: '1px solid #cbd5e1',
            background: '#f8fafc',
          }}
        >
          Try again
        </button>
      </body>
    </html>
  )
}
