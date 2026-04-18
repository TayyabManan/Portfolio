import { Metadata } from 'next'
import ProjectsPageContent from './ProjectsPageContent'

export const metadata: Metadata = {
  title: 'ML & AI Projects Portfolio',
  description: 'ML & AI projects portfolio featuring Computer Vision, NLP, Geospatial AI & predictive analytics. Built with PyTorch, TensorFlow, LangChain & Scikit-learn.',
  keywords: [
    'ML projects',
    'AI portfolio',
    'machine learning applications',
    'geospatial AI',
    'computer vision projects',
    'ML engineer portfolio',
    'Python ML projects',
    'predictive analytics',
    'time series forecasting',
    'MLOps',
    'data science projects',
    'AI developer',
    'deep learning',
    'NLP projects'
  ],
  openGraph: {
    title: 'ML & AI Projects Portfolio - Tayyab Manan',
    description: 'Browse cutting-edge ML projects including groundwater prediction systems using machine learning, geospatial AI for infrastructure planning, and data-driven applications built with Python, Scikit-learn, and modern AI technologies.',
    url: 'https://tayyabmanan.com/projects',
    type: 'website',
    images: [
      {
        url: '/projects/watertrace.webp',
        width: 1200,
        height: 630,
        alt: 'ML Projects Portfolio - WaterTrace Pakistan ML System',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ML & AI Projects Portfolio - Tayyab Manan',
    description: 'Innovative ML projects featuring predictive analytics, geospatial AI, and intelligent data-driven solutions.',
    images: ['/projects/watertrace.webp'],
  },
  alternates: {
    canonical: 'https://tayyabmanan.com/projects',
  },
}

export default function ProjectsPage() {
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://tayyabmanan.com' },
      { '@type': 'ListItem', position: 2, name: 'Projects', item: 'https://tayyabmanan.com/projects' },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ProjectsPageContent />
    </>
  )
}