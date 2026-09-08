'use client'

import { useState } from 'react'
import {
  SPIKES_POPULATION,
  SPIKES_SEVERITIES,
  type SpikesConditionStats,
  type SpikesKind,
} from '@/lib/spikes-demo-data'

/**
 * The published run (n=288, single seed) as small multiples: accuracy vs
 * severity with bootstrap 95% bands, and confidence minus accuracy on its
 * own axis (two measures, two charts, never a dual axis). The severity the
 * visitor picked is the one stop that gets direct labels; hover or arrow
 * keys read any other into the mono readout under each plot. With "Clean" selected the four corruptions show at
 * once as an overview.
 */

const W = 320
const H = 196
const PAD = { left: 40, right: 12, top: 14, bottom: 30 }

const SERIES = {
  snn: { name: 'SNN', stroke: 'var(--accent-ink)', dash: undefined, band: 0.14 },
  ann: { name: 'ANN', stroke: 'var(--text)', dash: '5 4', band: 0.08 },
} as const

const KIND_TITLE: Record<Exclude<SpikesKind, 'clean'>, string> = {
  drop: 'lose events',
  noise: 'add noise',
  occlude: 'block a patch',
  tshuffle: 'shuffle time',
}

type Measure = 'acc' | 'gap'
const MEASURE: Record<Measure, { title: string; min: number; max: number; ticks: number[] }> = {
  acc: { title: 'how often right', min: 0, max: 1, ticks: [0, 0.5, 1] },
  gap: { title: 'surer than it should be', min: -0.1, max: 0.5, ticks: [-0.1, 0, 0.25, 0.5] },
}

function tick(v: number) {
  if (v === 0) return '0'
  if (v === 1) return '1'
  const s = v.toFixed(2).replace(/0+$/, '').replace(/\.$/, '')
  return s.replace(/^(-?)0\./, '$1.')
}

function stopLabel(kind: Exclude<SpikesKind, 'clean'>, level: number) {
  if (level === 0) return 'clean'
  const v = SPIKES_SEVERITIES[kind][level - 1]
  return tick(v)
}

const SYMBOL: Record<Exclude<SpikesKind, 'clean'>, string> = {
  drop: 'p',
  noise: 'λ',
  occlude: 's',
  tshuffle: 'w',
}

/** "at λ = 0.1", or "undamaged": the readout's stop, with its symbol. */
function stopPhrase(kind: Exclude<SpikesKind, 'clean'>, level: number) {
  if (level === 0) return 'undamaged'
  const v = SPIKES_SEVERITIES[kind][level - 1]
  return `at ${SYMBOL[kind]} = ${v}${kind === 'occlude' ? ' px' : ''}`
}

function signed(v: number) {
  return `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(2)}`
}

/** a fraction as signed whole percentage points, e.g. 0.281 -> "+28" */
function points(v: number) {
  const p = Math.round(v * 100)
  return `${p >= 0 ? '+' : '−'}${Math.abs(p)}`
}

interface SmallMultipleProps {
  kind: Exclude<SpikesKind, 'clean'>
  measure: Measure
  /** the visitor's stop; null in the overview, where no stop is selected */
  currentLevel: number | null
}

