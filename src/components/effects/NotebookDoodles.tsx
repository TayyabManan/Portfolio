/**
 * Lab-notebook doodle family - the site's one illustration motif (kill-boring
 * personality layer, see DESIGN_SYSTEM.md "Personality layer"). Unused doodles
 * are removed, not kept in reserve - re-draw from git history if one returns.
 *
 * One pen for everything: 1-1.5px stroke, currentColor, round caps, wobble
 * BAKED into hand-authored path literals - no runtime randomness (identical
 * server/client output, hydration-safe), no filters, no dependencies.
 * Axis strokes overshoot their corners by a few px like a real pen.
 *
 * All exports are server-renderable (no hooks). Decorative by contract:
 * aria-hidden, focusable=false, pointer-events-none baked in; data-doodle
 * powers the global print rule. Callers set size/position/color via
 * className (typically with the .doodle wrapper treatment from globals.css).
 * The only non-currentColor ink is the outlier circle: var(--accent-ink) -
 * part of the site's closed lime budget.
 */

interface DoodleProps {
  className?: string
}

function doodleAttrs(className?: string) {
  return {
    fill: 'none',
    'aria-hidden': true,
    focusable: 'false',
    'data-doodle': true,
    className: `pointer-events-none select-none ${className ?? ''}`,
  } as const
}

const PEN = {
  stroke: 'currentColor',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  // ink stays 1-1.5px no matter how large or small a doodle renders
  vectorEffect: 'non-scaling-stroke',
} as const

/** Scatter with one circled off-band point - the circle is the lime element. */
export function ScatterOutlier({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 150 100" {...doodleAttrs(className)}>
      <path d="M16 10 C15.4 35 15.8 62 15.4 88.5" {...PEN} strokeWidth="1.25" />
      <path d="M12 84.4 C50 83.6 100 84.6 144 83.2" {...PEN} strokeWidth="1.25" />
      <path d="M12.6 32 L19 31.6" {...PEN} strokeWidth="1" />
      <path d="M12.2 58.5 L18.8 58.9" {...PEN} strokeWidth="1" />
      <path d="M52 81.4 L51.6 87" {...PEN} strokeWidth="1" />
      <path d="M98 80.8 L98.4 86.6" {...PEN} strokeWidth="1" />
      {/* loose rising band */}
      {[
        [30, 72],
        [41, 66],
        [50, 69],
        [62, 58],
        [72, 54],
        [83, 57],
        [95, 46],
        [108, 42],
        [120, 38],
      ].map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="2" fill="currentColor" stroke="none" />
      ))}
      {/* the outlier */}
      <circle cx="126" cy="16" r="2.2" fill="currentColor" stroke="none" />
      {/* hand ellipse around it - open path, start/end strokes cross */}
      <path
        d="M138 13.5 C138.5 6.5 130 3 122.5 5.5 C114.5 8.2 111.5 16.5 115.5 22.5 C119.8 28.5 132 28.6 137 22.2 C140 18.2 139 11.5 134.5 8.6"
        stroke="var(--accent-ink)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

/**
 * Chart-variant vocabulary shared by frontmatter `metricChart` and the cover
 * charts below. Each project picks the shape that fits its metric, so no two
 * covers show the same drawing. Unknown/absent variant falls back to the
 * plain loss line.
 */
export type MetricChart =
  | 'line'
  | 'scatter-fit'
  | 'bars-up'
  | 'bars-down'
  | 'hbars'
  | 'accuracy'
  | 'coverage'
  | 'roc'
  | 'crossing'

// Stroke paths carry data-draw + pathLength=100 so the .metric-chart hover
// rule in globals.css can re-sketch them left-to-right; fills (dots, area)
// carry data-pop to fade in alongside. Fully drawn at rest.
const DRAW = { 'data-draw': true, pathLength: 100 } as const

