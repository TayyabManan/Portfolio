'use client'

import { useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from '@/components/ui/Toast'
import { useTheme } from '@/contexts/ThemeContext'

export interface ShortcutConfig {
  key: string
  ctrl?: boolean
  meta?: boolean
  shift?: boolean
  alt?: boolean
  action: () => void
  description?: string
  preventDefault?: boolean
  stopPropagation?: boolean
  enabled?: boolean
}

export function useKeyboardShortcuts(shortcuts: ShortcutConfig[]) {
  const activeShortcuts = useRef<ShortcutConfig[]>(shortcuts)

  useEffect(() => {
    // Filter out any invalid shortcuts
    const validShortcuts = shortcuts.filter(shortcut => 
      shortcut && 
      shortcut.key && 
      typeof shortcut.key === 'string' && 
      typeof shortcut.action === 'function'
    )
    activeShortcuts.current = validShortcuts
  }, [shortcuts])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore keyboard shortcuts when user is typing in form fields
      const target = e.target as HTMLElement
      if (target && (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.isContentEditable
      )) {
        return
      }

      const matchingShortcut = activeShortcuts.current.find(shortcut => {
        if (shortcut.enabled === false) return false
        if (!shortcut || !shortcut.key || typeof shortcut.key !== 'string') return false
        
        const keyMatch = e.key.toLowerCase() === shortcut.key.toLowerCase()
        const ctrlMatch = shortcut.ctrl ? (e.ctrlKey || e.metaKey) : !e.ctrlKey && !e.metaKey
        const metaMatch = shortcut.meta ? e.metaKey : !e.metaKey
        const shiftMatch = shortcut.shift ? e.shiftKey : !e.shiftKey
        const altMatch = shortcut.alt ? e.altKey : !e.altKey
        
        return keyMatch && ctrlMatch && metaMatch && shiftMatch && altMatch
      })

      if (matchingShortcut) {
        if (matchingShortcut.preventDefault !== false) {
          e.preventDefault()
        }
        if (matchingShortcut.stopPropagation !== false) {
          e.stopPropagation()
        }
        matchingShortcut.action()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])
}

export function useGlobalKeyboardShortcuts() {
  const router = useRouter()
  const { toggleTheme, actualTheme } = useTheme()

  const navigate = useCallback((path: string) => {
    // Use startTransition for smoother navigation
    router.push(path)
    // Force a small delay to ensure navigation completes
    setTimeout(() => {
      if (window.location.pathname !== path) {
        window.location.href = path
      }
    }, 100)
  }, [router])

  const shortcuts: ShortcutConfig[] = [
    // Navigation shortcuts using Alt key to avoid browser conflicts
    {
      key: 'h',
      alt: true,
      action: () => {
        navigate('/')
        toast.info('Navigated to Home')
      },
      description: 'Go to Home',
    },
    {
      key: 'p',
      alt: true,
      action: () => {
        navigate('/projects')
        toast.info('Navigated to Projects')
      },
      description: 'Go to Projects',
    },
    {
      key: 'b',
      alt: true,
      action: () => {
        navigate('/blog')
        toast.info('Navigated to Blog')
      },
      description: 'Go to Blog',
    },
    {
      key: 'a',
      alt: true,
      action: () => {
        navigate('/about')
        toast.info('Navigated to About')
      },
      description: 'Go to About',
    },
    {
      key: 'r',
      alt: true,
      action: () => {
        navigate('/resume')
        toast.info('Navigated to Resume')
      },
      description: 'Go to Resume',
    },
    {
      key: 'c',
      alt: true,
      action: () => {
        navigate('/contact')
        toast.info('Navigated to Contact')
      },
      description: 'Go to Contact',
    },
    // Theme shortcuts using Alt key
    {
      key: 't',
      alt: true,
      action: () => {
        toggleTheme()
        const newTheme = actualTheme === 'light' ? 'dark' : 'light'
        toast.success(`Switched to ${newTheme === 'light' ? 'Light' : 'Dark'} theme`)
      },
      description: 'Toggle Theme',
    },
    // External shortcuts
    {
      key: 'g',
      alt: true,
      action: () => {
        window.open('https://github.com/TayyabManan/GIS-Portfolio', '_blank')
        toast.info('Opened GitHub Repository')
      },
      description: 'Open GitHub Repository',
    },
    // Utility shortcuts
    {
      key: '?',
      shift: true,
      action: () => {
        showShortcutsHelp()
      },
      description: 'Show Keyboard Shortcuts',
    },
    // Removed global Escape handler to avoid conflicts with CommandPalette
  ]

  useKeyboardShortcuts(shortcuts)
  return shortcuts
}

