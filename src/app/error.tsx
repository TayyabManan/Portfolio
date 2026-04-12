'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { ArrowPathIcon, HomeIcon } from '@heroicons/react/24/outline'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[var(--background)]">
      <div className="max-w-md mx-auto px-4 text-center">
        <h1 className="text-6xl font-bold text-[var(--text-tertiary)] mb-4">500</h1>
        <h2 className="text-2xl font-bold text-[var(--text)] mb-3">
          Something went wrong
        </h2>
        <p className="text-[var(--text-secondary)] mb-8">
          Something went wrong. Try again or head back home.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 bg-[var(--primary)] text-white px-6 py-3 rounded-lg font-medium hover:bg-[var(--primary-hover)] transition-colors"
          >
            <ArrowPathIcon className="h-5 w-5" />
            Try Again
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 border border-[var(--border)] text-[var(--text)] px-6 py-3 rounded-lg font-medium hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors"
          >
            <HomeIcon className="h-5 w-5" />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  )
}