/**
 * Cover charts (240x120) - the project-card cover art, drawn at plot scale
 * with the HeroReadout anatomy:
 * constant hand axes (quiet ink) + one data element in --accent-ink (this IS
 * the card's slot in the closed lime budget - it replaced the chip sparkline).
 * Same variant vocabulary as MetricChart, driven by frontmatter `metricChart`.
 * Stroke paths carry data-draw/pathLength so the card's pointer-enter
 * re-sketch (WAAPI, see ProjectCard) replays them; fills carry data-pop.
 */
export const COVER_CAPTIONS: Record<MetricChart, string> = {
  'scatter-fit': 'predicted vs observed',
  'bars-up': 'win rate vs base',
  'bars-down': 'bundle size',
  hbars: 'feature importance',
  accuracy: 'acc vs epochs',
  coverage: 'spatial coverage',
  roc: 'roc curve',
  line: 'loss vs steps',
  crossing: 'accuracy vs noise',
}

function coverChartBody(variant: MetricChart) {
  switch (variant) {
    case 'scatter-fit': // regression fit with observations straddling it
      return (
        <>
          <path d="M40 84 C100 62 160 36 222 15" {...PEN} {...DRAW} strokeWidth="1.75" />
          <g fill="currentColor" stroke="none" data-pop>
            <circle cx="56" cy="78" r="3" />
            <circle cx="84" cy="56" r="3" />
            <circle cx="112" cy="64" r="3" />
            <circle cx="144" cy="40" r="3" />
            <circle cx="176" cy="45" r="3" />
            <circle cx="206" cy="22" r="3" />
          </g>
        </>
      )
    case 'bars-up': // REAL DATA: Urdu LLM win rate vs base across versions -
      // v1 51.5% / v2 66% / v3 79.5% (published in the fine-tuning post's
      // evaluation section). Heights are value/100 x 80px from the y=92
      // baseline; wobble stays baked in the literals (hydration rule).
      return (
        <g {...PEN} strokeWidth="3">
          <path d="M70 92 C70.4 79 69.6 62 70 51" {...DRAW} />
          <path d="M126 92 C126.4 74 125.6 52 126 39" {...DRAW} />
          <path d="M182 92 C182.4 70 181.5 42 182 28.5" {...DRAW} />
        </g>
      )
    case 'bars-down': // REAL DATA: TeacherRank initial bundle, before/after
      // route-based code splitting - 450KB -> 180KB (published in the
      // TeacherRank post). Second bar is 180/450 of the first's height.
      return (
        <g {...PEN} strokeWidth="3">
          <path d="M88 92 C88.3 66 87.7 34 88 16" {...DRAW} />
          <path d="M164 92 C164.3 82 163.7 68 164 61.5" {...DRAW} />
        </g>
      )
    case 'hbars': // horizontal importance bars
      return (
        <g {...PEN} strokeWidth="3">
          <path d="M38 32 C84 31.4 130 32.5 176 31.8" {...DRAW} />
          <path d="M38 58 C68 57.5 98 58.4 128 57.9" {...DRAW} />
          <path d="M38 84 C96 83.3 154 84.4 208 83.6" {...DRAW} />
        </g>
      )
    case 'accuracy': // validation accuracy rising to a plateau
      return (
        <path
          d="M38 88 C56 85 68 40 100 30 C136 20 180 17 220 15.5"
          {...PEN}
          {...DRAW}
          strokeWidth="1.75"
        />
      )
    case 'coverage': // covered area filling under the line
      return (
        <>
          <path
            d="M38 78 C50 73 62 65 74 62 C92 57.5 104 60 122 52 C146 41.5 170 38 222 33 L222 96 L38 96 Z"
            fill="currentColor"
            fillOpacity="0.14"
            stroke="none"
            data-pop
          />
          <path
            d="M38 78 C50 73 62 65 74 62 C92 57.5 104 60 122 52 C146 41.5 170 38 222 33"
            {...PEN}
            {...DRAW}
            strokeWidth="1.75"
          />
        </>
      )
    case 'roc': // ROC bowing to the top-left
      return (
        <path
          d="M38 92 C46 40 62 26 100 21 C150 16.5 190 16 222 14.5"
          {...PEN}
          {...DRAW}
          strokeWidth="1.75"
        />
      )
    case 'crossing': // REAL SHAPE: SNN vs ANN accuracy under event noise
      // (the spikes study). The ANN starts higher and falls steadily; the
      // SNN holds and dips late; they cross near the mildest severity. The
      // ANN is the quiet reference line in tertiary ink (solid: the
      // re-sketch rule owns stroke-dasharray), the SNN carries the data ink.
      return (
        <>
          <path
            d="M40 17 C68 22 100 40 132 52 C162 62 194 70 222 76"
            stroke="var(--text-tertiary)"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            fill="none"
            {...DRAW}
          />
          <path
            d="M40 24 C80 24.5 130 25.5 172 31 C194 34.5 210 42 222 50"
            {...PEN}
            {...DRAW}
            strokeWidth="1.75"
          />
        </>
      )
    case 'line':
    default: // descending loss with noise
      return (
        <path
          d="M38 20 C52 42 64 58 84 68 C100 75.5 116 70 134 76 C158 84 190 80 222 78"
          {...PEN}
          {...DRAW}
          strokeWidth="1.75"
        />
      )
  }
}

