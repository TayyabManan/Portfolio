'use client'

import Link from 'next/link'
import { HomeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'

export default function NotFound() {
  return (
    <div className="relative min-h-[100dvh] flex items-center justify-center bg-[var(--background)]">
      {/* Simple subtle background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--background)] via-[var(--background-secondary)] to-[var(--background)] opacity-50" />

      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-8">
          {/* Main content */}
          <div>
            <h1 className="text-8xl sm:text-9xl font-bold text-[var(--text)] mb-6">
              404
            </h1>
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text)] mb-4">
              Page Not Found
            </h2>
            <p className="text-lg sm:text-xl text-[var(--text-secondary)] mb-8">
              The page you&apos;re looking for doesn&apos;t exist or has been moved.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 bg-[var(--primary)] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[var(--primary-hover)] transition-colors"
            >
              <HomeIcon className="h-5 w-5" />
              Back to Home
            </Link>

            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center gap-2 bg-[var(--background-secondary)] text-[var(--text)] px-6 py-3 rounded-lg font-semibold hover:bg-[var(--background-tertiary)] transition-colors border border-[var(--border)]"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              Go Back
            </button>
          </div>

          {/* Quick links */}
          <div className="pt-8 border-t border-[var(--border)]">
            <p className="text-sm text-[var(--text-secondary)] mb-3">
              Quick links:
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              {[
                { name: 'Projects', href: '/projects' },
                { name: 'Blog', href: '/blog' },
                { name: 'About', href: '/about' },
                { name: 'Contact', href: '/contact' }
              ].map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-[var(--primary)] hover:text-[var(--primary-hover)] font-medium transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
