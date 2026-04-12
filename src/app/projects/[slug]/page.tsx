import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getProjectBySlug, getAllProjectSlugs, getAdjacentProjects } from '@/lib/markdown'
import ProjectPageClient from './ProjectPageClient'

// Force static generation for all project pages
export const dynamic = 'force-static'
export const dynamicParams = false

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const project = getProjectBySlug(slug)

  if (!project) {
    return {
      title: 'Project Not Found',
      description: 'The requested project could not be found.',
    }
  }

  const imageUrl = project.image || '/images/profile-picture.webp'
  const projectUrl = `https://tayyabmanan.com/projects/${project.slug}`

  // Create rich description with tech stack
  const techStackText = project.techStack?.slice(0, 5).join(', ') || 'ML/AI technologies'
  const fullDescription = `${project.description} Built with ${techStackText}. ${project.category} project showcasing expertise in machine learning, AI development, and geospatial intelligence.`

  return {
    title: `${project.title} - ${project.subtitle || 'ML Project'} | Tayyab Manan`,
    description: fullDescription,
    keywords: [
      project.title,
      'ML project',
      'machine learning application',
      'AI development',
      'geospatial AI',
      'computer vision',
      'MLOps',
      project.category,
      ...(project.techStack || []),
      'data science',
      'predictive analytics',
      'ML engineer portfolio',
      'AI developer portfolio',
      'Tayyab Manan'
    ],
    openGraph: {
      title: `${project.title} | Tayyab Manan ML Portfolio`,
      description: project.description,
      url: projectUrl,
      type: 'article',
      publishedTime: project.date || new Date().toISOString(),
      authors: ['Tayyab Manan'],
      tags: project.techStack || [],
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${project.title} - ${project.subtitle || 'ML Project Screenshot'}`,
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${project.title} - ${project.subtitle || 'ML Project'}`,
      description: project.description,
      images: [imageUrl],
      creator: '@tayyabmanan',
    },
    alternates: {
      canonical: projectUrl,
    },
  }
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params
  const project = getProjectBySlug(slug)

  if (!project) {
    notFound()
  }

  // Generate SoftwareApplication schema for ML/AI projects
  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: project.title,
    description: project.description,
    applicationCategory: 'MachineLearningApplication',
    operatingSystem: 'Web',
    image: project.image || 'https://tayyabmanan.com/images/profile-picture.webp',
    screenshot: project.image || 'https://tayyabmanan.com/images/profile-picture.webp',
    url: project.demoUrl || `https://tayyabmanan.com/projects/${project.slug}`,
    codeRepository: project.githubUrl,
    applicationSubCategory: project.category,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock'
    },
    author: {
      '@type': 'Person',
      name: 'Tayyab Manan',
      url: 'https://tayyabmanan.com',
      jobTitle: 'AI/ML Engineer',
      sameAs: [
        'https://www.linkedin.com/in/tayyabmanan',
        'https://github.com/TayyabManan',
        'https://twitter.com/tayyabmanan'
      ]
    },
    creator: {
      '@type': 'Person',
      name: 'Tayyab Manan'
    },
    datePublished: project.date || new Date().toISOString(),
    keywords: project.techStack?.join(', '),
    programmingLanguage: project.techStack?.includes('Python') ? 'Python' : 'JavaScript',
    softwareVersion: '1.0',
    aggregateRating: project.featured ? {
      '@type': 'AggregateRating',
      ratingValue: '5',
      ratingCount: '1',
      bestRating: '5',
      worstRating: '1'
    } : undefined
  }

  // CreativeWork schema for portfolio item
  const creativeWorkSchema = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.description,
    image: project.image || 'https://tayyabmanan.com/images/profile-picture.webp',
    url: `https://tayyabmanan.com/projects/${project.slug}`,
    datePublished: project.date || new Date().toISOString(),
    author: {
      '@type': 'Person',
      name: 'Tayyab Manan',
      url: 'https://tayyabmanan.com'
    },
    creator: {
      '@type': 'Person',
      name: 'Tayyab Manan'
    },
    about: {
      '@type': 'Thing',
      name: project.category
    },
    keywords: project.techStack?.join(', '),
    inLanguage: 'en-US',
    isAccessibleForFree: 'True'
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
        name: 'Projects',
        item: 'https://tayyabmanan.com/projects'
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: project.title,
        item: `https://tayyabmanan.com/projects/${project.slug}`
      }
    ]
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([softwareSchema, creativeWorkSchema, breadcrumbSchema]) }}
      />
      <ProjectPageClient project={project} adjacentProjects={getAdjacentProjects(slug)} />
    </>
  )
}

export async function generateStaticParams() {
  const slugs = getAllProjectSlugs()
  return slugs.map((slug) => ({
    slug,
  }))
}