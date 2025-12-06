'use client'

import React, { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch() {
    // Error already captured in state via getDerivedStateFromError
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
            <div className="text-center p-8">
              <h2 className="text-2xl font-bold text-[var(--text)] mb-4">
                Something went wrong
              </h2>
              <p className="text-[var(--text-secondary)] mb-6">
                We apologize for the inconvenience. Please try refreshing the page.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="bg-[var(--primary)] text-white px-6 py-3 rounded-lg hover:bg-[var(--primary-hover)] transition-colors"
              >
                Refresh Page
              </button>
            </div>
          </div>
        )
      )
    }

    return this.props.children
  }
}