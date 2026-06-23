'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { MapPinIcon, EnvelopeIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'
import { Github, Linkedin } from 'lucide-react'
import ObfuscatedEmail from '@/components/ui/ObfuscatedEmail'

const UpworkIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M18.561 13.158c-1.102 0-2.135-.467-3.074-1.227l.228-1.076.008-.042c.207-1.143.849-3.06 2.839-3.06 1.492 0 2.703 1.212 2.703 2.703-.001 1.489-1.212 2.702-2.704 2.702zm0-8.14c-2.539 0-4.51 1.649-5.31 4.366-1.22-1.834-2.148-4.036-2.687-5.892H7.828v7.112c-.002 1.406-1.141 2.546-2.547 2.548-1.405-.002-2.543-1.143-2.545-2.548V3.492H0v7.112c0 2.914 2.37 5.303 5.281 5.303 2.913 0 5.283-2.389 5.283-5.303v-1.19c.529 1.107 1.182 2.229 1.974 3.221l-1.673 7.873h2.797l1.213-5.71c1.063.679 2.285 1.109 3.686 1.109 3 0 5.439-2.452 5.439-5.45 0-3-2.439-5.439-5.439-5.439z"/>
  </svg>
)

const HuggingFaceIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path d="M2.25 11.535c0-3.407 1.847-6.554 4.844-8.258a9.822 9.822 0 019.687 0c2.997 1.704 4.844 4.851 4.844 8.258 0 5.266-4.337 9.535-9.687 9.535S2.25 16.8 2.25 11.535z" fill="#FF9D0B" />
    <path d="M11.938 20.086c4.797 0 8.687-3.829 8.687-8.551 0-4.722-3.89-8.55-8.687-8.55-4.798 0-8.688 3.828-8.688 8.55 0 4.722 3.89 8.55 8.688 8.55z" fill="#FFD21E" />
    <path d="M11.875 15.113c2.457 0 3.25-2.156 3.25-3.263 0-.576-.393-.394-1.023-.089-.582.283-1.365.675-2.224.675-1.798 0-3.25-1.693-3.25-.586 0 1.107.79 3.263 3.25 3.263h-.003z" fill="#FF323D" />
    <path d="M14.76 9.21c.32.108.445.753.767.585.447-.233.707-.708.659-1.204a1.235 1.235 0 00-.879-1.059 1.262 1.262 0 00-1.33.394c-.322.384-.377.92-.14 1.36.153.283.638-.177.925-.079l-.002.003zm-5.887 0c-.32.108-.448.753-.768.585a1.226 1.226 0 01-.658-1.204c.048-.495.395-.913.878-1.059a1.262 1.262 0 011.33.394c.322.384.377.92.14 1.36-.152.283-.64-.177-.925-.079l.003.003zm1.12 5.34a2.166 2.166 0 011.325-1.106c.07-.02.144.06.219.171l.192.306c.069.1.139.175.209.175.074 0 .15-.074.223-.172l.205-.302c.08-.11.157-.188.234-.165.537.168.986.536 1.25 1.026.932-.724 1.275-1.905 1.275-2.633 0-.508-.306-.426-.81-.19l-.616.296c-.52.24-1.148.48-1.824.48-.676 0-1.302-.24-1.823-.48l-.589-.283c-.52-.248-.838-.342-.838.177 0 .703.32 1.831 1.187 2.56l.18.14z" fill="#3A3B45" />
    <path d="M17.812 10.366a.806.806 0 00.813-.8c0-.441-.364-.8-.813-.8a.806.806 0 00-.812.8c0 .442.364.8.812.8zm-11.624 0a.806.806 0 00.812-.8c0-.441-.364-.8-.812-.8a.806.806 0 00-.813.8c0 .442.364.8.813.8z" fill="#3A3B45" />
    <path d="M4.515 13.073c-.405 0-.765.162-1.017.46a1.455 1.455 0 00-.333.925 1.801 1.801 0 00-.485-.074c-.387 0-.737.146-.985.409a1.41 1.41 0 00-.2 1.722 1.302 1.302 0 00-.447.694c-.06.222-.12.69.2 1.166a1.267 1.267 0 00-.093 1.236c.238.533.81.958 1.89 1.405l.24.096c.768.3 1.473.492 1.478.494.89.243 1.808.375 2.732.394 1.465 0 2.513-.443 3.115-1.314.93-1.342.842-2.575-.274-3.763l-.151-.154c-.692-.684-1.155-1.69-1.25-1.912-.195-.655-.71-1.383-1.562-1.383-.46.007-.889.233-1.15.605-.25-.31-.495-.553-.715-.694a1.87 1.87 0 00-.993-.312zm14.97 0c.405 0 .767.162 1.017.46.216.262.333.588.333.925.158-.047.322-.071.487-.074.388 0 .738.146.985.409a1.41 1.41 0 01.2 1.722c.22.178.377.422.445.694.06.222.12.69-.2 1.166.244.37.279.836.093 1.236-.238.533-.81.958-1.889 1.405l-.239.096c-.77.3-1.475.492-1.48.494-.89.243-1.808.375-2.732.394-1.465 0-2.513-.443-3.115-1.314-.93-1.342-.842-2.575.274-3.763l.151-.154c.695-.684 1.157-1.69 1.252-1.912.195-.655.708-1.383 1.56-1.383.46.007.889.233 1.15.605.25-.31.495-.553.718-.694.244-.162.523-.265.814-.3l.176-.012z" fill="#FF9D0B" />
    <path d="M9.785 20.132c.688-.994.638-1.74-.305-2.667-.945-.928-1.495-2.288-1.495-2.288s-.205-.788-.672-.714c-.468.074-.81 1.25.17 1.971.977.721-.195 1.21-.573.534-.375-.677-1.405-2.416-1.94-2.751-.532-.332-.907-.148-.782.541.125.687 2.357 2.35 2.14 2.707-.218.362-.983-.42-.983-.42S2.953 14.9 2.43 15.46c-.52.558.398 1.026 1.7 1.803 1.308.778 1.41.985 1.225 1.28-.187.295-3.07-2.1-3.34-1.083-.27 1.011 2.943 1.304 2.745 2.006-.2.7-2.265-1.324-2.685-.537-.425.79 2.913 1.718 2.94 1.725 1.075.276 3.813.859 4.77-.522zm4.432 0c-.687-.994-.64-1.74.305-2.667.943-.928 1.493-2.288 1.493-2.288s.205-.788.675-.714c.465.074.807 1.25-.17 1.971-.98.721.195 1.21.57.534.377-.677 1.407-2.416 1.94-2.751.532-.332.91-.148.782.541-.125.687-2.355 2.35-2.137 2.707.215.362.98-.42.98-.42S21.05 14.9 21.57 15.46c.52.558-.395 1.026-1.7 1.803-1.308.778-1.408.985-1.225 1.28.187.295 3.07-2.1 3.34-1.083.27 1.011-2.94 1.304-2.743 2.006.2.7 2.263-1.324 2.685-.537.423.79-2.912 1.718-2.94 1.725-1.077.276-3.815.859-4.77-.522z" fill="#FFD21E" />
  </svg>
)

