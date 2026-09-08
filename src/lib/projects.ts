/**
 * The Project shape. TYPE ONLY - the data itself comes from markdown
 * frontmatter via src/lib/markdown.ts (getAllProjectsFromMarkdown etc.).
 * A stale empty `projects: Project[] = []` array and a `getFeaturedProjects()`
 * that filtered it (so it could only ever return []) lived here until the
 * Aug 2026 dead-code sweep; the markdown loader replaced them long before.
 */
export interface Project {
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
  /** Terse headline metric shown in the mono voice on the card cover,
      e.g. "80% accuracy". Optional - covers without one render no metric. */
  metric?: string
  /** Which notebook chart the card cover draws (see CoverChart):
      'scatter-fit' | 'bars-up' | 'bars-down' | 'hbars' | 'accuracy' |
      'coverage' | 'roc' | 'line' | 'crossing'. Defaults to 'line' when unset. */
  metricChart?: string
}

