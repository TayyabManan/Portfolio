'use client'

import { useEffect, useRef } from 'react'

export default function ReadingProgress() {
  const progressRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
      const clampedProgress = Math.min(100, Math.max(0, scrollPercent))

      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${clampedProgress / 100})`
      }
    }

    const handleScroll = () => {
      requestAnimationFrame(updateProgress)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    updateProgress() // Initial calculation

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 z-[110] h-1 pointer-events-none">
      <div
        ref={progressRef}
        className="h-full bg-[var(--primary)] origin-left"
        style={{
          transform: 'scaleX(0)',
          willChange: 'transform'
        }}
      />
    </div>
  )
}
