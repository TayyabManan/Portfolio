'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { MapPinIcon, EnvelopeIcon } from '@heroicons/react/24/solid'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { SimpleCommandHint } from '@/components/ui/SimpleCommandHint'

export default function Hero() {
  const prefersReducedMotion = useReducedMotion()
  const scrollToProjects = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const projectsSection = document.getElementById('projects')
    if (projectsSection) {
      // Scroll to show projects section at the very top (under the header)
      const headerHeight = 64 // h-16 = 64px
      const y = projectsSection.getBoundingClientRect().top + window.pageYOffset - headerHeight
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => setIsMobile(window.innerWidth < 640)
    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <section className="relative min-h-[600px] sm:min-h-[calc(100vh-64px)] flex flex-col overflow-hidden bg-[var(--hero-background)]">
      {/* Animated GIS Background Pattern */}
      <div className="fixed inset-0 overflow-hidden">
        {/* Base gradient background - similar to About page */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary-light)] via-[var(--background)] to-[var(--accent)] opacity-30" />

        {/* Phase 5: Optimized floating orbs - static on mobile, reduced duration on desktop */}
        {isMobile || prefersReducedMotion ? (
          <>
            <div className="absolute top-[20%] left-[10%] w-64 h-64 sm:w-96 sm:h-96 bg-[var(--primary)] rounded-full blur-3xl opacity-15" />
            <div className="absolute bottom-[20%] right-[10%] w-48 h-48 sm:w-80 sm:h-80 bg-[var(--accent)] rounded-full blur-3xl opacity-15" />
          </>
        ) : (
          <>
            <motion.div
              className="absolute top-[20%] left-[10%] w-96 h-96 bg-[var(--primary)] rounded-full blur-3xl opacity-20"
              animate={{
                x: [0, 50, 0],
                y: [0, -30, 0],
              }}
              transition={{
                duration: 15, // Reduced from 30s for better performance
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="absolute bottom-[20%] right-[10%] w-80 h-80 bg-[var(--accent)] rounded-full blur-3xl opacity-20"
              animate={{
                x: [0, -40, 0],
                y: [0, 30, 0],
              }}
              transition={{
                duration: 18, // Reduced from 35s for better performance
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </>
        )}
      </div>
      
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

                <h1 className="text-4xl font-bold tracking-tight text-[var(--text)] sm:text-5xl md:text-6xl lg:text-7xl drop-shadow-md">
                  <span className="block">AI Engineering</span>
                  <span className="block">Student</span>
                </h1>

                <p className="mt-4 text-xl sm:text-2xl font-semibold bg-gradient-to-r from-[var(--info)] to-[var(--accent)] bg-clip-text text-transparent">
                  specializing in Computer Vision & Geospatial AI
                </p>

                <p className="mt-6 text-base sm:text-lg leading-relaxed text-[var(--text-secondary)] max-w-xl">
                  Building ML systems and AI-powered applications with PyTorch, TensorFlow, and LangChain through coursework and projects.
                  Passionate about solving real-world problems with machine learning.
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
                    href="/contact"
                    className="text-sm sm:text-base font-semibold leading-6 text-[var(--text)] hover:text-[var(--primary)] transition-all duration-200 group border-2 border-[var(--border)] hover:border-[var(--primary)] px-4 sm:px-8 py-3 sm:py-4 rounded-lg bg-[var(--background-secondary)] hover:bg-[var(--background-tertiary)] flex items-center justify-center gap-2 w-full sm:w-auto"
                  >
                    Get in touch
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

            {/* Right Column - Visual Element (Desktop Only) */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden lg:block order-2 lg:order-2 relative"
            >
              {/* Code Terminal - Desktop Only */}
              <div className="relative w-full max-w-md mx-auto lg:mx-0 lg:ml-auto">
                {/* Animated code/terminal window */}
                <div className="bg-gradient-to-br from-[var(--background-secondary)] to-[var(--background-tertiary)] rounded-2xl border border-[var(--border)] shadow-2xl overflow-hidden flex flex-col">
                  {/* Terminal header */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] bg-[var(--background)]">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#ff5f56] hover:bg-[#ff5f56]/80 cursor-pointer transition-colors"></div>
                      <div className="w-3 h-3 rounded-full bg-[#ffbd2e] hover:bg-[#ffbd2e]/80 cursor-pointer transition-colors"></div>
                      <div className="w-3 h-3 rounded-full bg-[#27c93f] hover:bg-[#27c93f]/80 cursor-pointer transition-colors"></div>
                      <span className="ml-2 text-xs text-[var(--text-secondary)]">train_model.py</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                      <span className="text-[10px] text-[var(--text-secondary)]">Training</span>
                    </div>
                  </div>

                  {/* Code content with realistic syntax highlighting */}
                  <div className="flex-1 p-4 font-mono text-[11px] leading-relaxed overflow-hidden">
                    {/* Line numbers column */}
                    <div className="flex gap-4">
                      <div className="text-[var(--text-tertiary)] select-none">
                        <div>1</div>
                        <div>2</div>
                        <div>3</div>
                        <div>4</div>
                        <div>5</div>
                        <div>6</div>
                        <div>7</div>
                        <div>8</div>
                        <div>9</div>
                        <div>10</div>
                        <div>11</div>
                        <div>12</div>
                        <div>13</div>
                        <div>14</div>
                        <div>15</div>
                        <div>16</div>
                        <div>17</div>
                      </div>
                      <div className="flex-1">
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          <span className="text-[var(--primary)]">import</span> <span className="text-[var(--info)]">torch</span>
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.4 }}
                        >
                          <span className="text-[var(--primary)]">import</span> <span className="text-[var(--info)]">torch.nn</span> <span className="text-[var(--primary)]">as</span> <span className="text-[var(--info)]">nn</span>
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 }}
                        >
                          <span className="text-[var(--primary)]">from</span> <span className="text-[var(--info)]">transformers</span> <span className="text-[var(--primary)]">import</span> <span className="text-[var(--accent)]">AutoModel</span>
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.6 }}
                        >
                          <span className="text-[var(--primary)]">from</span> <span className="text-[var(--info)]">langchain</span> <span className="text-[var(--primary)]">import</span> <span className="text-[var(--accent)]">LLMChain</span>
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.7 }}
                          className="mt-2"
                        >
                          &nbsp;
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.8 }}
                        >
                          <span className="text-[var(--text-tertiary)]"># Initialize model architecture</span>
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.9 }}
                        >
                          <span className="text-[var(--info)]">model</span> <span className="text-[var(--text)]">=</span> <span className="text-[var(--accent)]">VisionTransformer</span><span className="text-[var(--text)]">(</span>
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1.0 }}
                        >
                          &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[var(--text-secondary)]">img_size</span><span className="text-[var(--text)]">=</span><span className="text-[var(--success)]">224</span><span className="text-[var(--text)]">,</span> <span className="text-[var(--text-secondary)]">patch_size</span><span className="text-[var(--text)]">=</span><span className="text-[var(--success)]">16</span>
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1.1 }}
                        >
                          <span className="text-[var(--text)]">)</span>
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1.2 }}
                          className="mt-2"
                        >
                          &nbsp;
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1.3 }}
                        >
                          <span className="text-[var(--text-tertiary)]"># Training loop</span>
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1.4 }}
                        >
                          <span className="text-[var(--primary)]">for</span> <span className="text-[var(--text-secondary)]">epoch</span> <span className="text-[var(--primary)]">in</span> <span className="text-[var(--accent)]">range</span><span className="text-[var(--text)]">(</span><span className="text-[var(--success)]">100</span><span className="text-[var(--text)]">):</span>
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1.5 }}
                        >
                          &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[var(--info)]">loss</span> <span className="text-[var(--text)]">=</span> <span className="text-[var(--accent)]">train_step</span><span className="text-[var(--text)]">(</span><span className="text-[var(--text-secondary)]">model</span><span className="text-[var(--text)]">,</span> <span className="text-[var(--text-secondary)]">batch</span><span className="text-[var(--text)]">)</span>
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1.6 }}
                          className="mt-2"
                        >
                          &nbsp;
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1.7 }}
                        >
                          <span className="text-[var(--accent)]">print</span><span className="text-[var(--text)]">(</span><span className="text-amber-500">&quot;Epoch: 100/100 - Loss: 0.089&quot;</span><span className="text-[var(--text)]">)</span>
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1.8 }}
                        >
                          <span className="text-[var(--accent)]">print</span><span className="text-[var(--text)]">(</span><span className="text-amber-500">&quot;✓ Training complete!&quot;</span><span className="text-[var(--text)]">)</span>
                        </motion.div>
                      </div>
                    </div>
                  </div>

                  {/* Console output section */}
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ delay: 1.9, duration: 0.5 }}
                    className="border-t border-[var(--border)] bg-[var(--background)] px-4 py-3"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="text-[10px] text-[var(--text-tertiary)]">OUTPUT</div>
                      <div className="flex-1 h-px bg-[var(--border)]"></div>
                    </div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 2.0 }}
                      className="font-mono text-[10px] space-y-1"
                    >
                      <div className="text-[var(--text-secondary)]">Epoch: 100/100 - Loss: 0.089</div>
                      <div className="text-[var(--success)]">✓ Training complete!</div>
                      <div className="text-[var(--text-secondary)] flex items-center gap-2">
                        <span>Accuracy:</span>
                        <span className="text-[var(--success)] font-bold">94.3%</span>
                        <span className="text-[var(--text-tertiary)]">|</span>
                        <span>Val Loss:</span>
                        <span className="text-[var(--info)]">0.089</span>
                      </div>
                    </motion.div>
                  </motion.div>

                  {/* Interactive progress bar */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.2 }}
                    className="absolute top-16 right-4 bg-[var(--background)] border border-[var(--border)] rounded-lg px-3 py-2 shadow-lg"
                  >
                    <div className="text-[10px] text-[var(--text-secondary)] mb-1">Training Progress</div>
                    <div className="w-32 h-2 bg-[var(--border)] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ delay: 2.3, duration: 2, ease: "linear" }}
                        className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--success)]"
                      />
                    </div>
                    <div className="text-[10px] text-[var(--success)] mt-1 font-bold">100%</div>
                  </motion.div>
                </div>
                
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Command Palette Hint */}
      <SimpleCommandHint />
    </section>
  )
}