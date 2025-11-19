'use client'

import { useEffect, useRef, useCallback, useState } from 'react'

// Hook to manage focus restoration
export function useFocusRestore() {
  const lastFocusedElement = useRef<HTMLElement | null>(null)

  const saveFocus = useCallback(() => {
    lastFocusedElement.current = document.activeElement as HTMLElement
  }, [])

  const restoreFocus = useCallback(() => {
    if (lastFocusedElement.current && typeof lastFocusedElement.current.focus === 'function') {
      lastFocusedElement.current.focus()
    }
  }, [])

  return { saveFocus, restoreFocus }
}

// Hook to trap focus within a container
export function useFocusTrap(
  containerRef: React.RefObject<HTMLElement>,
  isActive: boolean = true,
  options: {
    initialFocus?: React.RefObject<HTMLElement>
    returnFocus?: boolean
    allowOutsideClick?: boolean
    escapeDeactivates?: boolean
    onEscape?: () => void
  } = {}
) {
  const { 
    initialFocus, 
    returnFocus = true, 
    allowOutsideClick = false,
    escapeDeactivates = true,
    onEscape
  } = options
  
  const { saveFocus, restoreFocus } = useFocusRestore()

  useEffect(() => {
    if (!isActive || !containerRef.current) return

    const container = containerRef.current
    
    // Save current focus before trapping
    if (returnFocus) {
      saveFocus()
    }

    // Get all focusable elements
    const getFocusableElements = () => {
      return container.querySelectorAll<HTMLElement>(
        'a[href]:not([disabled]), ' +
        'button:not([disabled]), ' +
        'textarea:not([disabled]), ' +
        'input:not([disabled]), ' +
        'select:not([disabled]), ' +
        '[tabindex]:not([tabindex="-1"]):not([disabled]), ' +
        'details:not([disabled]), ' +
        'summary:not([disabled]), ' +
        'iframe:not([disabled]), ' +
        'object:not([disabled]), ' +
        'embed:not([disabled]), ' +
        '[contenteditable]:not([contenteditable="false"]):not([disabled]), ' +
        'audio[controls]:not([disabled]), ' +
        'video[controls]:not([disabled])'
      )
    }

    const focusableElements = getFocusableElements()
    const firstElement = focusableElements[0]

    // Set initial focus
    if (initialFocus?.current) {
      initialFocus.current.focus()
    } else if (firstElement) {
      firstElement.focus()
    }

    // Handle tab key navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        const elements = getFocusableElements()
        const first = elements[0]
        const last = elements[elements.length - 1]

        if (!first) return

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault()
            last?.focus()
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault()
            first.focus()
          }
        }
      } else if (e.key === 'Escape' && escapeDeactivates) {
        e.preventDefault()
        onEscape?.()
      }
    }

    // Handle clicks outside container
    const handleOutsideClick = (e: MouseEvent) => {
      if (!allowOutsideClick && !container.contains(e.target as Node)) {
        e.preventDefault()
        e.stopPropagation()
        firstElement?.focus()
      }
    }

    container.addEventListener('keydown', handleKeyDown)
    document.addEventListener('click', handleOutsideClick, true)

    return () => {
      container.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('click', handleOutsideClick, true)
      
      if (returnFocus) {
        restoreFocus()
      }
    }
  }, [isActive, containerRef, initialFocus, returnFocus, allowOutsideClick, escapeDeactivates, onEscape, saveFocus, restoreFocus])
}

// Hook to manage focus for modals/dialogs
export function useModalFocus(
  isOpen: boolean,
  modalRef: React.RefObject<HTMLElement>,
  options?: Parameters<typeof useFocusTrap>[2]
) {
  useFocusTrap(modalRef, isOpen, {
    returnFocus: true,
    escapeDeactivates: true,
    ...options
  })

  // Hide background content from screen readers
  useEffect(() => {
    if (!isOpen) return

    const appRoot = document.getElementById('__next') || document.body
    const originalAriaHidden = appRoot.getAttribute('aria-hidden')

    appRoot.setAttribute('aria-hidden', 'true')
    if (modalRef.current) {
      modalRef.current.removeAttribute('aria-hidden')
    }

    return () => {
      if (originalAriaHidden) {
        appRoot.setAttribute('aria-hidden', originalAriaHidden)
      } else {
        appRoot.removeAttribute('aria-hidden')
      }
    }
  }, [isOpen, modalRef])
}

