'use client'

import Link from 'next/link'
import Image from 'next/image'
import { DynamicReactMarkdown } from '@/lib/dynamic-imports'
import { CalendarIcon, ClockIcon, UserIcon, ArrowLeftIcon, ArrowRightIcon, TagIcon } from '@heroicons/react/24/outline'
import { BlogPostWithContent, BlogPost } from '@/lib/markdown'
import ReadingProgress from '@/components/ui/ReadingProgress'
import ShareButtons from '@/components/ui/ShareButtons'
import CodeBlock from '@/components/ui/CodeBlock'
import TableOfContents from '@/components/ui/TableOfContents'
import BackToTop from '@/components/ui/BackToTop'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { extractTextContent } from '@/lib/utils'

interface BlogPostClientProps {
  post: BlogPostWithContent
  adjacentPosts?: { prev: BlogPost | null; next: BlogPost | null }
}

export default function BlogPostClient({ post, adjacentPosts }: BlogPostClientProps) {
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
      <div className="min-h-screen py-16 sm:py-24 bg-[var(--background)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <div className="mb-8">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Blog', href: '/blog' },
              { label: post.category, current: true },
            ]}
            size="sm"
            animated={false}
          />
        </div>

        {/* Two-column layout: Content + TOC */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 lg:gap-12">
          {/* Main Content */}
          <article className="min-w-0">
            {/* Header */}
            <header className="mb-8">
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
              table: ({ children }) => (
                <div className="overflow-x-auto my-6 rounded-lg border border-[var(--border)]">
                  <table className="w-full text-sm">{children}</table>
                </div>
              ),
              thead: ({ children }) => (
                <thead className="bg-[var(--background-tertiary)]">{children}</thead>
              ),
              th: ({ children }) => (
                <th className="px-4 py-3 text-left font-semibold text-[var(--text)] border-b border-[var(--border)]">{children}</th>
              ),
              td: ({ children }) => (
                <td className="px-4 py-3 text-[var(--text-secondary)] border-b border-[var(--border)]">{children}</td>
              ),
            }}
          >
                {post.content}
              </DynamicReactMarkdown>
            </div>

            {/* Previous / Next Post Navigation */}
            {adjacentPosts && (adjacentPosts.prev || adjacentPosts.next) && (
              <nav className="mt-12 pt-8 border-t border-[var(--border)]" aria-label="Adjacent posts">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {adjacentPosts.prev ? (
                    <Link
                      href={`/blog/${adjacentPosts.prev.slug}`}
                      className="group flex flex-col gap-1 p-4 rounded-lg border border-[var(--border)] hover:border-[var(--primary)] transition-colors"
                    >
                      <span className="text-xs text-[var(--text-tertiary)] flex items-center gap-1">
                        <ArrowLeftIcon className="h-3 w-3" /> Previous
                      </span>
                      <span className="text-sm font-medium text-[var(--text)] group-hover:text-[var(--primary)] transition-colors">
                        {adjacentPosts.prev.title}
                      </span>
                    </Link>
                  ) : <div />}
                  {adjacentPosts.next && (
                    <Link
                      href={`/blog/${adjacentPosts.next.slug}`}
                      className="group flex flex-col items-end gap-1 p-4 rounded-lg border border-[var(--border)] hover:border-[var(--primary)] transition-colors sm:col-start-2"
                    >
                      <span className="text-xs text-[var(--text-tertiary)] flex items-center gap-1">
                        Next <ArrowRightIcon className="h-3 w-3" />
                      </span>
                      <span className="text-sm font-medium text-[var(--text)] group-hover:text-[var(--primary)] transition-colors text-left">
                        {adjacentPosts.next.title}
                      </span>
                    </Link>
                  )}
                </div>
              </nav>
            )}

            {/* Share Section */}
            <div className="mt-8 pt-8 border-t border-[var(--border)]">
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
