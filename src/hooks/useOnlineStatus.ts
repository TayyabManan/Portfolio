'use client'

import { useState, useEffect } from 'react'

/**
 * Tracks the browser's online/offline status.
 *
 * Initializes to `true` (assume online) so the server render and first client
 * render agree — this avoids a false "offline" flash and a hydration mismatch.
 * The real value is read from `navigator.onLine` on mount, and kept in sync via
 * the `online`/`offline` window events.
 */
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    setIsOnline(navigator.onLine)

    const goOnline = () => setIsOnline(true)
    const goOffline = () => setIsOnline(false)

    window.addEventListener('online', goOnline)
    window.addEventListener('offline', goOffline)

    return () => {
      window.removeEventListener('online', goOnline)
      window.removeEventListener('offline', goOffline)
    }
  }, [])

  return isOnline
}
