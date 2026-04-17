'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import ProjectCard from '@/components/ui/ProjectCard'
import { SkeletonCard } from '@/components/ui/SkeletonLoader'
import { type Project } from '@/lib/projects'

export default function FeaturedProjects() {
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const loadProjects = () => {
    setError(false)
    setLoading(true)
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 15000)

    fetch('/api/projects', { signal: controller.signal })
      .then(res => res.json())
      .then(data => {
        const featured = data.filter((project: Project) => project.featured).slice(0, 3)
        setFeaturedProjects(featured)
        setLoading(false)
      })
      .catch(() => {
        setError(true)
        setLoading(false)
      })
      .finally(() => clearTimeout(timeout))
  }

  useEffect(() => {
    loadProjects()
  }, [])

  return (
    <section id="projects" className="relative py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-4xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text)] mb-4">Featured Projects</h2>
          <p className="text-base sm:text-lg text-[var(--text-secondary)]">
            Showcasing machine learning and AI projects that demonstrate expertise in
            computer vision, NLP, geospatial AI, and production ML systems.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {[0, 1, 2].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-[var(--text-secondary)] mb-4">
              Couldn&apos;t load projects. Check your connection and try again.
            </p>
            <button
              onClick={loadProjects}
              className="bg-[var(--primary)] text-white px-6 py-3 rounded-lg font-medium hover:bg-[var(--primary-hover)] transition-colors"
            >
              Load projects
            </button>
          </div>
        ) : featuredProjects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[var(--text-secondary)] mb-4">
              No projects found. Try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="text-[var(--primary)] font-medium hover:underline"
            >
              Refresh page
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredProjects.map((project) => (
              <div key={project.slug}>
                <ProjectCard project={project} />
              </div>
            ))}
          </div>
        )}

        <div className="text-center">
          <Link
            href="/projects"
            className="inline-flex items-center bg-[var(--primary)] text-white px-6 py-3 rounded-lg font-medium hover:bg-[var(--primary-hover)] transition-colors shadow-lg"
          >
            View All Projects
          </Link>
        </div>
      </div>
    </section>
  )
}