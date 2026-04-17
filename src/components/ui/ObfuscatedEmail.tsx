'use client'

import { useState, useEffect } from 'react'
import { decodeEmail } from '@/lib/utils'

interface ObfuscatedEmailProps {
  className?: string
  showAddress?: boolean
  children?: React.ReactNode
}

export default function ObfuscatedEmail({ className, showAddress = true, children }: ObfuscatedEmailProps) {
  const [email, setEmail] = useState<string | null>(null)

  useEffect(() => {
    setEmail(decodeEmail())
  }, [])

  if (!email) {
    // Pre-hydration: render children if present (icons/labels), otherwise empty span to avoid layout shift
    return <span className={className}>{children || '\u00A0'}</span>
  }

  return (
    <a href={`mailto:${email}`} className={className}>
      {children || (showAddress ? email : null)}
    </a>
  )
}
