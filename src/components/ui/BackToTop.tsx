'use client'

import { useState, useEffect } from 'react'
import { ArrowUpIcon } from '@heroicons/react/24/outline'

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when page is scrolled down 300px
      if (window.scrollY > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility, { passive: true })

    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const scrollToTop = () => {
    const duration = 1000 // 1 second for smooth scroll
    const start = window.scrollY
    const startTime = performance.now()

    const easeInOutCubic = (t: number): number => {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
    }

    const animateScroll = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const ease = easeInOutCubic(progress)

      window.scrollTo(0, start * (1 - ease))

      if (progress < 1) {
        requestAnimationFrame(animateScroll)
      }
    }

    requestAnimationFrame(animateScroll)
  }

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 p-3 bg-[var(--primary)] text-white rounded-full shadow-lg hover:bg-[var(--primary-hover)] transition-[background-color,transform,box-shadow] duration-300 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2"
          aria-label="Back to top"
          title="Back to top"
        >
          <ArrowUpIcon className="h-6 w-6" />
        </button>
      )}
    </>
  )
}