export default function Footer() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(0)

  const measure = useCallback(() => {
    if (containerRef.current) {
      setHeight(containerRef.current.scrollHeight)
    }
  }, [])

  useEffect(() => {
    measure()

    const el = containerRef.current
    if (!el) return

    const observer = new ResizeObserver(() => measure())
    observer.observe(el)

    // Re-measure after fonts load (large name text can shift)
    document.fonts?.ready?.then(measure)

    return () => observer.disconnect()
  }, [measure])

  return (
    <div
      className="relative"
      style={{ height: height || undefined, clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}
    >
      <footer
        className="fixed bottom-0 w-full border-t border-[var(--border)] shadow-2xl bg-[var(--background)]"
        style={{ height: height || undefined }}
      >
        {/* Inner container — natural flow, measured by ref */}
        <div ref={containerRef} className="flex flex-col">
          {/* Links section */}
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full pt-8 pb-6">
            {/* Mobile */}
            <div className="sm:hidden flex flex-col gap-5">
              <div className="text-center">
                <h3 className="text-sm font-semibold mb-3 text-[var(--text)]">Quick Links</h3>
                <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
                  <Link href="/" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors py-1.5">Home</Link>
                  <span className="text-[var(--text-tertiary)]">•</span>
                  <Link href="/projects" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors py-1.5">Projects</Link>
                  <span className="text-[var(--text-tertiary)]">•</span>
                  <Link href="/blog" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors py-1.5">Blog</Link>
                  <span className="text-[var(--text-tertiary)]">•</span>
                  <Link href="/about" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors py-1.5">About</Link>
                  <span className="text-[var(--text-tertiary)]">•</span>
                  <Link href="/contact" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors py-1.5">Contact</Link>
                  <span className="text-[var(--text-tertiary)]">•</span>
                  <a href="/resume" className="inline-flex items-center gap-1 text-sm text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors" target="_blank" rel="noopener noreferrer">
                    Resume <ArrowTopRightOnSquareIcon className="h-3 w-3" />
                  </a>
                </div>
              </div>

              <div className="text-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center gap-2">
                    <MapPinIcon className="h-3.5 w-3.5 text-[var(--text-tertiary)]" />
                    <span className="text-sm text-[var(--text-secondary)]">Islamabad, Pakistan</span>
                  </div>
                  <ObfuscatedEmail className="text-sm text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors inline-flex items-center gap-2">
                    <EnvelopeIcon className="h-3.5 w-3.5 text-[var(--text-tertiary)]" />
                    <span>Email Me</span>
                  </ObfuscatedEmail>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4">
                <a href="https://www.linkedin.com/in/tayyabmanan" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg border border-[var(--border)] hover:border-[var(--border-hover)] transition-all text-[var(--primary)] hover:text-[var(--primary-hover)]" aria-label="LinkedIn Profile" title="LinkedIn">
                  <Linkedin className="h-5 w-5" />
                </a>
                <a href="https://github.com/TayyabManan" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg border border-[var(--border)] hover:border-[var(--border-hover)] transition-all text-[var(--text)] hover:text-[var(--text-secondary)]" aria-label="GitHub Profile" title="GitHub">
                  <Github className="h-5 w-5" />
                </a>
                <a href="https://www.upwork.com/users/~0155edcc7d42fc5b51" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg border border-[var(--border)] hover:border-[var(--border-hover)] transition-all text-[var(--success)] hover:text-[var(--success)]/80" aria-label="Upwork Profile" title="Upwork">
                  <UpworkIcon className="h-5 w-5" />
                </a>
                <a href="https://huggingface.co/TayyabManan" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg border border-[var(--border)] hover:border-[var(--border-hover)] transition-all" aria-label="Hugging Face Profile" title="Hugging Face">
                  <HuggingFaceIcon className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Desktop */}
            <div className="hidden sm:grid sm:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-[var(--text)]">Contact</h3>
                <div className="space-y-1">
                  <div className="flex items-start gap-3">
                    <MapPinIcon className="h-5 w-5 text-[var(--text-tertiary)] mt-0.5 flex-shrink-0" />
                    <span className="text-[var(--text-secondary)]">Islamabad, Pakistan</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <EnvelopeIcon className="h-5 w-5 text-[var(--text-tertiary)] mt-0.5 flex-shrink-0" />
                    <ObfuscatedEmail className="text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors break-all" />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 text-[var(--text)]">Quick Links</h3>
                <div className="space-y-0.5">
                  <Link href="/" className="block text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors">Home</Link>
                  <Link href="/projects" className="block text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors">Projects</Link>
                  <Link href="/blog" className="block text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors">Blog</Link>
                  <Link href="/about" className="block text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors">About</Link>
                  <Link href="/contact" className="block text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors">Contact</Link>
                  <a href="/resume" className="inline-flex items-center gap-1 text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors" target="_blank" rel="noopener noreferrer">
                    Resume <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                  </a>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 text-[var(--text)]">Connect</h3>
                <div className="flex items-center gap-4">
                  <a href="https://www.linkedin.com/in/tayyabmanan" target="_blank" rel="noopener noreferrer" className="p-3 rounded-lg border border-[var(--border)] hover:border-[var(--border-hover)] transition-all text-[var(--primary)] hover:text-[var(--primary-hover)]" aria-label="LinkedIn Profile" title="LinkedIn">
                    <Linkedin className="h-6 w-6" />
                  </a>
                  <a href="https://github.com/TayyabManan" target="_blank" rel="noopener noreferrer" className="p-3 rounded-lg border border-[var(--border)] hover:border-[var(--border-hover)] transition-all text-[var(--text)] hover:text-[var(--text-secondary)]" aria-label="GitHub Profile" title="GitHub">
                    <Github className="h-6 w-6" />
                  </a>
                  <a href="https://www.upwork.com/users/~0155edcc7d42fc5b51" target="_blank" rel="noopener noreferrer" className="p-3 rounded-lg border border-[var(--border)] hover:border-[var(--border-hover)] transition-all text-[var(--success)] hover:text-[var(--success)]/80" aria-label="Upwork Profile" title="Upwork">
                    <UpworkIcon className="h-6 w-6" />
                  </a>
                  <a href="https://huggingface.co/TayyabManan" target="_blank" rel="noopener noreferrer" className="p-3 rounded-lg border border-[var(--border)] hover:border-[var(--border-hover)] transition-all" aria-label="Hugging Face Profile" title="Hugging Face">
                    <HuggingFaceIcon className="h-6 w-6" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Large Name Display */}
          <div className="flex items-end justify-center pb-1 sm:pb-2 md:pb-3 px-4 sm:px-6 md:px-8 pointer-events-none">
            <div className="relative pr-4 sm:pr-8">
              <h1 className="font-extrabold select-none leading-none tracking-tighter whitespace-nowrap text-[clamp(2rem,10vw,8rem)] sm:text-[12vw] md:text-[13vw] text-[var(--text)]">
                Tayyab Manan
              </h1>
              <span className="absolute top-0 -right-2 sm:-right-6 text-[3vw] sm:text-[2.5vw] md:text-[2vw] font-bold text-[var(--text)]">
                ©
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
