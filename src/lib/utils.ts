import { clsx, type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

// Email obfuscation: encoded so bots can't scrape plaintext from HTML/JS source
// Decoded client-side only via the ObfuscatedEmail component
export const ENCODED_EMAIL = [104,101,108,108,111,64,116,97,121,121,97,98,109,97,110,97,110,46,99,111,109]
export function decodeEmail(): string {
  return String.fromCharCode(...ENCODED_EMAIL)
}

/**
 * Safely extracts text content from React children
 */
export function extractTextContent(children: React.ReactNode): string {
  if (typeof children === 'string') {
    return children
  }

  if (Array.isArray(children)) {
    return children.map(extractTextContent).join('')
  }

  if (children && typeof children === 'object' && 'props' in children) {
    const element = children as React.ReactElement<{ children?: React.ReactNode }>
    return extractTextContent(element.props.children)
  }

  return String(children || '')
}

