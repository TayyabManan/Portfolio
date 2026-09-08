'use client'

import { useEffect, useRef, useState } from 'react'
import { loadMorphSVG } from '@/lib/gsap'
import { motionOK } from '@/lib/motion-tokens'

/**
 * Live readout beside the hero's focus-area pill index. Hidden at rest;
 * pointing at a pill draws in a proper notebook chart for that area, and
 * moving between pills MORPHS the data line from one chart into the next
 * (GSAP MorphSVG). Under reduced motion (motionOK() false) the readout stays
 * fully functional: the panel snaps visible with the chart already complete,
 * and variant changes hard-swap the shape - information without choreography.
 *
 * Anatomy: constant hand-drawn axes (same pen as the 404 scatter) + ONE
 * morphable multi-subpath data line + a dots layer that pops in only for the
 * regression scatter. All charts share the 160x100 space so shapes carry over.
 *
 * Failure direction: reveal/hide are WAAPI and the first draw sets `d`
 * directly, so if the gsap chunk never arrives the readout still works -
 * variant changes just hard-swap instead of morphing.
 *
 * React renders the path's `d` exactly once; every subsequent change is
 * imperative (setAttribute or MorphSVG), so re-renders never fight the tween.
 */

export type HeroReadoutVariant = 'accuracy' | 'bars-up' | 'scatter-fit' | 'crossing'

const CHARTS: Record<HeroReadoutVariant, { d: string; caption: string; dots: boolean }> = {
  // Validation accuracy climbing to a plateau (Computer Vision)
  accuracy: {
    d: 'M26 76 C38 74 46 42 68 33 C92 25 120 22 146 21',
    caption: 'acc vs epochs',
    dots: false,
  },
  // Win-rate comparison bars climbing base -> tuned (Production ML)
  'bars-up': {
    d: 'M42 82 C42.3 76 41.8 70 42 63 M70 82 C70.3 72 69.7 60 70 49 M98 82 C98.4 68 97.6 50 98 35 M126 82 C126.4 62 125.6 40 126 19',
    caption: 'win rate vs base',
    dots: false,
  },
  // Regression fit with observations straddling it (Geospatial AI, R²)
  'scatter-fit': {
    d: 'M28 74 C68 59 108 38 148 19',
    caption: 'predicted vs observed',
    dots: true,
  },
  // SNN vs ANN accuracy under event noise (Neuromorphic ML): two subpaths,
  // the ANN falling steadily and the SNN holding then dipping late, crossing
  // near the mildest severity - the shape on the study's card cover.
  crossing: {
    d: 'M28 20 C56 24 84 42 108 52 C124 59 136 64 146 68 M28 27 C60 27.5 96 28.5 116 33 C130 36.5 140 42 146 48',
    caption: 'accuracy vs noise',
    dots: false,
  },
}

const SCATTER_DOTS: [number, number][] = [
  [40, 68],
  [58, 50],
  [76, 58],
  [96, 36],
  [118, 40],
  [136, 22],
]

const INITIAL: HeroReadoutVariant = 'accuracy'

/** Warm the MorphSVG chunk on hover intent so the first morph doesn't
 * stutter. Reduced motion never morphs, so it never needs the chunk. */
export function warmHeroReadout() {
  if (!motionOK()) return
  loadMorphSVG().catch(() => {})
}

/** Animate an element's opacity from wherever it is to `to`. WAAPI; under
 * reduced motion or without WAAPI, snap (fail-visible - the readout still
 * appears, it just doesn't fade). */
function fadeTo(el: HTMLElement | SVGElement | null, to: number, duration: number, easing: string) {
  if (!el) return
  if (!motionOK() || typeof el.animate !== 'function') {
    if (typeof el.getAnimations === 'function') el.getAnimations().forEach((a) => a.cancel())
    el.style.opacity = String(to)
    return
  }
  el.getAnimations().forEach((a) => a.cancel())
  el.animate([{ opacity: to }], { duration, easing, fill: 'forwards' })
}

interface HeroReadoutProps {
  variant: HeroReadoutVariant | null
}

