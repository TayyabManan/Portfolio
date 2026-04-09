import { clsx, type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
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

