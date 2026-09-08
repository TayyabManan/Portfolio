'use client'

import { useId, useState } from 'react'
import type { SpikesModelResult } from './types'

/**
 * How each model's certainty built up over the 16 frames: the rate readout
 * stopped after t steps, normalized (max / sum). Two series, one axis. The
 * SNN line is the page's lime slot; the ANN is ink, dashed, so identity is
 * carried by hue, dash, and the legend together, never color alone. Below
 * the plot, two 16-cell rasters mark whether the running prediction was
 * right at each step: a spike-raster look for a spiking network.
 *
 * Hover or keyboard focus moves a crosshair that snaps to the nearest
 * frame and reads both values into a mono line under the plot, never over
 * it; an sr-only table carries every value.
 */

const W = 480
const H = 226
// right padding holds the two end labels ("0.86") beside the last point
const PAD = { left: 44, right: 40, top: 16, bottom: 4 }
const PLOT_BOTTOM = 158
const RASTER_Y = { snn: 178, ann: 198 }
const RASTER_H = 10

const SERIES = {
  snn: { name: 'SNN', stroke: 'var(--accent-ink)', dash: undefined },
  ann: { name: 'ANN', stroke: 'var(--text)', dash: '5 4' },
} as const

interface ConfidenceTraceProps {
  snn?: SpikesModelResult
  ann?: SpikesModelResult
  label: number
  T: number
  dim: boolean
}

