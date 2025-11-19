import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { CodeBracketIcon, ChevronDownIcon, ChevronUpIcon, LinkIcon } from '@heroicons/react/24/outline'

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
}

interface ProjectCardProps {
  project: Project
}

const ProjectCard = React.memo(function ProjectCard({ project }: ProjectCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [canExpand, setCanExpand] = useState(false)
  const textRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const checkTextClamping = () => {
      if (textRef.current && !isExpanded) {
        // Only check when collapsed to determine if expand button is needed
        const isClamped = textRef.current.scrollHeight > textRef.current.clientHeight
        setCanExpand(isClamped)
      }
    }

    checkTextClamping()
    // Re-check on window resize
    window.addEventListener('resize', checkTextClamping)
    return () => window.removeEventListener('resize', checkTextClamping)
  }, [project.description, isExpanded])

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.willChange = 'transform, box-shadow'
  }

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.willChange = 'auto'
  }

  return (
    <div
      className="group relative bg-[var(--background)] dark:bg-[var(--background-secondary)] rounded-xl shadow-sm hover:shadow-xl transition-[transform,box-shadow] duration-300 overflow-hidden border border-[var(--border)] hover:-translate-y-1"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="aspect-video relative overflow-hidden bg-[var(--border)] dark:bg-[var(--background-tertiary)]">
        {project.image ? (
          <Image
            src={project.image}
            alt={`${project.title} - ${project.category} ML/AI project screenshot showcasing ${project.techStack.slice(0, 3).join(', ')} implementation`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQ3NSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjFmNWY5Ii8+PC9zdmc+"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[var(--text-tertiary)]">
            <CodeBracketIcon className="h-12 w-12 opacity-20" />
          </div>
        )}
        {project.category === 'Full Stack' ? (
          <div className="absolute top-4 left-4 bg-[var(--primary)] text-white px-2 py-1 rounded-md text-xs font-medium z-10">
            Full Stack
          </div>
        ) : project.featured ? (
          <div className="absolute top-4 left-4 bg-[var(--primary)] text-white px-2 py-1 rounded-md text-xs font-medium z-10">
            Featured
          </div>
        ) : null}
        {/* Gradient overlay for better text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="p-6 transition-all duration-300">
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-flex items-center rounded-md bg-[var(--accent)]/10 dark:bg-[var(--accent)]/20 px-2 py-1 text-xs font-medium text-[var(--accent)] dark:text-[var(--accent)]">
            {project.category}
          </span>
        </div>

        <h3 className="text-xl font-semibold text-[var(--text)] mb-2 group-hover:text-[var(--primary)] transition-colors">
          {project.title}
        </h3>

        <div className="mb-4">
          <p
            ref={textRef}
            className={`text-[var(--text-secondary)] transition-all duration-300 ${isExpanded ? '' : 'line-clamp-2'}`}
          >
            {project.description}
          </p>
          {canExpand && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                setIsExpanded(!isExpanded)
              }}
              className="text-[var(--primary)] hover:text-[var(--primary-hover)] text-sm font-medium mt-1 inline-flex items-center gap-1 cursor-pointer"
            >
              {isExpanded ? (
                <>
                  Show less
                  <ChevronUpIcon className="h-4 w-4" />
                </>
              ) : (
                <>
                  Read more
                  <ChevronDownIcon className="h-4 w-4" />
                </>
              )}
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-4 transition-all duration-300">
          {(isExpanded ? project.techStack : project.techStack.slice(0, 3)).map((tech, index) => (
            <span
              key={tech}
              className="inline-flex items-center rounded-md bg-[var(--background-secondary)] dark:bg-[var(--background-tertiary)] px-2 py-1 text-xs font-medium text-[var(--text-secondary)] animate-in fade-in duration-200"
              style={{ animationDelay: `${index * 30}ms` }}
            >
              {tech}
            </span>
          ))}
          {!isExpanded && project.techStack.length > 3 && (
            <span className="inline-flex items-center rounded-md bg-[var(--background-secondary)] dark:bg-[var(--background-tertiary)] px-2 py-1 text-xs font-medium text-[var(--text-secondary)]">
              +{project.techStack.length - 3} more
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center p-2 text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors"
              title="Live Demo"
              onClick={(e) => e.stopPropagation()}
            >
              <LinkIcon className="h-5 w-5" />
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center p-2 text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors"
              title="Source Code"
              onClick={(e) => e.stopPropagation()}
            >
              <CodeBracketIcon className="h-5 w-5" />
            </a>
          )}
          <Link
            href={`/projects/${project.slug}`}
            className="ml-auto text-[var(--primary)] hover:text-[var(--primary-hover)] transition-colors text-sm font-medium"
            onClick={(e) => e.stopPropagation()}
          >
            View Details →
          </Link>
        </div>
      </div>
    </div>
  )
})

export default ProjectCard