function SmallMultiple({ kind, measure, currentLevel }: SmallMultipleProps) {
  const [hover, setHover] = useState<number | null>(null)
  const rows = SPIKES_POPULATION[kind]
  const spec = MEASURE[measure]
  const plotW = W - PAD.left - PAD.right
  const plotH = H - PAD.top - PAD.bottom
  const x = (level: number) => PAD.left + (plotW * level) / (rows.length - 1)
  const y = (v: number) => PAD.top + plotH * (1 - (v - spec.min) / (spec.max - spec.min))
  const value = (r: SpikesConditionStats, k: 'snn' | 'ann') => (measure === 'acc' ? r[k].acc : r[k].gap)

  const line = (k: 'snn' | 'ann') => rows.map((r, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)} ${y(value(r, k)).toFixed(1)}`).join(' ')
  const band = (k: 'snn' | 'ann') => {
    const top = rows.map((r, i) => `${x(i).toFixed(1)} ${y(r[k].accHi).toFixed(1)}`)
    const bottom = rows.map((r, i) => `${x(i).toFixed(1)} ${y(r[k].accLo).toFixed(1)}`).reverse()
    return `M${[...top, ...bottom].join(' L')} Z`
  }

  // Overview (no selected stop): no hairline, and the labels sit on the most
  // severe stop, where the four corruptions differ most.
  const focus = hover ?? currentLevel ?? rows.length - 1
  const showHairline = hover !== null || currentLevel !== null
  // A pointer event on an svg with no layout width (mid-resize, hidden)
  // would divide by zero and index rows with NaN; keep whatever the focus is.
  const nearest = (clientX: number, el: SVGSVGElement): number | null => {
    const rect = el.getBoundingClientRect()
    if (!rect.width) return null
    const px = ((clientX - rect.left) / rect.width) * W
    const level = Math.round(((px - PAD.left) / plotW) * (rows.length - 1))
    if (!Number.isFinite(level)) return null
    return Math.max(0, Math.min(rows.length - 1, level))
  }
  const row = rows[focus] ?? rows[0]

  return (
    <figure className="relative min-w-0">
      <p className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--text-secondary)]">
        {KIND_TITLE[kind]} · {spec.title}
      </p>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="mt-2 block w-full touch-none select-none outline-none focus-visible:rounded-lg focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
        role="img"
        aria-label={`${KIND_TITLE[kind]}, ${spec.title} by severity. ${stopPhrase(kind, focus)}: SNN ${value(row, 'snn').toFixed(2)}, ANN ${value(row, 'ann').toFixed(2)}.`}
        tabIndex={0}
        onPointerMove={(e) => {
          const level = nearest(e.clientX, e.currentTarget)
          if (level !== null) setHover(level)
        }}
        onPointerLeave={() => setHover(null)}
        onBlur={() => setHover(null)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            e.preventDefault()
            setHover((h) => Math.max(0, Math.min(rows.length - 1, (h ?? currentLevel ?? rows.length - 1) + (e.key === 'ArrowLeft' ? -1 : 1))))
          } else if (e.key === 'Escape') {
            setHover(null)
          }
        }}
      >
        {spec.ticks.map((v) => (
          <g key={v}>
            <line
              x1={PAD.left}
              x2={W - PAD.right}
              y1={y(v)}
              y2={y(v)}
              stroke={measure === 'gap' && v === 0 ? 'var(--border-hover)' : 'var(--border)'}
              strokeWidth="1"
            />
            <text x={PAD.left - 8} y={y(v) + 3.5} textAnchor="end" className="font-mono text-[10px] tabular-nums" fill="var(--text-tertiary)">
              {tick(v)}
            </text>
          </g>
        ))}
        {measure === 'acc' && (
          <>
            <line x1={PAD.left} x2={W - PAD.right} y1={y(1 / 11)} y2={y(1 / 11)} stroke="var(--border-hover)" strokeWidth="1" strokeDasharray="2 3" />
            <text x={W - PAD.right} y={y(1 / 11) - 4} textAnchor="end" className="font-mono text-[10px]" fill="var(--text-tertiary)">
              chance
            </text>
          </>
        )}
        {rows.map((r, i) => (
          <text key={i} x={x(i)} y={H - PAD.bottom + 16} textAnchor="middle" className="font-mono text-[10px] tabular-nums" fill="var(--text-tertiary)">
            {stopLabel(kind, i)}
          </text>
        ))}

        {/* the selected stop */}
        {showHairline && (
          <line x1={x(focus)} x2={x(focus)} y1={PAD.top - 4} y2={H - PAD.bottom + 4} stroke="var(--border-hover)" strokeWidth="1" />
        )}

        {measure === 'acc' && (
          <>
            <path d={band('ann')} fill={SERIES.ann.stroke} fillOpacity={SERIES.ann.band} stroke="none" />
            <path d={band('snn')} fill={SERIES.snn.stroke} fillOpacity={SERIES.snn.band} stroke="none" />
          </>
        )}
        <path d={line('ann')} fill="none" stroke={SERIES.ann.stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={SERIES.ann.dash} />
        <path d={line('snn')} fill="none" stroke={SERIES.snn.stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

        {(() => {
          // Both labels sit on the same side of the marker (right, or left
          // at the last stop so they stay inside the plot). When the two
          // values are close the labels are pushed apart vertically, the
          // higher value up, so they never overprint each other.
          const cx = x(focus)
          const right = focus < rows.length - 1
          const vs = value(row, 'snn')
          const va = value(row, 'ann')
          let ys = y(vs)
          let ya = y(va)
          if (Math.abs(ys - ya) < 13) {
            const mid = (ys + ya) / 2
            const up = vs >= va
            ys = mid + (up ? -6.5 : 6.5)
            ya = mid + (up ? 6.5 : -6.5)
          }
          // Move the pair together to stay inside the band; clamping each
          // one separately would collapse two labels near an edge.
          const top = PAD.top + 4
          const bottom = H - PAD.bottom - 4
          const lo = Math.min(ys, ya)
          const hi = Math.max(ys, ya)
          if (lo < top) {
            ys += top - lo
            ya += top - lo
          } else if (hi > bottom) {
            ys -= hi - bottom
            ya -= hi - bottom
          }
          const label = (v: number) => (measure === 'gap' ? signed(v) : v.toFixed(2))
          return (
            <>
              {(['snn', 'ann'] as const).map((k) => (
                <g key={k}>
                  <circle cx={cx} cy={y(value(row, k))} r="6" fill="var(--background)" />
                  <circle cx={cx} cy={y(value(row, k))} r="4" fill={SERIES[k].stroke} />
                </g>
              ))}
              <text x={cx + (right ? 9 : -9)} y={ys + 3.5} textAnchor={right ? 'start' : 'end'} className="font-mono text-[11px] tabular-nums" fill="var(--text)">
                {label(vs)}
              </text>
              <text x={cx + (right ? 9 : -9)} y={ya + 3.5} textAnchor={right ? 'start' : 'end'} className="font-mono text-[11px] tabular-nums" fill="var(--text)">
                {label(va)}
              </text>
            </>
          )
        })()}
      </svg>

      {/* Readout under the plot, never over it: the hovered stop, or the
          selected one at rest. Values lead, names follow, line keys not
          boxes; the intervals live here because the plot has no room for
          them. Always rendered, so hovering never shifts the layout. */}
      <p
        aria-hidden="true"
        className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] leading-relaxed tracking-[0.04em] text-[var(--text-secondary)]"
      >
        <span className="text-[var(--text-tertiary)]">{stopPhrase(kind, focus)}</span>
        {(['snn', 'ann'] as const).map((k) => (
          <span key={k} className="inline-flex items-center gap-1.5 whitespace-nowrap">
            <svg width="14" height="6" viewBox="0 0 14 6" aria-hidden="true">
              <path d="M1 3 H13" stroke={SERIES[k].stroke} strokeWidth="2" strokeLinecap="round" strokeDasharray={SERIES[k].dash} />
            </svg>
            <span className="font-medium tabular-nums text-[var(--text)]">
              {measure === 'gap' ? signed(value(row, k)) : value(row, k).toFixed(3)}
            </span>
            <span>
              {SERIES[k].name}
              {measure === 'acc' && ` [${row[k].accLo.toFixed(2)}, ${row[k].accHi.toFixed(2)}]`}
            </span>
          </span>
        ))}
      </p>
    </figure>
  )
}

function Legend() {
  return (
    <p className="flex flex-wrap items-center gap-x-5 gap-y-1 font-mono text-[11px] tracking-[0.04em] text-[var(--text-secondary)]">
      {(['snn', 'ann'] as const).map((k) => (
        <span key={k} className="inline-flex items-center gap-1.5">
          <svg width="18" height="6" viewBox="0 0 18 6" aria-hidden="true">
            <path d="M1 3 H17" stroke={SERIES[k].stroke} strokeWidth="2" strokeLinecap="round" strokeDasharray={SERIES[k].dash} />
          </svg>
          {SERIES[k].name}
        </span>
      ))}
      <span className="inline-flex items-center gap-1.5">
        <span aria-hidden="true" className="inline-block h-2.5 w-4 rounded-sm bg-[var(--text)]/10" />
        bootstrap 95% CI
      </span>
      <span>n = 288 · single seed</span>
    </p>
  )
}

interface PopulationChartsProps {
  kind: SpikesKind
  level: number
  /** the visitor's setting in words, e.g. "moderate background noise · λ = 0.1" */
  settingLabel: string
}

export default function PopulationCharts({ kind, level, settingLabel }: PopulationChartsProps) {
  if (kind === 'clean') {
    return (
      <div>
        <Legend />
        <div className="mt-6 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {(['drop', 'noise', 'occlude', 'tshuffle'] as const).map((k) => (
            <SmallMultiple key={k} kind={k} measure="acc" currentLevel={null} />
          ))}
        </div>
      </div>
    )
  }

  const row = SPIKES_POPULATION[kind][level]
  const sig = row.diffLo > 0 || row.diffHi < 0
  const pts = Math.round(row.diff * 100)
  return (
    <div>
      <Legend />
      {/* Same four-column grid as the overview, two slots used: the SVGs
          scale with their slot, so equal slots keep the mono labels at one
          size whichever view is showing. */}
      <div className="mt-6 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        <SmallMultiple kind={kind} measure="acc" currentLevel={level} />
        <SmallMultiple kind={kind} measure="gap" currentLevel={level} />
      </div>
      <p className="mt-6 max-w-4xl text-sm text-[var(--text-secondary)]">
        At the setting you picked ({settingLabel}), the spiking network is right{' '}
        {pts === 0 ? (
          'about as often as the ordinary one'
        ) : (
          <>
            <span className="font-medium tabular-nums text-[var(--text)]">{Math.abs(pts)} points</span>{' '}
            {pts > 0 ? 'more' : 'less'} often than the ordinary one
          </>
        )}
        , likely range <span className="tabular-nums">[{points(row.diffLo)}, {points(row.diffHi)}]</span>.{' '}
        {sig ? 'That range does not include zero, so the difference is real for this pair.' : 'That range includes zero, so there is no measurable difference at this setting.'}
        {' '}Surer than it should be: spiking <span className="tabular-nums">{signed(row.snn.gap)}</span>, ordinary{' '}
        <span className="tabular-nums">{signed(row.ann.gap)}</span>.
      </p>
    </div>
  )
}