export function CoverChart({ variant = 'line', className }: DoodleProps & { variant?: MetricChart }) {
  return (
    <svg
      viewBox="0 0 240 120"
      preserveAspectRatio="xMidYMid meet"
      {...doodleAttrs(`metric-chart ${className ?? ''}`)}
    >
      {/* Constant notebook axes - one pen, overshot corner, loose ticks
          (HeroReadout anatomy at cover scale) */}
      <g stroke="var(--text-tertiary)" strokeWidth="1.25" opacity="0.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M28 10 C27.5 40 27.8 72 27.4 100" vectorEffect="non-scaling-stroke" />
        <path d="M23 96.5 C80 95.8 160 96.6 228 95.7" vectorEffect="non-scaling-stroke" />
        <path d="M24.6 36 L31.2 35.6" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        <path d="M24.2 66.5 L30.8 66.9" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        <path d="M85 94 L84.6 100" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        <path d="M150 94.4 L150.5 100.2" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        <path d="M205 93.8 L205.3 99.6" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      </g>
      {coverChartBody(variant)}
    </svg>
  )
}

/** Axes with an empty plot area - the n=0 empty state. */
export function EmptyAxes({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 120 80" {...doodleAttrs(className)}>
      <path d="M16 8 C15.5 28 15.8 50 15.4 70.5" {...PEN} strokeWidth="1.25" />
      <path d="M12 66.5 C42 65.8 80 66.7 114 65.4" {...PEN} strokeWidth="1.25" />
      <path d="M12.6 25 L19 24.6" {...PEN} strokeWidth="1" />
      <path d="M12.2 45.5 L18.8 45.8" {...PEN} strokeWidth="1" />
      <path d="M40 63.5 L39.6 69" {...PEN} strokeWidth="1" />
      <path d="M65 63.9 L65.4 69.3" {...PEN} strokeWidth="1" />
      <path d="M90 63.2 L89.7 68.8" {...PEN} strokeWidth="1" />
    </svg>
  )
}

