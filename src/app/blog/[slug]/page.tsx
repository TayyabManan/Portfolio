import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getBlogPostBySlug, getAllBlogSlugs, getAdjacentBlogPosts } from '@/lib/markdown'
import BlogPostClient from './BlogPostClient'

// Force static generation for all blog pages
export const dynamic = 'force-static'
export const dynamicParams = false

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = getBlogPostBySlug(slug)

  if (!post) {
    return {
      title: 'Blog Post Not Found',
      description: 'The requested blog post could not be found.',
    }
  }

  const imageUrl = post.image || '/images/profile-picture.webp'
  const postUrl = `https://tayyabmanan.com/blog/${post.slug}`

  return {
    title: `${post.title} | AI Engineering Blog`,
    description: post.description,
    keywords: [
      post.title,
      'AI engineering blog',
      'ML student blog',
      'machine learning insights',
      'computer vision tutorials',
      'deep learning',
      'AI development',
      post.category,
      ...(post.tags || []),
      'AI student',
      'ML tutorials',
      'Tayyab Manan',
      'AI learning journey'
    ],
    openGraph: {
      title: `${post.title} | Tayyab Manan`,
      description: post.description,
      url: postUrl,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags || [],
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [imageUrl],
      creator: '@tayyabmanan',
    },
    alternates: {
      canonical: postUrl,
    },
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const post = getBlogPostBySlug(slug)

  if (!post) {
    notFound()
  }

  // Generate Article schema for SEO
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    image: post.image || 'https://tayyabmanan.com/images/profile-picture.webp',
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Person',
      name: post.author || 'Tayyab Manan',
      url: 'https://tayyabmanan.com',
      jobTitle: 'AI/ML Engineer',
      sameAs: [
        'https://www.linkedin.com/in/tayyabmanan',
        'https://github.com/TayyabManan',
        'https://twitter.com/tayyabmanan'
      ]
    },
    publisher: {
      '@type': 'Person',
      name: 'Tayyab Manan',
      logo: {
        '@type': 'ImageObject',
        url: 'https://tayyabmanan.com/logo.svg'
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://tayyabmanan.com/blog/${post.slug}`
    },
    articleSection: post.category,
    keywords: post.tags?.join(', ') || 'AI, Machine Learning, Computer Vision',
    about: {
      '@type': 'Thing',
      name: post.category
    },
    inLanguage: 'en-US',
    isAccessibleForFree: 'True',
    isPartOf: {
      '@type': 'Blog',
      '@id': 'https://tayyabmanan.com/blog',
      name: 'AI/ML Engineering Blog - Tayyab Manan'
    }
  }

  // Breadcrumb schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://tayyabmanan.com'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: 'https://tayyabmanan.com/blog'
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: `https://tayyabmanan.com/blog/${post.slug}`
      }
    ]
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([articleSchema, breadcrumbSchema]) }}
      />
      <BlogPostClient post={post} adjacentPosts={getAdjacentBlogPosts(slug)} />
    </>
  )
}

export async function generateStaticParams() {
  const slugs = getAllBlogSlugs()
  return slugs.map((slug) => ({
    slug,
  }))
}
