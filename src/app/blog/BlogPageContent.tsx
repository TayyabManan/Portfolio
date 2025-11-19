'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CalendarIcon, ClockIcon, TagIcon, FolderIcon } from '@heroicons/react/24/outline'
import { BlogPost } from '@/lib/markdown'

interface BlogPageContentProps {
  posts: BlogPost[]
}

export default function BlogPageContent({ posts }: BlogPageContentProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const categories = ['all', ...Array.from(new Set(posts.map(p => p.category)))]

  const filteredPosts = selectedCategory === 'all'
    ? posts
    : posts.filter(p => p.category === selectedCategory)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen relative py-24 overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0">
        {/* Beautiful gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--hero-gradient-start)] via-[var(--hero-gradient-mid)] to-[var(--hero-gradient-end)]" />

        {/* Subtle pattern overlay */}
        <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="blog-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="50" cy="50" r="1" fill="var(--border)" opacity="0.1" />
              <circle cx="25" cy="25" r="0.5" fill="var(--primary)" opacity="0.08" />
              <circle cx="75" cy="25" r="0.5" fill="var(--accent)" opacity="0.08" />
              <circle cx="25" cy="75" r="0.5" fill="var(--info)" opacity="0.08" />
              <circle cx="75" cy="75" r="0.5" fill="var(--success)" opacity="0.08" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#blog-pattern)" />
        </svg>

        {/* Subtle noise texture */}
        <div className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-[var(--text)] sm:text-5xl md:text-6xl">
            Blog
          </h1>
          <p className="mt-4 text-lg text-[var(--text-secondary)] max-w-3xl">
            Sharing my learning journey in AI Engineering, insights from ML projects, and experiences with Computer Vision, NLP, and Deep Learning.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedCategory === category
                  ? 'bg-[var(--primary)] text-white shadow-lg'
                  : 'bg-[var(--background-secondary)] text-[var(--text-secondary)] hover:bg-[var(--background-tertiary)] hover:text-[var(--text)]'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {/* Blog Posts Grid */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-[var(--text-secondary)]">
              No blog posts yet. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <article key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group block bg-[var(--background-secondary)] border border-[var(--border)] rounded-2xl overflow-hidden hover:border-[var(--primary)] transition-all duration-300 hover:shadow-xl h-full"
                >
                  {/* Image */}
                  {post.image && (
                    <div className="relative h-48 overflow-hidden">
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
                        style={{ backgroundImage: `url(${post.image})` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-transparent to-transparent opacity-60" />
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-6">
                    {/* Category & Date */}
                    <div className="flex items-center gap-4 text-xs text-[var(--text-tertiary)] mb-3">
                      <div className="flex items-center gap-1">
                        <FolderIcon className="h-4 w-4" />
                        <span>{post.category}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="h-4 w-4" />
                        <time dateTime={post.date}>{formatDate(post.date)}</time>
                      </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-xl font-bold text-[var(--text)] mb-2 group-hover:text-[var(--primary)] transition-colors line-clamp-2">
                      {post.title}
                    </h2>

                    {/* Description */}
                    <p className="text-sm text-[var(--text-secondary)] mb-4 line-clamp-3">
                      {post.description}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1 text-[var(--text-tertiary)]">
                        <ClockIcon className="h-4 w-4" />
                        <span>{post.readTime || '5 min read'}</span>
                      </div>

                      {/* Tags */}
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex items-center gap-1 text-[var(--text-tertiary)]">
                          <TagIcon className="h-4 w-4" />
                          <span className="line-clamp-1">{post.tags[0]}</span>
                          {post.tags.length > 1 && (
                            <span className="text-[var(--text-tertiary)]">+{post.tags.length - 1}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
