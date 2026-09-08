'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import { Github, Linkedin, FileText, ArrowUpRight } from 'lucide-react'
import WiggleLine from '@/components/effects/WiggleLine'
import HeroReadout, { warmHeroReadout, type HeroReadoutVariant } from '@/components/effects/HeroReadout'
import { desktopMotionOK } from '@/lib/gsap'

// Four focus areas - a static annotation line in the mobile hero, and a numbered index on desktop.
// Each pill links to its flagship project. `metric` is the real, already-published number
// shown by the fill layer that rises on hover - keep these terse so the pill width
// (sized to the wider of label/metric) stays close to today's. Every metric
// carries its baseline or context (bare accuracy invites skepticism from
// anyone who knows ML): 7-class task, vs-base win rate, vs-the-ReLU-twin under noise,
// district count. Numbers must match the project pages verbatim.
const focusAreas: { label: string; metric: string; href: string; readout: HeroReadoutVariant }[] = [
  { label: 'Computer Vision', metric: '80% acc · 7 classes', href: '/projects/face-expression-detection', readout: 'accuracy' },
  { label: 'Production ML', metric: '79.5% win vs base', href: '/projects/urdu-llm-fine-tuning', readout: 'bars-up' },
  { label: 'Geospatial AI', metric: 'R²=0.89 · 145 districts', href: '/projects/watertrace', readout: 'scatter-fit' },
  { label: 'Neuromorphic ML', metric: '+28 pts under noise', href: '/projects/do-spikes-fail-differently', readout: 'crossing' },
]

// Reused external-link arrow (↗) for affiliation links.
function ExternalArrow() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      className="shrink-0 translate-y-[-1px]"
      aria-hidden="true"
    >
      <path d="M3.5 2.5H9.5V8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9.5 2.5L2.5 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const affiliationLinkClass =
  'inline-flex items-center gap-0.5 text-[var(--primary)] font-semibold underline underline-offset-2 decoration-[var(--primary)]/30 hover:decoration-[var(--primary)] transition-all'

// Heading font for the focus-area pill text: <a>/<span> don't inherit the h1-scoped
// heading font, so the pill layers set it explicitly (shared across sizer/base/fill).
// The headline itself does NOT use this - owner call (Aug 2026): the hero headline
// speaks the body voice (Hanken) on every breakpoint, see the h1's font-sans below.
const PILL_FONT = { fontFamily: 'var(--font-heading), system-ui, sans-serif' } as const

