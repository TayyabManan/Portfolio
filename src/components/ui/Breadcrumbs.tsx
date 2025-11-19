'use client'

import React from 'react'
import Link from 'next/link'
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface BreadcrumbItem {
  label: string
  href?: string
  icon?: React.ReactNode
  current?: boolean
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[]
  separator?: React.ReactNode
  className?: string
  showHome?: boolean
  maxItems?: number
  variant?: 'default' | 'contained' | 'minimal'
  size?: 'sm' | 'md' | 'lg'
  animated?: boolean
}

export function Breadcrumbs({
  items,
  separator = <ChevronRightIcon className="w-4 h-4" />,
  className,
  showHome = true,
  maxItems = 0,
  variant = 'default',
  size = 'md',
  animated = true,
}: BreadcrumbsProps) {
  // Get pathname directly without reactive tracking - component remounts on navigation anyway
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/'

  // Auto-generate breadcrumbs from pathname if items not provided
  const breadcrumbItems = items || generateBreadcrumbsFromPath(pathname, showHome)
  
  // Apply maxItems limit if specified
  const displayItems = maxItems > 0 && breadcrumbItems.length > maxItems
    ? [
        ...breadcrumbItems.slice(0, 1),
        { label: '...', href: undefined },
        ...breadcrumbItems.slice(-(maxItems - 2))
      ]
    : breadcrumbItems

  const containerClasses = cn(
    'flex items-center',
    variant === 'contained' && 'px-4 py-2 bg-[var(--background-secondary)] rounded-lg',
    variant === 'minimal' && 'text-sm',
    size === 'sm' && 'text-sm space-x-1',
    size === 'md' && 'text-base space-x-2',
    size === 'lg' && 'text-lg space-x-3',
    className
  )

  const itemClasses = (isCurrent: boolean) => cn(
    'inline-flex items-center gap-1 transition-colors duration-200',
    isCurrent
      ? 'text-[var(--text)] font-medium cursor-default'
      : 'text-[var(--text-secondary)] hover:text-[var(--text)]',
    size === 'sm' && 'text-sm',
    size === 'md' && 'text-base',
    size === 'lg' && 'text-lg'
  )

  const separatorClasses = cn(
    'text-[var(--text-tertiary)]',
    size === 'sm' && 'mx-1',
    size === 'md' && 'mx-2',
    size === 'lg' && 'mx-3'
  )

  return (
    <nav aria-label="Breadcrumb" className={containerClasses}>
      <ol className="flex items-center space-x-1 md:space-x-2">
        {displayItems.map((item, index) => {
          const isLast = index === displayItems.length - 1
          const itemContent = (
            <>
              {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
              <span className={cn(
                'truncate max-w-[200px]',
                variant === 'minimal' && 'sr-only sm:not-sr-only'
              )}>
                {item.label}
              </span>
            </>
          )

          const breadcrumbItem = (
            <li key={index} className="flex items-center">
              {animated ? (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center"
                >
                  {item.href && !isLast ? (
                    <Link href={item.href} className={itemClasses(false)}>
                      {itemContent}
                    </Link>
                  ) : (
                    <span 
                      className={itemClasses(isLast)}
                      aria-current={isLast ? 'page' : undefined}
                    >
                      {itemContent}
                    </span>
                  )}
                  {!isLast && (
                    <span className={separatorClasses} aria-hidden="true">
                      {separator}
                    </span>
                  )}
                </motion.div>
              ) : (
                <>
                  {item.href && !isLast ? (
                    <Link href={item.href} className={itemClasses(false)}>
                      {itemContent}
                    </Link>
                  ) : (
                    <span 
                      className={itemClasses(isLast)}
                      aria-current={isLast ? 'page' : undefined}
                    >
                      {itemContent}
                    </span>
                  )}
                  {!isLast && (
                    <span className={separatorClasses} aria-hidden="true">
                      {separator}
                    </span>
                  )}
                </>
              )}
            </li>
          )

          return breadcrumbItem
        })}
      </ol>
    </nav>
  )
}

function generateBreadcrumbsFromPath(pathname: string, showHome: boolean): BreadcrumbItem[] {
  const paths = pathname.split('/').filter(Boolean)
  const breadcrumbs: BreadcrumbItem[] = []

  if (showHome) {
    breadcrumbs.push({
      label: 'Home',
      href: '/',
      icon: <HomeIcon className="w-4 h-4" />,
    })
  }

  let currentPath = ''
  paths.forEach((path, index) => {
    currentPath += `/${path}`
    const label = formatPathSegment(path)
    const isLast = index === paths.length - 1

    breadcrumbs.push({
      label,
      href: isLast ? undefined : currentPath,
      current: isLast,
    })
  })

  return breadcrumbs
}

function formatPathSegment(segment: string): string {
  // Handle special cases
  const specialCases: Record<string, string> = {
    'gis': 'GIS',
    'api': 'API',
    'ui': 'UI',
    'ux': 'UX',
  }

  const lower = segment.toLowerCase()
  if (specialCases[lower]) {
    return specialCases[lower]
  }

  // Convert kebab-case or snake_case to Title Case
  return segment
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase())
}

// Schema.org structured data for breadcrumbs
export function BreadcrumbSchema({ items }: { items: BreadcrumbItem[] }) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': items
      .filter(item => item.href)
      .map((item, index) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'name': item.label,
        'item': `${process.env.NEXT_PUBLIC_SITE_URL || ''}${item.href}`,
      })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

// Mobile-optimized breadcrumbs with dropdown
export function MobileBreadcrumbs({ items, ...props }: BreadcrumbsProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/'
  const breadcrumbItems = items || generateBreadcrumbsFromPath(pathname, true)
  
  if (breadcrumbItems.length <= 2) {
    return <Breadcrumbs items={breadcrumbItems} {...props} />
  }

  const firstItem = breadcrumbItems[0]
  const lastItem = breadcrumbItems[breadcrumbItems.length - 1]
  const middleItems = breadcrumbItems.slice(1, -1)

  return (
    <nav aria-label="Breadcrumb" className="flex items-center space-x-2">
      {firstItem.href ? (
        <Link href={firstItem.href} className="text-[var(--text-secondary)] hover:text-[var(--text)]">
          {firstItem.icon || firstItem.label}
        </Link>
      ) : (
        <span className="text-[var(--text-secondary)]">{firstItem.icon || firstItem.label}</span>
      )}

      <ChevronRightIcon className="w-4 h-4 text-[var(--text-tertiary)]" />

      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-[var(--text-secondary)] hover:text-[var(--text)]"
          aria-label="Show more breadcrumbs"
        >
          ...
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 mt-1 bg-[var(--background)] border border-[var(--border)] rounded-md shadow-lg z-10">
            {middleItems.map((item, index) => (
              <Link
                key={index}
                href={item.href || '#'}
                className="block px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--background-secondary)]"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>

      <ChevronRightIcon className="w-4 h-4 text-[var(--text-tertiary)]" />

      <span className="text-[var(--text)] font-medium">
        {lastItem.label}
      </span>
    </nav>
  )
}