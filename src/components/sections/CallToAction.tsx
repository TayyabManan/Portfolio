'use client'

import Link from 'next/link'
import { ArrowRightIcon, SparklesIcon } from '@heroicons/react/24/outline'

export default function CallToAction() {
  return (
    <section className="relative min-h-[50vh] py-16 sm:py-20 lg:py-24 flex items-center bg-transparent border-y border-[var(--border)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-hover)] rounded-full mb-4 shadow-lg">
              <SparklesIcon className="w-5 h-5 text-white" />
              <span className="text-sm font-semibold text-white uppercase tracking-wider">Let&apos;s Connect</span>
            </div>
            <h2 className="text-4xl font-bold text-[var(--text)] mb-4">
              Interested in Collaborating?
            </h2>
            <p className="text-xl text-[var(--text-secondary)]">
              I&apos;m excited to learn, contribute, and build impactful ML solutions.
              Let&apos;s discuss opportunities, projects, or just chat about AI and machine learning!
            </p>
          </div>
          <div className="flex flex-row items-center justify-center gap-3 sm:gap-4">
            <Link
              href="/contact"
              className="group bg-[var(--primary)] text-white px-4 sm:px-8 py-3 sm:py-4 rounded-lg text-sm sm:text-base font-semibold hover:bg-[var(--primary-hover)] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl inline-flex items-center gap-2 whitespace-nowrap"
            >
              <span className="hidden sm:inline">Get in Touch</span>
              <span className="sm:hidden">Contact</span>
              <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/projects"
              className="group border-2 border-[var(--primary)] text-[var(--primary)] px-4 sm:px-8 py-3 sm:py-4 rounded-lg text-sm sm:text-base font-semibold hover:bg-[var(--primary)] hover:text-white transition-all duration-300 bg-[var(--background)] hover:shadow-lg inline-flex items-center gap-2 whitespace-nowrap"
            >
              View My Work
              <span>→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}