export default function Hero() {
  const indexRef = useRef<HTMLUListElement>(null)

  // Desktop focus-index readout: hidden at rest; shows the hovered/focused
  // pill's chart and morphs between charts (see HeroReadout).
  const [readoutArea, setReadoutArea] = useState<number | null>(null)

  // Fill-up on the focus-area index pills (desktop, fine-pointer only). On hover or keyboard focus GSAP slides a
  // primary fill layer (with a slightly arced cap) up from below to cover the pill while the base
  // text travels up and out; on leave both slide back. GSAP is used (not a CSS transition) so the
  // motion survives the global prefers-reduced-motion rule that would otherwise zero it. Dynamically
  // imported so the mobile hero never ships it; gsap.matchMedia reverts the listeners below lg.
  useEffect(() => {
    if (!indexRef.current) return
    // Gate the import itself: touch / narrow viewports never download GSAP,
    // and reduced-motion users keep the static pills (rest state is complete).
    if (!desktopMotionOK()) return
    let cancelled = false
    let revert: (() => void) | null = null
    // fonts.ready before measuring: the pills' widths depend on the heading font,
    // and the rest/hover widths are captured in px at bind time.
    Promise.all([import('gsap'), document.fonts?.ready ?? Promise.resolve()]).then(([{ default: gsap }]) => {
      const ul = indexRef.current
      if (cancelled || !ul) return
      const mm = gsap.matchMedia()
      mm.add('(min-width: 1024px)', () => {
        // Pin the w-fit ul at its intrinsic width BEFORE parking rows at px widths.
        // Without this the ul re-derives its size from the rows' explicit px values
        // (intrinsic sizing ignores % widths but honors px), collapsing the rail by
        // the arrow slot and leaving no room for the hover expansion.
        // ceil, not offsetWidth: offsetWidth rounds DOWN, and pinning half a pixel
        // short of the intrinsic width made the longest metric wrap on hover.
        const fullW = Math.ceil(ul.getBoundingClientRect().width)
        gsap.set(ul, { width: fullW })
        const rows = gsap.utils.toArray<HTMLElement>('[data-index-row]', ul)
        const disposers = rows.map((row) => {
          const fill = row.querySelector<HTMLElement>('[data-index-fill]')
          const base = row.querySelector<HTMLElement>('[data-index-base]')
          const arrows = gsap.utils.toArray<HTMLElement>('[data-index-arrow]', row)
          if (!fill || !base) return () => {}
          // Park the fill - plus its arced cap (h-3 = 12px above it) - fully below the pill.
          gsap.set(fill, { yPercent: 100, y: 18 })
          gsap.set(base, { yPercent: 0 })
          // Rest state: the pill sits 32px narrower than its slot (the arrow slot:
          // 16px icon + 16px gap-4) hugging the rail's right edge, mirroring the CSS
          // `w-[calc(100%-2rem)] ml-auto` rest classes so there's no jump when these
          // inline values take over. On hover it expands leftward to the pinned full
          // width while the arrow fades/slides in - one gesture with the fill rise.
          const restW = fullW - 32
          gsap.set(row, { width: restW })
          gsap.set(arrows, { opacity: 0, x: 8 })
          // Explicit in/out tweens (not timeline.reverse) so the fill comes and goes at the same speed.
          const DUR = 0.32
          const EASE = 'power3.out'
          const enter = () => {
            gsap.to(fill, { yPercent: 0, y: 0, duration: DUR, ease: EASE, overwrite: true })
            gsap.to(base, { yPercent: -100, duration: DUR, ease: EASE, overwrite: true })
            gsap.to(row, { width: fullW, duration: DUR, ease: EASE, overwrite: true })
            gsap.to(arrows, { opacity: 1, x: 0, duration: DUR, ease: EASE, overwrite: true })
          }
          const leave = () => {
            gsap.to(fill, { yPercent: 100, y: 18, duration: DUR, ease: EASE, overwrite: true })
            gsap.to(base, { yPercent: 0, duration: DUR, ease: EASE, overwrite: true })
            gsap.to(row, { width: restW, duration: DUR, ease: EASE, overwrite: true })
            gsap.to(arrows, { opacity: 0, x: 8, duration: DUR, ease: EASE, overwrite: true })
          }
          row.addEventListener('mouseenter', enter)
          row.addEventListener('mouseleave', leave)
          // Keyboard focus drives the same fill so the signature motion isn't mouse-only.
          row.addEventListener('focus', enter)
          row.addEventListener('blur', leave)
          return () => {
            row.removeEventListener('mouseenter', enter)
            row.removeEventListener('mouseleave', leave)
            row.removeEventListener('focus', enter)
            row.removeEventListener('blur', leave)
            gsap.killTweensOf([fill, base, row, ...arrows])
            gsap.set([fill, base, row, ...arrows], { clearProps: 'all' })
          }
        })
        return () => {
          disposers.forEach((dispose) => dispose())
          gsap.set(ul, { clearProps: 'width' })
        }
      })
      revert = () => mm.revert()
    }).catch(() => {
      // Motion is progressive enhancement - a failed gsap chunk load leaves the
      // pills static (CSS rest state) instead of surfacing an unhandled rejection.
    })
    return () => {
      cancelled = true
      revert?.()
    }
    // Bind once on mount - the pills are static server-rendered nodes (the desktop
    // entrance is CSS now, so there's no remount that swaps in fresh nodes).
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
    <section className="relative bg-[var(--background)]">
      {/* ===================== MOBILE / TABLET HERO (below lg) ===================== */}
      {/* The original single-column hero, kept as-is for small screens (no marquee). */}
      <div className="flex min-h-[calc(100dvh-64px)] items-center px-4 sm:px-6 lg:hidden">
        <div className="mx-auto w-full max-w-4xl py-12 sm:py-16">
          {/* PARITY RULE (review 2026-09-03): this hero is the desktop hero's
              content re-flowed for one column - same eyebrow, same claim,
              same meta line, same lede, same actions. It used to carry its
              own greeting (sentence case, larger), its own bio paragraph, a
              four-item status row and a right-arrow CTA, so an iPad saw one
              site in landscape (lg, 1024+) and another rotated. When the
              desktop copy changes, change it here too. */}

          {/* 1. Eyebrow - greeting + job title (title demoted here in the
              home restructure; the headline carries the claim) */}
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-tertiary)]">
            Tayyab Manan &middot; AI/ML Engineer
          </p>

          {/* 2. Headline = the claim, not the job title. font-sans! beats the
              global h1 rule (which would set the Bricolage heading face - and,
              being unlayered, outranks plain utilities): the hero headline is
              deliberately in the body voice, matching the desktop twin, a <p>
              that inherits Hanken from <body>. leading needs the ! for the
              same unlayered-rule reason now that it wraps to several lines.
              The marker swipe rides the final word - the page's one lime
              moment lands in the headline on every breakpoint. */}
          <h1 className="mt-4 font-sans! text-4xl font-semibold leading-[1.1]! tracking-tight text-[var(--text)] sm:text-6xl md:text-7xl">
            I build ML systems that make it to{' '}
            <span className="marker-highlight">production</span>
          </h1>

          {/* 3. Meta - the desktop meta row's two halves, stacked. Same
              size and case as desktop; the ink step (secondary vs tertiary)
              carries the hierarchy. */}
          <div className="mt-6 flex flex-col gap-1 text-sm">
            <p className="text-[var(--text-secondary)]">
              AI Developer at{' '}
              <a href="https://cointegration.ai/" target="_blank" rel="noopener noreferrer" className={affiliationLinkClass}>
                Cointegration
                <ExternalArrow />
              </a>
              {' '}since 2025 &middot; Graduate student at{' '}
              <a href="https://www.comsats.edu.pk/" target="_blank" rel="noopener noreferrer" className={affiliationLinkClass}>
                COMSATS
                <ExternalArrow />
              </a>
            </p>
            <p className="text-[var(--text-tertiary)]">
              Islamabad &middot; UTC+5 &middot; Available for remote contract work
            </p>
          </div>

          {/* 4. Drawn rule */}
          <div className="mt-6 h-px w-16 origin-left bg-[var(--border-hover)]" aria-hidden="true" />

          {/* 5. Lede - the proof line, verbatim from desktop */}
          <p className="mt-7 max-w-xl text-base leading-relaxed text-[var(--text-secondary)] sm:text-lg">
            Computer vision, NLP, geospatial AI, and multi-agent workflows.
            Seven deployed projects, every one with a live demo.
          </p>

          {/* 6. Focus areas - the desktop index pills' stand-in, static, in the
              mono annotation voice (the word carousel was cut in the premium
              pass: motion on a first-impression surface). */}
          <p className="mt-5 font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--text-secondary)]">
            {focusAreas.map((a) => a.label).join(' · ')}
          </p>

          {/* 7. Actions: primary CTAs + secondary profile links. Same arrows
              as desktop: View Projects scrolls DOWN the page, so its glyph
              points down. */}
          <div className="mt-10 flex flex-col gap-x-6 gap-y-6 sm:flex-row sm:items-center">
            <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-4">
              <a
                href="#projects"
                onClick={scrollToProjects}
                className="group flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-[var(--on-primary)] transition-[background-color,transform] duration-200 hover:bg-[var(--primary-hover)] active:scale-[0.98] sm:w-auto sm:justify-start sm:px-8 sm:py-4"
              >
                View projects
                <span aria-hidden="true" className="inline-block transition-transform duration-200 group-hover:translate-y-0.5">
                  &darr;
                </span>
              </a>
              <a
                href="/contact"
                className="group flex w-full items-center justify-center gap-2 rounded-lg border border-[var(--border)] px-6 py-3 text-sm font-semibold text-[var(--text)] transition-[color,border-color,transform] duration-200 hover:border-[var(--primary)] hover:text-[var(--primary)] active:scale-[0.98] sm:w-auto sm:justify-start sm:px-8 sm:py-4"
              >
                Get in touch
                <span aria-hidden="true" className="inline-block transition-transform duration-200 group-hover:translate-x-0.5">
                  &rarr;
                </span>
              </a>
            </div>

            <div className="hidden h-8 w-px bg-[var(--border)] sm:block" aria-hidden="true" />

            <div className="flex items-center justify-center gap-6 sm:justify-start sm:gap-5">
              <a
                href="https://github.com/TayyabManan"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub profile"
                title="GitHub"
                className="text-[var(--text-secondary)] transition-colors hover:text-[var(--primary)]"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/tayyabmanan"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn profile"
                title="LinkedIn"
                className="text-[var(--text-secondary)] transition-colors hover:text-[var(--primary)]"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <Link
                href="/resume"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--primary)]"
              >
                <FileText className="h-4 w-4" />
                Resume
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ===================== DESKTOP HERO (lg and up) ===================== */}
      {/* Editorial oversize layout; the numbered index is the target for a future GSAP animation. */}
      <div className="hidden min-h-[calc(100dvh-64px)] items-center px-4 sm:px-6 lg:flex lg:px-8">
        {/* CSS-driven staggered entrance (see .hero-reveal* in globals.css): plays on
            first paint instead of after hydration, so the hero doesn't sit static for a
            beat then replay. No data-essential-motion: the entrance is decorative, so
            the global reduced-motion rule zeroes it to an instant appearance (the
            animations still complete - fill 'both' lands every element visible). */}
        <div
          className="mx-auto w-full max-w-7xl py-16 lg:py-20"
        >
          {/* 1. Eyebrow row - greeting + job title (title demoted here in the
              home restructure; the headline below carries the claim) */}
          <div className="hero-reveal" style={{ animationDelay: '100ms' }}>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-tertiary)]">
              Tayyab Manan &middot; AI/ML Engineer
            </p>
          </div>

          {/* 2. Headline - the claim, fluid oversize across two balanced lines
              (manual break; the clamp is sized so neither line wraps inside
              the max-w-7xl container). A <p>, not an <h1>: the mobile hero
              variant already owns the page's single <h1>, and Google indexes
              mobile-first, so this desktop-only twin stays a styled paragraph
              to avoid a duplicate H1. Transform-only reveal (no opacity fade)
              so this LCP element paints at once. The marker swipe rides the
              final word - the lime moment at its maximum size. */}
          <p
            className="mt-4 text-[clamp(2.5rem,7.3vw,6.25rem)] font-semibold leading-[1.05]! tracking-[-0.02em]! text-[var(--text)] hero-reveal-headline"
            style={{ animationDelay: '200ms' }}
          >
            I build ML systems that
            <br />
            make it to <span className="marker-highlight">production</span>
          </p>

          {/* 3. Meta row - role/affiliation + location. Kicker rhythm: the
              eyebrow sits TIGHT above the headline (mt-4, one lockup) and the
              meta gets MORE air below it (mt-7) - the reverse read as off.
              The clamp cap is now an OWNER TASTE CALL, deliberately below the
              maximum the container allows - do not "fix" it back up. The
              measured maximum is 7.25rem (line one runs ~10em in Hanken at
              -0.02em tracking, which is the largest cap clearing the 1216px
              inner width at ~95% fill); the owner found that too big on
              2026-08-29 and chose 6.25rem / 7.3vw = 100px at 1440, ~77% fill.
              A previous pass raised this clamp for measure-fill reasons and
              overshot what the owner wanted - fill is the ceiling, not the
              target. Leading 1.05 per the display band (1.02 was under it).
              Mobile keeps its own ladder (text-4xl sm:text-6xl md:text-7xl),
              left alone by the same call. */}
          <div
            className="mt-7 flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between hero-reveal"
            style={{ animationDelay: '350ms' }}
          >
            <p className="text-sm text-[var(--text-secondary)]">
              AI Developer at{' '}
              <a href="https://cointegration.ai/" target="_blank" rel="noopener noreferrer" className={affiliationLinkClass}>
                Cointegration
                <ExternalArrow />
              </a>
              {' '}since 2025 &middot; Graduate student at{' '}
              <a href="https://www.comsats.edu.pk/" target="_blank" rel="noopener noreferrer" className={affiliationLinkClass}>
                COMSATS
                <ExternalArrow />
              </a>
            </p>
            {/* Matches the left half's size and case so the row reads as ONE meta
                line; the ink step (tertiary vs secondary) carries the hierarchy
                instead. Was 12px uppercase tracked, which made two halves of the
                same line look unrelated - and uppercasing the LEFT half to match
                was worse: 70 characters of tracked caps wrapped to two lines. */}
            <p className="text-sm text-[var(--text-tertiary)]">
              Islamabad &middot; UTC+5 &middot; Available for remote contract work
            </p>
          </div>

          {/* 4. Hairline rule - interactive bezier: bends with the cursor on hover,
              springs back elastically on leave (see WiggleLine).
              mt-4 = 16px above the rule against 40px below. That asymmetry is
              CORRECT and owner-confirmed (Aug 2026): the rule terminates the
              header block, so it belongs to the meta line above it rather than
              floating midway to the lede. An audit briefly "fixed" this to
              mt-12 and the owner rejected it on sight - don't re-balance it.

              MEASUREMENT TRAP: in headless/automation contexts the .hero-reveal
              entrance animations freeze at their FIRST keyframe, so the meta row
              sits at heroRise's translateY(14px) and the lede does too. Measuring
              then reports 2px above / 54px below and invents a spacing bug that
              does not exist. Before trusting any hero geometry, run
              el.getAnimations().forEach(a => a.finish()) on the .hero-reveal*
              elements, or measure in a real browser. */}
          <div className="mt-4 origin-left hero-reveal-rule" style={{ animationDelay: '600ms' }} aria-hidden="true">
            <WiggleLine />
          </div>

          {/* 5. Two-column grid - lede/actions (left) + focus-area index (right) */}
          <div className="mt-10 grid items-start gap-12 lg:grid-cols-[1fr_auto] lg:gap-16">
            {/* Left column */}
            <div className="hero-reveal" style={{ animationDelay: '500ms' }}>
              {/* The claim moved up to the headline; the lede is now the
                  proof line - domains plus a verifiable fact. */}
              <p className="max-w-xl text-lg text-[var(--text-secondary)] sm:text-xl">
                Computer vision, NLP, geospatial AI, and multi-agent workflows.
                Seven deployed projects, every one with a live demo.
              </p>

              {/* CTA row */}
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#projects"
                  onClick={scrollToProjects}
                  className="group flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-[var(--on-primary)] transition-[background-color,transform] duration-200 hover:bg-[var(--primary-hover)] active:scale-[0.98] sm:px-8 sm:py-4"
                >
                  View projects
                  <span aria-hidden="true" className="inline-block transition-transform duration-200 group-hover:translate-y-0.5">
                    &darr;
                  </span>
                </a>
                <a
                  href="/contact"
                  className="group flex items-center justify-center gap-2 rounded-lg border border-[var(--border)] px-6 py-3 text-sm font-semibold text-[var(--text)] transition-[color,border-color,transform] duration-200 hover:border-[var(--primary)] hover:text-[var(--primary)] active:scale-[0.98]"
                >
                  Get in touch
                  <span aria-hidden="true" className="inline-block transition-transform duration-200 group-hover:translate-x-0.5">
                    &rarr;
                  </span>
                </a>
              </div>

              {/* Socials row - 44px touch targets, offset so the first icon aligns to the column edge */}
              <div className="mt-7 -ml-2.5 flex items-center gap-1">
                <a
                  href="https://github.com/TayyabManan"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub profile"
                  title="GitHub"
                  className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-[var(--text-secondary)] transition-colors hover:text-[var(--primary)]"
                >
                  <Github className="h-5 w-5" />
                </a>
                <a
                  href="https://www.linkedin.com/in/tayyabmanan"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn profile"
                  title="LinkedIn"
                  className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-[var(--text-secondary)] transition-colors hover:text-[var(--primary)]"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
                <span className="mx-1.5 h-4 w-px bg-[var(--border)]" aria-hidden="true" />
                <Link
                  href="/resume"
                  className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg px-1.5 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--primary)]"
                >
                  <FileText className="h-4 w-4" />
                  Resume
                </Link>
              </div>
            </div>

            {/* Right column - numbered index of focus areas, with a live readout
                to its LEFT that morphs into the hovered area's micro-chart. The
                chart sits beside the pills (not below) so the pill you point at
                and its reaction are in the same glance. */}
            <div className="flex flex-col items-end hero-reveal" style={{ animationDelay: '650ms' }}>
              <div className="flex items-center gap-8">
                {/* Live readout - empty until a pill is pointed at, then draws
                    that area's chart and morphs between charts as you move */}
                <HeroReadout variant={readoutArea === null ? null : focusAreas[readoutArea].readout} />
              <ul
                ref={indexRef}
                onPointerEnter={warmHeroReadout}
                onPointerLeave={() => setReadoutArea(null)}
                onBlur={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setReadoutArea(null)
                }}
                className="flex w-fit flex-col gap-3"
              >
                {focusAreas.map((area, index) => (
                  <li key={area.label}>
                    <Link
                      href={area.href}
                      data-index-row
                      onPointerEnter={() => setReadoutArea(index)}
                      onFocus={() => setReadoutArea(index)}
                      className="group relative isolate ml-auto flex w-[calc(100%-2rem)] items-center overflow-hidden rounded-full px-5 py-3 shadow-[inset_0_0_0_1px_var(--border)] transition-shadow duration-200 hover:shadow-[inset_0_0_0_1px_var(--primary)] focus-visible:rounded-full"
                    >
                      {/* Sizer - invisible, in-flow; fixes each pill's intrinsic size. The parent ul's
                          w-fit sizes to the widest pill and every pill stretches to it, so they're all
                          the same width; the absolute layers can't change it (prevents hover "expand").
                          Base shows the label and the fill shows the metric, so the sizer stacks BOTH
                          copies in one grid cell - the pill sizes to whichever is wider. */}
                      <span aria-hidden="true" className="invisible inline-grid">
                        {[area.label, area.metric].map((text) => (
                          <span key={text} className="col-start-1 row-start-1 inline-flex items-center gap-4 whitespace-nowrap">
                            <span
                              className="text-base font-semibold"
                              style={PILL_FONT}
                            >
                              {text}
                            </span>
                            <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                          </span>
                        ))}
                      </span>

                      {/* Base (unfilled) content - visible/accessible copy; slides up as the fill rises */}
                      <span
                        data-index-base
                        className="absolute inset-0 flex items-center justify-between gap-4 whitespace-nowrap px-5 will-change-transform"
                      >
                        <span
                          className="text-base font-semibold text-[var(--text)]"
                          style={PILL_FONT}
                        >
                          {area.label}
                        </span>
                        <ArrowUpRight data-index-arrow className="h-4 w-4 shrink-0 text-[var(--primary)] opacity-0" aria-hidden="true" />
                      </span>

                      {/* Fill layer - a primary fill (with a slightly arced, flat-bottomed cap) slides
                          up from below on hover, carrying white copies of the content. The inline
                          transform parks it below from the first paint (matching GSAP's yPercent:100 +
                          y:18) so the pill doesn't flash filled before the lazy-loaded GSAP runs. */}
                      <span
                        data-index-fill
                        aria-hidden="true"
                        className="absolute inset-0 flex items-center justify-between gap-4 whitespace-nowrap bg-[var(--primary)] px-5 text-[var(--on-primary)] will-change-transform"
                        style={{ transform: 'translateY(calc(100% + 18px))' }}
                      >
                        {/* Flat-bottomed dome so it joins the fill with no side gaps; 1px overlap. */}
                        <span
                          className="pointer-events-none absolute inset-x-0 bottom-[calc(100%-1px)] h-3 bg-[var(--primary)]"
                          style={{ borderRadius: '50% 50% 0 0 / 100% 100% 0 0' }}
                        />
                        <span
                          className="text-base font-semibold"
                          style={PILL_FONT}
                        >
                          {area.metric}
                        </span>
                        <ArrowUpRight data-index-arrow className="h-4 w-4 shrink-0 opacity-0" aria-hidden="true" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
