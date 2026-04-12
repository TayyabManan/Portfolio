'use client'

import { useState, useEffect } from 'react'
import ProjectCard from '@/components/ui/ProjectCard'
import { type Project } from '@/lib/projects'
import { LoadingError } from '@/components/ui/ErrorState'
import { toast } from '@/components/ui/Toast'

const categories = ['All', 'Geospatial AI', 'Computer Vision', 'Natural Language Processing', 'Machine Learning & MLOps', 'Web Application']

const PROJECTS_PER_PAGE = 6

export default function ProjectsPageContent() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  useEffect(() => {
    // Fetch projects from API
    const loadProjects = async () => {
      try {
        const res = await fetch('/api/projects')
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }
        const data = await res.json()
        setProjects(data)
        setError(null)
      } catch (err) {
        setError(err as Error)
        setProjects([])
        toast.error('Couldn\'t load projects', 'Try refreshing the page')
      } finally {
        setLoading(false)
      }
    }
    
    loadProjects()
  }, [])

  const filteredProjects = selectedCategory === 'All' 
    ? projects 
    : projects.filter(project => project.category === selectedCategory)
  
  // Paginate projects
  const totalPages = Math.ceil(filteredProjects.length / PROJECTS_PER_PAGE)
  const paginatedProjects = filteredProjects.slice(0, currentPage * PROJECTS_PER_PAGE)
  const hasMore = currentPage < totalPages
  
  const loadMore = () => {
    if (!isLoadingMore && hasMore) {
      setIsLoadingMore(true)
      // Simulate loading delay for smooth UX
      setTimeout(() => {
        setCurrentPage(prev => prev + 1)
        setIsLoadingMore(false)
      }, 300)
    }
  }
  
  // Reset pagination when category changes
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedCategory])

  return (
    <div className="relative py-16 sm:py-24 min-h-screen bg-[var(--background)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header - Left aligned */}
        <div className="mb-12 max-w-4xl">
          <h1 className="text-4xl sm:text-5xl font-bold text-[var(--text)] mb-4">ML & AI Projects</h1>
          <p className="text-lg sm:text-xl text-[var(--text-secondary)]">
            A collection of machine learning and AI projects demonstrating expertise in computer vision,
            NLP, geospatial AI, and MLOps—transforming complex data into intelligent, production-ready solutions.
          </p>
        </div>

        {/* Category Filter - Left aligned */}
        <div className="flex flex-wrap gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 min-h-[44px] rounded-lg font-medium transition-all text-sm sm:text-base cursor-pointer ${
                selectedCategory === category
                  ? 'bg-[var(--primary)] text-white shadow-lg sm:scale-105'
                  : 'bg-[var(--background-secondary)] text-[var(--text)] hover:bg-[var(--background-tertiary)] border border-[var(--border)] hover:border-[var(--primary)]'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)]"></div>
          </div>
        ) : error ? (
          <LoadingError 
            resource="projects" 
            onRetry={() => {
              setLoading(true)
              setError(null)
              fetch('/api/projects')
                .then(res => res.json())
                .then(data => {
                  setProjects(data)
                  setError(null)
                })
                .catch(err => {
                  setError(err)
                  toast.error('Couldn\'t load projects')
                })
                .finally(() => setLoading(false))
            }}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginatedProjects.map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="flex justify-center mt-12">
                <button
                  onClick={loadMore}
                  disabled={isLoadingMore}
                  className="px-6 py-3 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isLoadingMore ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Loading...
                    </>
                  ) : (
                    <>
                      Load More Projects
                      <span className="text-sm opacity-75">
                        ({filteredProjects.length - paginatedProjects.length} remaining)
                      </span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Empty State */}
            {filteredProjects.length === 0 && !error && (
              <div className="text-center py-12">
                <p className="text-[var(--text-secondary)] mb-4">No projects in this category yet.</p>
                <button
                  onClick={() => setSelectedCategory('All')}
                  className="text-[var(--primary)] font-medium hover:underline"
                >
                  Show all projects
                </button>
              </div>
            )}
          </>
        )}
        
        {/* Coming Soon */}
        <div className="mt-16 bg-[var(--background-secondary)] rounded-2xl p-8 lg:p-12 border border-[var(--border)]">
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text)] mb-4">More Projects Coming Soon</h2>
          <p className="text-[var(--text-secondary)] text-base sm:text-lg max-w-2xl">
            I&apos;m continuously working on new machine learning and AI projects, including RAG systems,
            computer vision applications, and MLOps platforms. Follow my{' '}
            <a href="https://github.com/TayyabManan" target="_blank" rel="noopener noreferrer" className="text-[var(--primary)] hover:underline">GitHub</a>
            {' '}for the latest developments.
          </p>
        </div>
      </div>
    </div>
  )
}