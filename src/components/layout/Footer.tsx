'use client'

import Link from 'next/link'
import { MapPinIcon, EnvelopeIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'
import { Github, Linkedin } from 'lucide-react'

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

export default function Footer() {
  return (
    <div
      className="relative h-[400px] sm:h-[500px]"
      style={{clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)"}}
    >
      <footer className="fixed bottom-0 h-[400px] sm:h-[500px] w-full text-[var(--text)] flex items-center border-t border-[var(--border)] shadow-2xl">
      {/* Footer Background */}
      <div className="absolute inset-0">
        {/* Beautiful gradient background matching the site theme */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--hero-gradient-start)] via-[var(--hero-gradient-mid)] to-[var(--hero-gradient-end)]" />

        {/* Semi-transparent overlay for readability */}
        <div className="absolute inset-0 bg-[var(--background)]/50 backdrop-blur-sm" />

        {/* Subtle network pattern */}
        <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="footer-pattern" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
              <circle cx="100" cy="100" r="1" fill="var(--border)" opacity="0.1" />
              <circle cx="50" cy="50" r="0.5" fill="var(--primary)" opacity="0.08" />
              <circle cx="150" cy="50" r="0.5" fill="var(--accent)" opacity="0.08" />
              <circle cx="50" cy="150" r="0.5" fill="var(--info)" opacity="0.08" />
              <circle cx="150" cy="150" r="0.5" fill="var(--success)" opacity="0.08" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#footer-pattern)" />
        </svg>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full relative z-10 pt-6 sm:pt-8 pb-16 sm:pb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Mobile view - modern clean layout */}
          <div className="sm:hidden">
            <div className="flex flex-col gap-6">
              {/* Quick Links - Single Column */}
              <div className="text-center">
                <h3 className="text-sm font-semibold mb-3 text-[var(--text)]" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>Quick Links</h3>
                <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
                  <Link href="/projects" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors">
                    Projects
                  </Link>
                  <span className="text-[var(--text-tertiary)]">•</span>
                  <Link href="/blog" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors">
                    Blog
                  </Link>
                  <span className="text-[var(--text-tertiary)]">•</span>
                  <Link href="/about" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors">
                    About
                  </Link>
                  <span className="text-[var(--text-tertiary)]">•</span>
                  <Link href="/contact" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors">
                    Contact
                  </Link>
                  <span className="text-[var(--text-tertiary)]">•</span>
                  <a href="/resume" className="inline-flex items-center gap-1 text-sm text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors" target="_blank" rel="noopener noreferrer">
                    Resume
                    <ArrowTopRightOnSquareIcon className="h-3 w-3" />
                  </a>
                </div>
              </div>

              {/* Contact Info - Centered */}
              <div className="text-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center gap-2">
                    <MapPinIcon className="h-3.5 w-3.5 text-[var(--text-tertiary)]" />
                    <span className="text-sm text-[var(--text-secondary)]">Islamabad, Pakistan</span>
                  </div>
                  <a
                    href="mailto:m.tayyab.manan@gmail.com"
                    className="text-sm text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors inline-flex items-center gap-2"
                  >
                    <EnvelopeIcon className="h-3.5 w-3.5 text-[var(--text-tertiary)]" />
                    <span>Email Me</span>
                  </a>
                </div>
              </div>

              {/* Social Icons */}
              <div className="flex items-center justify-center gap-4">
                <a
                  href="https://www.linkedin.com/in/muhammad-tayyab-3962a2373/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg border border-[var(--border)] hover:border-[var(--border-hover)] transition-all text-[var(--primary)] hover:text-[var(--primary-hover)]"
                  aria-label="LinkedIn Profile"
                  title="LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
                <a
                  href="https://github.com/TayyabManan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg border border-[var(--border)] hover:border-[var(--border-hover)] transition-all text-[var(--text)] hover:text-[var(--text-secondary)]"
                  aria-label="GitHub Profile"
                  title="GitHub"
                >
                  <Github className="h-5 w-5" />
                </a>
                <a
                  href="https://www.upwork.com/users/~0155edcc7d42fc5b51"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg border border-[var(--border)] hover:border-[var(--border-hover)] transition-all text-[var(--success)] hover:text-[var(--success)]/80"
                  aria-label="Upwork Profile"
                  title="Upwork"
                >
                  <UpworkIcon className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Desktop view - original layout */}
          <div className="hidden sm:grid sm:grid-cols-3 sm:col-span-3 gap-8">
            {/* Contact Info */}
            <div>
            <h3 className="text-lg font-semibold mb-4 text-[var(--text)]" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>Contact</h3>
            <div className="space-y-1">
              <div className="flex items-start gap-3">
                <MapPinIcon className="h-5 w-5 text-[var(--text-tertiary)] mt-0.5 flex-shrink-0" />
                <span className="text-[var(--text-secondary)]">Islamabad, Pakistan</span>
              </div>
              <div className="flex items-start gap-3">
                <EnvelopeIcon className="h-5 w-5 text-[var(--text-tertiary)] mt-0.5 flex-shrink-0" />
                <a
                  href="mailto:m.tayyab.manan@gmail.com"
                  className="text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors break-all"
                >
                  m.tayyab.manan@gmail.com
                </a>
              </div>
            </div>
            </div>

            {/* Quick Links */}
            <div>
            <h3 className="text-lg font-semibold mb-4 text-[var(--text)]" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>Quick Links</h3>
            <div className="space-y-0.5">
              <Link href="/projects" className="block text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors">
                Projects
              </Link>
              <Link href="/blog" className="block text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors">
                Blog
              </Link>
              <Link href="/about" className="block text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors">
                About
              </Link>
              <Link href="/contact" className="block text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors">
                Contact
              </Link>
              <a href="/resume" className="inline-flex items-center gap-1 text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors" target="_blank" rel="noopener noreferrer">
                Resume
                <ArrowTopRightOnSquareIcon className="h-4 w-4" />
              </a>
            </div>
            </div>

            {/* Professional Links */}
            <div>
            <h3 className="text-lg font-semibold mb-4 text-[var(--text)]" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>Connect</h3>
            <div className="flex items-center gap-4">
              <a
                href="https://www.linkedin.com/in/muhammad-tayyab-3962a2373/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-lg border border-[var(--border)] hover:border-[var(--border-hover)] transition-all text-[var(--primary)] hover:text-[var(--primary-hover)]"
                aria-label="LinkedIn Profile"
                title="LinkedIn"
              >
                <Linkedin className="h-6 w-6" />
              </a>
              <a
                href="https://github.com/TayyabManan"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-lg border border-[var(--border)] hover:border-[var(--border-hover)] transition-all text-[var(--text)] hover:text-[var(--text-secondary)]"
                aria-label="GitHub Profile"
                title="GitHub"
              >
                <Github className="h-6 w-6" />
              </a>
              <a
                href="https://www.upwork.com/users/~0155edcc7d42fc5b51"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-lg border border-[var(--border)] hover:border-[var(--border-hover)] transition-all text-[var(--success)] hover:text-[var(--success)]/80"
                aria-label="Upwork Profile"
                title="Upwork"
              >
                <UpworkIcon className="h-6 w-6" />
              </a>
            </div>
            </div>
          </div>
        </div>

      </div>

      {/* Large Name Display - positioned at the very bottom */}
      <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center pb-1 sm:pb-2 md:pb-3 px-4 sm:px-6 md:px-8 pointer-events-none z-0">
        <div className="relative pr-4 sm:pr-8">
          <h1 className="font-extrabold select-none leading-none tracking-tighter whitespace-nowrap text-[10vw] sm:text-[12vw] md:text-[13vw]" style={{ fontFamily: 'inherit', color: 'var(--text)' }}>
            Tayyab Manan
          </h1>
          {/* Copyright icon at top right of last 'n' */}
          <span className="absolute top-0 -right-2 sm:-right-6 text-[3vw] sm:text-[2.5vw] md:text-[2vw] font-bold text-[var(--text)]">
            ©
          </span>
        </div>
      </div>
      </footer>
    </div>
  )
}