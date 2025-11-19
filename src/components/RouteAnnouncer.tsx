'use client'

import { useEffect, useRef } from 'react'

/**
 * RouteAnnouncer - Phase 2 Accessibility Improvement
 * Announces page transitions to screen readers using ARIA live regions
 * Uses browser APIs to avoid Next.js navigation hook issues
 */
export default function RouteAnnouncer() {
  const announcerRef = useRef<HTMLDivElement>(null)
  const previousUrl = useRef<string>('')

  useEffect(() => {
    if (typeof window === 'undefined') return

    const announcePageChange = (pathname: string) => {
      if (!announcerRef.current) return

      // Extract page name from pathname
      const pageName = pathname === '/'
        ? 'Home page'
        : pathname
            .split('/')
            .filter(Boolean)
            .map(segment =>
              segment
                .split('-')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ')
            )
            .join(' - ') + ' page'

      // Announce the navigation
      announcerRef.current.textContent = `Navigated to ${pageName}`

      // Clear the announcement after a delay
      setTimeout(() => {
        if (announcerRef.current) {
          announcerRef.current.textContent = ''
        }
      }, 1000)
    }

    // Check for route changes
    const checkRouteChange = () => {
      const currentUrl = window.location.pathname
      if (currentUrl !== previousUrl.current) {
        previousUrl.current = currentUrl
        announcePageChange(currentUrl)
      }
    }

    // Initial check
    checkRouteChange()

    // Set up multiple listeners for route changes
    // 1. Listen for popstate events (browser back/forward)
    const handlePopstate = () => {
      checkRouteChange()
    }
    window.addEventListener('popstate', handlePopstate)

    // 2. Override pushState and replaceState to detect programmatic navigation
    const originalPushState = window.history.pushState
    const originalReplaceState = window.history.replaceState

    window.history.pushState = function (...args) {
      originalPushState.apply(window.history, args)
      setTimeout(checkRouteChange, 0)
    }

    window.history.replaceState = function (...args) {
      originalReplaceState.apply(window.history, args)
      setTimeout(checkRouteChange, 0)
    }

    // 3. Use MutationObserver as additional fallback
    const observer = new MutationObserver(() => {
      checkRouteChange()
    })

    // Observe changes to the document
    observer.observe(document.body, {
      childList: true,
      subtree: true
    })

    // Cleanup
    return () => {
      window.removeEventListener('popstate', handlePopstate)
      window.history.pushState = originalPushState
      window.history.replaceState = originalReplaceState
      observer.disconnect()
    }
  }, [])

  return (
    <div
      ref={announcerRef}
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
      aria-label="Page navigation announcement"
    />
  )
}