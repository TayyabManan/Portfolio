import { Metadata } from 'next'
import { getAllBlogPosts } from '@/lib/markdown'
import BlogPageContent from './BlogPageContent'

export const metadata: Metadata = {
  title: 'Blog - Tayyab Manan | AI/ML Engineering Insights',
  description: 'Technical writing on AI/ML engineering, production ML systems, Computer Vision, and Geospatial AI. Project deep-dives, tutorials, and engineering insights.',
  keywords: [
    'AI engineering blog',
    'machine learning insights',
    'ML project tutorials',
    'computer vision blog',
    'deep learning blog',
    'ML engineering blog',
    'AI/ML tutorials',
    'production ML blog'
  ],
  openGraph: {
    title: 'Blog - Tayyab Manan | AI/ML Engineer',
    description: 'Technical writing on production ML systems, Computer Vision, Multi-Agent Systems, and Geospatial AI.',
    url: 'https://tayyabmanan.com/blog',
    type: 'website',
    images: [
      {
        url: '/images/profile-picture.webp',
        width: 1200,
        height: 630,
        alt: 'AI/ML Engineering Blog - Tayyab Manan',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog - Tayyab Manan | AI/ML Engineer',
    description: 'Technical writing on production ML systems, Computer Vision, and Geospatial AI.',
    images: ['/images/profile-picture.webp'],
  },
  alternates: {
    canonical: 'https://tayyabmanan.com/blog',
  },
}

export default function BlogPage() {
  const posts = getAllBlogPosts()
  return <BlogPageContent posts={posts} />
}
