'use client'

import React, { useEffect, useState, useMemo, useRef } from 'react'
import { ChevronDownIcon, ChevronUpIcon, ListBulletIcon } from '@heroicons/react/24/outline'

interface TocItem {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  content: string
  variant?: 'mobile' | 'desktop' | 'both'
}

export default function TableOfContents({ content, variant = 'both' }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('')
  const [isOpen, setIsOpen] = useState(false)
  const [hasOverflow, setHasOverflow] = useState(false)
  const [isFixed, setIsFixed] = useState(false)
  const [isAbsolute, setIsAbsolute] = useState(false)
  const [absoluteTop, setAbsoluteTop] = useState(0)
  const navRef = useRef<HTMLElement>(null)
  const tocContainerRef = useRef<HTMLDivElement>(null)
  const asideRef = useRef<HTMLElement>(null)

  // Extract headings from markdown content
  const tocItems = useMemo(() => {
    const headingRegex = /^(#{2,3})\s+(.+)$/gm
    const items: TocItem[] = []
    let match

    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length
      const text = match[2].trim()
      // Simple ID generation to match BlogPostClient heading IDs
      // Must match the sanitization in generateHeadingId but without registry
      let id = text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '')

      // Ensure ID starts with a letter (HTML requirement)
      if (!/^[a-z]/.test(id)) {
        id = `heading-${id}`
      }

      // Ensure ID is not empty
      if (!id) {
        id = `heading-${Math.random().toString(36).substr(2, 9)}`
      }

      items.push({ id, text, level })
    }

    return items
  }, [content])

  useEffect(() => {
    // Don't set up observer if no items
    if (tocItems.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the entry that's intersecting and closest to the top
        const intersectingEntries = entries.filter(entry => entry.isIntersecting)

        if (intersectingEntries.length > 0) {
          // Sort by position on page and take the first one
          intersectingEntries.sort((a, b) => {
            return a.boundingClientRect.top - b.boundingClientRect.top
          })
          setActiveId(intersectingEntries[0].target.id)
        }
      },
      {
        rootMargin: '-100px 0px -66% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1]
      }
    )

    // Retry logic to ensure headings are found
    let hasSetInitialActive = false
    const setupObserver = (retries = 0) => {
      const headings = document.querySelectorAll('h2[id], h3[id]')

      if (headings.length > 0) {
        // Headings found, set up observer
        headings.forEach((heading) => observer.observe(heading))

        // Set initial active ID to first heading (only once)
        if (!hasSetInitialActive) {
          hasSetInitialActive = true
          setActiveId(headings[0].id)
        }
      } else if (retries < 10) {
        // Retry after a delay if headings not found yet
        setTimeout(() => setupObserver(retries + 1), 100)
      }
    }

    // Start setup with retry logic
    setupObserver()

    return () => {
      observer.disconnect()
    }
  }, [tocItems.length])

  // Check if nav has overflow and handle scroll behavior
  useEffect(() => {
    if (tocItems.length === 0) return

    const checkOverflow = () => {
      if (navRef.current) {
        const hasScroll = navRef.current.scrollHeight > navRef.current.clientHeight
        setHasOverflow(hasScroll)
      }
    }

    checkOverflow()
    window.addEventListener('resize', checkOverflow)

    return () => window.removeEventListener('resize', checkOverflow)
  }, [tocItems.length])

  // Handle wheel event to allow page scroll when TOC doesn't need scrolling
  useEffect(() => {
    if (tocItems.length === 0) return

    const nav = navRef.current
    if (!nav) return

    const handleWheel = (e: WheelEvent) => {
      // If no overflow, let the event bubble to scroll the page
      if (!hasOverflow) {
        return
      }

      // Check if we're at scroll boundaries
      const atTop = nav.scrollTop === 0
      const atBottom = nav.scrollTop + nav.clientHeight >= nav.scrollHeight - 1

      // If scrolling up and at top, or scrolling down and at bottom, let it bubble
      if ((e.deltaY < 0 && atTop) || (e.deltaY > 0 && atBottom)) {
        return
      }

      // Otherwise, stop propagation to scroll the TOC
      e.stopPropagation()
    }

    nav.addEventListener('wheel', handleWheel, { passive: true })

    return () => nav.removeEventListener('wheel', handleWheel)
  }, [hasOverflow, tocItems.length])

  // Auto-scroll TOC to show active heading
  useEffect(() => {
    if (tocItems.length === 0) return
    if (!activeId || !navRef.current) return

    // Find the button for the active heading
    const activeButton = navRef.current.querySelector(`button[data-heading-id="${activeId}"]`)
    if (!activeButton) return

    // Scroll the active button into view if it's not visible
    activeButton.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'nearest'
    })
  }, [activeId, tocItems.length])

  // Handle sticky behavior with article boundary protection
  useEffect(() => {
    if (tocItems.length === 0) return
    if (!tocContainerRef.current || !asideRef.current) return

    const handleScroll = () => {
      if (!tocContainerRef.current || !asideRef.current) return

      const containerRect = tocContainerRef.current.getBoundingClientRect()
      const asideRect = asideRef.current.getBoundingClientRect()
      const offsetTop = 96 // 6rem = 96px
      const tocHeight = asideRect.height
      const buffer = 100 // Larger buffer to prevent footer overlap

      // Find the article element and footer
      const article = document.querySelector('article')
      const footerWrapper = document.querySelector('footer')?.parentElement

      // Check if we should be fixed
      if (containerRect.top > offsetTop) {
        // Haven't scrolled enough - stay relative
        setIsFixed(false)
        setIsAbsolute(false)
      } else {
        // Would be in sticky zone
        const tocBottomIfFixed = offsetTop + tocHeight
        let stopPosition = null

        // Check article boundary
        if (article) {
          const articleRect = article.getBoundingClientRect()
          const articleBottom = articleRect.bottom

          if (tocBottomIfFixed >= articleBottom - buffer) {
            stopPosition = window.scrollY + articleBottom - tocHeight - buffer
          }
        }

        // Also check footer boundary (use the earlier stop position)
        if (footerWrapper) {
          const footerRect = footerWrapper.getBoundingClientRect()
          const footerTop = footerRect.top

          if (tocBottomIfFixed >= footerTop - buffer) {
            const footerStopPosition = window.scrollY + footerTop - tocHeight - buffer
            // Use whichever stop position comes first
            if (stopPosition === null || footerStopPosition < stopPosition) {
              stopPosition = footerStopPosition
            }
          }
        }

        if (stopPosition !== null) {
          // Stop here with absolute positioning
          setIsFixed(false)
          setIsAbsolute(true)
          setAbsoluteTop(stopPosition)
        } else {
          // Normal sticky behavior
          setIsFixed(true)
          setIsAbsolute(false)
        }
      }
    }

    // Listen to scroll events
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll, { passive: true })

    // Initial check
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [tocItems.length])


  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      // Close mobile TOC first
      setIsOpen(false)

      // Small delay to let the mobile TOC collapse
      setTimeout(() => {
        // Use scrollIntoView with custom offset
        const y = element.getBoundingClientRect().top + window.scrollY - 100
        window.scrollTo({
          top: y,
          behavior: 'smooth'
        })
      }, 100)
    }
  }

  // Don't show TOC if there are fewer than 3 headings
  if (tocItems.length < 3) {
    return null
  }

  return (
    <>
      {/* Mobile TOC - Collapsible */}
      {(variant === 'mobile' || variant === 'both') && (
      <div className="lg:hidden mb-8">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-4 bg-[var(--background-secondary)] rounded-lg border border-[var(--border)] text-[var(--text)] hover:border-[var(--primary)] transition-colors"
        >
          <div className="flex items-center gap-2">
            <ListBulletIcon className="h-5 w-5 text-[var(--text-tertiary)]" />
            <span className="font-semibold text-sm">Table of Contents</span>
            <span className="text-xs text-[var(--text-tertiary)]">({tocItems.length} sections)</span>
          </div>
          {isOpen ? (
            <ChevronUpIcon className="h-5 w-5 text-[var(--text-tertiary)]" />
          ) : (
            <ChevronDownIcon className="h-5 w-5 text-[var(--text-tertiary)]" />
          )}
        </button>

        {isOpen && (
          <div className="mt-2 p-4 bg-[var(--background-secondary)] rounded-lg border border-[var(--border)] animate-fadeIn">
            <nav>
              <ul className="space-y-2">
                {tocItems.map((item) => (
                  <li key={item.id} style={{ paddingLeft: `${(item.level - 2) * 1}rem` }}>
                    <button
                      onClick={() => scrollToHeading(item.id)}
                      className={`text-left text-sm transition-colors hover:text-[var(--primary)] w-full text-left ${
                        activeId === item.id
                          ? 'text-[var(--primary)] font-semibold'
                          : 'text-[var(--text-secondary)]'
                      }`}
                    >
                      {item.text}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        )}
      </div>
      )}

      {/* Desktop TOC - Sticky Sidebar */}
      {(variant === 'desktop' || variant === 'both') && (
      <div ref={tocContainerRef} className="hidden lg:block self-start">
        <aside
          ref={asideRef}
          className={`transition-all duration-200 ${
            isFixed
              ? 'fixed top-[6rem] w-[300px] z-10'
              : isAbsolute
              ? 'absolute w-[300px] z-10'
              : 'relative'
          }`}
          style={isAbsolute ? { top: `${absoluteTop}px` } : undefined}
          aria-label="Table of contents"
        >
          <div className="p-5 bg-[var(--background-secondary)] rounded-xl border border-[var(--border)] shadow-sm max-h-[calc(100vh-7.5rem)] flex flex-col">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[var(--border)] flex-shrink-0">
              <ListBulletIcon className="h-4 w-4 text-[var(--primary)]" />
              <h3 className="text-sm font-semibold text-[var(--text)] uppercase tracking-wide">
                On This Page
              </h3>
            </div>

            <nav
              ref={navRef}
              className={`flex-1 overscroll-contain ${hasOverflow ? 'overflow-y-auto' : 'overflow-y-hidden'}`}
              style={{ scrollbarWidth: 'thin' }}
            >
              <ul className="space-y-1 pr-2">
                {tocItems.map((item) => {
                  const isH2 = item.level === 2
                  const isH3 = item.level === 3

                  return (
                    <li key={item.id} className="relative">
                      <button
                        onClick={() => scrollToHeading(item.id)}
                        data-heading-id={item.id}
                        className={`
                          text-left transition-all duration-200 block w-full
                          py-2 rounded-md relative cursor-pointer
                          ${isH2 ? 'pl-3 text-sm font-medium' : 'pl-6 text-xs'}
                          ${
                            activeId === item.id
                              ? 'text-[var(--primary)] font-semibold bg-[var(--primary)]/10'
                              : 'text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--background-tertiary)]'
                          }
                        `}
                      >
                        {/* Visual hierarchy indicators */}
                        {isH2 && (
                          <span className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 rounded-r ${
                            activeId === item.id ? 'bg-[var(--primary)]' : 'bg-[var(--border)]'
                          }`} />
                        )}
                        {isH3 && (
                          <span className={`absolute left-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full ${
                            activeId === item.id ? 'bg-[var(--primary)]' : 'bg-[var(--border)]'
                          }`} />
                        )}
                        {item.text}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </nav>
          </div>
        </aside>
      </div>
      )}
    </>
  )
}
