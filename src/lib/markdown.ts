import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { Project } from './projects'
import { projectSlugSchema } from './validation'

const contentDirectory = path.join(process.cwd(), 'content/projects')
const blogDirectory = path.join(process.cwd(), 'content/blog')

export interface ProjectWithContent extends Project {
  content: string
}

/**
 * Get all project markdown files
 */
export function getAllProjectSlugs(): string[] {
  try {
    if (!fs.existsSync(contentDirectory)) {
      return []
    }
    const fileNames = fs.readdirSync(contentDirectory)
    return fileNames
      .filter(name => name.endsWith('.md') && !name.startsWith('_'))
      .map(name => name.replace(/\.md$/, ''))
  } catch {
    return []
  }
}

/**
 * Get project data by slug from markdown file
 */
export function getProjectBySlug(slug: string): ProjectWithContent | null {
  try {
    // Validate slug to prevent path traversal
    const validatedSlug = projectSlugSchema.parse(slug)
    
    const fullPath = path.join(contentDirectory, `${validatedSlug}.md`)
    
    // Additional safety check: ensure the resolved path is within content directory
    const resolvedPath = path.resolve(fullPath)
    const resolvedContentDir = path.resolve(contentDirectory)
    
    if (!resolvedPath.startsWith(resolvedContentDir)) {
      return null
    }
    
    if (!fs.existsSync(fullPath)) {
      return null
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    return {
      slug: data.slug || slug,
      title: data.title || '',
      subtitle: data.subtitle || '',
      description: data.description || '',
      category: data.category || '',
      techStack: data.techStack || [],
      image: data.image || '',
      demoUrl: data.demoUrl,
      githubUrl: data.githubUrl,
      featured: data.featured || false,
      date: data.date || '',
      content
    }
  } catch {
    return null
  }
}

/**
 * Get all projects from markdown files
 */
export function getAllProjectsFromMarkdown(): Project[] {
  try {
    const slugs = getAllProjectSlugs()
    const projects = slugs
      .filter(slug => !slug.startsWith('_'))
      .map(slug => getProjectBySlug(slug))
      .filter((project): project is ProjectWithContent => project !== null)
      .map((project) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { content, ...projectWithoutContent } = project
        return projectWithoutContent
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    return projects
  } catch {
    return []
  }
}

/**
 * Get adjacent (previous/next) projects for navigation
 */
export function getAdjacentProjects(slug: string): { prev: Project | null; next: Project | null } {
  const allProjects = getAllProjectsFromMarkdown()
  const index = allProjects.findIndex(p => p.slug === slug)
  return {
    prev: index < allProjects.length - 1 ? allProjects[index + 1] : null,
    next: index > 0 ? allProjects[index - 1] : null,
  }
}

/**
 * Get featured projects from markdown files
 */
export function getFeaturedProjectsFromMarkdown(): Project[] {
  return getAllProjectsFromMarkdown().filter(project => project.featured)
}

// ============================================================================
// BLOG FUNCTIONS
// ============================================================================

export interface BlogPost {
  slug: string
  title: string
  description: string
  date: string
  author: string
  category: string
  tags: string[]
  image?: string
  readTime?: string
}

export interface BlogPostWithContent extends BlogPost {
  content: string
}

/**
 * Get all blog post markdown files
 */
export function getAllBlogSlugs(): string[] {
  try {
    if (!fs.existsSync(blogDirectory)) {
      return []
    }
    const fileNames = fs.readdirSync(blogDirectory)
    return fileNames
      .filter(name => name.endsWith('.md') && !name.startsWith('_'))
      .map(name => name.replace(/\.md$/, ''))
  } catch {
    return []
  }
}

/**
 * Get blog post data by slug from markdown file
 */
export function getBlogPostBySlug(slug: string): BlogPostWithContent | null {
  try {
    // Validate slug to prevent path traversal
    const validatedSlug = projectSlugSchema.parse(slug)

    const fullPath = path.join(blogDirectory, `${validatedSlug}.md`)

    // Additional safety check: ensure the resolved path is within blog directory
    const resolvedPath = path.resolve(fullPath)
    const resolvedBlogDir = path.resolve(blogDirectory)

    if (!resolvedPath.startsWith(resolvedBlogDir)) {
      return null
    }

    if (!fs.existsSync(fullPath)) {
      return null
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    return {
      slug: data.slug || slug,
      title: data.title || '',
      description: data.description || '',
      date: data.date || '',
      author: data.author || 'Tayyab Manan',
      category: data.category || 'General',
      tags: data.tags || [],
      image: data.image,
      readTime: data.readTime,
      content
    }
  } catch {
    return null
  }
}

/**
 * Get adjacent (previous/next) blog posts for navigation
 */
export function getAdjacentBlogPosts(slug: string): { prev: BlogPost | null; next: BlogPost | null } {
  const allPosts = getAllBlogPosts()
  const index = allPosts.findIndex(p => p.slug === slug)
  return {
    prev: index < allPosts.length - 1 ? allPosts[index + 1] : null,
    next: index > 0 ? allPosts[index - 1] : null,
  }
}

/**
 * Get all blog posts from markdown files
 */
export function getAllBlogPosts(): BlogPost[] {
  try {
    const slugs = getAllBlogSlugs()
    const posts = slugs
      .filter(slug => !slug.startsWith('_'))
      .map(slug => getBlogPostBySlug(slug))
      .filter((post): post is BlogPostWithContent => post !== null)
      .map((post) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { content, ...postWithoutContent } = post
        return postWithoutContent
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    return posts
  } catch {
    return []
  }
}

