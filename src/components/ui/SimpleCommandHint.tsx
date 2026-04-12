'use client'

import React, { useState, useEffect } from 'react'
import { CommandLineIcon, XMarkIcon } from '@heroicons/react/24/outline'

export function SimpleCommandHint() {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    // Check if device is desktop (not mobile or tablet)
    const checkDevice = () => {
      // Check for desktop by screen size and lack of touch
      const hasKeyboard = window.matchMedia('(min-width: 1024px)').matches
      const hasHover = window.matchMedia('(hover: hover)').matches
      const hasPointer = window.matchMedia('(pointer: fine)').matches
      
      setIsDesktop(hasKeyboard && hasHover && hasPointer)
    }

    checkDevice()
    window.addEventListener('resize', checkDevice)
    
    return () => window.removeEventListener('resize', checkDevice)
  }, [])

  useEffect(() => {
    // Only show on desktop after 2 seconds unless dismissed
    if (!isDismissed && isDesktop) {
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [isDismissed, isDesktop])

  useEffect(() => {
    // Auto-dismiss after 5 seconds
    if (isVisible) {
      const autoDismissTimer = setTimeout(() => {
        setIsVisible(false)
        setIsDismissed(true)
        // Reset dismissed state after 30 seconds so it can show again
        setTimeout(() => {
          setIsDismissed(false)
        }, 30000)
      }, 5000)

      return () => clearTimeout(autoDismissTimer)
    }
  }, [isVisible])

  const openCommandPalette = () => {
    // Dispatch keyboard event to open command palette
    const event = new KeyboardEvent('keydown', {
      key: 'k',
      ctrlKey: true,
      metaKey: true,
      bubbles: true
    })
    document.dispatchEvent(event)
    setIsVisible(false)
    // Reshow after a delay when opened
    setTimeout(() => {
      if (!isDismissed) {
        setIsVisible(true)
      }
    }, 3000)
  }

  const handleDismiss = () => {
    setIsVisible(false)
    setIsDismissed(true)
    // Reset dismissed state after 30 seconds so it can show again
    setTimeout(() => {
      setIsDismissed(false)
    }, 30000)
  }

  // Don't render on mobile/tablet devices
  if (!isDesktop || !isVisible) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-fade-in">
      <div className="relative bg-[var(--primary)] text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200">
        <div className="flex items-center">
          <button
            onClick={openCommandPalette}
            className="flex-1 px-4 py-3 flex items-center gap-3 group rounded-l-lg hover:bg-[var(--primary-hover)] transition-colors"
          >
            <CommandLineIcon className="w-5 h-5" />
            <div className="text-left">
              <div className="text-sm font-semibold">Quick Commands</div>
              <div className="text-xs opacity-90">Press ⌘K or Ctrl+K</div>
            </div>
          </button>
          
          {/* Dismiss button as part of the main component */}
          <button
            onClick={handleDismiss}
            className="px-3 py-3 hover:bg-[var(--primary-hover)] rounded-r-lg border-l border-[var(--primary-hover)] transition-colors group"
            aria-label="Dismiss hint"
            title="Dismiss for 30 seconds"
          >
            <XMarkIcon className="w-4 h-4 text-white opacity-70 group-hover:opacity-100" />
          </button>
        </div>
      </div>
    </div>
  )
}