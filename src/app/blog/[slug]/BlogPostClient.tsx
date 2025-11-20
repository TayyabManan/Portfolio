'use client'

import Link from 'next/link'
import Image from 'next/image'
import { DynamicReactMarkdown } from '@/lib/dynamic-imports'
import { CalendarIcon, ClockIcon, UserIcon, ArrowLeftIcon, TagIcon } from '@heroicons/react/24/outline'
import { BlogPostWithContent } from '@/lib/markdown'
import ReadingProgress from '@/components/ui/ReadingProgress'
import ShareButtons from '@/components/ui/ShareButtons'
import CodeBlock from '@/components/ui/CodeBlock'
import TableOfContents from '@/components/ui/TableOfContents'
import BackToTop from '@/components/ui/BackToTop'
import { extractTextContent } from '@/lib/utils'

interface BlogPostClientProps {
  post: BlogPostWithContent
}

export default function BlogPostClient({ post }: BlogPostClientProps) {
  const postUrl = `https://tayyabmanan.com/blog/${post.slug}`
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Helper function to generate heading IDs consistently with TableOfContents
  const generateHeadingId = (children: React.ReactNode): string => {
    const textContent = typeof children === 'string' ? children : extractTextContent(children)

    let id = textContent
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '')

    // Ensure ID starts with a letter (HTML requirement)
    if (!/^[a-z]/.test(id)) {
      id = `heading-${id}`
    }

    // Ensure ID is not empty
    if (!id) {
      id = `heading-${Math.random().toString(36).substr(2, 9)}`
    }

    return id
  }

  return (
    <>
      <ReadingProgress />
      <div className="min-h-screen relative py-24">
        {/* Background with gradient */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Beautiful gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--hero-gradient-start)] via-[var(--hero-gradient-mid)] to-[var(--hero-gradient-end)]" />

        {/* Subtle pattern overlay */}
        <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="blog-post-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="50" cy="50" r="1" fill="var(--border)" opacity="0.1" />
              <circle cx="25" cy="25" r="0.5" fill="var(--primary)" opacity="0.08" />
              <circle cx="75" cy="25" r="0.5" fill="var(--accent)" opacity="0.08" />
              <circle cx="25" cy="75" r="0.5" fill="var(--info)" opacity="0.08" />
              <circle cx="75" cy="75" r="0.5" fill="var(--success)" opacity="0.08" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#blog-post-pattern)" />
        </svg>

        {/* Subtle noise texture */}
        <div className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Back Button */}
        <div className="mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            <span>Back to Blog</span>
          </Link>
        </div>

        {/* Two-column layout: Content + TOC */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 lg:gap-12">
          {/* Main Content */}
          <article className="min-w-0">
            {/* Header */}
            <header className="mb-8">
          {/* Category Badge */}
          <div className="mb-4">
            <span className="inline-block px-3 py-1 text-xs font-medium bg-[var(--primary)]/10 text-[var(--primary)] rounded-full">
              {post.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-[var(--text)] mb-4">
            {post.title}
          </h1>

          {/* Description */}
          <p className="text-xl text-[var(--text-secondary)] mb-6">
            {post.description}
          </p>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--text-tertiary)] pb-6 border-b border-[var(--border)]">
            <div className="flex items-center gap-2">
              <UserIcon className="h-4 w-4" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              <time dateTime={post.date}>{formatDate(post.date)}</time>
            </div>
            {post.readTime && (
              <div className="flex items-center gap-2">
                <ClockIcon className="h-4 w-4" />
                <span>{post.readTime}</span>
              </div>
            )}
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <TagIcon className="h-4 w-4 text-[var(--text-tertiary)]" />
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-xs font-medium bg-[var(--background-secondary)] text-[var(--text-secondary)] rounded-full border border-[var(--border)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
            </header>

            {/* Featured Image */}
            {post.image && (
              <div className="mb-12 rounded-2xl overflow-hidden relative w-full aspect-video">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* Mobile TOC - Shows before content */}
            <TableOfContents content={post.content} variant="mobile" />

            {/* Content */}
            <div className="prose prose-lg max-w-none">
          <DynamicReactMarkdown
            components={{
              h1: ({ children }) => {
                const id = generateHeadingId(children)
                return (
                  <h1 id={id} className="text-3xl font-bold tracking-tight text-[var(--text)] mt-8 mb-4">
                    {children}
                  </h1>
                )
              },
              h2: ({ children }) => {
                const id = generateHeadingId(children)
                return (
                  <h2 id={id} className="text-2xl font-bold tracking-tight text-[var(--text)] mt-8 mb-4">
                    {children}
                  </h2>
                )
              },
              h3: ({ children }) => {
                const id = generateHeadingId(children)
                return (
                  <h3 id={id} className="text-xl font-bold tracking-tight text-[var(--text)] mt-6 mb-3">
                    {children}
                  </h3>
                )
              },
              p: ({ children }) => (
                <p className="text-base text-[var(--text-secondary)] leading-relaxed mb-4">
                  {children}
                </p>
              ),
              ul: ({ children }) => (
                <ul className="list-disc list-inside space-y-2 mb-4 text-[var(--text-secondary)]">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-inside space-y-2 mb-4 text-[var(--text-secondary)]">
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li className="text-base leading-relaxed">{children}</li>
              ),
              code: ({ children, className }) => {
                const isInline = !className
                return isInline ? (
                  <code className="px-1.5 py-0.5 bg-[var(--background-secondary)] text-[var(--primary)] rounded text-sm font-mono">
                    {children}
                  </code>
                ) : (
                  <code className="block p-4 bg-[var(--background-secondary)] text-[var(--text)] rounded-lg overflow-x-auto text-sm font-mono mb-4">
                    {children}
                  </code>
                )
              },
              pre: ({ children }) => (
                <CodeBlock className="bg-[var(--background-secondary)] p-4 rounded-lg overflow-x-auto mb-4">
                  {children}
                </CodeBlock>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-[var(--primary)] pl-4 italic text-[var(--text-secondary)] my-4">
                  {children}
                </blockquote>
              ),
              a: ({ href, children }) => (
                <a
                  href={href}
                  className="text-[var(--primary)] hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {children}
                </a>
              ),
              img: ({ src, alt }) => (
                <Image
                  src={typeof src === 'string' ? src : ''}
                  alt={typeof alt === 'string' ? alt : ''}
                  width={800}
                  height={450}
                  className="rounded-lg my-6 w-full h-auto"
                  unoptimized
                />
              ),
            }}
          >
                {post.content}
              </DynamicReactMarkdown>
            </div>

            {/* Share Section */}
            <div className="mt-12 pt-8 border-t border-[var(--border)]">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 text-[var(--primary)] hover:text-[var(--primary-hover)] transition-colors font-medium"
                >
                  <ArrowLeftIcon className="h-4 w-4" />
                  <span>Back to all posts</span>
                </Link>
                <ShareButtons
                  title={post.title}
                  url={postUrl}
                />
              </div>
            </div>
          </article>

          {/* Desktop TOC - Sticky Sidebar (right column) */}
          <TableOfContents content={post.content} variant="desktop" />
        </div>
      </div>
    </div>

    {/* Back to Top Button */}
    <BackToTop />
    </>
  )
}
