'use client'

import { lazy, Suspense } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Toaster } from '@/components/ui/Toast'
import { useCommandPalette } from '@/components/ui/CommandPalette'
import { useGlobalKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { useSkipToContent } from '@/hooks/useFocusManagement'

// Lazy load the CommandPalette component for better performance
const CommandPalette = lazy(() => import('@/components/ui/CommandPalette').then(mod => ({ default: mod.CommandPalette })))

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { isOpen, close } = useCommandPalette()
  useGlobalKeyboardShortcuts()
  useSkipToContent()

  return (
    <>
      <div className="bg-[var(--background)] min-h-screen transition-colors">
        <Header />
        <main id="main-content" className="min-h-screen pt-16 focus:outline-none">
          {children}
        </main>
        <Footer />
      </div>
      <Toaster />
      {isOpen && (
        <Suspense fallback={<div className="fixed inset-0 z-50 bg-black/50" />}>
          <CommandPalette isOpen={isOpen} onClose={close} />
        </Suspense>
      )}
    </>
  )
}