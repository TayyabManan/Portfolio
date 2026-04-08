'use client'

import React, { useState, useRef, useEffect } from 'react'
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

interface ExpandableSectionProps {
  title: string
  children: React.ReactNode
  defaultExpanded?: boolean
  className?: string
  headerClassName?: string
  contentClassName?: string
  icon?: React.ReactNode
  badge?: string | number
  variant?: 'default' | 'card' | 'minimal'
  expandIcon?: 'chevron' | 'plus' | 'arrow'
  animationDuration?: number
  onToggle?: (isExpanded: boolean) => void
}

export function ExpandableSection({
  title,
  children,
  defaultExpanded = false,
  className,
  headerClassName,
  contentClassName,
  icon,
  badge,
  variant = 'default',
  expandIcon = 'chevron',
  animationDuration = 0.2,
  onToggle,
}: ExpandableSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  const contentRef = useRef<HTMLDivElement>(null)
  const [contentHeight, setContentHeight] = useState<number | 'auto'>('auto')

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight)
    }
  }, [children])

  const handleToggle = () => {
    const newState = !isExpanded
    setIsExpanded(newState)
    onToggle?.(newState)
  }

  const getExpandIcon = () => {
    switch (expandIcon) {
      case 'plus':
        return (
          <div className={cn(
            'w-5 h-5 relative transition-transform duration-200',
            isExpanded && 'rotate-45'
          )}>
            <span className="absolute inset-x-0 top-1/2 h-0.5 bg-current -translate-y-1/2" />
            <span className={cn(
              'absolute inset-y-0 left-1/2 w-0.5 bg-current -translate-x-1/2 transition-opacity',
              isExpanded && 'opacity-0'
            )} />
          </div>
        )
      case 'arrow':
        return (
          <ChevronRightIcon
            className={cn(
              'w-5 h-5 transition-transform duration-200',
              isExpanded && 'rotate-90'
            )}
          />
        )
      default:
        return (
          <ChevronDownIcon
            className={cn(
              'w-5 h-5 transition-transform duration-200',
              isExpanded && 'rotate-180'
            )}
          />
        )
    }
  }

  const containerClasses = cn(
    'overflow-hidden',
    variant === 'card' && 'border border-[var(--border)] rounded-lg shadow-sm',
    variant === 'minimal' && 'border-b border-[var(--border)]',
    className
  )

  const headerClasses = cn(
    'w-full flex items-center justify-between cursor-pointer select-none',
    'transition-colors duration-200',
    variant === 'default' && 'p-4 hover:bg-[var(--background-secondary)] rounded-lg',
    variant === 'card' && 'p-4 hover:bg-[var(--background-secondary)]',
    variant === 'minimal' && 'py-3 hover:text-[var(--primary)]',
    headerClassName
  )

  return (
    <div className={containerClasses}>
      <button
        className={headerClasses}
        onClick={handleToggle}
        aria-expanded={isExpanded}
        aria-controls={`expandable-content-${title}`}
      >
        <div className="flex items-center gap-3">
          {icon && <div className="flex-shrink-0">{icon}</div>}
          <span className="font-medium text-left">{title}</span>
          {badge && (
            <span className="px-2 py-0.5 text-xs font-medium bg-[var(--primary)]/10 text-[var(--primary)] rounded-full">
              {badge}
            </span>
          )}
        </div>
        {getExpandIcon()}
      </button>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: contentHeight, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: animationDuration, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div
              ref={contentRef}
              id={`expandable-content-${title}`}
              className={cn(
                variant === 'default' && 'px-4 pb-4',
                variant === 'card' && 'px-4 pb-4 border-t border-[var(--border)]',
                variant === 'minimal' && 'pb-3',
                contentClassName
              )}
            >
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

interface AccordionProps {
  items: Array<{
    id: string
    title: string
    content: React.ReactNode
    icon?: React.ReactNode
    badge?: string | number
  }>
  allowMultiple?: boolean
  defaultExpanded?: string[]
  className?: string
  variant?: 'default' | 'card' | 'minimal'
}

export function Accordion({
  items,
  allowMultiple = false,
  defaultExpanded = [],
  className,
  variant = 'default',
}: AccordionProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(
    new Set(defaultExpanded)
  )

  const handleToggle = (itemId: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev)
      
      if (newSet.has(itemId)) {
        newSet.delete(itemId)
      } else {
        if (!allowMultiple) {
          newSet.clear()
        }
        newSet.add(itemId)
      }
      
      return newSet
    })
  }

  return (
    <div className={cn('space-y-2', className)}>
      {items.map((item) => (
        <ExpandableSection
          key={item.id}
          title={item.title}
          defaultExpanded={expandedItems.has(item.id)}
          icon={item.icon}
          badge={item.badge}
          variant={variant}
          onToggle={() => handleToggle(item.id)}
        >
          {item.content}
        </ExpandableSection>
      ))}
    </div>
  )
}

interface TabsProps {
  tabs: Array<{
    id: string
    label: string
    content: React.ReactNode
    icon?: React.ReactNode
    badge?: string | number
  }>
  defaultTab?: string
  className?: string
  variant?: 'default' | 'pills' | 'underline'
  onChange?: (tabId: string) => void
}

export function Tabs({
  tabs,
  defaultTab,
  className,
  variant = 'default',
  onChange,
}: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id)

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    onChange?.(tabId)
  }

  const tabClasses = (isActive: boolean) => cn(
    'flex items-center gap-2 px-4 py-2 font-medium transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
    variant === 'default' && [
      'border-b-2',
      isActive
        ? 'border-[var(--primary)] text-[var(--primary)]'
        : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text)]'
    ],
    variant === 'pills' && [
      'rounded-lg',
      isActive
        ? 'bg-[var(--primary)] text-white'
        : 'text-[var(--text-secondary)] hover:bg-[var(--background-secondary)]'
    ],
    variant === 'underline' && [
      'relative',
      isActive
        ? 'text-[var(--primary)]'
        : 'text-[var(--text-secondary)] hover:text-[var(--text)]'
    ]
  )

  return (
    <div className={className}>
      <div
        className={cn(
          'flex',
          variant === 'default' && 'border-b border-[var(--border)]',
          variant === 'pills' && 'gap-2 p-1 bg-[var(--background-secondary)] rounded-lg',
          variant === 'underline' && 'gap-4'
        )}
        role="tablist"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`tabpanel-${tab.id}`}
            className={tabClasses(activeTab === tab.id)}
            onClick={() => handleTabChange(tab.id)}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.badge && (
              <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-[var(--background-tertiary)] rounded-full">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="mt-4">
        <AnimatePresence mode="wait">
          {tabs.map((tab) => 
            activeTab === tab.id && (
              <motion.div
                key={tab.id}
                role="tabpanel"
                id={`tabpanel-${tab.id}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {tab.content}
              </motion.div>
            )
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}