export default function ConfidenceTrace({ snn, ann, label, T, dim }: ConfidenceTraceProps) {
  const [hover, setHover] = useState<number | null>(null)
  const tableId = useId()

  const plotW = W - PAD.left - PAD.right
  const x = (t: number) => PAD.left + (plotW * (t + 0.5)) / T
  const y = (v: number) => PLOT_BOTTOM - (PLOT_BOTTOM - PAD.top) * Math.max(0, Math.min(1, v))
  const cellW = plotW / T

  const path = (m?: SpikesModelResult) =>
    m ? m.step_conf.map((v, t) => `${t === 0 ? 'M' : 'L'}${x(t).toFixed(1)} ${y(v).toFixed(1)}`).join(' ') : ''

  // A pointer event on an svg with no layout width (mid-resize, hidden)
  // would divide by zero and index the steps with NaN; keep the focus as is.
  const nearest = (clientX: number, el: SVGSVGElement): number | null => {
    const rect = el.getBoundingClientRect()
    if (!rect.width) return null
    const px = ((clientX - rect.left) / rect.width) * W
    const t = Math.round((px - PAD.left) / cellW - 0.5)
    if (!Number.isFinite(t)) return null
    return Math.max(0, Math.min(T - 1, t))
  }

  const has = Boolean(snn && ann)
  const hoverT = has && hover !== null ? hover : null

  // End labels sit to the right of the last point, inside the right pad.
  // When the two lines converge the labels are pushed apart vertically
  // (higher value up, lower value down) so they never overprint, and both
  // stay inside the plot band so they cannot land on the axis ticks.
  const endLabels = (s: SpikesModelResult, a: SpikesModelResult) => {
    const vs = s.step_conf[T - 1]
    const va = a.step_conf[T - 1]
    let ys = y(vs)
    let ya = y(va)
    if (Math.abs(ys - ya) < 13) {
      const mid = (ys + ya) / 2
      const up = vs >= va
      ys = mid + (up ? -6.5 : 6.5)
      ya = mid + (up ? 6.5 : -6.5)
    }
    // Keep the pair inside the plot band by moving both together, so two
    // labels at the very top (both 1.00) or bottom stay separated instead
    // of being clamped back onto each other.
    const top = PAD.top + 4
    const bottom = PLOT_BOTTOM - 4
    const lo = Math.min(ys, ya)
    const hi = Math.max(ys, ya)
    if (lo < top) {
      ys += top - lo
      ya += top - lo
    } else if (hi > bottom) {
      ys -= hi - bottom
      ya -= hi - bottom
    }
    return (
      <>
        <text x={x(T - 1) + 9} y={ys + 3.5} className="font-mono text-[11px] tabular-nums" fill="var(--text)">
          {vs.toFixed(2)}
        </text>
        <text x={x(T - 1) + 9} y={ya + 3.5} className="font-mono text-[11px] tabular-nums" fill="var(--text)">
          {va.toFixed(2)}
        </text>
      </>
    )
  }

  return (
    <figure className={`relative min-w-0 transition-opacity duration-200 ${dim ? 'opacity-60' : ''}`}>
      <div className="flex items-baseline justify-between gap-3">
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--text-secondary)]">
          How sure, frame by frame
        </p>
        <p className="flex items-center gap-4 font-mono text-[11px] tracking-[0.04em] text-[var(--text-secondary)]" aria-hidden="true">
          {(['snn', 'ann'] as const).map((k) => (
            <span key={k} className="inline-flex items-center gap-1.5">
              <svg width="18" height="6" viewBox="0 0 18 6" className="shrink-0">
                <path d="M1 3 H17" stroke={SERIES[k].stroke} strokeWidth="2" strokeLinecap="round" strokeDasharray={SERIES[k].dash} />
              </svg>
              {SERIES[k].name}
            </span>
          ))}
        </p>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="mt-2 block w-full touch-none select-none outline-none focus-visible:rounded-lg focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
        role="img"
        aria-labelledby={tableId}
        tabIndex={has ? 0 : -1}
        onPointerMove={(e) => {
          if (!has) return
          const t = nearest(e.clientX, e.currentTarget)
          if (t !== null) setHover(t)
        }}
        onPointerLeave={() => setHover(null)}
        onBlur={() => setHover(null)}
        onKeyDown={(e) => {
          if (!has) return
          if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            e.preventDefault()
            setHover((h) => {
              const cur = h ?? T - 1
              return Math.max(0, Math.min(T - 1, cur + (e.key === 'ArrowLeft' ? -1 : 1)))
            })
          } else if (e.key === 'Escape') {
            setHover(null)
          }
        }}
      >
        {/* gridlines: hairline, solid, recessive */}
        {[0, 0.5, 1].map((v) => (
          <g key={v}>
            <line x1={PAD.left} x2={W - PAD.right} y1={y(v)} y2={y(v)} stroke="var(--border)" strokeWidth="1" />
            <text x={PAD.left - 8} y={y(v) + 3.5} textAnchor="end" className="font-mono text-[10px] tabular-nums" fill="var(--text-tertiary)">
              {v === 0 ? '0' : v === 1 ? '1' : '.5'}
            </text>
          </g>
        ))}
        {/* x ticks */}
        {[1, 4, 8, 12, 16].map((n) => (
          <text key={n} x={x(n - 1)} y={PLOT_BOTTOM + 13} textAnchor="middle" className="font-mono text-[10px] tabular-nums" fill="var(--text-tertiary)">
            {n}
          </text>
        ))}
        <text x={PAD.left - 8} y={RASTER_Y.snn + RASTER_H - 1} textAnchor="end" className="font-mono text-[10px]" fill="var(--text-tertiary)">
          SNN
        </text>
        <text x={PAD.left - 8} y={RASTER_Y.ann + RASTER_H - 1} textAnchor="end" className="font-mono text-[10px]" fill="var(--text-tertiary)">
          ANN
        </text>

        {/* rasters: filled cell = the running prediction was right at t */}
        {(['snn', 'ann'] as const).map((k) => {
          const m = k === 'snn' ? snn : ann
          return Array.from({ length: T }, (_, t) => {
            const right = m ? m.step_pred[t] === label : false
            return (
              <rect
                key={`${k}-${t}`}
                x={PAD.left + t * cellW + 1}
                y={RASTER_Y[k]}
                width={Math.max(1, cellW - 2)}
                height={RASTER_H}
                rx="1.5"
                fill={right ? SERIES[k].stroke : 'none'}
                stroke={right ? 'none' : 'var(--border)'}
                strokeWidth="1"
              />
            )
          })
        })}

        {/* crosshair */}
        {hoverT !== null && (
          <line x1={x(hoverT)} x2={x(hoverT)} y1={PAD.top - 4} y2={RASTER_Y.ann + RASTER_H} stroke="var(--border-hover)" strokeWidth="1" />
        )}

        {/* series */}
        {has && (
          <>
            <path d={path(ann)} fill="none" stroke={SERIES.ann.stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={SERIES.ann.dash} />
            <path d={path(snn)} fill="none" stroke={SERIES.snn.stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            {(['snn', 'ann'] as const).map((k) => {
              const m = k === 'snn' ? snn! : ann!
              const t = hoverT ?? T - 1
              return (
                <g key={k}>
                  <circle cx={x(t)} cy={y(m.step_conf[t])} r="6" fill="var(--background)" />
                  <circle cx={x(t)} cy={y(m.step_conf[t])} r="4" fill={SERIES[k].stroke} />
                </g>
              )
            })}
            {hoverT === null && endLabels(snn!, ann!)}
          </>
        )}
        {!has && (
          <text x={PAD.left + plotW / 2} y={(PAD.top + PLOT_BOTTOM) / 2} textAnchor="middle" className="font-mono text-[11px] tracking-[0.08em]" fill="var(--text-tertiary)">
            waiting for the first run
          </text>
        )}
      </svg>

      {/* Readout under the plot, never over it: the hovered frame, or the
          last one at rest. Values lead, names follow, line keys not boxes.
          Always rendered so hovering never shifts the layout. */}
      <p
        aria-hidden="true"
        className="mt-1 flex min-h-[1.25rem] flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px] tracking-[0.04em] text-[var(--text-secondary)]"
      >
        {has &&
          (() => {
            const t = hoverT ?? T - 1
            return (
              <>
                <span className="text-[var(--text-tertiary)]">frame {t + 1}</span>
                {(['snn', 'ann'] as const).map((k) => {
                  const m = k === 'snn' ? snn! : ann!
                  const right = m.step_pred[t] === label
                  return (
                    <span key={k} className="inline-flex items-center gap-1.5 whitespace-nowrap">
                      <svg width="14" height="6" viewBox="0 0 14 6" aria-hidden="true">
                        <path d="M1 3 H13" stroke={SERIES[k].stroke} strokeWidth="2" strokeLinecap="round" strokeDasharray={SERIES[k].dash} />
                      </svg>
                      <span className="font-medium tabular-nums text-[var(--text)]">{m.step_conf[t].toFixed(2)}</span>
                      <span>
                        {SERIES[k].name} · {right ? 'right' : 'wrong'}
                      </span>
                    </span>
                  )
                })}
              </>
            )
          })()}
      </p>

      {/* Key for the rasters, directly under them, so the rows explain
          themselves without a trip to the prose. */}
      <figcaption className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] leading-relaxed tracking-[0.08em] text-[var(--text-tertiary)]">
        <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
          <span aria-hidden="true" className="inline-block h-2.5 w-3.5 rounded-[2px] bg-[var(--text-secondary)]" />
          right at that frame
        </span>
        <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
          <span aria-hidden="true" className="inline-block h-2.5 w-3.5 rounded-[2px] border border-[var(--border-hover)]" />
          wrong
        </span>
        <span>· line = how sure of its answer so far · hover or arrow keys to read a frame</span>
      </figcaption>

      <table id={tableId} className="sr-only">
        <caption>Confidence of the running prediction after each frame, SNN and ANN</caption>
        <thead>
          <tr>
            <th scope="col">frame</th>
            <th scope="col">SNN confidence</th>
            <th scope="col">SNN correct</th>
            <th scope="col">ANN confidence</th>
            <th scope="col">ANN correct</th>
          </tr>
        </thead>
        <tbody>
          {has &&
            Array.from({ length: T }, (_, t) => (
              <tr key={t}>
                <th scope="row">{t + 1}</th>
                <td>{snn!.step_conf[t].toFixed(2)}</td>
                <td>{snn!.step_pred[t] === label ? 'yes' : 'no'}</td>
                <td>{ann!.step_conf[t].toFixed(2)}</td>
                <td>{ann!.step_pred[t] === label ? 'yes' : 'no'}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </figure>
  )
}
