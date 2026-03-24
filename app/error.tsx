'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
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
          background: '#fff',
        }}
      >
        Try again
      </button>
    </div>
  )
}
