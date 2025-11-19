'use client'

import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import {
  MagnifyingGlassIcon,
  HomeIcon,
  DocumentTextIcon,
  BriefcaseIcon,
  UserIcon,
  EnvelopeIcon,
  CommandLineIcon,
  ArrowRightIcon,
  SunIcon,
  NewspaperIcon,
} from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'
import { toast } from '@/components/ui/Toast'
import { useTheme } from '@/contexts/ThemeContext'

// Custom navigation function using browser history API
function navigateTo(path: string) {
  window.history.pushState({}, '', path)
  // Trigger a popstate event so Next.js detects the navigation
  window.dispatchEvent(new PopStateEvent('popstate'))
}

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
  const { toggleTheme, actualTheme } = useTheme()
  const [search, setSearch] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [recentCommands, setRecentCommands] = useState<string[]>([])
  const listRef = React.useRef<HTMLUListElement>(null)

  const defaultCommands: CommandItem[] = useMemo(() => [
    {
      id: 'home',
      title: 'Go to Home',
      description: 'Navigate to the homepage',
      icon: HomeIcon,
      action: () => {
        navigateTo('/')
        onClose()
      },
      keywords: ['home', 'main', 'index'],
      category: 'Navigation',
      shortcut: 'Alt+H',
    },
    {
      id: 'projects',
      title: 'View Projects',
      description: 'Browse all projects',
      icon: BriefcaseIcon,
      action: () => {
        navigateTo('/projects')
        onClose()
      },
      keywords: ['work', 'portfolio', 'gis'],
      category: 'Navigation',
      shortcut: 'Alt+P',
    },
    {
      id: 'blog',
      title: 'Read Blog',
      description: 'Browse blog posts and articles',
      icon: NewspaperIcon,
      action: () => {
        navigateTo('/blog')
        onClose()
      },
      keywords: ['blog', 'articles', 'posts', 'writing'],
      category: 'Navigation',
      shortcut: 'Alt+B',
    },
    {
      id: 'about',
      title: 'About Me',
      description: 'Learn more about my background',
      icon: UserIcon,
      action: () => {
        navigateTo('/about')
        onClose()
      },
      keywords: ['bio', 'background', 'experience'],
      category: 'Navigation',
      shortcut: 'Alt+A',
    },
    {
      id: 'resume',
      title: 'View Resume',
      description: 'Download or view my resume',
      icon: DocumentTextIcon,
      action: () => {
        navigateTo('/resume')
        onClose()
      },
      keywords: ['cv', 'download', 'pdf'],
      category: 'Navigation',
      shortcut: 'Alt+R',
    },
    {
      id: 'contact',
      title: 'Contact Me',
      description: 'Get in touch',
      icon: EnvelopeIcon,
      action: () => {
        navigateTo('/contact')
        onClose()
      },
      keywords: ['email', 'message', 'reach'],
      category: 'Navigation',
      shortcut: 'Alt+C',
    },
    {
      id: 'theme-toggle',
      title: 'Toggle Theme',
      description: 'Switch between light and dark mode',
      icon: SunIcon,
      action: () => {
        toggleTheme()
        const newTheme = actualTheme === 'light' ? 'dark' : 'light'
        toast.success(`Switched to ${newTheme === 'light' ? 'Light' : 'Dark'} theme`)
        onClose()
      },
      keywords: ['theme', 'dark', 'light', 'switch', 'toggle', 'mode', 'appearance'],
      category: 'Settings',
      shortcut: 'Alt+T',
    },
    {
      id: 'source',
      title: 'View Source Code',
      description: 'Open GitHub repository',
      icon: CommandLineIcon,
      action: () => {
        window.open('https://github.com/TayyabManan/GIS-Portfolio', '_blank')
        onClose()
      },
      keywords: ['github', 'code', 'repository'],
      category: 'External',
      shortcut: 'Alt+G',
    },
  ], [onClose, toggleTheme, actualTheme])

  // Load recent commands from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentCommands')
    if (saved) {
      try {
        setRecentCommands(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to parse recent commands', e)
      }
    }
  }, [])

  // Update recent commands when a command is executed
  const executeCommand = useCallback((command: CommandItem) => {
    // Update recent commands
    const updated = [command.id, ...recentCommands.filter(id => id !== command.id)].slice(0, 5)
    setRecentCommands(updated)
    localStorage.setItem('recentCommands', JSON.stringify(updated))

    // Execute the command action
    command.action()
  }, [recentCommands])

  const allCommands = useMemo(() => {
    return [...defaultCommands, ...additionalCommands]
  }, [defaultCommands, additionalCommands])

  const filteredCommands = useMemo(() => {
    if (!search) return allCommands

    const searchLower = search.toLowerCase()
    return allCommands.filter(command => {
      const titleMatch = command.title.toLowerCase().includes(searchLower)
      const descMatch = command.description?.toLowerCase().includes(searchLower)
      const keywordMatch = command.keywords?.some(k => k.toLowerCase().includes(searchLower))
      const categoryMatch = command.category?.toLowerCase().includes(searchLower)
      
      return titleMatch || descMatch || keywordMatch || categoryMatch
    })
  }, [search, allCommands])

  const groupedCommands = useMemo(() => {
    const groups: Record<string, CommandItem[]> = {}

    // Add recent commands as the first group if no search and recent commands exist
    if (!search && recentCommands.length > 0) {
      const recentCommandItems = recentCommands
        .map(id => allCommands.find(cmd => cmd.id === id))
        .filter(Boolean) as CommandItem[]

      if (recentCommandItems.length > 0) {
        groups['Recent'] = recentCommandItems
      }
    }

    // Group remaining commands
    filteredCommands.forEach(command => {
      // Skip if already in recent commands
      if (!search && recentCommands.includes(command.id)) {
        return
      }

      const category = command.category || 'Other'
      if (!groups[category]) {
        groups[category] = []
      }
      groups[category].push(command)
    })

    return groups
  }, [filteredCommands, search, recentCommands, allCommands])

  const scrollToItem = useCallback((index: number) => {
    requestAnimationFrame(() => {
      const selectedElement = document.querySelector(`[data-command-index="${index}"]`) as HTMLElement
      const container = listRef.current
      
      if (selectedElement && container) {
        const containerRect = container.getBoundingClientRect()
        const elementRect = selectedElement.getBoundingClientRect()
        
        if (elementRect.bottom > containerRect.bottom) {
          container.scrollTop += elementRect.bottom - containerRect.bottom + 10
        } else if (elementRect.top < containerRect.top) {
          container.scrollTop -= containerRect.top - elementRect.top + 10
        }
      }
    })
  }, [])

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isOpen) return
    
    if (e.key === 'Escape') {
      e.preventDefault()
      e.stopPropagation()
      onClose()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      e.stopPropagation()
      setSelectedIndex(prev => {
        const newIndex = prev < filteredCommands.length - 1 ? prev + 1 : 0
        scrollToItem(newIndex)
        return newIndex
      })
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      e.stopPropagation()
      setSelectedIndex(prev => {
        const newIndex = prev > 0 ? prev - 1 : filteredCommands.length - 1
        scrollToItem(newIndex)
        return newIndex
      })
    } else if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
      e.preventDefault()
      e.stopPropagation()
      executeCommand(filteredCommands[selectedIndex])
    }
  }, [filteredCommands, selectedIndex, isOpen, scrollToItem, onClose, executeCommand])

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, handleKeyDown])

  useEffect(() => {
    setSelectedIndex(0)
  }, [search])

  useEffect(() => {
    if (isOpen) {
      setSearch('')
      setSelectedIndex(0)
    }
  }, [isOpen])

  // Lock body scroll when command palette is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  let currentIndex = -1

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={onClose}
        onKeyDown={(e: React.KeyboardEvent) => {
          if (e.key === 'Escape') {
            e.preventDefault()
            e.stopPropagation()
            onClose()
          }
        }}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto p-4 sm:p-6 md:p-20">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="mx-auto max-w-2xl transform divide-y divide-[var(--border)] overflow-hidden rounded-xl bg-[var(--background)] shadow-2xl ring-1 ring-black/5 dark:ring-white/10 transition-all">
              <div className="relative">
                <MagnifyingGlassIcon
                  className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-[var(--text-tertiary)]"
                  aria-hidden="true"
                />
                <input
                  type="text"
                  className="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-[var(--text)] placeholder:text-[var(--text-tertiary)] focus:ring-0 sm:text-sm"
                  placeholder="Search commands..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  autoFocus
                />
                <div className="absolute right-4 top-3 text-xs text-[var(--text-tertiary)]">
                  Press <kbd className="px-1.5 py-0.5 bg-[var(--background-secondary)] rounded">ESC</kbd> to close
                </div>
              </div>

              {filteredCommands.length > 0 ? (
                <ul ref={listRef} className="max-h-80 scroll-py-2 overflow-y-auto py-2 text-sm text-[var(--text)]">
                  {Object.entries(groupedCommands).map(([category, commands]) => (
                    <li key={category}>
                      <h2 className="bg-[var(--background-secondary)] px-4 py-2 text-xs font-semibold text-[var(--text-secondary)]">
                        {category}
                      </h2>
                      <ul className="text-sm">
                        {commands.map((command) => {
                          currentIndex++
                          const isSelected = currentIndex === selectedIndex
                          const Icon = command.icon

                          return (
                            <li
                              key={command.id}
                              data-command-index={currentIndex}
                              className={cn(
                                'cursor-pointer select-none px-4 py-2 flex items-center justify-between group',
                                isSelected
                                  ? 'bg-[var(--primary)] text-white'
                                  : 'hover:bg-[var(--background-secondary)]'
                              )}
                              onClick={() => executeCommand(command)}
                              onMouseEnter={() => setSelectedIndex(currentIndex)}
                            >
                              <div className="flex items-center gap-3">
                                {Icon && (
                                  <Icon
                                    className={cn(
                                      'h-5 w-5 flex-shrink-0',
                                      isSelected
                                        ? 'text-white'
                                        : 'text-[var(--text-tertiary)]'
                                    )}
                                  />
                                )}
                                <div>
                                  <p className={cn(
                                    'font-medium',
                                    isSelected ? 'text-white' : 'text-[var(--text)]'
                                  )}>
                                    {command.title}
                                  </p>
                                  {command.description && (
                                    <p className={cn(
                                      'text-xs',
                                      isSelected ? 'text-blue-100' : 'text-[var(--text-secondary)]'
                                    )}>
                                      {command.description}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {command.shortcut && (
                                  <kbd className={cn(
                                    'hidden sm:inline-block px-1.5 py-0.5 text-xs rounded',
                                    isSelected
                                      ? 'bg-white/20 text-white'
                                      : 'bg-[var(--background-tertiary)] text-[var(--text-secondary)]'
                                  )}>
                                    {command.shortcut}
                                  </kbd>
                                )}
                                <ArrowRightIcon
                                  className={cn(
                                    'h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity',
                                    isSelected ? 'text-white opacity-100' : 'text-[var(--text-tertiary)]'
                                  )}
                                />
                              </div>
                            </li>
                          )
                        })}
                      </ul>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-6 py-14 text-center text-sm sm:px-14">
                  <CommandLineIcon
                    className="mx-auto h-6 w-6 text-[var(--text-tertiary)]"
                    aria-hidden="true"
                  />
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
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export function useCommandPalette() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(true)
        // Mark that user has used the command palette
        localStorage.setItem('command-palette-used', 'true')
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return {
    isOpen,
    open: () => {
      setIsOpen(true)
      localStorage.setItem('command-palette-used', 'true')
    },
    close: () => setIsOpen(false),
    toggle: () => setIsOpen(prev => !prev),
  }
}