'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowLeftIcon, CodeBracketIcon } from '@heroicons/react/24/outline'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import CategoryFilter from '@/components/ui/CategoryFilter'
import Eyebrow from '@/components/ui/Eyebrow'
import BackToTop from '@/components/ui/BackToTop'
import {
  SPIKES_CLASS_NAMES,
  SPIKES_KINDS,
  SPIKES_N_TEST,
  SPIKES_POPULATION,
  SPIKES_SEVERITIES,
  type SpikesKind,
} from '@/lib/spikes-demo-data'
import { decodeFrames, type SpikesRunResult } from './types'
import EventCanvas from './EventCanvas'
import ConfidenceTrace from './ConfidenceTrace'
import ModelReadout from './ModelReadout'
import PopulationCharts from './PopulationCharts'
import { GesturePicker, RecordingPicker } from './SamplePicker'
import Explain from './Explain'
import EnergyBreakdown from './EnergyBreakdown'
import SeriesKey from './SeriesKey'

/** Every external source the page cites. Each URL was fetched and checked
 *  before it went in (house rule: no link that was not seen resolving). */
const SOURCES = {
  dataset: 'https://ibm.ent.box.com/s/3hiq58ww1pbbjrinh367ykfdf60xsfm8',
  datasetPaper: 'https://openaccess.thecvf.com/content_cvpr_2017/html/Amir_A_Low_Power_CVPR_2017_paper.html',
  spikingjelly: 'https://github.com/fangwei123456/spikingjelly',
  pytorch: 'https://pytorch.org/',
  modal: 'https://modal.com/',
  horowitz: 'https://doi.org/10.1109/ISSCC.2014.6757323',
} as const

// Ink-link grammar (DESIGN_SYSTEM.md): the underline is the affordance.
const LINK =
  'font-medium text-[var(--text)] underline decoration-[var(--text)]/30 underline-offset-[0.15em] transition-[text-decoration-color] hover:decoration-[var(--text)]'
// The same link inside a mono annotation line, which keeps its quiet ink.
const MONO_LINK =
  'underline decoration-[var(--text-tertiary)]/50 underline-offset-[0.15em] transition-[color,text-decoration-color] hover:text-[var(--text)] hover:decoration-[var(--text)]'

function Source({ href, className, children }: { href: string; className?: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className ?? LINK}>
      {children}
    </a>
  )
}

/**
 * "Do spikes fail differently?" live demo. One controlled experiment, live:
 * the same damaged event-camera recording goes through a spiking network
 * and its ReLU twin, and the page shows what each answers, how sure it is,
 * how that certainty built up over the 16 frames, and what the run costs
 * on the accounting model. The published run (n=288) sits underneath so a
 * single live sample can be read against the whole test set.
 *
 * Written for a visitor who has never heard of an event camera: four
 * numbered steps in the home page's eyebrow grammar, one plain sentence
 * under each, words before symbols on every control, and a one-sentence
 * verdict after every run. The SNN's data ink is this page's slot in the
 * closed lime budget (DESIGN_SYSTEM.md, "Personality layer").
 */

const PROJECT_HREF = '/projects/do-spikes-fail-differently'
// Set once the study's repository is public.
const SOURCE_URL = ''

export const KIND_LABELS: Record<SpikesKind, string> = {
  clean: 'No damage',
  drop: 'Lose events',
  noise: 'Add noise',
  occlude: 'Block a patch',
  tshuffle: 'Shuffle time',
}

const KIND_NOTES: Record<SpikesKind, string> = {
  clean: 'The recording exactly as the camera saved it. Both networks get every recording on this page right when it is undamaged, so this is the baseline. Pick a kind of damage to break things.',
  drop: 'Some of the camera events are deleted at random, like a sensor that is failing or losing sensitivity. Both networks suffer. At the extreme setting both are near guessing and still about 80% sure of themselves.',
  noise: 'Random background events are sprinkled over every frame, like hot pixels or a noisy sensor. This is the study’s headline: the ordinary network keeps its confidence while its answers get worse, the spiking network loses confidence as it loses accuracy.',
  occlude: 'A square patch is blanked out in every frame, as if something sat in front of the lens. The ordinary network keeps its small lead throughout.',
  tshuffle: 'The 16 frames are reordered in windows. The ordinary network averages its 16 answers, so by construction it cannot tell. Anything that changes is the spiking network using the order of events.',
}

