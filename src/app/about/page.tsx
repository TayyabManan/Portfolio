import { Metadata } from 'next'
import AboutPageContent from './AboutPageContent'

export const metadata: Metadata = {
  title: 'About - Tayyab Manan | AI/ML Engineer',
  description: 'AI/ML Engineer specializing in Computer Vision, Multi-Agent Systems, and Geospatial AI. Building production ML systems with PyTorch, TensorFlow & LangChain.',
  keywords: [
    'about Tayyab Manan',
    'AI ML engineer',
    'machine learning engineer',
    'computer vision engineer',
    'Python ML developer',
    'PyTorch developer',
    'geospatial AI engineer',
    'multi-agent systems'
  ],
  openGraph: {
    title: 'About Tayyab Manan - AI/ML Engineer',
    description: 'AI/ML Engineer specializing in Computer Vision, Multi-Agent Systems, and Geospatial AI. Building production ML systems with PyTorch, TensorFlow & LangChain.',
    url: 'https://tayyabmanan.com/about',
    type: 'profile',
    images: [
      {
        url: '/images/profile-picture.webp',
        width: 1200,
        height: 630,
        alt: 'Tayyab Manan - AI/ML Engineer',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Tayyab Manan - AI/ML Engineer',
    description: 'AI/ML Engineer with expertise in Computer Vision, Multi-Agent Systems, and Geospatial AI. PyTorch, TensorFlow, and LangChain.',
    images: ['/images/profile-picture.webp'],
  },
  alternates: {
    canonical: 'https://tayyabmanan.com/about',
  },
}

export default function AboutPage() {
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://tayyabmanan.com' },
      { '@type': 'ListItem', position: 2, name: 'About', item: 'https://tayyabmanan.com/about' },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <AboutPageContent />
    </>
  )
}