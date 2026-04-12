'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { ArrowLeftIcon, ArrowRightIcon, ArrowTopRightOnSquareIcon, CodeBracketIcon, CalendarIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import { DynamicReactMarkdown } from '@/lib/dynamic-imports'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import ShareButtons from '@/components/ui/ShareButtons'
import BackToTop from '@/components/ui/BackToTop'

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
  const projectUrl = `https://tayyabmanan.com/projects/${project.slug}`
  const [showTech, setShowTech] = useState(false)

  return (
    <>
      <div className="min-h-screen py-16 sm:py-24 bg-[var(--background)]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <div className="mb-8">
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

          <article>
            {/* Header */}
            <header className="mb-8">
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-[var(--text)] mb-4">
                {project.title}
              </h1>

              {project.subtitle && (
                <p className="text-xl text-[var(--text-secondary)] mb-6">
                  {project.subtitle}
                </p>
              )}

              <p className="text-base sm:text-lg text-[var(--text-secondary)] mb-6">
                {project.description}
              </p>

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--text-tertiary)] pb-6 border-b border-[var(--border)]">
                {project.featured && (
                  <span className="inline-flex items-center rounded-full bg-[var(--warning)]/10 px-3 py-1 text-sm font-medium text-[var(--warning)]">
                    Featured
                  </span>
                )}
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  <span>{new Date(project.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</span>
                </div>
                <button
                  onClick={() => setShowTech(!showTech)}
                  className="flex items-center gap-1 text-[var(--text-tertiary)] hover:text-[var(--primary)] transition-colors cursor-pointer"
                >
                  <span>{project.techStack.length} technologies</span>
                  <ChevronDownIcon className={`h-3.5 w-3.5 transition-transform duration-200 ${showTech ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {/* Tech Stack — collapsible */}
              <div className={`overflow-hidden transition-all duration-200 ${showTech ? 'max-h-40 mt-4 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 text-xs font-medium bg-[var(--background-secondary)] text-[var(--text-secondary)] rounded-full border border-[var(--border)]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </header>

            {/* Project Image */}
            {project.image && (
              <div className="mb-12 rounded-2xl overflow-hidden border border-[var(--border)]">
                <Image
                  src={project.image}
                  alt={`${project.title} - ${project.category} project`}
                  width={960}
                  height={540}
                  className="w-full h-auto"
                  priority
                />
              </div>
            )}

            {/* Action Buttons — after image, before content */}
            {(project.demoUrl || project.githubUrl) && (
              <div className="flex flex-wrap gap-3 mb-12">
                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center bg-[var(--primary)] text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-[var(--primary-hover)] transition-colors"
                  >
                    <ArrowTopRightOnSquareIcon className="h-4 w-4 mr-2" />
                    Live Demo
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center border border-[var(--border)] text-[var(--text)] px-6 py-3 rounded-lg text-sm font-medium hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors"
                  >
                    <CodeBracketIcon className="h-4 w-4 mr-2" />
                    Source Code
                  </a>
                )}
              </div>
            )}

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              <DynamicReactMarkdown
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-3xl font-bold tracking-tight text-[var(--text)] mt-8 mb-4">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-2xl font-bold tracking-tight text-[var(--text)] mt-8 mb-4">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-xl font-bold tracking-tight text-[var(--text)] mt-6 mb-3">
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="text-base text-[var(--text-secondary)] leading-relaxed mb-4">
                      {children}
                    </p>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside space-y-2 mb-4 text-[var(--text-secondary)]">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-inside space-y-2 mb-4 text-[var(--text-secondary)]">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li className="text-base leading-relaxed">{children}</li>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-semibold text-[var(--text)]">{children}</strong>
                  ),
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      className="text-[var(--primary)] hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
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

            {/* Previous / Next Project Navigation */}
            {adjacentProjects && (adjacentProjects.prev || adjacentProjects.next) && (
              <nav className="mt-12 pt-8 border-t border-[var(--border)]" aria-label="Adjacent projects">
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

            {/* Footer: Back + Share */}
            <div className="mt-8 pt-8 border-t border-[var(--border)]">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2 text-[var(--primary)] hover:text-[var(--primary-hover)] transition-colors font-medium"
                >
                  <ArrowLeftIcon className="h-4 w-4" />
                  <span>Back to all projects</span>
                </Link>
                <ShareButtons
                  title={project.title}
                  url={projectUrl}
                />
              </div>
            </div>
          </article>
        </div>
      </div>

      <BackToTop />
    </>
  )
}
