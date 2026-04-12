'use client'

import React from 'react'
import { CheckCircleIcon, CodeBracketIcon, GlobeAltIcon, CircleStackIcon, CloudIcon, BeakerIcon } from '@heroicons/react/24/solid'
import { resumeData } from '@/lib/resume-data'

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'Machine Learning & AI': BeakerIcon,
  'Deep Learning & Computer Vision': BeakerIcon,
  'MLOps & Deployment': CloudIcon,
  'Programming Languages': CodeBracketIcon,
  'Data Science & Analysis': BeakerIcon,
  'Geospatial AI & Remote Sensing': GlobeAltIcon,
  'Web Development': CodeBracketIcon,
  'Databases & Cloud': CircleStackIcon,
  'Tools & Methodologies': CloudIcon,
}

// Show top 5 categories, 3 items each for scannability
const MAX_CATEGORIES = 5
const MAX_ITEMS_PER_CATEGORY = 3

const topCategories = resumeData.skills.slice(0, MAX_CATEGORIES).map(category => ({
  name: category.category,
  icon: categoryIcons[category.category] || CheckCircleIcon,
  items: category.items.slice(0, MAX_ITEMS_PER_CATEGORY),
  totalItems: category.items.length,
}))

const totalSkills = resumeData.skills.reduce((sum, cat) => sum + cat.items.length, 0)

export default function Skills() {
  return (
    <section className="relative min-h-screen flex items-center">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full py-16 sm:py-24">
        <div className="mb-12 max-w-4xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text)] mb-4">Skills & Expertise</h2>
          <p className="text-base sm:text-lg text-[var(--text-secondary)]">
            Specialized in machine learning engineering with expertise across {resumeData.skills.length} technology domains
            and {totalSkills}+ tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-w-5xl">
          {topCategories.map((category) => {
            const Icon = category.icon

            return (
              <div
                key={category.name}
                className="bg-[var(--background-secondary)] rounded-xl p-4 border border-[var(--border)] hover:border-[var(--primary)] transition-all hover:shadow-md"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Icon className="h-4 w-4 text-[var(--primary)]" />
                  <h3 className="text-sm font-semibold text-[var(--text)]">
                    {category.name}
                  </h3>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {category.items.map((item) => (
                    <span
                      key={item}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[var(--background)] rounded-lg text-sm text-[var(--text)] border border-[var(--border)]"
                    >
                      <CheckCircleIcon className="h-3.5 w-3.5 text-[var(--primary)]" />
                      <span className="font-medium">{item}</span>
                    </span>
                  ))}
                  {category.totalItems > MAX_ITEMS_PER_CATEGORY && (
                    <span className="inline-flex items-center px-3 py-1.5 text-xs text-[var(--text-tertiary)]">
                      +{category.totalItems - MAX_ITEMS_PER_CATEGORY} more
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
