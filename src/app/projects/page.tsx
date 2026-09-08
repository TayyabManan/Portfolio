import { Metadata } from 'next'
import ProjectsPageContent from './ProjectsPageContent'
import { getAllProjectsFromMarkdown } from '@/lib/markdown'

// Build-time read so the project grid is in the initial HTML for AI crawlers
// (the page used to fetch /api/projects client-side and show a spinner).
export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'AI/ML Projects',
  description: 'Seven deployed ML/AI projects with live demos and open repos: groundwater prediction (R²=0.89), Urdu LLM fine-tuning, and face-expression detection.',
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
    description: 'Seven deployed ML/AI projects with live demos and open repos: groundwater prediction (R²=0.89), Urdu LLM fine-tuning, and face-expression detection.',
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
    description: 'Seven deployed ML/AI projects with live demos and open repos.',
    images: ['/projects/watertrace.webp'],
  },
  alternates: {
    canonical: 'https://tayyabmanan.com/projects',
  },
}

export default function ProjectsPage() {
  const projects = getAllProjectsFromMarkdown()

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
      <ProjectsPageContent projects={projects} />
    </>
  )
}