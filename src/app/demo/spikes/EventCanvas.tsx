'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Layers, Pause, Play } from 'lucide-react'
import { EmptyAxes } from '@/components/effects/NotebookDoodles'
import { motionOK } from '@/lib/motion-tokens'
import { FRAME_SIDE } from './types'

/**
 * The corrupted input, drawn as ink on the site's own surface instead of a
 * PNG from the backend: the frames arrive as a uint8 block and are painted
 * to a 64x64 canvas in the page's text tokens (ON events full ink, OFF
 * events tertiary), so the picture is theme-aware and never clashes with
 * the stone palette. Loops through the 16 frames when motion is allowed;
 * under reduced motion it opens on the stacked composite and can be
 * stepped by hand. Sits in the same ink mat as the evidence figures.
 */

// alpha per pooled event count (the backend sum-pools 2x2, so counts run ~4x)
const GAIN = 0.35
const FRAME_MS = 110

type Mode = 'play' | 'pause' | 'stack'

function tokenRgb(name: string, fallback: [number, number, number]): [number, number, number] {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  const hex = raw.startsWith('#') ? raw.slice(1) : ''
  const full = hex.length === 3 ? hex.split('').map((c) => c + c).join('') : hex
  if (full.length < 6) return fallback
  const v = parseInt(full.slice(0, 6), 16)
  if (Number.isNaN(v)) return fallback
  return [(v >> 16) & 255, (v >> 8) & 255, v & 255]
}

interface EventCanvasProps {
  frames: Uint8Array | null
  T: number
  dim: boolean
  label: string
}

export default function EventCanvas({ frames, T, dim, label }: EventCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [motion, setMotion] = useState(false)
  const [mode, setMode] = useState<Mode>('stack')
  const [t, setT] = useState(0)

  useEffect(() => {
    const ok = motionOK()
    setMotion(ok)
    setMode(ok ? 'play' : 'stack')
  }, [])

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const N = FRAME_SIDE * FRAME_SIDE
    if (!frames) {
      ctx.clearRect(0, 0, FRAME_SIDE, FRAME_SIDE)
      return
    }
    const ink = tokenRgb('--text', [41, 37, 36])
    const faint = tokenRgb('--text-tertiary', [120, 113, 108])
    const img = ctx.createImageData(FRAME_SIDE, FRAME_SIDE)
    const stacked = mode === 'stack'
    const gain = stacked ? GAIN / 4 : GAIN
    for (let i = 0; i < N; i++) {
      let on = 0
      let off = 0
      if (stacked) {
        for (let s = 0; s < T; s++) {
          off += frames[(s * 2) * N + i]
          on += frames[(s * 2 + 1) * N + i]
        }
      } else {
        off = frames[(t * 2) * N + i]
        on = frames[(t * 2 + 1) * N + i]
      }
      const aOn = Math.min(1, on * gain)
      const aOff = Math.min(1, off * gain)
      const [r, g, b] = aOn >= aOff ? ink : faint
      const a = Math.max(aOn, aOff)
      const o = i * 4
      img.data[o] = r
      img.data[o + 1] = g
      img.data[o + 2] = b
      img.data[o + 3] = Math.round(a * 255)
    }
    ctx.putImageData(img, 0, 0)
  }, [frames, mode, t, T])

  useEffect(() => {
    draw()
  }, [draw])

  // Theme flips only change data-theme on <html>; repaint with the new ink.
  useEffect(() => {
    const observer = new MutationObserver(() => draw())
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => observer.disconnect()
  }, [draw])

  useEffect(() => {
    if (mode !== 'play' || !frames) return
    const id = window.setInterval(() => setT((x) => (x + 1) % T), FRAME_MS)
    return () => window.clearInterval(id)
  }, [mode, frames, T])

  const step = (delta: number) => {
    setMode('pause')
    setT((x) => (x + delta + T) % T)
  }

  const frameText = mode === 'stack' ? `all ${T} frames stacked` : `frame ${String(t + 1).padStart(2, '0')} / ${T}`
  const iconButton =
    'inline-flex h-11 w-11 items-center justify-center rounded-md text-[var(--text-tertiary)] transition-colors hover:text-[var(--text)] disabled:opacity-40 disabled:hover:text-[var(--text-tertiary)]'

  return (
    <figure className="rounded-xl border border-[var(--border)] bg-[var(--background-secondary)] p-3">
      <div
        className={`relative aspect-square overflow-hidden rounded-lg transition-opacity duration-200 ${dim ? 'opacity-60' : ''}`}
      >
        <canvas
          ref={canvasRef}
          width={FRAME_SIDE}
          height={FRAME_SIDE}
          role="img"
          aria-label={frames ? `${label}, ${frameText}` : 'No run yet'}
          className="block h-full w-full [image-rendering:pixelated]"
        />
        {!frames && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <EmptyAxes className="doodle h-1/2 w-1/2" />
            <p className="font-mono text-[11px] tracking-[0.08em] text-[var(--text-tertiary)]">waiting for the first run</p>
          </div>
        )}
      </div>

      {/* Controls on their own row: four 44px targets leave no room for text
          beside them at the card's width, so the caption goes underneath. */}
      <div role="group" aria-label="Playback" className="-ml-2 mt-1 flex items-center">
        <span className="flex items-center">
          <button
            type="button"
            onClick={() => step(-1)}
            disabled={!frames}
            className={iconButton}
            aria-label="Previous frame"
            title="Previous frame"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => setMode(mode === 'play' ? 'pause' : 'play')}
            disabled={!frames || !motion}
            className={iconButton}
            aria-label={mode === 'play' ? 'Pause' : 'Play'}
            aria-pressed={mode === 'play'}
            title={
              motion
                ? mode === 'play'
                  ? 'Pause the 16 frames'
                  : 'Play the 16 frames'
                : 'Playback is off while reduced motion is on; step through the frames instead'
            }
          >
            {mode === 'play' ? <Pause className="h-4 w-4" aria-hidden="true" /> : <Play className="h-4 w-4" aria-hidden="true" />}
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            disabled={!frames}
            className={iconButton}
            aria-label="Next frame"
            title="Next frame"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => setMode(mode === 'stack' ? 'pause' : 'stack')}
            disabled={!frames}
            className={`${iconButton} ${mode === 'stack' ? 'text-[var(--text)]' : ''}`}
            aria-label="Stack all frames"
            title={mode === 'stack' ? 'Back to single frames' : 'Stack all 16 frames into one picture'}
            aria-pressed={mode === 'stack'}
          >
            <Layers className="h-4 w-4" aria-hidden="true" />
          </button>
        </span>
      </div>
      {/* Frame counter, then what the ink means: the picture has two tones
          and nothing else on the page says which is which. Wraps, never
          truncates. */}
      <figcaption className="mt-1 font-mono text-[11px] leading-relaxed tracking-[0.08em] text-[var(--text-tertiary)]">
        <span className="text-[var(--text)]">{frames ? frameText : 'waiting for the first run'}</span>
        {' '}· dark = brightness went up · faint = went down · one dot per pixel that changed
      </figcaption>
    </figure>
  )
}
