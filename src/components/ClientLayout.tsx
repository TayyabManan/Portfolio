'use client'

import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Toaster } from '@/components/ui/Toast'
import OfflineBanner from '@/components/ui/OfflineBanner'
import { CommandPaletteProvider } from '@/components/ui/CommandPaletteProvider'
import { useGlobalKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { useSkipToContent } from '@/hooks/useFocusManagement'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  useGlobalKeyboardShortcuts()
  useSkipToContent()

  return (
    <CommandPaletteProvider>
      <div className="bg-[var(--background)] min-h-[100dvh] transition-colors">
        <Header />
        <main id="main-content" className="min-h-[100dvh] focus:outline-none">
          {children}
        </main>
        <Footer />
      </div>
      <Toaster />
      <OfflineBanner />
    </CommandPaletteProvider>
  )
}