// Hook to announce dynamic content changes to screen readers
export function useLiveRegion(
  message: string,
  politeness: 'polite' | 'assertive' = 'polite'
) {
  const regionRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!regionRef.current) {
      const region = document.createElement('div')
      region.setAttribute('aria-live', politeness)
      region.setAttribute('aria-atomic', 'true')
      region.style.position = 'absolute'
      region.style.left = '-10000px'
      region.style.width = '1px'
      region.style.height = '1px'
      region.style.overflow = 'hidden'
      document.body.appendChild(region)
      regionRef.current = region
    }

    if (message) {
      regionRef.current.textContent = message
    }

    return () => {
      if (regionRef.current && document.body.contains(regionRef.current)) {
        document.body.removeChild(regionRef.current)
        regionRef.current = null
      }
    }
  }, [message, politeness])
}

// Hook to skip to main content
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

// Hook to manage roving tabindex for lists
export function useRovingTabIndex(
  itemsRef: React.RefObject<HTMLElement[]>,
  options: {
    orientation?: 'horizontal' | 'vertical' | 'both'
    loop?: boolean
    onSelect?: (index: number) => void
  } = {}
) {
  const { orientation = 'vertical', loop = true, onSelect } = options
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const items = itemsRef.current
    if (!items || items.length === 0) return

    // Update tabindex attributes
    items.forEach((item, index) => {
      if (item) {
        item.tabIndex = index === activeIndex ? 0 : -1
      }
    })

    const handleKeyDown = (e: KeyboardEvent) => {
      const currentItems = itemsRef.current
      if (!currentItems) return

      let nextIndex = activeIndex
      const lastIndex = currentItems.length - 1

      switch (e.key) {
        case 'ArrowUp':
          if (orientation === 'vertical' || orientation === 'both') {
            e.preventDefault()
            nextIndex = activeIndex > 0 ? activeIndex - 1 : (loop ? lastIndex : 0)
          }
          break
        case 'ArrowDown':
          if (orientation === 'vertical' || orientation === 'both') {
            e.preventDefault()
            nextIndex = activeIndex < lastIndex ? activeIndex + 1 : (loop ? 0 : lastIndex)
          }
          break
        case 'ArrowLeft':
          if (orientation === 'horizontal' || orientation === 'both') {
            e.preventDefault()
            nextIndex = activeIndex > 0 ? activeIndex - 1 : (loop ? lastIndex : 0)
          }
          break
        case 'ArrowRight':
          if (orientation === 'horizontal' || orientation === 'both') {
            e.preventDefault()
            nextIndex = activeIndex < lastIndex ? activeIndex + 1 : (loop ? 0 : lastIndex)
          }
          break
        case 'Home':
          e.preventDefault()
          nextIndex = 0
          break
        case 'End':
          e.preventDefault()
          nextIndex = lastIndex
          break
        case 'Enter':
        case ' ':
          e.preventDefault()
          onSelect?.(activeIndex)
          break
      }

      if (nextIndex !== activeIndex) {
        setActiveIndex(nextIndex)
        currentItems[nextIndex]?.focus()
      }
    }

    // Add event listeners to all items
    items.forEach(item => {
      item?.addEventListener('keydown', handleKeyDown)
    })

    return () => {
      items.forEach(item => {
        item?.removeEventListener('keydown', handleKeyDown)
      })
    }
  }, [itemsRef, activeIndex, orientation, loop, onSelect])

  return { activeIndex, setActiveIndex }
}

// Utility function to check if element is focusable
export function isFocusable(element: HTMLElement): boolean {
  if (element.tabIndex < 0) return false

  // Check if element has disabled property (form elements)
  if ('disabled' in element && (element as HTMLButtonElement | HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement).disabled) {
    return false
  }

  const focusableTags = ['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA', 'IFRAME', 'OBJECT', 'EMBED']

  if (focusableTags.includes(element.tagName)) {
    return true
  }

  if (element.hasAttribute('contenteditable')) {
    return true
  }

  if (element.hasAttribute('tabindex')) {
    return true
  }

  return false
}

// Utility function to get all focusable elements
export function getFocusableElements(container: HTMLElement = document.body): HTMLElement[] {
  const elements = container.querySelectorAll<HTMLElement>(
    'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"]), [contenteditable]'
  )

  return Array.from(elements).filter(el =>
    !el.hasAttribute('disabled') &&
    !el.getAttribute('aria-hidden') &&
    el.offsetParent !== null // Check if element is visible
  )
}