const KIND_NOUN: Record<Exclude<SpikesKind, 'clean'>, string> = {
  drop: 'event loss',
  noise: 'background noise',
  occlude: 'blockage',
  tshuffle: 'time shuffling',
}

const SEVERITY_SYMBOL: Record<Exclude<SpikesKind, 'clean'>, string> = {
  drop: 'p',
  noise: 'λ',
  occlude: 's',
  tshuffle: 'w',
}

const LEVEL_WORDS = ['none', 'mild', 'moderate', 'heavy', 'extreme'] as const

/** "λ = 0.1", or "no damage": the symbol form for tight captions. */
function shortSeverity(kind: SpikesKind, level: number): string {
  if (kind === 'clean' || level === 0) return 'no damage'
  const value = SPIKES_SEVERITIES[kind][level - 1]
  const unit = kind === 'occlude' ? ' px' : ''
  return `${SEVERITY_SYMBOL[kind]} = ${value}${unit}`
}

/** "moderate background noise · λ = 0.1": words first, symbol second. */
function formatSeverity(kind: SpikesKind, level: number): string {
  if (kind === 'clean' || level === 0) return 'no damage'
  return `${LEVEL_WORDS[level]} ${KIND_NOUN[kind]} · ${shortSeverity(kind, level)}`
}

function kindFromLabel(label: string): SpikesKind {
  return (SPIKES_KINDS.find((k) => KIND_LABELS[k] === label) ?? 'clean') as SpikesKind
}

function pct(x: number) {
  return `${Math.round(x * 100)}%`
}

/** One plain sentence a visitor can read without the charts. */
function verdict(r: SpikesRunResult): string {
  const s = r.snn
  const a = r.ann
  const sName = SPIKES_CLASS_NAMES[s.pred]
  const aName = SPIKES_CLASS_NAMES[a.pred]
  if (s.correct && a.correct) {
    return `Both networks got it right. The spiking network is ${pct(s.conf)} sure, the ordinary network ${pct(a.conf)}.`
  }
  if (s.correct && !a.correct) {
    return `The spiking network got it right and is ${pct(s.conf)} sure. The ordinary network answered “${aName}” and is ${pct(a.conf)} sure of that.`
  }
  if (!s.correct && a.correct) {
    return `The ordinary network got it right and is ${pct(a.conf)} sure. The spiking network answered “${sName}” and is ${pct(s.conf)} sure of that.`
  }
  return `Both networks got it wrong. The spiking network said “${sName}” at ${pct(s.conf)}, the ordinary network said “${aName}” at ${pct(a.conf)}.`
}

function pct1(x: number) {
  return `${(x * 100).toFixed(1)}%`
}

/**
 * The study's headline results, spiking then ordinary, for the header's
 * side panel. Accuracies come from the published run in the data module;
 * calibration error (step 5) and paper energy (step 7) are the study's
 * reported figures and match the project page.
 */
const GLANCE: { label: string; snn: string; ann: string }[] = (() => {
  const clean = SPIKES_POPULATION.clean[0]
  const heavyNoise = SPIKES_POPULATION.noise[3]
  return [
    { label: 'Right on undamaged recordings', snn: pct1(clean.snn.acc), ann: pct1(clean.ann.acc) },
    { label: 'Calibration error, lower is better', snn: '0.040', ann: '0.039' },
    { label: 'Right under heavy noise, λ = 0.2', snn: pct1(heavyNoise.snn.acc), ann: pct1(heavyNoise.ann.acc) },
    { label: 'Energy per recording, on paper', snn: '3.30 mJ', ann: '61.90 mJ' },
  ]
})()

function StepHeading({
  id,
  index,
  label,
  title,
  children,
}: {
  id: string
  index: string
  label: string
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="mb-6 max-w-3xl">
      <Eyebrow index={index}>{label}</Eyebrow>
      <h2 id={id} className="mb-2 text-2xl font-semibold text-[var(--text)] sm:text-3xl">{title}</h2>
      <p className="text-base text-[var(--text-secondary)]">{children}</p>
    </div>
  )
}

