'use client'

import { createContext, useContext, useState, useEffect, useCallback, lazy, Suspense } from 'react'

// Single source for the dynamic import so the lazy component and the preloader
// resolve the exact same chunk.
const importCommandPalette = () => import('@/components/ui/CommandPalette')

// Lazy load the (heavy) CommandPalette component so it stays out of the initial
// bundle until the palette is actually opened.
const CommandPalette = lazy(() =>
  importCommandPalette().then(mod => ({ default: mod.CommandPalette }))
)

// Warm the CommandPalette chunk ahead of first use so the first open is instant.
// Idempotent: the browser/bundler dedupes, and this guard avoids repeat calls.
let hasPreloaded = false
export function preloadCommandPalette() {
  if (hasPreloaded) return
  hasPreloaded = true
  importCommandPalette()
}

interface CommandPaletteContextValue {
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
}

const CommandPaletteContext = createContext<CommandPaletteContextValue>({
  isOpen: false,
  open: () => {},
  close: () => {},
  toggle: () => {},
})

export function useCommandPalette() {
  return useContext(CommandPaletteContext)
}

// Lightweight placeholder shown while the palette chunk loads. Mirrors the real
// palette's position and panel so the swap is seamless instead of a blank flash.
function CommandPaletteSkeleton() {
  return (
    <div className="fixed inset-0 z-[120]" aria-hidden="true">
      <div className="absolute inset-0 bg-[var(--overlay)] backdrop-blur-sm" />
      <div className="fixed inset-0 z-10 overflow-y-auto p-4 sm:p-6 md:p-20">
        <div className="mx-auto max-w-2xl divide-y divide-[var(--border)] overflow-hidden rounded-xl bg-[var(--background)] shadow-2xl ring-1 ring-[var(--border)]">
          <div className="flex items-center gap-3 px-4 py-4">
            <div className="h-5 w-5 rounded bg-[var(--background-tertiary)] animate-pulse" />
            <div className="h-4 w-44 rounded bg-[var(--background-tertiary)] animate-pulse" />
          </div>
          <div className="p-2 space-y-1">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-3 px-3 py-2.5">
                <div className="h-9 w-9 rounded-lg bg-[var(--background-secondary)] animate-pulse" />
                <div
                  className="h-3.5 rounded bg-[var(--background-secondary)] animate-pulse"
                  style={{ width: `${42 - i * 5}%` }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function CommandPaletteProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  const open = useCallback(() => {
    setIsOpen(true)
    localStorage.setItem('command-palette-used', 'true')
  }, [])
  const close = useCallback(() => setIsOpen(false), [])
  const toggle = useCallback(() => setIsOpen(prev => !prev), [])

  // Single global Cmd/Ctrl+K listener for the whole app.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        open()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open])

  // Preload the palette chunk once the page is idle, so the first open doesn't
  // pay the fetch/parse cost. Falls back to a short timeout where idle isn't available.
  useEffect(() => {
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void) => number
      cancelIdleCallback?: (id: number) => void
    }
    let idleId: number | undefined
    let timerId: ReturnType<typeof setTimeout> | undefined
    if (typeof w.requestIdleCallback === 'function') {
      idleId = w.requestIdleCallback(preloadCommandPalette)
    } else {
      timerId = setTimeout(preloadCommandPalette, 1500)
    }
    return () => {
      if (idleId !== undefined && typeof w.cancelIdleCallback === 'function') {
        w.cancelIdleCallback(idleId)
      }
      if (timerId !== undefined) clearTimeout(timerId)
    }
  }, [])

  return (
    <CommandPaletteContext.Provider value={{ isOpen, open, close, toggle }}>
      {children}
      {isOpen && (
        <Suspense fallback={<CommandPaletteSkeleton />}>
          <CommandPalette isOpen={isOpen} onClose={close} />
        </Suspense>
      )}
    </CommandPaletteContext.Provider>
  )
}
