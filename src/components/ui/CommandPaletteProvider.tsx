'use client'

import { createContext, useContext, useState, useEffect, useCallback, lazy, Suspense } from 'react'

// Lazy load the (heavy) CommandPalette component so it stays out of the initial bundle
// until the palette is actually opened.
const CommandPalette = lazy(() =>
  import('@/components/ui/CommandPalette').then(mod => ({ default: mod.CommandPalette }))
)

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

  return (
    <CommandPaletteContext.Provider value={{ isOpen, open, close, toggle }}>
      {children}
      {isOpen && (
        <Suspense fallback={<div className="fixed inset-0 z-50 bg-[var(--overlay)]" />}>
          <CommandPalette isOpen={isOpen} onClose={close} />
        </Suspense>
      )}
    </CommandPaletteContext.Provider>
  )
}
