'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ProjectCard from '@/components/ui/ProjectCard'
import { type Project } from '@/lib/projects'
import { LoadingError } from '@/components/ui/ErrorState'
import { toast } from '@/components/ui/Toast'

const categories = ['All', 'Geospatial AI & Predictive Analytics', 'Geospatial AI & Optimization', 'Computer Vision', 'Natural Language Processing', 'Machine Learning & MLOps', 'Web Application']

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
        toast.error('Failed to load projects', 'Please try refreshing the page')
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
    <div className="relative py-16 min-h-screen overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0">
        {/* Beautiful gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--hero-gradient-start)] via-[var(--hero-gradient-mid)] to-[var(--hero-gradient-end)]" />

        {/* Hexagon pattern */}
        <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hexagon-pattern-page" x="0" y="0" width="60" height="52" patternUnits="userSpaceOnUse">
              <polygon points="30,1 45,13 45,39 30,51 15,39 15,13" fill="none" stroke="var(--border)" strokeWidth="0.5" opacity="0.1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hexagon-pattern-page)" />
        </svg>

        {/* Subtle noise texture */}
        <div className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
          }}
        />
      </div>
      
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
              className={`px-4 py-2 min-h-[44px] rounded-lg font-medium transition-all text-sm sm:text-base ${
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
                  toast.error('Failed to load projects')
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
                <p className="text-[var(--text-secondary)]">No projects found in this category.</p>
              </div>
            )}
          </>
        )}
        
        {/* Coming Soon Section - Two column layout */}
        <div className="mt-16 bg-[var(--background-secondary)] rounded-2xl p-8 lg:p-12 border border-[var(--border)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left - Content */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text)] mb-4">More ML Projects Coming Soon</h2>
              <p className="text-[var(--text-secondary)] text-base sm:text-lg">
                I&apos;m continuously working on new machine learning and AI projects, including RAG systems,
                computer vision applications, and MLOps platforms. Check back regularly for updates, or follow my GitHub for the latest developments.
              </p>
            </div>

            {/* Right - SVG Illustration */}
            <div className="hidden lg:flex items-center justify-center">
              <svg className="w-full max-w-xs" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                {/* Rocket illustration representing upcoming projects */}
                <g>
                  {/* Rocket body */}
                  <path d="M100 40 L120 120 L100 110 L80 120 Z" fill="var(--primary)" opacity="0.8" />

                  {/* Rocket window */}
                  <circle cx="100" cy="70" r="8" fill="var(--background)" stroke="var(--info)" strokeWidth="2" />

                  {/* Rocket fins */}
                  <path d="M80 100 L70 130 L80 120 Z" fill="var(--accent)" opacity="0.7" />
                  <path d="M120 100 L130 130 L120 120 Z" fill="var(--accent)" opacity="0.7" />

                  {/* Animated Flame */}
                  <motion.path
                    d="M90 120 L85 140 L90 135 L95 145 L100 130 L105 145 L110 135 L115 140 L110 120 Z"
                    fill="var(--warning)"
                    opacity="0.8"
                    animate={{
                      d: [
                        "M90 120 L85 140 L90 135 L95 145 L100 130 L105 145 L110 135 L115 140 L110 120 Z",
                        "M90 120 L87 135 L92 132 L97 142 L100 128 L103 142 L108 132 L113 135 L110 120 Z",
                        "M90 120 L85 140 L90 135 L95 145 L100 130 L105 145 L110 135 L115 140 L110 120 Z"
                      ]
                    }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />

                  {/* Animated Stars around */}
                  {[...Array(8)].map((_, i) => (
                    <motion.circle
                      key={i}
                      cx={50 + (i % 4) * 40}
                      cy={30 + Math.floor(i / 4) * 100}
                      r="2"
                      fill="var(--primary)"
                      opacity="0.5"
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 0.8, 0.5]
                      }}
                      transition={{
                        duration: 2 + i * 0.2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  ))}

                  {/* Animated Code symbols floating */}
                  <motion.text
                    x="40"
                    y="80"
                    fontSize="16"
                    fill="var(--info)"
                    opacity="0.5"
                    animate={{
                      y: [80, 75, 80],
                      opacity: [0.5, 0.8, 0.5]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    &lt;/&gt;
                  </motion.text>
                  <motion.text
                    x="145"
                    y="60"
                    fontSize="14"
                    fill="var(--accent)"
                    opacity="0.5"
                    animate={{
                      y: [60, 55, 60],
                      opacity: [0.5, 0.8, 0.5]
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.5
                    }}
                  >
                    &#123;&#125;
                  </motion.text>
                  <motion.text
                    x="150"
                    y="120"
                    fontSize="12"
                    fill="var(--success)"
                    opacity="0.5"
                    animate={{
                      y: [120, 115, 120],
                      opacity: [0.5, 0.8, 0.5]
                    }}
                    transition={{
                      duration: 2.8,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1
                    }}
                  >
                    AI
                  </motion.text>
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}