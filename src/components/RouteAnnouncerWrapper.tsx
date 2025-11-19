'use client'

import dynamic from 'next/dynamic'

// Dynamically import RouteAnnouncer with no SSR to avoid hydration issues
const RouteAnnouncer = dynamic(
  () => import('./RouteAnnouncer'),
  {
    ssr: false,
    loading: () => <div className="sr-only" aria-hidden="true" />
  }
)

export default function RouteAnnouncerWrapper() {
  return <RouteAnnouncer />
}