export default function HeroReadout({ variant }: HeroReadoutProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const dotsRef = useRef<SVGGElement>(null)
  const prevRef = useRef<HeroReadoutVariant | null>(null)
  // Last non-null variant, so the caption/chart keep their content while the
  // container fades out instead of vanishing mid-fade.
  const [display, setDisplay] = useState<HeroReadoutVariant>(INITIAL)

  useEffect(() => {
    const root = rootRef.current
    const path = pathRef.current
    const dots = dotsRef.current
    if (!root || !path) return
    const prev = prevRef.current
    prevRef.current = variant

    // -> hidden: fade the whole readout away, keep its last contents.
    if (variant === null) {
      if (prev !== null) fadeTo(root, 0, 180, 'ease-in')
      return
    }

    const chart = CHARTS[variant]
    setDisplay(variant)

    const showDots = (on: boolean) => {
      if (!dots) return
      fadeTo(dots, on ? 1 : 0, on ? 300 : 150, on ? 'ease-out' : 'ease-in')
      if (on && motionOK() && typeof dots.animate === 'function') {
        dots.querySelectorAll('circle').forEach((c, i) => {
          c.getAnimations().forEach((a) => a.cancel())
          c.animate([{ opacity: 0 }, { opacity: 1 }], {
            duration: 260,
            delay: 140 + i * 45,
            easing: 'ease-out',
            fill: 'backwards',
          })
        })
      }
    }

    // hidden -> shown: place the shape instantly (it's invisible), then fade
    // the panel in while the pen draws the data line left to right.
    if (prev === null) {
      path.setAttribute('d', chart.d)
      fadeTo(root, 1, 240, 'ease-out')
      // Reduced motion: no pen-draw - dashoffset rests at 0, so the line is
      // simply complete the moment the panel appears.
      if (motionOK() && typeof path.animate === 'function') {
        path.getAnimations().forEach((a) => a.cancel())
        path.animate([{ strokeDashoffset: 100 }, { strokeDashoffset: 0 }], {
          duration: 520,
          easing: 'ease-out',
          fill: 'backwards',
        })
      }
      showDots(chart.dots)
      return
    }

    // shown -> different chart: morph the data line; details crossfade.
    // Reduced motion: hard-swap the shape (correct end state, no morph) and
    // skip the MorphSVG chunk entirely.
    if (prev !== variant) {
      if (!motionOK()) {
        path.setAttribute('d', chart.d)
        showDots(chart.dots)
        return
      }
      loadMorphSVG()
        .then(({ gsap }) => {
          // A newer hover (or a hide) may have superseded this one while the
          // chunk loaded - only morph toward the still-current target.
          if (prevRef.current !== variant || !pathRef.current) return
          gsap.killTweensOf(pathRef.current)
          gsap.to(pathRef.current, {
            morphSVG: { shape: chart.d, shapeIndex: 'auto' },
            duration: 0.55,
            ease: 'power2.inOut',
          })
        })
        .catch(() => {
          // No morph plugin: hard swap, still correct.
          pathRef.current?.setAttribute('d', chart.d)
        })
      showDots(chart.dots)
    }
  }, [variant])

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="pointer-events-none hidden w-40 shrink-0 flex-col gap-2 xl:flex"
      style={{ opacity: 0 }}
    >
      <svg viewBox="0 0 160 100" fill="none" className="w-full select-none" focusable="false">
        {/* Constant notebook axes - one pen, overshot corner, loose ticks */}
        <g stroke="var(--text-tertiary)" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" opacity="0.7">
          <path d="M22 8 C21.6 32 21.9 58 21.5 88" />
          <path d="M18 84.5 C60 83.9 110 84.6 152 83.7" />
          <path d="M19 30 L25.5 29.6" strokeWidth="1" />
          <path d="M18.8 56.5 L25.2 56.8" strokeWidth="1" />
          <path d="M60 82.2 L59.6 87.4" strokeWidth="1" />
          <path d="M100 81.8 L100.4 87" strokeWidth="1" />
          <path d="M140 82.4 L139.7 87.6" strokeWidth="1" />
        </g>
        {/* The morphing data line. d is rendered once; MorphSVG owns it after.
            --accent-ink, not --accent: raw marker lime is near-invisible on the
            light stone background (owner-confirmed), so the chart uses the
            "lime as ink" token - olive in light, bright lime in dark. */}
        <path
          ref={pathRef}
          d={CHARTS[INITIAL].d}
          pathLength={100}
          strokeDasharray="100"
          stroke="var(--accent-ink)"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Observations - only the regression scatter shows these */}
        <g ref={dotsRef} fill="var(--accent-ink)" opacity="0">
          {SCATTER_DOTS.map(([cx, cy]) => (
            <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="2.5" />
          ))}
        </g>
      </svg>
      <p className="font-mono text-[11px] leading-tight tracking-[0.08em] text-[var(--text-secondary)]">
        {CHARTS[display].caption}
      </p>
    </div>
  )
}
