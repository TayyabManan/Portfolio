'use client'

import React from 'react'
import { CheckCircleIcon, CodeBracketIcon, GlobeAltIcon, CircleStackIcon, CloudIcon, BeakerIcon } from '@heroicons/react/24/solid'
import { resumeData } from '@/lib/resume-data'

// Get icons for each category
const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'Programming Languages': CodeBracketIcon,
  'GIS & Remote Sensing': GlobeAltIcon,
  'Web Development': CodeBracketIcon,
  'Data Analysis & ML': BeakerIcon,
  'Databases': CircleStackIcon,
  'Cloud & Tools': CloudIcon,
}

// Group tools by category
const toolCategories = resumeData.skills.map(category => ({
  name: category.category,
  icon: categoryIcons[category.category] || CheckCircleIcon,
  items: category.items
}))

// Simple skill badge component
const SkillBadge = ({ name }: { name: string }) => {
  return (
    <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-[var(--background-secondary)] rounded-lg text-sm text-[var(--text)] border border-[var(--border)] hover:border-[var(--primary)] transition-colors">
      <CheckCircleIcon className="h-3.5 w-3.5 text-[var(--primary)]" />
      <span className="font-medium">{name}</span>
    </span>
  )
}

export default function Skills() {
  return (
    <section className="relative min-h-screen flex items-center">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full py-16 sm:py-24">
        <div className="mb-12 max-w-4xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text)] mb-4">Skills & Expertise</h2>
          <p className="text-base sm:text-lg text-[var(--text-secondary)]">
            Specialized in machine learning engineering with expertise across {resumeData.skills.length} technology domains,
            from deep learning frameworks to production MLOps and deployment.
          </p>
        </div>

        {/* Skills in Compact Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-w-6xl mx-auto">
          {toolCategories.map((category) => {
            const Icon = category.icon

            return (
              <div
                key={category.name}
                className="bg-[var(--background-secondary)] rounded-xl p-4 border border-[var(--border)] hover:border-[var(--primary)] transition-all hover:shadow-md"
              >
                <div>
                  {/* Compact Category Header */}
                  <div className="flex items-center gap-2 mb-3">
                    <Icon className="h-4 w-4 text-[var(--primary)]" />
                    <h3 className="text-sm font-semibold text-[var(--text)]">
                      {category.name}
                    </h3>
                    <span className="ml-auto text-xs text-[var(--text-secondary)]">
                      {category.items.length}
                    </span>
                  </div>

                  {/* Skills as compact badges */}
                  <div className="flex flex-wrap gap-1.5">
                    {category.items.map((item) => (
                      <SkillBadge
                        key={item}
                        name={item}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
