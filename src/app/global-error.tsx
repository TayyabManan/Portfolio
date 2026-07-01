'use client'

import { useEffect } from 'react'

/**
 * Catches errors thrown by the root layout itself (which the route-level
 * `error.tsx` cannot catch). When it renders it REPLACES the root layout, so it
 * must render its own <html>/<body> and cannot rely on globals.css or the theme
 * CSS variables being applied — hence the self-contained inline styles.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Global error:', error)
  }, [error])

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100dvh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          textAlign: 'center',
          fontFamily:
            'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
          background: '#fafaf9',
          color: '#1c1917',
        }}
      >
        <div style={{ maxWidth: '28rem' }}>
          <h1
            style={{
              fontSize: '3.75rem',
              fontWeight: 800,
              lineHeight: 1,
              margin: 0,
              color: '#a8a29e',
            }}
          >
            500
          </h1>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '1rem 0 0.5rem' }}>
            Something went wrong
          </h2>
          <p style={{ color: '#57534e', margin: '0 0 2rem' }}>
            A critical error occurred while loading the page. Try again, or head back home.
          </p>
          <div
            style={{
              display: 'flex',
              gap: '0.75rem',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <button
              onClick={() => reset()}
              style={{
                cursor: 'pointer',
                background: '#3568d4',
                color: '#ffffff',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                fontWeight: 500,
                fontSize: '1rem',
              }}
            >
              Try again
            </button>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- global-error replaces the root layout; a hard navigation fully resets the crashed app, which Link's client-side nav would not */}
            <a
              href="/"
              style={{
                display: 'inline-block',
                border: '1px solid #d6d3d1',
                color: '#1c1917',
                textDecoration: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                fontWeight: 500,
                fontSize: '1rem',
              }}
            >
              Go home
            </a>
          </div>
        </div>
      </body>
    </html>
  )
}
