'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import ProjectCard from '@/components/ui/ProjectCard'
import { type Project } from '@/lib/projects'

export default function FeaturedProjects() {
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([])
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setMounted(true)
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => {
        const featured = data.filter((project: Project) => project.featured).slice(0, 3)
        setFeaturedProjects(featured)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [])

  return (
    <section id="projects" className="relative pt-20 pb-16 overflow-hidden">
      {/* Animated GIS-themed background */}
      <div className="absolute inset-0">
        {/* Transparent overlay - let hero gradient show through */}
        <div className="absolute inset-0 bg-transparent" />
        
        {/* Animated geometric patterns */}
        <div className="absolute inset-0">
          {/* Floating hexagons - representing spatial data cells */}
          <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="hexagon-pattern" x="0" y="0" width="60" height="52" patternUnits="userSpaceOnUse">
                <polygon points="30,1 45,13 45,39 30,51 15,39 15,13" fill="none" stroke="var(--projects-pattern-stroke)" strokeWidth="0.5" opacity="0.1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hexagon-pattern)" />
          </svg>
          
          {/* Gradient orbs */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-[var(--projects-orb-primary)] rounded-full blur-3xl opacity-5" />
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-[var(--projects-orb-secondary)] rounded-full blur-3xl opacity-5" />
          
          {/* Grid overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--hero-grid-color)_1px,transparent_1px),linear-gradient(to_bottom,var(--hero-grid-color)_1px,transparent_1px)] bg-[size:24px_24px]" />
          
          {/* Floating data points */}
          {mounted && (
            <div className="absolute inset-0">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    left: `${20 + (i * 10)}%`,
                    top: `${10 + (i * 12)}%`,
                    background: i % 2 === 0 ? 'var(--projects-float-color)' : 'var(--projects-float-color-alt)',
                    boxShadow: `0 0 20px ${i % 2 === 0 ? 'var(--projects-float-color)' : 'var(--projects-float-color-alt)'}`
                  }}
                />
              ))}
            </div>
          )}
        </div>
        
        {/* Subtle noise texture */}
        <div className="absolute inset-0 opacity-[0.015]" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
          }}
        />
      </div>
      
      {/* Content with higher z-index */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-4xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text)] mb-4" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>Featured Projects</h2>
          <p className="text-base sm:text-lg text-[var(--text-secondary)]" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
            Showcasing machine learning and AI projects that demonstrate expertise in
            computer vision, NLP, geospatial AI, and production ML systems.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)]"></div>
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
            className="inline-flex items-center bg-[var(--primary)] text-white px-6 py-3 rounded-md font-medium hover:bg-[var(--primary-hover)] transition-colors shadow-lg"
          >
            View All Projects
          </Link>
        </div>
      </div>
    </section>
  )
}