/** Loss curve that diverges at the end, the kink circled in lime - the 500 page. */
export function DivergedCurve({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 140 90" {...doodleAttrs(className)}>
      <path d="M18.5 8 C18 30 18.2 55 17.6 82.5" {...PEN} strokeWidth="1.25" />
      <path d="M14 78.6 C45 78 90 78.8 134 77.6" {...PEN} strokeWidth="1.25" />
      <path d="M15 30.5 L21.5 30" {...PEN} strokeWidth="1" />
      <path d="M14.8 55.5 L21.2 55.2" {...PEN} strokeWidth="1" />
      <path d="M55 75.5 L54.6 81.5" {...PEN} strokeWidth="1" />
      <path d="M95 75.2 L95.4 81.6" {...PEN} strokeWidth="1" />
      {/* converging nicely... then diverging hard in the last quarter */}
      <path
        d="M26 20 C30 38 35 48 44 54 C52 59.5 62 56 72 58.5 C84 61.5 92 60.5 100 55 C108 49 113 36 118 18"
        {...PEN}
        strokeWidth="1.25"
      />
      {/* hand ellipse around the kink */}
      <path
        d="M128 22 C129 12.5 121 8 112.5 11 C104 14.2 101.5 24 106.5 30.5 C111.5 36.8 124 35.8 128 28.5 C130 24.8 129 17.5 125 14.5"
        stroke="var(--accent-ink)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

/**
 * The 404 centerpiece: a large scatter where the lost page is the outlier.
 * Full-pressure ink (no .doodle opacity treatment) - the flood page is the
 * one place the pen presses hard. Ink follows currentColor; the double
 * hand-ellipse follows --on-flood-strong (defined by the 404 container).
 */
export function Scatter404({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 560 360" {...doodleAttrs(className)}>
      <path d="M42 40 C40.5 130 41.5 230 40.2 324" {...PEN} strokeWidth="1.5" />
      <path d="M34 318.5 C160 316.5 380 319 532 316" {...PEN} strokeWidth="1.5" />
      {/* ticks */}
      <path d="M33 100.5 L49 99.5" {...PEN} strokeWidth="1.25" />
      <path d="M32.5 170 L48.5 171" {...PEN} strokeWidth="1.25" />
      <path d="M33.2 240.5 L48 239.8" {...PEN} strokeWidth="1.25" />
      <path d="M140 312 L139 325" {...PEN} strokeWidth="1.25" />
      <path d="M250 313.5 L250.8 326" {...PEN} strokeWidth="1.25" />
      <path d="M360 311.8 L359.4 324.5" {...PEN} strokeWidth="1.25" />
      <path d="M465 313 L465.8 325.6" {...PEN} strokeWidth="1.25" />
      {/* 14 dots, loose rising band */}
      {[
        [78, 282],
        [104, 268],
        [126, 274],
        [152, 252],
        [180, 244],
        [205, 250],
        [232, 228],
        [262, 218],
        [288, 224],
        [318, 200],
        [348, 190],
        [380, 178],
        [412, 168],
        [444, 152],
      ].map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="4" fill="currentColor" stroke="none" />
      ))}
      {/* the outlier - far off-band, upper right */}
      <circle cx="470" cy="82" r="4.5" fill="currentColor" stroke="none" />
      {/* two overlapping hand ellipses, rotated, pen pressed hard */}
      <g stroke="var(--on-flood-strong, currentColor)" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
        {/* vector-effect is per-element, not inherited from <g> */}
        <path d="M500 76 C501 57 480 46 461 52 C441 58.5 435 80 447 93 C459 106 489 105 498 89 C503 79.5 500 64 489 57" fill="none" vectorEffect="non-scaling-stroke" />
        <path d="M497 88 C507 76 501 56 483 49.5 C464 43 444 53 441 71 C438 89 455 103 474 100.5 C486 99 495 91 497 82" fill="none" vectorEffect="non-scaling-stroke" />
      </g>
      {/* annotation arrow toward the circle from lower-left */}
      <path d="M368 128 C394 122 416 110 436 96 C440 93.2 443 91 446.5 88.5" {...PEN} strokeWidth="2" />
      <path d="M437 84 L448.5 87.5" {...PEN} strokeWidth="2" />
      <path d="M439 97.5 L448.8 88.2" {...PEN} strokeWidth="2" />
    </svg>
  )
}
