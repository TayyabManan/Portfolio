'use client'

import { useState } from 'react'
import { ClipboardIcon, CheckIcon } from '@heroicons/react/24/outline'

interface CodeBlockProps {
  children: React.ReactNode
  className?: string
}

export default function CodeBlock({ children, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    const code = typeof children === 'string' ? children : extractTextFromChildren(children)

    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Silently fail - clipboard API may not be available
    }
  }

  const extractTextFromChildren = (node: React.ReactNode): string => {
    if (typeof node === 'string') return node
    if (Array.isArray(node)) return node.map(extractTextFromChildren).join('')
    if (node && typeof node === 'object' && 'props' in node) {
      const element = node as { props: { children?: React.ReactNode } }
      return extractTextFromChildren(element.props.children)
    }
    return ''
  }

  return (
    <div className="relative group">
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 p-2.5 min-h-[44px] min-w-[44px] rounded-lg bg-[var(--background)] border border-[var(--border)] hover:bg-[var(--background-secondary)] transition-colors cursor-pointer flex items-center justify-center"
        title={copied ? 'Copied!' : 'Copy code'}
      >
        {copied ? (
          <CheckIcon className="h-4 w-4 text-[var(--success)]" />
        ) : (
          <ClipboardIcon className="h-4 w-4 text-[var(--text-secondary)]" />
        )}
      </button>
      <pre className={className}>
        {children}
      </pre>
    </div>
  )
}
