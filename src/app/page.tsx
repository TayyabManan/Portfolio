import { Metadata } from 'next'
import Hero from '@/components/sections/Hero'
import Education from '@/components/sections/Education'
import FeaturedProjects from '@/components/sections/FeaturedProjects'
import LatestWriting from '@/components/sections/LatestWriting'
import CallToAction from '@/components/sections/CallToAction'
import HomeScrollEffects from '@/components/effects/HomeScrollEffects'
import { getFeaturedProjectsFromMarkdown, getAllBlogPosts } from '@/lib/markdown'

// Read project data at build time so the featured grid ships in the initial
// HTML (AI crawlers don't execute the client fetch that used to populate it).
export const dynamic = 'force-static'

export const metadata: Metadata = {
  // title intentionally omitted: inherits the layout's `title.default`
  // ("Tayyab Manan - AI/ML Engineer") so the brand suffix isn't doubled.
  description: 'AI/ML Engineer building production ML, computer vision & multi-agent systems. Seven live projects with demos in PyTorch, TensorFlow & LangChain.',
  openGraph: {
    title: 'Tayyab Manan - AI/ML Engineer',
    description: 'AI/ML Engineer building production ML systems, computer vision solutions, and multi-agent workflows. PyTorch, TensorFlow, LangChain.',
    url: 'https://tayyabmanan.com',
    siteName: 'Tayyab Manan',
    type: 'profile',
    // OG/Twitter image is supplied by the app/opengraph-image.tsx branded card.
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tayyab Manan - AI/ML Engineer',
    description: 'AI/ML Engineer building production ML systems with PyTorch, TensorFlow & LangChain. Computer Vision, Multi-Agent Systems & Geospatial AI.',
    creator: '@tayyabmanan',
  },
  alternates: {
    canonical: 'https://tayyabmanan.com',
  },
}

export default function HomePage() {
  const featured = getFeaturedProjectsFromMarkdown().slice(0, 3)
  const posts = getAllBlogPosts().slice(0, 3)

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

  // Home restructure: work -> writing -> compact background + the single CTA.
  // The FAQ moved off the home page (it was an SEO artifact reading as
  // machine-written; contact/about keep theirs), and its FAQPage schema left
  // with it - Google requires schema text to be visible on the page.
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbJsonLd]) }}
      />
      <Hero />
      <FeaturedProjects projects={featured} />
      {/* Client wrapper scroll-reveals these server sections via their data-reveal-* attributes */}
      <HomeScrollEffects>
        <LatestWriting posts={posts} />
        {/* Background + CTA side by side on desktop: the quiet education
            rows fill the left, the page's one Get-in-Touch card the right.
            They stack on mobile/tablet. */}
        <section className="relative border-t border-[var(--border)] py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:items-start lg:gap-14">
              <Education />
              <div className="lg:sticky lg:top-24 lg:self-start">
                <CallToAction />
              </div>
            </div>
          </div>
        </section>
      </HomeScrollEffects>
    </>
  )
}
