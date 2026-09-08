'use client'

import { Check, X } from 'lucide-react'
import { SPIKES_CLASS_NAMES } from '@/lib/spikes-demo-data'
import type { SpikesModelResult } from './types'

/**
 * One model's answer: what it said, whether that was right, how sure it
 * was, the raw rate output per class as thin bars, and what the run cost
 * on the accounting model. Static card surface (non-interactive: no hover).
 * Right/wrong is status, so it may use the status colors, and it never
 * relies on them alone: icon plus word, every time.
 */

const META = {
  snn: {
    eyebrow: 'Spiking network · SNN',
    blurb: 'Neurons fire short pulses and stay silent otherwise. Its answer is how often each output fired over the 16 frames.',
    bar: 'bg-[var(--accent-ink)]',
    cost: (m: SpikesModelResult) =>
      `${m.energy_mj.toFixed(2)} mJ on paper · ${((m.silent_fraction ?? 0) * 100).toFixed(1)}% of neuron-timesteps silent`,
  },
  ann: {
    eyebrow: 'Ordinary network · ANN',
    blurb: 'The same network with always-on units. It answers each frame on its own and averages the 16 answers.',
    bar: 'bg-[var(--text-secondary)]',
    cost: (m: SpikesModelResult) => `${m.energy_mj.toFixed(1)} mJ on paper · every unit computes every frame`,
  },
} as const

interface ModelReadoutProps {
  which: 'snn' | 'ann'
  result?: SpikesModelResult
  label: number
  dim: boolean
}

export default function ModelReadout({ which, result, label, dim }: ModelReadoutProps) {
  const meta = META[which]
  // Bars show each unit's share of the total response, not its raw score:
  // raw outputs are MSE-trained rates that the ReLU twin can push past 1,
  // which reads as an impossible "108%". Shares sum to 1, and the top
  // share is exactly the "sure" figure above (max / sum, never softmax).
  const total = result ? result.scores.reduce((a, b) => a + Math.max(0, b), 0) : 0
  const share = (v: number) => (total > 0 ? Math.max(0, v) / total : 0)

  return (
    <section
      aria-label={`${which === 'snn' ? 'Spiking network' : 'ReLU twin'} answer`}
      className={`rounded-xl border border-[var(--border)] bg-[var(--background)] p-6 transition-opacity duration-200 ${dim ? 'opacity-60' : ''}`}
    >
      <p className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--text-tertiary)]">
        {meta.eyebrow}
      </p>
      <p className="mt-2 text-sm text-[var(--text-secondary)]">{meta.blurb}</p>

      <p className="mt-5 font-mono text-[11px] tracking-[0.08em] text-[var(--text-tertiary)]">its answer</p>
      <div className="mt-1 flex items-baseline justify-between gap-3">
        <h3 className="text-lg font-semibold text-[var(--text)] sm:text-xl">
          {result ? SPIKES_CLASS_NAMES[result.pred] : '—'}
        </h3>
        {result && (
          <span
            className={`inline-flex shrink-0 items-center gap-1 font-mono text-[11px] font-medium uppercase tracking-[0.14em] ${
              result.correct ? 'text-[var(--success)]' : 'text-[var(--error)]'
            }`}
          >
            {result.correct ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : <X className="h-3.5 w-3.5" aria-hidden="true" />}
            {result.correct ? 'right' : 'wrong'}
          </span>
        )}
      </div>

      <p className="mt-2 flex items-baseline gap-2 text-sm text-[var(--text-secondary)]">
        <span className="text-3xl font-semibold text-[var(--text)]">{result ? `${Math.round(result.conf * 100)}%` : '—'}</span>
        sure
      </p>

      <p className="mt-5 font-mono text-[11px] leading-relaxed tracking-[0.08em] text-[var(--text-tertiary)]">
        each gesture&apos;s share of the total response · bold = the true gesture
      </p>
      <ol className="mt-2 space-y-1.5" aria-label="Raw output per class">
        {SPIKES_CLASS_NAMES.map((name, i) => {
          const value = result ? result.scores[i] : 0
          const isPred = result ? result.pred === i : false
          const isTrue = i === label
          return (
            <li key={name} className="grid grid-cols-[6.5rem_minmax(0,1fr)_2.25rem] items-center gap-2 sm:grid-cols-[7.5rem_minmax(0,1fr)_2.25rem]">
              <span
                className={`truncate font-mono text-[11px] ${isTrue ? 'font-medium text-[var(--text)]' : 'text-[var(--text-tertiary)]'}`}
                title={isTrue ? `${name} (true class)` : name}
              >
                {name}
              </span>
              <span className="relative h-2">
                <span
                  className={`absolute inset-y-0 left-0 rounded-r-sm ${meta.bar} transition-[width] duration-200`}
                  style={{ width: `${share(value) * 100}%` }}
                />
              </span>
              <span className="text-right font-mono text-[11px] tabular-nums text-[var(--text-secondary)]">
                {isPred ? `${Math.round(share(value) * 100)}%` : isTrue && result && !isPred ? 'truth' : ''}
              </span>
            </li>
          )
        })}
      </ol>

      <dl className="mt-5 border-t border-[var(--border)] pt-4 font-mono text-[11px] leading-relaxed tracking-[0.04em] text-[var(--text-secondary)]">
        <div className="flex gap-2">
          <dt className="shrink-0 text-[var(--text-tertiary)]">cost</dt>
          <dd>{result ? meta.cost(result) : '—'}</dd>
        </div>
        {which === 'snn' && result?.lif_rates && (
          <div className="mt-1 flex gap-2">
            <dt className="shrink-0 text-[var(--text-tertiary)]">firing rate by layer</dt>
            <dd className="tabular-nums">{result.lif_rates.map((r) => r.toFixed(3)).join(' ')}</dd>
          </div>
        )}
      </dl>
    </section>
  )
}
