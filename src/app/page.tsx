import { Metadata } from 'next'
import Hero from '@/components/sections/Hero'
import Education from '@/components/sections/Education'
import FeaturedProjects from '@/components/sections/FeaturedProjects'
import CurrentlyLearning from '@/components/sections/CurrentlyLearning'
import CallToAction from '@/components/sections/CallToAction'

export const metadata: Metadata = {
  title: 'Tayyab Manan — AI/ML Engineer',
  description: 'AI/ML Engineer building production ML systems, computer vision solutions, and multi-agent workflows. PyTorch, TensorFlow, LangChain. Portfolio showcasing deployed machine learning projects and AI-powered applications.',
  openGraph: {
    title: 'Tayyab Manan — AI/ML Engineer',
    description: 'AI/ML Engineer building production ML systems, computer vision solutions, and multi-agent workflows. PyTorch, TensorFlow, LangChain.',
    url: 'https://tayyabmanan.com',
    siteName: 'Tayyab Manan',
    type: 'profile',
    images: [
      {
        url: '/images/profile-picture.webp',
        width: 1200,
        height: 630,
        alt: 'Tayyab Manan — AI/ML Engineer Portfolio',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tayyab Manan — AI/ML Engineer',
    description: 'AI/ML Engineer building production ML systems with PyTorch, TensorFlow & LangChain. Computer Vision, Multi-Agent Systems & Geospatial AI.',
    images: ['/images/profile-picture.webp'],
    creator: '@tayyabmanan',
  },
  alternates: {
    canonical: 'https://tayyabmanan.com',
  },
}

export default function HomePage() {
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://tayyabmanan.com',
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Hero />
      <FeaturedProjects />
      <Education />
      <CurrentlyLearning />
      <CallToAction />
    </>
  )
}