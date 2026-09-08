'use client'

import { useState } from 'react'
import ProjectCard from '@/components/ui/ProjectCard'
import { type Project } from '@/lib/projects'
import { useGridFlip } from '@/components/effects/useGridFlip'
import { EmptyAxes } from '@/components/effects/NotebookDoodles'
import CategoryFilter from '@/components/ui/CategoryFilter'

const categories = ['All', 'Neuromorphic Computing', 'Geospatial AI', 'Computer Vision', 'Natural Language Processing', 'Machine Learning & MLOps', 'Web Application']

interface ProjectsPageContentProps {
  projects: Project[]
}

export default function ProjectsPageContent({ projects }: ProjectsPageContentProps) {
  const [selectedCategory, setSelectedCategory] = useState('All')

  const filteredProjects = selectedCategory === 'All'
    ? projects
    : projects.filter(project => project.category === selectedCategory)

  // FLIP morph on filter change (desktop only; no-op hard swap on mobile)
  const { gridRef, capture } = useGridFlip(filteredProjects.map((p) => p.slug).join('|'))

  const selectCategory = (category: string) => {
    if (category === selectedCategory) return
    capture() // snapshot positions before React swaps the list
    setSelectedCategory(category)
  }

  return (
    <div className="relative py-16 sm:py-24 min-h-[100dvh] bg-[var(--background)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header - Left aligned */}
        <div className="mb-12 max-w-4xl">
          <h1 className="text-4xl sm:text-5xl font-semibold text-[var(--text)] mb-4">ML & AI Projects</h1>
          <p className="text-lg sm:text-xl text-[var(--text-secondary)]">
            Seven deployed ML systems across computer vision, NLP, geospatial AI, neuromorphic computing, and MLOps.
            Each one has a live demo and an open repo.
          </p>
        </div>

        {/* Category Filter - Left aligned */}
        <CategoryFilter categories={categories} selected={selectedCategory} onSelect={selectCategory} />

        {/* Projects Grid */}
        <div ref={gridRef} className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div key={project.slug} data-flip-id={project.slug}>
              <ProjectCard project={project} />
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <div className="doodle mx-auto mb-4 w-28">
              <EmptyAxes className="w-full" />
              <p className="font-mono text-[10px] tracking-[0.08em] mt-1">n=0</p>
            </div>
            <p className="text-[var(--text-secondary)] mb-4">No projects in this category yet.</p>
            <button
              onClick={() => setSelectedCategory('All')}
              className="font-medium text-[var(--text)] underline decoration-[var(--text)]/30 underline-offset-[0.15em] transition-[text-decoration-color] duration-200 hover:decoration-[var(--text)]"
            >
              Show all projects
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
