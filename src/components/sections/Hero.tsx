'use client'

import { motion } from 'framer-motion'
import { MapPinIcon, EnvelopeIcon } from '@heroicons/react/24/solid'
import { SimpleCommandHint } from '@/components/ui/SimpleCommandHint'
import HeroChatbot from '@/components/ui/HeroChatbot'

export default function Hero() {
  const scrollToProjects = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const projectsSection = document.getElementById('projects')
    if (projectsSection) {
      const headerHeight = 64
      const y = projectsSection.getBoundingClientRect().top + window.pageYOffset - headerHeight
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }

  return (
    <section className="relative min-h-[600px] sm:min-h-[calc(100vh-64px)] flex flex-col overflow-hidden bg-[var(--hero-background)]">
      {/* Simple gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary-light)] via-[var(--background)] to-[var(--accent)] opacity-30" />

      <div className="relative flex-1 flex items-center px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl w-full py-12 lg:py-20">
          {/* Two-column layout on desktop, single column on mobile */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">

            {/* Left Column - Content */}
            <div className="order-1 lg:order-1">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                {/* Small label */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--background-secondary)] border border-[var(--border)] mb-4">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  <span className="text-sm text-[var(--text-secondary)]">Available for opportunities</span>
                </div>

                <h1 className="text-4xl font-bold tracking-tight text-[var(--text)] sm:text-5xl md:text-6xl lg:text-7xl">
                  <span className="block">AI / ML</span>
                  <span className="block">Engineer</span>
                </h1>

                <p className="mt-4 text-xl sm:text-2xl font-semibold bg-gradient-to-r from-[var(--info)] to-[var(--accent)] bg-clip-text text-transparent">
                  Computer Vision · Multi-Agent Systems · Production ML
                </p>

                <p className="mt-6 text-base sm:text-lg leading-relaxed text-[var(--text-secondary)] max-w-xl">
                  AI/ML Engineering graduate student at COMSATS, building machine learning systems across computer vision, NLP, and geospatial AI. Currently working as an AI Developer at Cointegration.
                </p>

                <div className="mt-8 flex flex-row items-center gap-3 text-sm text-[var(--text-secondary)] flex-wrap">
                  <div className="flex items-center gap-2">
                    <MapPinIcon className="h-4 w-4 text-[var(--info)]" />
                    <span>Islamabad, Pakistan</span>
                  </div>
                  <div className="w-1 h-1 rounded-full bg-[var(--border)]"></div>
                  <div className="flex items-center gap-2">
                    <EnvelopeIcon className="h-4 w-4 text-[var(--accent)]" />
                    <span>Open to Remote Work</span>
                  </div>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                  <a
                    href="#projects"
                    onClick={scrollToProjects}
                    className="bg-[var(--primary)] px-4 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold text-white shadow-lg hover:bg-[var(--primary-hover)] hover:shadow-xl rounded-lg transition-all duration-200 transform hover:scale-105 cursor-pointer flex items-center justify-center gap-2 w-full sm:w-auto"
                  >
                    View Projects
                    <span aria-hidden="true">→</span>
                  </a>
                  <a
                    href="/resume"
                    className="text-sm sm:text-base font-semibold leading-6 text-[var(--text)] hover:text-[var(--primary)] transition-all duration-200 group border-2 border-[var(--border)] hover:border-[var(--primary)] px-4 sm:px-8 py-3 sm:py-4 rounded-lg bg-[var(--background-secondary)] hover:bg-[var(--background-tertiary)] flex items-center justify-center gap-2 w-full sm:w-auto"
                  >
                    View Resume
                    <span aria-hidden="true" className="inline-block transition-transform group-hover:translate-x-1">→</span>
                  </a>
                </div>

                {/* Tech Stack Pills */}
                <div className="mt-8 flex flex-wrap gap-3">
                  {['PyTorch', 'TensorFlow', 'LangChain', 'Scikit-learn', 'Computer Vision', 'NLP', 'MLOps', 'FastAPI'].map((tech, i) => (
                    <motion.span
                      key={tech}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.8 + (i * 0.1) }}
                      className="px-3 py-1 text-xs font-medium bg-[var(--background-secondary)] text-[var(--text-secondary)] rounded-full border border-[var(--border)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors"
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right Column - AI Chatbot (Desktop Only) */}
            <div className="hidden lg:block order-2">
              <div className="max-w-md mx-auto lg:ml-auto">
                <HeroChatbot />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Command Palette Hint */}
      <SimpleCommandHint />
    </section>
  )
}
