'use client'

import { WifiIcon } from '@heroicons/react/24/outline'
import { useOnlineStatus } from '@/hooks/useOnlineStatus'

/**
 * A subtle, fixed banner shown only while the browser reports being offline.
 * Uses the warning token family and is announced politely to screen readers.
 */
export default function OfflineBanner() {
  const isOnline = useOnlineStatus()

  if (isOnline) return null

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-0 left-0 right-0 z-[110] flex items-center justify-center gap-2 px-4 py-3 text-sm border-t bg-[var(--warning)]/10 border-[var(--warning)]/30 text-[var(--text)] backdrop-blur"
    >
      <WifiIcon className="h-4 w-4 flex-shrink-0 text-[var(--warning)]" />
      <span>You&apos;re offline. Some features may not work until your connection returns.</span>
    </div>
  )
}
