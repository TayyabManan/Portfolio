'use client'

import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import {
  MagnifyingGlassIcon,
  HomeIcon,
  DocumentTextIcon,
  BriefcaseIcon,
  UserIcon,
  EnvelopeIcon,
  CommandLineIcon,
  ArrowRightIcon,
  NewspaperIcon,
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon,
} from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/contexts/ThemeContext'

interface CommandItem {
  id: string
  title: string
  description?: string
  icon?: React.ComponentType<{ className?: string }>
  action: () => void
  keywords?: string[]
  category?: string
  shortcut?: string
}

interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
  additionalCommands?: CommandItem[]
}

export function CommandPalette({ isOpen, onClose, additionalCommands = [] }: CommandPaletteProps) {
  const router = useRouter()
  const { theme, preference, setPreference, toggleTheme } = useTheme()
  const [search, setSearch] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [recentCommands, setRecentCommands] = useState<string[]>([])
  const listRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [visible, setVisible] = useState(false)

  const navigate = useCallback((path: string) => {
    router.push(path)
    setTimeout(() => {
      if (window.location.pathname !== path) {
        window.location.href = path
      }
    }, 100)
  }, [router])

  const defaultCommands: CommandItem[] = useMemo(() => [
    {
      id: 'home',
      title: 'Go to Home',
      description: 'Navigate to the homepage',
      icon: HomeIcon,
      action: () => { navigate('/'); onClose() },
      keywords: ['home', 'main', 'index'],
      category: 'Navigation',
      shortcut: 'Alt+H',
    },
    {
      id: 'projects',
      title: 'View Projects',
      description: 'Browse all projects',
      icon: BriefcaseIcon,
      action: () => { navigate('/projects'); onClose() },
      keywords: ['work', 'portfolio', 'gis'],
      category: 'Navigation',
      shortcut: 'Alt+P',
    },
    {
      id: 'blog',
      title: 'Read Blog',
      description: 'Browse blog posts and articles',
      icon: NewspaperIcon,
      action: () => { navigate('/blog'); onClose() },
      keywords: ['blog', 'articles', 'posts', 'writing'],
      category: 'Navigation',
      shortcut: 'Alt+B',
    },
    {
      id: 'about',
      title: 'About Me',
      description: 'Learn more about my background',
      icon: UserIcon,
      action: () => { navigate('/about'); onClose() },
      keywords: ['bio', 'background', 'experience'],
      category: 'Navigation',
      shortcut: 'Alt+A',
    },
    {
      id: 'resume',
      title: 'View Resume',
      description: 'Download or view my resume',
      icon: DocumentTextIcon,
      action: () => { navigate('/resume'); onClose() },
      keywords: ['cv', 'download', 'pdf'],
      category: 'Navigation',
      shortcut: 'Alt+R',
    },
    {
      id: 'contact',
      title: 'Contact Me',
      description: 'Get in touch',
      icon: EnvelopeIcon,
      action: () => { navigate('/contact'); onClose() },
      keywords: ['email', 'message', 'reach'],
      category: 'Navigation',
      shortcut: 'Alt+C',
    },
    {
      id: 'source',
      title: 'View Source Code',
      description: 'Open GitHub repository',
      icon: CommandLineIcon,
      action: () => { window.open('https://github.com/TayyabManan/GIS-Portfolio', '_blank'); onClose() },
      keywords: ['github', 'code', 'repository'],
      category: 'External',
      shortcut: 'Alt+G',
    },
    {
      id: 'toggle-theme',
      title: theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode',
      description: theme === 'dark' ? 'Use the light color scheme' : 'Use the dark color scheme',
      icon: theme === 'dark' ? SunIcon : MoonIcon,
      action: () => { toggleTheme(); onClose() },
      keywords: ['theme', 'dark', 'light', 'mode', 'toggle'],
      category: 'Settings',
    },
    ...(preference !== 'system' ? [{
      id: 'system-theme',
      title: 'Use System Theme',
      description: 'Follow your operating system preference',
      icon: ComputerDesktopIcon,
      action: () => { setPreference('system'); onClose() },
      keywords: ['theme', 'system', 'auto', 'os'],
      category: 'Settings',
    }] : []),
  ], [navigate, onClose, theme, preference, toggleTheme, setPreference])

  // Load recent commands
  useEffect(() => {
    const saved = localStorage.getItem('recentCommands')
    if (saved) {
      try { setRecentCommands(JSON.parse(saved)) } catch { /* ignore */ }
    }
  }, [])

  const executeCommand = useCallback((command: CommandItem) => {
    const updated = [command.id, ...recentCommands.filter(id => id !== command.id)].slice(0, 5)
    setRecentCommands(updated)
    localStorage.setItem('recentCommands', JSON.stringify(updated))
    command.action()
  }, [recentCommands])

  const allCommands = useMemo(() => [...defaultCommands, ...additionalCommands], [defaultCommands, additionalCommands])

  const filteredCommands = useMemo(() => {
    if (!search) return allCommands
    const searchLower = search.toLowerCase()
    return allCommands.filter(command => {
      return command.title.toLowerCase().includes(searchLower)
        || command.description?.toLowerCase().includes(searchLower)
        || command.keywords?.some(k => k.toLowerCase().includes(searchLower))
        || command.category?.toLowerCase().includes(searchLower)
    })
  }, [search, allCommands])

  const groupedCommands = useMemo(() => {
    const groups: Record<string, CommandItem[]> = {}

    if (!search && recentCommands.length > 0) {
      const recentItems = recentCommands
        .map(id => allCommands.find(cmd => cmd.id === id))
        .filter(Boolean) as CommandItem[]
      if (recentItems.length > 0) groups['Recent'] = recentItems
    }

    filteredCommands.forEach(command => {
      if (!search && recentCommands.includes(command.id)) return
      const category = command.category || 'Other'
      if (!groups[category]) groups[category] = []
      groups[category].push(command)
    })

    return groups
  }, [filteredCommands, search, recentCommands, allCommands])

  // Flat list for keyboard nav
  const flatCommands = useMemo(() => {
    return Object.values(groupedCommands).flat()
  }, [groupedCommands])

  // Animate in/out
  useEffect(() => {
    if (isOpen) {
      setSearch('')
      setSelectedIndex(0)
      // Trigger animation on next frame
      requestAnimationFrame(() => setVisible(true))
    } else {
      setVisible(false)
    }
  }, [isOpen])

  // Focus input when opened
  useEffect(() => {
    if (isOpen && visible) {
      inputRef.current?.focus()
    }
  }, [isOpen, visible])

  // Reset selection on search change
  useEffect(() => { setSelectedIndex(0) }, [search])

  // Keyboard handling
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          e.preventDefault()
          onClose()
          break
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex(prev => (prev + 1) % flatCommands.length)
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex(prev => (prev - 1 + flatCommands.length) % flatCommands.length)
          break
        case 'Enter':
          e.preventDefault()
          if (flatCommands[selectedIndex]) executeCommand(flatCommands[selectedIndex])
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, flatCommands, selectedIndex, onClose, executeCommand])

  // Scroll selected item into view
  useEffect(() => {
    if (!listRef.current) return
    const selected = listRef.current.querySelector(`[data-index="${selectedIndex}"]`) as HTMLElement
    if (selected) {
      selected.scrollIntoView({ block: 'nearest' })
    }
  }, [selectedIndex])

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  let itemIndex = -1

  return (
    <div className="fixed inset-0 z-[120]" onWheel={(e) => e.stopPropagation()} data-lenis-prevent>
      {/* Backdrop */}
      <div
        className={cn(
          'absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-200',
          visible ? 'opacity-100' : 'opacity-0'
        )}
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="fixed inset-0 z-10 overflow-y-auto p-4 sm:p-6 md:p-20" onClick={onClose}>
        <div
          onClick={(e) => e.stopPropagation()}
          className={cn(
            'mx-auto max-w-2xl divide-y divide-[var(--border)] overflow-hidden rounded-xl bg-[var(--background)] shadow-2xl ring-1 ring-[var(--border)] transition-all duration-200',
            visible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-4'
          )}
        >
          {/* Search Input */}
          <div className="relative">
            <MagnifyingGlassIcon
              className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-[var(--text-tertiary)]"
              aria-hidden="true"
            />
            <input
              ref={inputRef}
              type="text"
              className="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-[var(--text)] placeholder:text-[var(--text-tertiary)] focus:ring-0 focus:outline-none sm:text-sm"
              placeholder="Search commands..."
              aria-label="Search commands"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="absolute right-4 top-3 text-xs text-[var(--text-tertiary)]">
              Press <kbd className="px-1.5 py-0.5 bg-[var(--background-secondary)] rounded">ESC</kbd> to close
            </div>
          </div>

          {/* Results */}
          {flatCommands.length > 0 ? (
            <div ref={listRef} className="max-h-80 overflow-y-auto overscroll-contain py-2 text-sm text-[var(--text)]">
              {Object.entries(groupedCommands).map(([category, commands]) => (
                <div key={category}>
                  <div className="bg-[var(--background-secondary)] px-4 py-2 text-xs font-semibold text-[var(--text-secondary)]">
                    {category}
                  </div>
                  {commands.map((command) => {
                    itemIndex++
                    const idx = itemIndex
                    const isSelected = idx === selectedIndex
                    const Icon = command.icon

                    return (
                      <div
                        key={command.id}
                        data-index={idx}
                        className={cn(
                          'cursor-pointer select-none px-4 py-2.5 flex items-center justify-between group transition-colors duration-75',
                          isSelected
                            ? 'bg-[var(--primary)] text-white'
                            : 'hover:bg-[var(--background-secondary)]'
                        )}
                        onClick={() => executeCommand(command)}
                        onMouseMove={() => setSelectedIndex(idx)}
                      >
                        <div className="flex items-center gap-3">
                          {Icon && (
                            <Icon className={cn('h-5 w-5 flex-shrink-0', isSelected ? 'text-white' : 'text-[var(--text-tertiary)]')} />
                          )}
                          <div>
                            <p className={cn('font-medium', isSelected ? 'text-white' : 'text-[var(--text)]')}>
                              {command.title}
                            </p>
                            {command.description && (
                              <p className={cn('text-xs', isSelected ? 'text-white/80' : 'text-[var(--text-secondary)]')}>
                                {command.description}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {command.shortcut && (
                            <kbd className={cn(
                              'hidden sm:inline-block px-1.5 py-0.5 text-xs rounded',
                              isSelected ? 'bg-white/20 text-white' : 'bg-[var(--background-tertiary)] text-[var(--text-secondary)]'
                            )}>
                              {command.shortcut}
                            </kbd>
                          )}
                          <ArrowRightIcon
                            className={cn(
                              'h-4 w-4 transition-opacity duration-75',
                              isSelected ? 'text-white opacity-100' : 'text-[var(--text-tertiary)] opacity-0 group-hover:opacity-100'
                            )}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          ) : (
            <div className="px-6 py-14 text-center text-sm sm:px-14">
              <CommandLineIcon className="mx-auto h-6 w-6 text-[var(--text-tertiary)]" aria-hidden="true" />
              <p className="mt-4 font-medium text-[var(--text)]">
                {search ? `No results for "${search}"` : 'No commands found'}
              </p>
              {search && (
                <p className="mt-2 text-xs text-[var(--text-secondary)]">
                  Try searching for: projects, about, resume, or theme
                </p>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-[var(--border)] bg-[var(--background-secondary)] px-4 py-2.5 text-xs text-[var(--text-secondary)]">
            <div className="flex gap-2">
              <span>Navigate</span>
              <kbd className="px-1.5 py-0.5 bg-[var(--background)] rounded">↑↓</kbd>
            </div>
            <div className="flex gap-2">
              <span>Select</span>
              <kbd className="px-1.5 py-0.5 bg-[var(--background)] rounded">Enter</kbd>
            </div>
            <div className="flex gap-2">
              <span>Close</span>
              <kbd className="px-1.5 py-0.5 bg-[var(--background)] rounded">ESC</kbd>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function useCommandPalette() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(true)
        localStorage.setItem('command-palette-used', 'true')
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return {
    isOpen,
    open: () => { setIsOpen(true); localStorage.setItem('command-palette-used', 'true') },
    close: () => setIsOpen(false),
    toggle: () => setIsOpen(prev => !prev),
  }
}
