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

// Lazy load markdown renderer (react-markdown + remark-gfm)
export const DynamicReactMarkdown = dynamic(
  () => import('@/components/ui/Markdown'),
  {
    loading: LoadingSpinner,
    ssr: true
  }
)