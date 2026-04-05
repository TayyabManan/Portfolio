import dynamic from 'next/dynamic'
import React from 'react'

// Loading component for dynamic imports
const LoadingSpinner = () => (
  <div className="flex justify-center items-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)]"></div>
  </div>
)

// Pre-configured dynamic imports for heavy components
export const DynamicResumeChatbot = dynamic(
  () => import('@/components/ui/ResumeChatbot'),
  {
    loading: LoadingSpinner,
    ssr: false
  }
)

// CommandPalette is a named export, so we need to handle it differently
export const DynamicCommandPalette = dynamic(
  () => import('@/components/ui/CommandPalette').then(mod => ({ default: mod.CommandPalette })),
  { 
    loading: LoadingSpinner,
    ssr: false 
  }
)

// Lazy load framer-motion components for non-critical animations
export const DynamicMotionDiv = dynamic(
  () => import('framer-motion').then(mod => ({ default: mod.motion.div })),
  {
    loading: LoadingSpinner,
    ssr: false
  }
)

// Lazy load markdown renderer (react-markdown + remark-gfm)
export const DynamicReactMarkdown = dynamic(
  () => import('@/components/ui/Markdown'),
  {
    loading: LoadingSpinner,
    ssr: true
  }
)