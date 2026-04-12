'use client'

import { useState, useEffect, lazy, Suspense } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Bars3Icon, XMarkIcon, MagnifyingGlassIcon, ChatBubbleLeftRightIcon, SunIcon, MoonIcon } from '@heroicons/react/24/outline'
import Logo from '@/components/ui/Logo'
import { useCommandPalette } from '@/components/ui/CommandPalette'
import { useTheme } from '@/contexts/ThemeContext'

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
  const { theme, toggleTheme } = useTheme()

  const pathname = usePathname()

  // Check if a navigation item is active
  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }

  // Enhanced scroll detection for mobile (especially iOS)
  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      const currentScroll = window.pageYOffset || document.documentElement.scrollTop

      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrolled = currentScroll > 20
          if (isScrolled !== scrolled) {
            setIsScrolled(scrolled)
          }
          ticking = false
        })
        ticking = true
      }
    }

    // Initial check
    handleScroll()

    // Listen to scroll with passive for better performance
    window.addEventListener('scroll', handleScroll, { passive: true })

    // Also listen to touchmove for iOS
    window.addEventListener('touchmove', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('touchmove', handleScroll)
    }
  }, [isScrolled])

  // Lock body scroll when mobile menu is open (iOS compatible)
  useEffect(() => {
    if (mobileMenuOpen) {
      const scrollY = window.scrollY
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = '100%'
      document.body.style.overflow = 'hidden'
    } else {
      const scrollY = document.body.style.top
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      document.body.style.overflow = ''
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1)
      }
    }
  }, [mobileMenuOpen])

  // Close mobile menu on ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [mobileMenuOpen])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  return (
    <>
      {/* Desktop Navbar */}
      <nav
        className={`hidden md:block fixed top-0 left-0 right-0 z-[100] mx-auto transition-all duration-300 ${
          isScrolled
            ? 'mt-3 px-4 max-w-[95vw] sm:max-w-[90vw] md:max-w-4xl lg:max-w-5xl'
            : 'px-4 sm:px-6 lg:px-8 max-w-7xl'
        }`}
        role="navigation"
        aria-label="Main navigation"
        style={{
          WebkitTransform: 'translateZ(0)',
          transform: 'translateZ(0)',
          willChange: 'transform'
        }}
      >
        <div
          className={`flex items-center justify-between transition-all duration-300 ${
            isScrolled
              ? 'h-14 px-4 sm:px-6 rounded-full shadow-lg border border-[var(--border)] bg-[var(--background)] opacity-95'
              : 'h-16 bg-transparent'
          }`}
        >
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 sm:gap-3 font-bold transition-all duration-300 hover:opacity-80"
          >
            <div className="text-[var(--primary)]">
              <Logo
                className={`transition-all duration-300 ${
                  isScrolled ? 'w-5 h-5 sm:w-6 sm:h-6' : 'w-6 h-6 sm:w-7 sm:h-7'
                }`}
              />
            </div>
            <span
              className={`whitespace-nowrap transition-all duration-300 text-[var(--text)] ${
                isScrolled ? 'text-sm sm:text-base' : 'text-base sm:text-lg'
              }`}
            >
              Tayyab Manan
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="flex items-center gap-1 lg:gap-2">
            {navigationItems.map((item) => {
              const active = isActive(item.href)
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative px-3 lg:px-4 py-2 rounded-lg font-medium transition-all duration-200 group ${
                    isScrolled ? 'text-sm' : 'text-sm lg:text-base'
                  } ${
                    active
                      ? 'text-[var(--primary)]'
                      : 'text-[var(--text-secondary)] hover:text-[var(--primary)] hover:bg-[var(--background-secondary)]'
                  }`}
                  aria-current={active ? 'page' : undefined}
                >
                  {item.name}
                  {active && (
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 rounded-full bg-[var(--primary)]" />
                  )}
                  {/* Tooltip */}
                  <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 bg-[var(--background-tertiary)] text-[var(--text)] border border-[var(--border)]">
                    {item.shortcut}
                  </div>
                </Link>
              )
            })}

            {/* Search Button */}
            <button
              onClick={openCommandPalette}
              type="button"
              className="p-2 min-h-[44px] min-w-[44px] rounded-lg transition-all duration-200 group flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--primary)] hover:bg-[var(--background-secondary)]"
              aria-label="Open command palette"
            >
              <MagnifyingGlassIcon className="h-5 w-5" />
              <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 bg-[var(--background-tertiary)] text-[var(--text)] border border-[var(--border)]">
                ⌘K
              </div>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              type="button"
              className="p-2 min-h-[44px] min-w-[44px] rounded-lg transition-all duration-200 group flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--primary)] hover:bg-[var(--background-secondary)]"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? (
                <SunIcon className="h-5 w-5" />
              ) : (
                <MoonIcon className="h-5 w-5" />
              )}
            </button>

            {/* Resume Button */}
            <Link
              href="/resume"
              className={`ml-2 px-4 lg:px-5 py-2 text-white font-medium rounded-lg transition-all duration-200 flex items-center gap-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] ${
                isScrolled ? 'text-sm' : 'text-sm lg:text-base'
              }`}
            >
              Resume
              <ChatBubbleLeftRightIcon className={`${isScrolled ? 'h-3.5 w-3.5' : 'h-4 w-4'}`} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Navbar - iOS Optimized */}
      <div
        className="md:hidden fixed top-0 left-0 right-0 z-[100]"
        style={{
          position: 'fixed',
          WebkitTransform: 'translate3d(0,0,0)',
          transform: 'translate3d(0,0,0)',
          WebkitBackfaceVisibility: 'hidden',
          backfaceVisibility: 'hidden',
          WebkitPerspective: '1000',
          perspective: '1000',
          willChange: 'auto'
        }}
      >
        {/* Mobile Navbar Container */}
        <div
          className={`transition-all duration-300 ease-out ${
            isScrolled ? 'p-3' : 'p-0'
          }`}
        >
          {/* Mobile Nav Bar */}
          <div
            className={`transition-all duration-300 ease-out ${
              isScrolled
                ? 'rounded-full shadow-lg border border-[var(--border)] bg-[var(--background)] opacity-95'
                : 'bg-transparent'
            }`}
            style={{
              WebkitTransform: 'translateZ(0)',
              transform: 'translateZ(0)',
            }}
          >
            <div className="flex items-center justify-between h-16 px-4">
              {/* Logo */}
              <Link
                href="/"
                className="flex items-center gap-2 font-bold transition-all duration-300 hover:opacity-80 z-10"
              >
                <div className="text-[var(--primary)]">
                  <Logo
                    className={`transition-all duration-300 ${
                      isScrolled ? 'w-5 h-5' : 'w-6 h-6'
                    }`}
                  />
                </div>
                <span
                  className={`whitespace-nowrap transition-all duration-300 text-[var(--text)] ${
                    isScrolled ? 'text-sm' : 'text-base'
                  }`}
                >
                  Tayyab Manan
                </span>
              </Link>

              {/* Mobile Controls */}
              <div className="flex items-center gap-1 z-10">
                {/* Mobile Search */}
                <button
                  onClick={openCommandPalette}
                  type="button"
                  className="p-2 min-h-[44px] min-w-[44px] transition-colors rounded-lg flex items-center justify-center text-[var(--text-secondary)] active:text-[var(--primary)] active:bg-[var(--background-secondary)]"
                  aria-label="Open search"
                >
                  <MagnifyingGlassIcon className="h-5 w-5" />
                </button>

                {/* Mobile Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  type="button"
                  className="p-2 min-h-[44px] min-w-[44px] transition-colors rounded-lg flex items-center justify-center text-[var(--text-secondary)] active:text-[var(--primary)] active:bg-[var(--background-secondary)]"
                  aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  {theme === 'dark' ? (
                    <SunIcon className="h-5 w-5" />
                  ) : (
                    <MoonIcon className="h-5 w-5" />
                  )}
                </button>

                {/* Hamburger Menu */}
                <button
                  type="button"
                  className="p-2 min-h-[44px] min-w-[44px] transition-colors rounded-lg flex items-center justify-center text-[var(--text-secondary)] active:text-[var(--text)] active:bg-[var(--background-secondary)]"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  aria-label={mobileMenuOpen ? "Close mobile menu" : "Open mobile menu"}
                  aria-expanded={mobileMenuOpen}
                  aria-controls="mobile-menu-dropdown"
                >
                  {mobileMenuOpen ? (
                    <XMarkIcon className="h-6 w-6" />
                  ) : (
                    <Bars3Icon className="h-6 w-6" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <div
          className={`fixed inset-0 bg-black/60 transition-opacity duration-300 ${
            mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          style={{
            top: isScrolled ? 'calc(4rem + 1.5rem)' : '4rem',
            zIndex: 90
          }}
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />

        {/* Mobile Menu Dropdown */}
        <div
          id="mobile-menu-dropdown"
          className={`fixed left-3 right-3 transition-all duration-300 ease-out ${
            mobileMenuOpen
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 -translate-y-4 pointer-events-none'
          }`}
          style={{
            top: isScrolled ? 'calc(4rem + 2rem)' : '4.75rem',
            zIndex: 95,
            WebkitTransform: mobileMenuOpen ? 'translate3d(0,0,0)' : 'translate3d(0,-1rem,0)',
            transform: mobileMenuOpen ? 'translate3d(0,0,0)' : 'translate3d(0,-1rem,0)',
          }}
          role="menu"
          aria-label="Mobile navigation menu"
        >
          <div className="rounded-2xl shadow-2xl border border-[var(--border)] bg-[var(--background)] overflow-hidden">
            <div className="p-2 space-y-1">
              {navigationItems.map((item) => {
                const active = isActive(item.href)
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl font-medium transition-all duration-200 active:scale-[0.98] ${
                      active
                        ? 'text-[var(--primary)]'
                        : 'text-[var(--text)] active:bg-[var(--background-secondary)]'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                    aria-current={active ? 'page' : undefined}
                  >
                    <span>{item.name}</span>
                    <span className="text-xs text-[var(--text-tertiary)]">
                      {item.shortcut}
                    </span>
                  </Link>
                )
              })}

              {/* Resume Button */}
              <Link
                href="/resume"
                className="flex items-center justify-center px-4 py-3 mt-2 text-white font-medium rounded-xl transition-all duration-200 active:scale-[0.98] gap-2 bg-[var(--primary)] active:bg-[var(--primary-hover)]"
                onClick={() => setMobileMenuOpen(false)}
              >
                Resume
                <ChatBubbleLeftRightIcon className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer to prevent content from hiding under fixed header */}
      <div className="h-16" />

      {/* Command Palette */}
      {isOpen && (
        <Suspense fallback={<div className="fixed inset-0 z-[110] bg-black/50" />}>
          <CommandPalette isOpen={isOpen} onClose={closeCommandPalette} />
        </Suspense>
      )}
    </>
  )
}
