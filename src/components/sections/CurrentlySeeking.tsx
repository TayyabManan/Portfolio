'use client'

import {
  BriefcaseIcon,
  AcademicCapIcon,
  UserGroupIcon,
  CalendarIcon,
  MapPinIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'

export default function CurrentlySeeking() {
  const opportunities = [
    {
      icon: BriefcaseIcon,
      title: "Summer 2026 ML Internship",
      description: "Seeking hands-on experience in ML Engineering, Computer Vision, or NLP",
      color: "primary"
    },
    {
      icon: AcademicCapIcon,
      title: "Research Assistant Positions",
      description: "Interested in academic research in Geospatial AI and Environmental Monitoring",
      color: "accent"
    },
    {
      icon: UserGroupIcon,
      title: "Collaborative Projects",
      description: "Open to working on open-source ML projects and team collaborations",
      color: "info"
    }
  ]

  const preferences = [
    {
      icon: CalendarIcon,
      label: "Timeline",
      value: "Summer 2026 (May - August)"
    },
    {
      icon: MapPinIcon,
      label: "Location",
      value: "Remote, Hybrid, or On-site"
    },
    {
      icon: ClockIcon,
      label: "Availability",
      value: "Full-time during summer, Part-time during semester"
    }
  ]

  return (
    <section className="py-16 sm:py-24 bg-[var(--background-secondary)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-4">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-sm font-medium text-green-500">Open to Opportunities</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-[var(--text)] sm:text-4xl">
            Currently Seeking
          </h2>
          <p className="mt-4 text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
            Looking for opportunities to apply my ML skills, learn from industry experts, and contribute to impactful projects
          </p>
        </div>

        {/* Opportunities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {opportunities.map((opportunity, index) => {
            // Whitelist approach for colors to prevent CSS injection
            const colorMap: Record<string, string> = {
              primary: 'var(--primary)',
              accent: 'var(--accent)',
              info: 'var(--info)',
              success: 'var(--success)',
            }
            const bgColor = colorMap[opportunity.color] || colorMap.primary

            return (
            <div
              key={index}
              className="bg-[var(--background-secondary)] border border-[var(--border)] rounded-2xl p-6 hover:border-[var(--primary)] transition-all duration-200 hover:shadow-md"
            >
              <div className="flex flex-col items-center text-center">
                <div
                  className="p-4 rounded-xl mb-4"
                  style={{ backgroundColor: `${bgColor}1A` }}
                >
                  <opportunity.icon className="h-8 w-8" style={{ color: bgColor }} />
                </div>
                <h3 className="text-lg font-bold text-[var(--text)] mb-2">
                  {opportunity.title}
                </h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  {opportunity.description}
                </p>
              </div>
            </div>
            )
          })}
        </div>

        {/* Preferences */}
        <div className="bg-[var(--background-secondary)] border border-[var(--border)] rounded-2xl p-8 mb-12">
          <h3 className="text-xl font-bold text-[var(--text)] mb-6 text-center">
            My Preferences
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {preferences.map((pref, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="p-2 bg-[var(--primary)]/10 rounded-lg mt-1">
                  <pref.icon className="h-5 w-5 text-[var(--primary)]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--text-tertiary)] mb-1">
                    {pref.label}
                  </p>
                  <p className="text-sm font-semibold text-[var(--text)]">
                    {pref.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-[var(--text)] mb-4">
            Interested in Working Together?
          </h3>
          <p className="text-[var(--text-secondary)] mb-8 max-w-2xl mx-auto">
            I&apos;m always excited to discuss potential opportunities, collaborate on projects, or just chat about ML and AI.
            Feel free to reach out!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="w-full sm:min-w-[180px] inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-[var(--primary)] rounded-lg hover:bg-[var(--primary-hover)] transition-all duration-200"
            >
              Get in Touch
              <span aria-hidden="true" className="ml-2">→</span>
            </Link>
            <Link
              href="/resume"
              className="w-full sm:min-w-[180px] inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-[var(--text)] bg-[var(--background-secondary)] border-2 border-[var(--border)] rounded-lg hover:border-[var(--primary)] hover:bg-[var(--background-tertiary)] transition-all duration-200"
            >
              View Resume
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
