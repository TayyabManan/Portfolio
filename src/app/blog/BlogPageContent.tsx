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
    <div className="min-h-screen py-16 sm:py-24 bg-[var(--background)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header - Left aligned */}
        <div className="mb-12 max-w-4xl">
          <h1 className="text-4xl sm:text-5xl font-bold text-[var(--text)] mb-4">
            Blog
          </h1>
          <p className="text-lg sm:text-xl text-[var(--text-secondary)]">
            Sharing my learning journey in AI Engineering, insights from ML projects, and experiences with Computer Vision, NLP, and Deep Learning.
          </p>
        </div>

        {/* Category Filter - Left aligned */}
        <div className="flex flex-wrap gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 min-h-[44px] rounded-lg font-medium transition-all text-sm sm:text-base cursor-pointer ${
                selectedCategory === category
                  ? 'bg-[var(--primary)] text-white shadow-lg sm:scale-105'
                  : 'bg-[var(--background-secondary)] text-[var(--text)] hover:bg-[var(--background-tertiary)] border border-[var(--border)] hover:border-[var(--primary)]'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {/* Blog Posts Grid */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-[var(--text-secondary)] mb-4">
              {selectedCategory !== 'all'
                ? 'No posts in this category yet.'
                : 'No blog posts yet.'}
            </p>
            {selectedCategory !== 'all' ? (
              <button
                onClick={() => setSelectedCategory('all')}
                className="text-[var(--primary)] font-medium hover:underline"
              >
                Show all posts
              </button>
            ) : (
              <Link
                href="/projects"
                className="text-[var(--primary)] font-medium hover:underline"
              >
                Browse projects instead
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <article key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group block bg-[var(--background)] border border-[var(--border)] rounded-xl overflow-hidden hover:border-[var(--primary)] transition-[transform,box-shadow] duration-300 hover:shadow-xl hover:-translate-y-1 h-full"
                >
                  {/* Image */}
                  {post.image && (
                    <div className="relative h-48 overflow-hidden">
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
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
                    <h2 className="text-xl font-semibold text-[var(--text)] mb-2 group-hover:text-[var(--primary)] transition-colors line-clamp-2">
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
