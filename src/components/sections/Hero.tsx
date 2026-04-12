'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import { SimpleCommandHint } from '@/components/ui/SimpleCommandHint'

const EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1]

const containerVariants: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
}

const itemVariants: Variants = {
  initial: { opacity: 0, y: 14 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: EASE,
    },
  },
}

const ruleVariants: Variants = {
  initial: { scaleX: 0, opacity: 0 },
  animate: {
    scaleX: 1,
    opacity: 1,
    transition: {
      duration: 0.8,
      delay: 0.7,
      ease: EASE,
    },
  },
}

const specializations = [
  'Computer Vision',
  'Multi-Agent Systems',
  'Production ML',
  'Geospatial AI',
]

export default function Hero() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % specializations.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const scrollToProjects = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault()
      const projectsSection = document.getElementById('projects')
      if (projectsSection) {
        const headerHeight = 64
        const y =
          projectsSection.getBoundingClientRect().top +
          window.pageYOffset -
          headerHeight
        window.scrollTo({ top: y, behavior: 'smooth' })
      }
    },
    []
  )

  return (
    <section className="relative flex flex-col h-[calc(100svh-64px)] overflow-hidden bg-[var(--background)]">
      <div className="relative flex-1 flex items-center px-4 sm:px-6 lg:px-8 overflow-hidden">
        <motion.div
          className="mx-auto max-w-4xl w-full py-12 sm:py-16"
          variants={containerVariants}
          initial="initial"
          animate="animate"
        >
          {/* Greeting: lighter weight, sets human tone before the big title */}
          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg font-medium text-[var(--text-secondary)] tracking-wide"
          >
            Hello, I&apos;m Tayyab Manan
          </motion.p>

          {/* Title: large, tight tracking, commands the page */}
          <motion.h1
            variants={itemVariants}
            className="mt-3 text-[2.75rem] leading-[1.08] font-bold tracking-tight text-[var(--text)] sm:text-6xl md:text-7xl"
          >
            AI/ML Engineer
          </motion.h1>

          {/* Rotating specialization */}
          <motion.div
            variants={itemVariants}
            className="mt-5 h-8 sm:h-9 relative overflow-hidden"
          >
            <AnimatePresence mode="wait">
              <motion.p
                key={activeIndex}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="text-base sm:text-lg font-semibold text-[var(--primary)] uppercase tracking-[0.12em] absolute left-0"
              >
                {specializations[activeIndex]}
              </motion.p>
            </AnimatePresence>
          </motion.div>

          {/* Drawn rule: a thin line that scales in, creates visual structure */}
          <motion.div
            variants={ruleVariants}
            className="mt-7 h-px w-16 bg-[var(--border-hover)] origin-left"
            aria-hidden="true"
          />

          {/* Bio: concise, human, not marketing copy */}
          <motion.p
            variants={itemVariants}
            className="mt-7 text-base sm:text-lg leading-relaxed text-[var(--text-secondary)] max-w-xl"
          >
            Graduate student at{' '}
            <a
              href="https://www.comsats.edu.pk/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-0.5 text-[var(--primary)] font-semibold underline underline-offset-2 decoration-[var(--primary)]/30 hover:decoration-[var(--primary)] transition-all"
            >
              COMSATS
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0 translate-y-[-1px]" aria-hidden="true">
                <path d="M3.5 2.5H9.5V8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9.5 2.5L2.5 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
            , building machine learning systems
            across computer vision, NLP, and geospatial AI. Currently an AI
            Developer at{' '}
            <a
              href="https://cointegration.ai/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-0.5 text-[var(--primary)] font-semibold underline underline-offset-2 decoration-[var(--primary)]/30 hover:decoration-[var(--primary)] transition-all"
            >
              Cointegration
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0 translate-y-[-1px]" aria-hidden="true">
                <path d="M3.5 2.5H9.5V8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9.5 2.5L2.5 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
            .
          </motion.p>

          {/* Status line: flat, informational, engineer-style */}
          <motion.div
            variants={itemVariants}
            className="mt-6 flex flex-row items-center gap-4 text-sm text-[var(--text-tertiary)] flex-wrap"
          >
            <span className="inline-flex items-center gap-2">
              <span
                className="w-1.5 h-1.5 rounded-full bg-[var(--success)]"
                aria-hidden="true"
              />
              <span>Available for roles</span>
            </span>
            <span
              className="hidden sm:inline text-[var(--border-hover)]"
              aria-hidden="true"
            >
              /
            </span>
            <span>Islamabad, UTC+5</span>
            <span
              className="hidden sm:inline text-[var(--border-hover)]"
              aria-hidden="true"
            >
              /
            </span>
            <span>Replies in 24h</span>
          </motion.div>

          {/* CTAs: left-aligned to match the content flow */}
          <motion.div
            variants={itemVariants}
            className="mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4"
          >
            <a
              href="#projects"
              onClick={scrollToProjects}
              className="group bg-[var(--primary)] px-7 py-3.5 text-sm font-semibold text-white rounded-lg hover:bg-[var(--primary-hover)] active:scale-[0.98] transition-all duration-200 cursor-pointer flex items-center justify-center sm:justify-start gap-2 w-full sm:w-auto"
            >
              View Projects
              <span
                aria-hidden="true"
                className="inline-block transition-transform duration-200 group-hover:translate-x-0.5"
              >
                &rarr;
              </span>
            </a>
            <a
              href="/resume"
              className="group text-sm font-semibold text-[var(--text)] hover:text-[var(--primary)] border-2 border-[var(--border)] hover:border-[var(--primary)] px-7 py-3.5 rounded-lg transition-all duration-200 flex items-center justify-center sm:justify-start gap-2 w-full sm:w-auto"
            >
              View Resume
              <span
                aria-hidden="true"
                className="inline-block transition-transform duration-200 group-hover:translate-x-0.5"
              >
                &rarr;
              </span>
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Tech stack marquee */}
      <div className="mt-auto overflow-hidden border-t border-[var(--border)] py-5 select-none" aria-hidden="true">
        <motion.div
          className="flex whitespace-nowrap"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: isMobile ? 12 : 25, ease: 'linear', repeat: Infinity }}
        >
          {[0, 1].map((i) => (
            <div key={i} className="flex shrink-0 items-center">
              {[
                'PyTorch', 'TensorFlow', 'LangChain', 'Computer Vision',
                'NLP', 'Geospatial AI', 'HuggingFace', 'OpenAI',
                'Scikit-learn', 'FastAPI', 'Docker', 'MLOps',
                'Multi-Agent Systems', 'Python', 'Deep Learning',
                'Time Series', 'Remote Sensing', 'CrewAI',
              ].map((item) => (
                <span key={item} className="flex items-center">
                  <span
                    className="text-base font-medium text-[var(--text-secondary)] tracking-wide px-6"
                    style={{ fontFamily: 'var(--font-heading), system-ui, sans-serif' }}
                  >
                    {item}
                  </span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 text-[var(--primary)]" aria-hidden="true">
                    <path d="M8 0L9.79 6.21L16 8L9.79 9.79L8 16L6.21 9.79L0 8L6.21 6.21L8 0Z" fill="currentColor" />
                  </svg>
                </span>
              ))}
            </div>
          ))}
        </motion.div>
      </div>

      <SimpleCommandHint />
    </section>
  )
}
