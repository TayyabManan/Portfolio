'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeftIcon, ArrowTopRightOnSquareIcon, CodeBracketIcon, CalendarIcon, TagIcon } from '@heroicons/react/24/outline'
import { DynamicReactMarkdown } from '@/lib/dynamic-imports'

interface Project {
  slug: string
  title: string
  subtitle: string
  description: string
  category: string
  techStack: string[]
  image: string
  demoUrl?: string
  githubUrl?: string
  featured: boolean
  date: string
  content: string
}

interface ProjectPageClientProps {
  project: Project
}

export default function ProjectPageClient({ project }: ProjectPageClientProps) {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[var(--primary)] to-[var(--accent)]">
        <div className="absolute inset-0">
          <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="hero-pattern" x="0" y="0" width="60" height="52" patternUnits="userSpaceOnUse">
                <polygon points="30,1 45,13 45,39 30,51 15,39 15,13" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hero-pattern)" />
          </svg>
        </div>
        
        <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
          <div>
            <Link
              href="/"
              className="inline-flex items-center text-white/80 hover:text-white transition-colors mb-6"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back to Portfolio
            </Link>
            
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              <div className="flex-1 order-2 lg:order-1">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="inline-flex items-center rounded-full bg-white/20 backdrop-blur-sm px-3 py-1 text-sm font-medium text-white">
                    <TagIcon className="h-4 w-4 mr-1" />
                    {project.category}
                  </span>
                  {project.featured && (
                    <span className="inline-flex items-center rounded-full bg-yellow-400/20 backdrop-blur-sm px-3 py-1 text-sm font-medium text-yellow-100">
                      ⭐ Featured
                    </span>
                  )}
                </div>
                
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
                  {project.title}
                </h1>
                
                {project.subtitle && (
                  <p className="text-lg sm:text-xl text-white/90 mb-6">
                    {project.subtitle}
                  </p>
                )}
                
                <p className="text-base sm:text-lg text-white/80 mb-8">
                  {project.description}
                </p>
                
                <div className="flex items-center gap-4 text-white/70 mb-8">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5" />
                    <span className="text-sm sm:text-base">{new Date(project.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</span>
                  </div>
                </div>
                
                <div className="flex flex-row gap-2 sm:gap-4">
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center bg-white text-[var(--primary)] px-3 xs:px-4 sm:px-6 py-3 rounded-lg text-xs xs:text-sm sm:text-base font-medium hover:bg-gray-100 transition-colors whitespace-nowrap"
                    >
                      <ArrowTopRightOnSquareIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                      <span className="hidden xs:inline">Live </span>Demo
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center bg-white/10 backdrop-blur-sm text-white border border-white/20 px-3 xs:px-4 sm:px-6 py-3 rounded-lg text-xs xs:text-sm sm:text-base font-medium hover:bg-white/20 transition-colors whitespace-nowrap"
                    >
                      <CodeBracketIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                      <span className="hidden xs:inline">Source </span>Code
                    </a>
                  )}
                </div>
              </div>
              
              {project.image && (
                <div className="w-full lg:w-80 order-1 lg:order-2">
                  <div className="relative rounded-xl overflow-hidden shadow-2xl mx-auto max-w-sm lg:max-w-none">
                    <Image
                      src={project.image}
                      alt={`${project.title} - ${project.category} project using ${project.techStack.slice(0, 3).join(', ')}`}
                      width={320}
                      height={240}
                      className="object-cover w-full h-48 sm:h-60"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="relative py-16">
        {/* Decorative background elements */}
        <div className="absolute inset-0">
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]" />
          
          {/* Floating hexagon pattern */}
          <svg className="absolute inset-0 h-full w-full opacity-30" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="content-hexagon" x="0" y="0" width="80" height="69" patternUnits="userSpaceOnUse">
                <polygon points="40,1 60,18 60,52 40,69 20,52 20,18" fill="none" stroke="#3b82f6" strokeWidth="0.3" opacity="0.1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#content-hexagon)" />
          </svg>
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                {/* Tech Stack */}
                <div className="bg-[var(--background-secondary)] backdrop-blur-sm rounded-xl p-6 shadow-lg border border-[var(--border)]">
                  <h3 className="text-lg font-semibold text-[var(--text)] mb-4 flex items-center">
                    <div className="w-2 h-2 bg-[var(--primary)] rounded-full mr-3"></div>
                    Tech Stack
                  </h3>
                  <div className="space-y-3">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="flex items-center w-full bg-[var(--background-tertiary)] text-[var(--text)] px-4 py-3 rounded-lg text-sm font-medium border border-[var(--border)] hover:shadow-md transition-all duration-200"
                      >
                        <div className="w-2 h-2 bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] rounded-full mr-3"></div>
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Project Links - Desktop only */}
                <div className="hidden lg:block bg-[var(--background-secondary)] backdrop-blur-sm rounded-xl p-6 shadow-lg border border-[var(--border)]">
                  <h3 className="text-lg font-semibold text-[var(--text)] mb-4 flex items-center">
                    <div className="w-2 h-2 bg-[var(--accent)] rounded-full mr-3"></div>
                    Project Links
                  </h3>
                  <div className="space-y-3">
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-[var(--primary)] hover:text-[var(--primary-hover)] transition-colors bg-[var(--primary-light)] px-4 py-3 rounded-lg border border-[var(--border)] hover:shadow-md"
                      >
                        <ArrowTopRightOnSquareIcon className="h-5 w-5 mr-3" />
                        <span className="font-medium">Live Demo</span>
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-[var(--text)] hover:text-[var(--text-secondary)] transition-colors bg-[var(--background-tertiary)] px-4 py-3 rounded-lg border border-[var(--border)] hover:shadow-md"
                      >
                        <CodeBracketIcon className="h-5 w-5 mr-3" />
                        <span className="font-medium">Source Code</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="col-span-1 lg:col-span-3">
              <div className="bg-[var(--background-secondary)] backdrop-blur-sm rounded-xl shadow-lg border border-[var(--border)] overflow-hidden">
                <div className="p-6 sm:p-8 lg:p-12">
                  <div className="prose prose-lg max-w-none"
                  >
                    <DynamicReactMarkdown
                      components={{
                        h1: ({ children }) => (
                          <h1 className="text-2xl sm:text-3xl font-bold mb-6 pb-3 border-b border-[var(--border)] text-[var(--text)]">
                            {children}
                          </h1>
                        ),
                        h2: ({ children }) => (
                          <h2 className="text-xl sm:text-2xl font-semibold mt-10 mb-4 text-[var(--primary)] flex items-center">
                            <div className="w-1 h-6 bg-gradient-to-b from-[var(--primary)] to-[var(--accent)] rounded-full mr-3"></div>
                            {children}
                          </h2>
                        ),
                        h3: ({ children }) => (
                          <h3 className="text-lg sm:text-xl font-semibold mt-8 mb-3 text-[var(--accent)] flex items-center">
                            <div className="w-1 h-5 bg-[var(--accent)] rounded-full mr-3"></div>
                            {children}
                          </h3>
                        ),
                        ul: ({ children }) => (
                          <ul className="space-y-3 my-6">
                            {children}
                          </ul>
                        ),
                        li: ({ children }) => (
                          <li className="flex items-start text-[var(--text-secondary)]">
                            <div className="w-2 h-2 bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            <span>{children}</span>
                          </li>
                        ),
                        p: ({ children }) => (
                          <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                            {children}
                          </p>
                        ),
                        strong: ({ children }) => (
                          <strong className="font-semibold text-[var(--text)]">
                            {children}
                          </strong>
                        ),
                        a: ({ href, children }) => (
                          <a
                            href={href}
                            className="text-[var(--primary)] hover:text-[var(--primary-hover)] underline underline-offset-2 transition-colors"
                          >
                            {children}
                          </a>
                        ),
                      }}
                    >
                      {project.content}
                    </DynamicReactMarkdown>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Project Links - At the bottom */}
          <div className="lg:hidden mt-12">
            <div className="bg-[var(--background-secondary)] backdrop-blur-sm rounded-xl p-6 shadow-lg border border-[var(--border)]">
              <h3 className="text-lg font-semibold text-[var(--text)] mb-4 flex items-center">
                <div className="w-2 h-2 bg-[var(--accent)] rounded-full mr-3"></div>
                Project Links
              </h3>
              <div className="flex flex-row gap-3 flex-wrap">
                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center text-[var(--primary)] hover:text-[var(--primary-hover)] transition-colors bg-[var(--primary-light)] px-4 py-3 rounded-lg border border-[var(--border)] hover:shadow-md whitespace-nowrap"
                  >
                    <ArrowTopRightOnSquareIcon className="h-5 w-5 mr-3" />
                    <span className="font-medium">Live Demo</span>
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center text-[var(--text)] hover:text-[var(--text-secondary)] transition-colors bg-[var(--background-tertiary)] px-4 py-3 rounded-lg border border-[var(--border)] hover:shadow-md whitespace-nowrap"
                  >
                    <CodeBracketIcon className="h-5 w-5 mr-3" />
                    <span className="font-medium">Source Code</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}