export default function SpikesDemo() {
  const [sample, setSample] = useState(0)
  const [kind, setKind] = useState<SpikesKind>('clean')
  const [level, setLevel] = useState(0)
  const [seed, setSeed] = useState(0)

  const [result, setResult] = useState<SpikesRunResult | null>(null)
  const [pending, setPending] = useState(true)
  const [slow, setSlow] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const controllerRef = useRef<AbortController | null>(null)

  // Every control change is one run. The previous request is aborted so a
  // fast series of clicks settles on the last one; the previous result stays
  // on screen, dimmed, until the new one lands (refetch keeps the frame).
  useEffect(() => {
    controllerRef.current?.abort()
    const controller = new AbortController()
    controllerRef.current = controller
    setPending(true)
    setError(null)
    setSlow(false)
    const slowTimer = window.setTimeout(() => setSlow(true), 2500)

    fetch('/api/spikes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sample, kind, level, seed }),
      signal: controller.signal,
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}))
        if (!res.ok) throw new Error(data?.error || `The demo backend answered ${res.status}.`)
        return data as SpikesRunResult
      })
      .then((data) => {
        if (controller.signal.aborted) return
        setResult(data)
        setPending(false)
      })
      .catch((err: { name?: string; message?: string }) => {
        if (controller.signal.aborted || err?.name === 'AbortError') return
        setError(err?.message || 'The demo backend is unreachable right now.')
        setPending(false)
      })
      .finally(() => window.clearTimeout(slowTimer))

    return () => {
      controller.abort()
      window.clearTimeout(slowTimer)
    }
  }, [sample, kind, level, seed])

  const frames = useMemo(() => (result ? decodeFrames(result.frames.b64) : null), [result])
  const dim = pending && result !== null
  const gesture = Math.floor(sample / 3)
  const gestureName = SPIKES_CLASS_NAMES[gesture]

  const selectGesture = (c: number) => setSample(c * 3 + (sample % 3))
  const selectKind = (label: string) => {
    const next = kindFromLabel(label)
    setKind(next)
    if (next === 'clean') setLevel(0)
    else if (level === 0) setLevel(2)
  }

  const severityText = formatSeverity(kind, level)
  const status = pending
    ? slow
      ? 'waking the models · the first call after idle takes a few seconds'
      : 'running both networks'
    : error
      ? null
      : result
        ? `run time snn ${result.snn.ms} ms · ann ${result.ann.ms} ms on cpu · draw #${seed}`
        : null

  const stopStrip = kind !== 'clean' && (
    <div role="group" aria-label="How much damage" className="flex flex-wrap items-baseline gap-x-6 font-mono text-xs">
      <span className="text-[var(--text-tertiary)]">how much</span>
      {[1, 2, 3, 4].map((l) => {
        const active = level === l
        const value = SPIKES_SEVERITIES[kind][l - 1]
        return (
          <button
            key={l}
            type="button"
            onClick={() => setLevel(l)}
            aria-pressed={active}
            aria-label={`${LEVEL_WORDS[l]}, ${SEVERITY_SYMBOL[kind]} = ${value}`}
            className={`relative -mb-px whitespace-nowrap text-left transition-colors ${
              active ? 'text-[var(--text)]' : 'text-[var(--text-secondary)] hover:text-[var(--text)]'
            }`}
          >
            <span className="relative inline-block py-2">
              <span className="font-medium">{LEVEL_WORDS[l]}</span>
              <span className="ml-1.5 tabular-nums text-[var(--text-tertiary)]">
                {SEVERITY_SYMBOL[kind]} = {value}
              </span>
              <span
                aria-hidden="true"
                className={`absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-[var(--primary)] transition-opacity duration-200 ${
                  active ? 'opacity-100' : 'opacity-0'
                }`}
              />
            </span>
          </button>
        )
      })}
      <button
        type="button"
        onClick={() => setSeed((s) => (s + 1) % 1_000_000)}
        title="The damage is random. This re-rolls it on the same recording."
        className="py-2 font-medium text-[var(--text-secondary)] underline decoration-[var(--text)]/30 underline-offset-[0.15em] transition-[text-decoration-color] hover:text-[var(--text)] hover:decoration-[var(--text)]"
      >
        re-roll the damage
      </button>
    </div>
  )

  return (
    <>
      <div className="min-h-[100dvh] bg-[var(--background)] py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Breadcrumbs
              items={[
                { label: 'Home', href: '/' },
                { label: 'Projects', href: '/projects' },
                { label: 'Live demo', current: true },
              ]}
              size="sm"
            />
          </div>

          {/* Header: the project-page grammar, so the demo and the study
              read as one piece. */}
          <header className="mb-12 border-b border-[var(--border)] pb-8">
            <p className="mb-3 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--text-tertiary)]">
              Neuromorphic Computing &middot; Live demo
            </p>
            <h1 className="mb-4 text-4xl font-semibold tracking-tight text-[var(--text)] sm:text-5xl">
              Do spikes fail differently?
            </h1>

            {/* Two columns from lg, like the home hero: the reading measure on
                the left, and the study's four headline numbers on the right so
                the wide container is not two thirds empty. */}
            <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-16">
              <div>
                <p className="max-w-3xl text-xl text-[var(--text-secondary)]">
                  Damage a gesture recording from an event camera and watch two networks answer the
                  same damaged input: one built from spiking neurons, one from ordinary ones.
                </p>
                <div className="mt-6 max-w-3xl space-y-3 text-base text-[var(--text-secondary)]">
                  <p>
                    An event camera does not take pictures. Each pixel reports only when the
                    brightness in front of it changes, so a still scene is invisible and a moving
                    hand is a cloud of dots. Two networks were trained on the same recordings to name
                    eleven hand and arm gestures. One uses spiking neurons, which fire short pulses
                    and stay silent otherwise. The other is the very same network with ordinary
                    always-on units. Same layers, same number of weights, same data, same training.
                  </p>
                  <p>
                    Everything below runs live. Pick a gesture, choose how to damage the recording,
                    and the page sends the damaged frames through both networks and reports what each
                    one answered and how sure it was.
                  </p>
                </div>
                <p className="mt-5 font-mono text-xs tracking-[0.04em] text-[var(--text-tertiary)]">
                  <Source href={SOURCES.dataset} className={MONO_LINK}>DVS128Gesture</Source> &middot; 16 frames
                  per recording &middot; <Source href={SOURCES.pytorch} className={MONO_LINK}>PyTorch</Source> +{' '}
                  <Source href={SOURCES.spikingjelly} className={MONO_LINK}>SpikingJelly</Source> &middot; runs on{' '}
                  <Source href={SOURCES.modal} className={MONO_LINK}>Modal</Source>
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href={PROJECT_HREF}
                    className="inline-flex items-center rounded-lg border border-[var(--border)] px-6 py-3 text-sm font-medium text-[var(--text)] transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)]"
                  >
                    <ArrowLeftIcon className="mr-2 h-4 w-4" />
                    Read the study
                  </Link>
                  {SOURCE_URL && (
                    <a
                      href={SOURCE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center rounded-lg border border-[var(--border)] px-6 py-3 text-sm font-medium text-[var(--text)] transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)]"
                    >
                      <CodeBracketIcon className="mr-2 h-4 w-4" />
                      Source Code
                    </a>
                  )}
                </div>
              </div>

              {/* Static ink, hairline rows, one column per network, headed by
                  the same series keys the charts use, so "which number is
                  whose" never has to be inferred. */}
              <aside aria-labelledby="glance-heading" className="lg:pt-1">
                <p
                  id="glance-heading"
                  className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--text-secondary)]"
                >
                  The study in four numbers
                </p>
                <table className="mt-3 w-full border-collapse">
                  <caption className="sr-only">Headline results, spiking network against the ordinary network</caption>
                  <thead>
                    <tr className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--text-tertiary)]">
                      <th scope="col" className="pb-2 text-left font-medium">
                        result
                      </th>
                      <th scope="col" className="whitespace-nowrap pb-2 pl-3 text-right font-medium">
                        <SeriesKey kind="snn" className="mr-1.5" />
                        spiking
                      </th>
                      <th scope="col" className="whitespace-nowrap pb-2 pl-3 text-right font-medium">
                        <SeriesKey kind="ann" className="mr-1.5" />
                        ordinary
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {GLANCE.map((row) => (
                      <tr key={row.label} className="border-t border-[var(--border)]">
                        <th scope="row" className="py-3 pr-2 text-left text-sm font-normal text-[var(--text-secondary)]">
                          {row.label}
                        </th>
                        <td className="whitespace-nowrap py-3 pl-3 text-right font-mono text-xs tabular-nums text-[var(--text)]">
                          {row.snn}
                        </td>
                        <td className="whitespace-nowrap py-3 pl-3 text-right font-mono text-xs tabular-nums text-[var(--text)]">
                          {row.ann}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="border-t border-[var(--border)] pt-3 font-mono text-[11px] leading-relaxed tracking-[0.08em] text-[var(--text-tertiary)]">
                  288 test recordings &middot; one training seed &middot; the study puts a 95% interval on
                  every number
                </p>
              </aside>
            </div>
          </header>

          {/* 01 */}
          <section aria-labelledby="step-1">
            <StepHeading id="step-1" index="01" label="The input" title="Choose a gesture">
              Eleven gestures, each drawn from one of its recordings: every dot is a pixel that saw
              the brightness change. These recordings were held out from training, so neither
              network has seen them before.
            </StepHeading>
            <GesturePicker selected={gesture} onSelect={selectGesture} />
            <Explain summary="where these recordings come from" className="mt-5">
              <p>
                <Source href={SOURCES.dataset}>DVS128Gesture</Source> is IBM’s event-camera dataset,
                published with{' '}
                <Source href={SOURCES.datasetPaper}>Amir et al., CVPR 2017</Source>: 11 hand and arm
                gestures performed by 29 people under three lighting conditions, recorded by a 128 by
                128 pixel sensor that reports only brightness changes. The standard split holds out
                whole people, so the 288 test recordings show people the networks never trained on.
              </p>
              <p>
                <Source href={SOURCES.spikingjelly}>SpikingJelly</Source> bins each recording’s events into 16 frames, one channel for
                brightness-up events and one for brightness-down. This bank is 33 of the test
                recordings, three per gesture: the first three in test-set order that both networks
                classify correctly when undamaged, so any disagreement you produce here comes from
                the damage. The thumbnails and the player are those frames shrunk to 64 by 64 for
                display; the networks always see the full 128 by 128.
              </p>
            </Explain>
          </section>

          {/* 02 */}
          <section aria-labelledby="step-2" className="mt-14 sm:mt-16">
            <StepHeading id="step-2" index="02" label="The damage" title="Damage the recording">
              Four ways to damage it, each modelled on something that goes wrong with a real sensor.
              Pick one, then how much. Both networks always see the identical damaged frames.
            </StepHeading>
            <CategoryFilter
              categories={SPIKES_KINDS.map((k) => KIND_LABELS[k])}
              selected={KIND_LABELS[kind]}
              onSelect={selectKind}
              label="Kind of damage"
              className="mb-0!"
            />
            <div className="mt-4 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3">
              {stopStrip || (
                <p className="py-2 font-mono text-xs text-[var(--text-tertiary)]">how much · nothing to set, the recording is untouched</p>
              )}
              <p
                role="status"
                aria-live="polite"
                className="flex items-center gap-2 py-2 font-mono text-[11px] tracking-[0.04em] text-[var(--text-tertiary)]"
              >
                {pending && (
                  <span
                    aria-hidden="true"
                    data-essential-motion
                    className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--text-secondary)]"
                  />
                )}
                {error ? <span className="text-[var(--error)]">{error}</span> : status}
              </p>
            </div>
            <p className="mt-4 max-w-3xl text-sm text-[var(--text-secondary)]">{KIND_NOTES[kind]}</p>
            <Explain summary="exactly what each kind of damage does to the frames" className="mt-4">
              <p>
                Damage is applied to the 16 binned frames, identically for both networks, with a
                random seed fixed by the recording and the setting. The same choice always produces
                the same damaged frames until you re-roll.
              </p>
              <ul className="list-disc space-y-1.5 pl-5">
                <li>Lose events: every event is kept or dropped by a coin flip, surviving with probability 1 − p.</li>
                <li>Add noise: a Poisson draw with mean λ is added to every pixel in every frame, for both polarities, on top of the real events.</li>
                <li>Block a patch: one square of s by s pixels, placed at random per recording, is set to zero in all 16 frames.</li>
                <li>Shuffle time: the 16 frames are cut into windows of w frames and the frames inside each window are reordered at random. The frames themselves are untouched.</li>
              </ul>
              <p>
                The four settings on the strip are the study’s four severities, so the published
                curves in step 04 used exactly this damage.
              </p>
            </Explain>
          </section>

          {/* 03 */}
          <section aria-labelledby="step-3" className="mt-14 sm:mt-16">
            <StepHeading id="step-3" index="03" label="The answers" title="Watch both networks answer">
              The player shows the damaged recording the networks are looking at. The chart beside
              it shows each network making up its mind frame by frame. The two cards are their final
              answers.
            </StepHeading>

            <div className="grid gap-8 md:grid-cols-[minmax(0,300px)_minmax(0,1fr)]">
              <div className="flex flex-col gap-4">
                <EventCanvas frames={frames} T={result?.T ?? 16} dim={dim} label={shortSeverity(kind, level)} />
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <RecordingPicker selected={sample} onSelect={setSample} />
                  <p className="max-w-[10rem] font-mono text-[11px] leading-relaxed tracking-[0.08em] text-[var(--text-tertiary)]">
                    three recordings of {gestureName} · # = its number in the test set
                  </p>
                </div>
              </div>
              <ConfidenceTrace
                snn={result?.snn}
                ann={result?.ann}
                label={result?.label ?? gesture}
                T={result?.T ?? 16}
                dim={dim}
              />
            </div>
            <Explain summary="how the frame-by-frame chart is built" className="mt-4">
              <p>
                Each network produces one response per gesture, eleven in all. The spiking
                network’s response is a firing rate: how often that output neuron fired. The chart
                replays the run one frame at a time. After frame t it averages the responses seen so
                far, takes the largest as the answer, and divides it by the sum of all eleven to get
                how sure. The ordinary network answers every frame on its own, so its point at
                frame t is the average of its first t answers. Frame 16 is the final answer on the
                cards.
              </p>
              <p>
                At frame 1 the spiking network has fired only a handful of spikes, so whichever
                output fired first looks unanimous. That early 1.0 is small-sample noise, not
                confidence, and it settles within a few frames as spikes accumulate.
              </p>
            </Explain>

            <p
              className={`mt-8 max-w-4xl text-lg font-medium text-[var(--text)] transition-opacity duration-200 sm:text-xl ${dim ? 'opacity-60' : ''}`}
              aria-live="polite"
            >
              {result ? (
                <>
                  <span className="text-[var(--text-secondary)]">
                    The recording shows {SPIKES_CLASS_NAMES[result.label]}
                    {result.kind !== 'clean' && result.level > 0
                      ? ` with ${LEVEL_WORDS[result.level]} ${KIND_NOUN[result.kind]} (${shortSeverity(result.kind, result.level)}).`
                      : ', undamaged.'}
                  </span>{' '}
                  {verdict(result)}
                </>
              ) : (
                <span className="text-[var(--text-secondary)]">
                  {error ? 'No answer yet.' : 'Waiting for the first answer.'}
                </span>
              )}
            </p>

            <div className="mt-8 grid gap-8 sm:grid-cols-2">
              <ModelReadout which="snn" result={result?.snn} label={result?.label ?? gesture} dim={dim} />
              <ModelReadout which="ann" result={result?.ann} label={result?.label ?? gesture} dim={dim} />
            </div>
            <p className="mt-4 font-mono text-[11px] leading-relaxed tracking-[0.04em] text-[var(--text-tertiary)]">
              energy is an accounting model, not measured power · on this CPU both networks cost the
              same watts
            </p>
            <div className="mt-2 space-y-2">
              <Explain summary="how “sure” and the bars are calculated">
                <p>
                  Neither network outputs probabilities. Both were trained with a squared-error loss
                  that pushes the right gesture’s output toward 1 and the other ten toward 0, so each
                  output is a response somewhere between 0 and about 1.3, not a share of a whole. The
                  spiking network’s responses are firing rates, so they never exceed 1; the ordinary
                  network’s can overshoot.
                </p>
                <p>
                  “Sure” is the winning response divided by the sum of all eleven. Each bar is that
                  gesture’s share of the same total, so the bars add up to 100% and the top bar is the
                  “sure” figure. The study deliberately does not use softmax here: on responses in
                  this range it squashes everything toward one eleventh and makes both networks look
                  far less sure than they are.
                </p>
              </Explain>
              <Explain summary="how the energy figure is calculated">
                <p>
                  Both figures come from a bookkeeping model, not a power meter. One
                  multiply-accumulate is priced at 4.6 pJ and one plain accumulate at 0.9 pJ,{' '}
                  <Source href={SOURCES.horowitz}>Horowitz’s 2014 figures</Source> for 45 nm silicon and
                  the standard prices in the spiking-network literature. The ordinary network does every multiply on every
                  frame whatever the input, so its bill is fixed: multiplies per frame, times 16
                  frames, times 4.6 pJ, for every layer. A spiking layer only works when an input
                  spike arrives, and a spike triggers an add rather than a multiply, so each layer is
                  billed on how busy its input was in this run: multiplies per frame, times 16, times
                  the fraction of input positions that spiked, times 0.9 pJ.
                </p>
                <p>
                  The first layer is the exception. It sees the analog event-count frames, not
                  spikes, so it is charged at full multiply price for both networks. That one layer
                  is most of the spiking bill, and the choice is deliberately conservative against
                  the spiking network. “Silent” is one minus the average firing rate over every
                  neuron and every frame, weighted by layer size. The table is this run’s
                  bookkeeping, recomputed in the browser from the measured activity.
                </p>
                {result && <EnergyBreakdown snn={result.snn} />}
                <p>
                  What the model leaves out, and why the number is “on paper”: it counts arithmetic
                  only, while on a real chip memory traffic usually costs more than arithmetic. It
                  does not bill the spiking network for updating every neuron’s membrane every
                  frame, silent or not. It bills the ordinary network as fully dense even though
                  ReLU outputs are often zero too, which a zero-skipping chip could exploit, although
                  a multiply would still cost about five times an add. The prices are from a 2014
                  process, so the ratio matters more than the absolute. And it is sensitive to
                  bookkeeping: measuring spike density before pooling instead of after changed the
                  study’s per-layer numbers by half. The saving exists only on event-driven
                  hardware. Live runs are on CPU, where spike timing can differ slightly from the
                  GPU run behind the published numbers.
                </p>
              </Explain>
            </div>
          </section>

          {/* 04 */}
          <section aria-labelledby="step-4" className="mt-16 border-t border-[var(--border)] pt-12 sm:mt-20">
            <StepHeading id="step-4" index="04" label="The whole test set" title="Compare with the whole test set">
              One live recording is an anecdote. These curves are all {SPIKES_N_TEST} test
              recordings under the kind of damage you picked, from the study&apos;s recorded run.
              Left: how often each network was right. Right: how far its confidence sits above or
              below that. Above zero means it is surer than it should be.
            </StepHeading>
            <PopulationCharts kind={kind} level={level} settingLabel={severityText} />
            <p className="mt-6 max-w-4xl text-sm text-[var(--text-secondary)]">
              Undamaged test set: spiking network {(SPIKES_POPULATION.clean[0].snn.acc * 100).toFixed(1)}%
              right [{(SPIKES_POPULATION.clean[0].snn.accLo * 100).toFixed(1)},{' '}
              {(SPIKES_POPULATION.clean[0].snn.accHi * 100).toFixed(1)}], ordinary network{' '}
              {(SPIKES_POPULATION.clean[0].ann.acc * 100).toFixed(1)}%
              [{(SPIKES_POPULATION.clean[0].ann.accLo * 100).toFixed(1)},{' '}
              {(SPIKES_POPULATION.clean[0].ann.accHi * 100).toFixed(1)}]. Brackets are the range the
              true number likely sits in, given only {SPIKES_N_TEST} recordings. On undamaged data
              both are slightly less sure than they should be, by about the same amount.
            </p>
            <Explain summary="how the curves and intervals are calculated" className="mt-4">
              <p>
                Every point is from one recorded run over the {SPIKES_N_TEST} test recordings. Each
                result is then bootstrapped: the {SPIKES_N_TEST} outcomes are resampled with
                replacement 3,000 times, accuracy is recomputed each time, and the shaded band is the
                range holding the middle 95% of those values. “Right N points more often” is a paired
                difference: each resample compares the two networks on the same recordings, so its
                interval reflects where they disagree rather than how hard the recordings are.
                Confidence is the same top-share figure as on the cards, averaged over the test set,
                and “surer than it should be” is that average minus accuracy.
              </p>
              <p>
                Single seed means one training run per network. The intervals cover sampling noise
                on {SPIKES_N_TEST} recordings; they say nothing about what a different random
                initialisation would do, which is the study’s stated next step.
              </p>
            </Explain>
          </section>

          <div className="mt-12 border-t border-[var(--border)] pt-8">
            <Link
              href={PROJECT_HREF}
              className="inline-flex items-center gap-2 font-medium text-[var(--primary)] transition-colors hover:text-[var(--primary-hover)]"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              <span>Back to the study</span>
            </Link>
          </div>
        </div>
      </div>
      <BackToTop />
    </>
  )
}