function showShortcutsHelp() {
  // Check if modal already exists
  const existingModal = document.getElementById('keyboard-shortcuts-modal')
  if (existingModal) {
    return // Don't create another modal if one already exists
  }

  const shortcuts = [
    { keys: '⌘K / Ctrl+K', description: 'Open Command Palette' },
    { keys: 'Alt+H', description: 'Go to Home' },
    { keys: 'Alt+P', description: 'Go to Projects' },
    { keys: 'Alt+B', description: 'Go to Blog' },
    { keys: 'Alt+A', description: 'Go to About' },
    { keys: 'Alt+R', description: 'Go to Resume' },
    { keys: 'Alt+C', description: 'Go to Contact' },
    { keys: 'Alt+T', description: 'Toggle Theme' },
    { keys: '?', description: 'Show this help' },
  ]

  // Create a custom modal to show shortcuts
  const modal = document.createElement('div')
  modal.id = 'keyboard-shortcuts-modal'
  modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm'
  modal.innerHTML = `
    <div class="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-6 max-w-md w-full">
      <h2 class="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Keyboard Shortcuts</h2>
      <div class="space-y-2">
        ${shortcuts.map(s => `
          <div class="flex justify-between items-center py-1">
            <kbd class="px-2 py-1 text-sm font-semibold text-gray-800 bg-gray-100 dark:text-gray-100 dark:bg-gray-800 rounded">
              ${s.keys}
            </kbd>
            <span class="text-sm text-gray-600 dark:text-gray-400">${s.description}</span>
          </div>
        `).join('')}
      </div>
      <button 
        onclick="this.closest('.fixed').remove()" 
        class="mt-6 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Close
      </button>
    </div>
  `
  
  modal.onclick = (e) => {
    if (e.target === modal) {
      modal.remove()
    }
  }
  
  document.body.appendChild(modal)
  
  // Remove on escape
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      modal.remove()
      document.removeEventListener('keydown', handleEscape)
    }
  }
  document.addEventListener('keydown', handleEscape)
}

export function useArrowKeyNavigation<T = unknown>(
  items: T[],
  onSelect: (item: T, index: number) => void,
  options: {
    vertical?: boolean
    wrap?: boolean
    enabled?: boolean
  } = {}
) {
  const { vertical = true, wrap = true, enabled = true } = options
  const selectedIndex = useRef(0)

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!enabled || items.length === 0) return

    const prevKey = vertical ? 'ArrowUp' : 'ArrowLeft'
    const nextKey = vertical ? 'ArrowDown' : 'ArrowRight'

    if (e.key === prevKey) {
      e.preventDefault()
      selectedIndex.current = wrap
        ? (selectedIndex.current - 1 + items.length) % items.length
        : Math.max(0, selectedIndex.current - 1)
      onSelect(items[selectedIndex.current], selectedIndex.current)
    } else if (e.key === nextKey) {
      e.preventDefault()
      selectedIndex.current = wrap
        ? (selectedIndex.current + 1) % items.length
        : Math.min(items.length - 1, selectedIndex.current + 1)
      onSelect(items[selectedIndex.current], selectedIndex.current)
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (items[selectedIndex.current]) {
        onSelect(items[selectedIndex.current], selectedIndex.current)
      }
    }
  }, [items, onSelect, vertical, wrap, enabled])

  useEffect(() => {
    if (enabled) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown, enabled])

  return {
    selectedIndex: selectedIndex.current,
    setSelectedIndex: (index: number) => {
      selectedIndex.current = index
    },
  }
}

export function useFocusTrap(containerRef: React.RefObject<HTMLElement>, enabled = true) {
  useEffect(() => {
    if (!enabled || !containerRef.current) return

    const container = containerRef.current
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )

    if (focusableElements.length === 0) return

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement.focus()
        }
      }
    }

    container.addEventListener('keydown', handleKeyDown)
    firstElement.focus()

    return () => {
      container.removeEventListener('keydown', handleKeyDown)
    }
  }, [containerRef, enabled])
}