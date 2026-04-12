'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeftIcon, ArrowRightIcon, ArrowTopRightOnSquareIcon, CodeBracketIcon, CalendarIcon } from '@heroicons/react/24/outline'
import { DynamicReactMarkdown } from '@/lib/dynamic-imports'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'

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

interface AdjacentProject {
  slug: string
  title: string
}

interface ProjectPageClientProps {
  project: Project
  adjacentProjects?: { prev: AdjacentProject | null; next: AdjacentProject | null }
}

export default function ProjectPageClient({ project, adjacentProjects }: ProjectPageClientProps) {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Hero Section */}
      <div className="bg-[var(--background)] pt-8 pb-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div>
            <div className="mb-6">
              <Breadcrumbs
                items={[
                  { label: 'Home', href: '/' },
                  { label: 'Projects', href: '/projects' },
                  { label: project.category, current: true },
                ]}
                size="sm"
                animated={false}
              />
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-start">
              <div className="flex-1 order-2 lg:order-1">
                {project.featured && (
                  <div className="mb-4">
                    <span className="inline-flex items-center rounded-full bg-[var(--warning)]/10 px-3 py-1 text-sm font-medium text-[var(--warning)]">
                      Featured
                    </span>
                  </div>
                )}

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--text)] mb-4">
                  {project.title}
                </h1>

                {project.subtitle && (
                  <p className="text-lg sm:text-xl text-[var(--text-secondary)] mb-6">
                    {project.subtitle}
                  </p>
                )}

                <p className="text-base sm:text-lg text-[var(--text-secondary)] mb-8">
                  {project.description}
                </p>

                <div className="flex items-center gap-4 text-[var(--text-tertiary)] mb-8">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5" />
                    <span className="text-sm sm:text-base">{new Date(project.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</span>
                  </div>
                </div>

                <div className="flex flex-row gap-2 sm:gap-4 lg:hidden">
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center bg-[var(--primary)] text-white px-3 xs:px-4 sm:px-6 py-3 rounded-lg text-xs xs:text-sm sm:text-base font-medium hover:bg-[var(--primary-hover)] transition-colors whitespace-nowrap"
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
                      className="inline-flex items-center justify-center border border-[var(--border)] text-[var(--text)] px-3 xs:px-4 sm:px-6 py-3 rounded-lg text-xs xs:text-sm sm:text-base font-medium hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors whitespace-nowrap"
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
      <div className="relative py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
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
                        table: ({ children }) => (
                          <div className="overflow-x-auto my-6 rounded-lg border border-[var(--border)]">
                            <table className="w-full text-sm">{children}</table>
                          </div>
                        ),
                        thead: ({ children }) => (
                          <thead className="bg-[var(--background-tertiary)]">{children}</thead>
                        ),
                        th: ({ children }) => (
                          <th className="px-4 py-3 text-left font-semibold text-[var(--text)] border-b border-[var(--border)]">{children}</th>
                        ),
                        td: ({ children }) => (
                          <td className="px-4 py-3 text-[var(--text-secondary)] border-b border-[var(--border)]">{children}</td>
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
          {/* Previous / Next Project Navigation */}
          {adjacentProjects && (adjacentProjects.prev || adjacentProjects.next) && (
            <nav className="mt-12" aria-label="Adjacent projects">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {adjacentProjects.prev ? (
                  <Link
                    href={`/projects/${adjacentProjects.prev.slug}`}
                    className="group flex flex-col gap-1 p-4 rounded-lg border border-[var(--border)] hover:border-[var(--primary)] transition-colors"
                  >
                    <span className="text-xs text-[var(--text-tertiary)] flex items-center gap-1">
                      <ArrowLeftIcon className="h-3 w-3" /> Previous project
                    </span>
                    <span className="text-sm font-medium text-[var(--text)] group-hover:text-[var(--primary)] transition-colors">
                      {adjacentProjects.prev.title}
                    </span>
                  </Link>
                ) : <div />}
                {adjacentProjects.next && (
                  <Link
                    href={`/projects/${adjacentProjects.next.slug}`}
                    className="group flex flex-col items-end gap-1 p-4 rounded-lg border border-[var(--border)] hover:border-[var(--primary)] transition-colors sm:col-start-2"
                  >
                    <span className="text-xs text-[var(--text-tertiary)] flex items-center gap-1">
                      Next project <ArrowRightIcon className="h-3 w-3" />
                    </span>
                    <span className="text-sm font-medium text-[var(--text)] group-hover:text-[var(--primary)] transition-colors text-left">
                      {adjacentProjects.next.title}
                    </span>
                  </Link>
                )}
              </div>
            </nav>
          )}
          </div>
        </div>
      </div>
    </div>
  )
}