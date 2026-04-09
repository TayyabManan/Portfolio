'use client'

import { useEffect } from 'react'

export function useSkipToContent() {
  useEffect(() => {
    const skipLink = document.createElement('a')
    skipLink.href = '#main-content'
    skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-md'
    skipLink.textContent = 'Skip to main content'

    skipLink.addEventListener('click', (e) => {
      e.preventDefault()
      const main = document.getElementById('main-content')
      if (main) {
        main.tabIndex = -1
        main.focus()
        main.scrollIntoView()
      }
    })

    document.body.insertBefore(skipLink, document.body.firstChild)

    return () => {
      if (document.body.contains(skipLink)) {
        document.body.removeChild(skipLink)
      }
    }
  }, [])
}
