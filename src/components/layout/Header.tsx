'use client'

import { useState, useEffect, lazy, Suspense } from 'react'
import Link from 'next/link'
import { Bars3Icon, XMarkIcon, ChatBubbleLeftRightIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import Logo from '@/components/ui/Logo'
import { ThemeSelector } from '@/components/ui/ThemeSelector'
import { useCommandPalette } from '@/components/ui/CommandPalette'
import styles from '@/styles/Header.module.css'

// Lazy load the CommandPalette component for better performance
const CommandPalette = lazy(() => import('@/components/ui/CommandPalette').then(mod => ({ default: mod.CommandPalette })))

const navigationItems = [
  { name: 'Home', href: '/', shortcut: 'Alt+H' },
  { name: 'Projects', href: '/projects', shortcut: 'Alt+P' },
  { name: 'Blog', href: '/blog', shortcut: 'Alt+B' },
  { name: 'About', href: '/about', shortcut: 'Alt+A' },
  { name: 'Contact', href: '/contact', shortcut: 'Alt+C' },
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { isOpen, open: openCommandPalette, close: closeCommandPalette } = useCommandPalette()

  // Simplified scroll behavior - just track if scrolled past threshold
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 100
      if (scrolled !== isScrolled) {
        setIsScrolled(scrolled)
      }
    }

    // Use passive listener for better scroll performance
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Check initial state

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [isScrolled])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  return (
    <>
    <header
      className={`fixed top-0 left-0 right-0 z-[60] transition-colors duration-300 ${
        !isScrolled ? 'bg-[var(--background)] border-b border-[var(--border)] shadow-sm' : 'md:bg-transparent'
      }`}
    >
      <nav
        className={`mx-auto transition-all duration-300 ${
          isScrolled
            ? `${styles.navScrolled}`
            : 'px-4 sm:px-6 lg:px-8 max-w-7xl'
        }`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div
          className={`flex items-center justify-between transition-all duration-300 ${
            isScrolled
              ? `${styles.containerScrolled}`
              : 'h-16 px-4 sm:px-6'
          }`}
        >
          <div className="flex items-center">
            <Link href="/" className={`flex items-center gap-2 sm:gap-3 font-bold text-[var(--text)] transition-all duration-300 ${
              isScrolled ? 'mr-2 md:mr-3 lg:mr-6' : ''
            }`}>
              <Logo className={`text-[var(--primary)] transition-all duration-300 ${
                isScrolled ? 'w-5 h-5 md:w-5 md:h-5 lg:w-6 lg:h-6' : 'w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8'
              }`} />
              <span className={`whitespace-nowrap transition-all duration-300 ${
                isScrolled
                  ? 'text-sm md:text-sm lg:text-base'
                  : 'text-base md:text-lg lg:text-xl'
              }`}>Tayyab Manan</span>
            </Link>
          </div>

          <div className={`hidden md:flex items-center ${styles.navItemsContainer} md:space-x-2 lg:space-x-4`}>
            <div className={`flex items-center ${isScrolled ? 'md:space-x-1 lg:space-x-2' : 'md:space-x-2 lg:space-x-4'}`}>
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`font-medium transition-all duration-300 flex items-center relative group text-[var(--text-secondary)] hover:text-[var(--primary)] ${
                    isScrolled
                      ? `${styles.navItemScrolled} md:px-2 lg:px-3 py-1.5 md:text-xs lg:text-sm h-8`
                      : `${styles.navItem} md:px-3 lg:px-4 py-2 md:text-sm lg:text-base`
                  }`}
                >
                  {item.name}
                  <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-[var(--background-tertiary)] text-[var(--text)] text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 border border-[var(--border)]">
                    {item.shortcut}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 border-4 border-transparent" style={{ borderBottomColor: 'var(--background-tertiary)' }}></div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Command Palette Search Button - Phase 2 improvement */}
            <button
              onClick={openCommandPalette}
              type="button"
              className="relative hidden lg:block p-1.5 lg:p-2 text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors group"
              aria-label="Open command palette (Ctrl/Cmd + K)"
            >
              <MagnifyingGlassIcon className="h-5 w-5 lg:h-6 lg:w-6" />
              <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-[var(--background-tertiary)] text-[var(--text)] text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 border border-[var(--border)]">
                Search ⌘K
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 border-4 border-transparent" style={{ borderBottomColor: 'var(--background-tertiary)' }}></div>
              </div>
            </button>

            {/* Enhanced Theme Selector with dropdown */}
            <ThemeSelector isCompact={isScrolled} />
            
            <Link
              href="/resume"
              className={`relative bg-[var(--primary)] text-white font-medium hover:bg-[var(--primary-hover)] transition-all duration-300 flex items-center group ${
                isScrolled
                  ? `${styles.resumeButtonScrolled} md:px-3 lg:px-4 py-1.5 rounded-full md:text-xs lg:text-sm h-8`
                  : `${styles.resumeButton} md:px-4 lg:px-5 py-2.5 rounded-lg md:text-sm lg:text-base`
              }`}
            >
              <span className="flex items-center md:gap-1 lg:gap-2">
                Resume
                <ChatBubbleLeftRightIcon className={`${isScrolled ? 'md:h-3 md:w-3 lg:h-4 lg:w-4' : 'md:h-4 md:w-4 lg:h-5 lg:w-5'}`} />
              </span>
              <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-[var(--background-tertiary)] text-[var(--text)] text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 border border-[var(--border)]">
                Alt+R
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 border-4 border-transparent" style={{ borderBottomColor: 'var(--background-tertiary)' }}></div>
              </div>
            </Link>
          </div>

          <div className="md:hidden flex items-center space-x-2">
            {/* Mobile Theme Selector */}
            <ThemeSelector isCompact={isScrolled} />
            
            <button
              type="button"
              className="text-[var(--text-secondary)] hover:text-[var(--text)] p-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <div
              className={`md:hidden fixed left-0 right-0 bottom-0 bg-black/20 backdrop-blur-sm z-40 ${
                isScrolled ? 'top-[calc(3.5rem+0.5rem)]' : 'top-16'
              }`}
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />
            {/* Menu content */}
            <div className="md:hidden absolute top-full left-0 right-0 mt-2 mx-4 z-[60]">
              <div className="bg-[var(--background)] rounded-lg shadow-lg border border-[var(--border)] px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-4 py-3 text-base font-medium min-h-[44px] flex items-center text-[var(--text-secondary)] hover:text-[var(--primary)]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                href="/resume"
                className="relative bg-[var(--primary)] text-white block px-4 py-3 rounded-md text-base font-medium hover:bg-[var(--primary-hover)] mt-4 min-h-[44px] flex items-center justify-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="flex items-center gap-2">
                  Resume
                  <ChatBubbleLeftRightIcon className="h-4 w-4" />
                </span>
              </Link>
              </div>
            </div>
          </>
        )}
      </nav>
    </header>

    {/* Command Palette - Lazy loaded for performance */}
    {isOpen && (
      <Suspense fallback={<div className="fixed inset-0 z-50 bg-black/50" />}>
        <CommandPalette isOpen={isOpen} onClose={closeCommandPalette} />
      </Suspense>
    )}
  </>
  )
}