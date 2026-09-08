'use client'

import { SPIKES_BANK, SPIKES_CLASS_NAMES } from '@/lib/spikes-demo-data'

/**
 * Step 01: the eleven gestures, each shown by its first bank recording as
 * an ink thumbnail (an alpha-only PNG of event density masked over the
 * page's text ink, so one file reads in both themes). Step 03 offers the
 * three recordings of the chosen gesture beside the player. Selection is
 * the inset ring the hero's index pills use.
 */

const THUMB_DIR = '/demo/spikes/thumbs'

function Thumb({ index, className }: { index: number; className?: string }) {
  const url = `url(${THUMB_DIR}/${index}.png)`
  return (
    <span
      aria-hidden="true"
      className={`block bg-[var(--text)] ${className ?? ''}`}
      style={{
        WebkitMaskImage: url,
        maskImage: url,
        WebkitMaskSize: 'contain',
        maskSize: 'contain',
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
        maskPosition: 'center',
      }}
    />
  )
}

interface GesturePickerProps {
  /** selected class 0..10 */
  selected: number
  onSelect: (label: number) => void
}

export function GesturePicker({ selected, onSelect }: GesturePickerProps) {
  return (
    <div role="group" aria-label="Gesture" className="grid grid-cols-3 gap-x-3 gap-y-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-11">
      {SPIKES_CLASS_NAMES.map((name, c) => {
        const active = selected === c
        return (
          <button
            key={name}
            type="button"
            onClick={() => onSelect(c)}
            aria-pressed={active}
            className="group flex min-w-0 flex-col items-stretch gap-2 text-left"
          >
            <span
              className={`block aspect-square rounded-md border bg-[var(--background-secondary)] p-1.5 transition-[border-color,box-shadow] duration-200 ${
                active
                  ? 'border-[var(--primary)] shadow-[inset_0_0_0_1px_var(--primary)]'
                  : 'border-[var(--border)] group-hover:border-[var(--border-hover)]'
              }`}
            >
              <Thumb index={c * 3} className="h-full w-full" />
            </span>
            <span
              className={`text-xs leading-snug ${active ? 'font-medium text-[var(--text)]' : 'text-[var(--text-secondary)] group-hover:text-[var(--text)]'}`}
            >
              {name}
            </span>
          </button>
        )
      })}
    </div>
  )
}

interface RecordingPickerProps {
  /** selected bank index 0..32 */
  selected: number
  onSelect: (index: number) => void
}

export function RecordingPicker({ selected, onSelect }: RecordingPickerProps) {
  const label = Math.floor(selected / 3)
  const recordings = SPIKES_BANK.filter((s) => s.label === label)
  return (
    <div role="group" aria-label="Recording" className="flex items-end gap-3">
      {recordings.map((s, i) => {
        const active = selected === s.index
        return (
          <button
            key={s.index}
            type="button"
            onClick={() => onSelect(s.index)}
            aria-pressed={active}
            aria-label={`Recording ${i + 1} of ${SPIKES_CLASS_NAMES[label]}, test sample ${s.testId}`}
            className="flex flex-col items-center gap-1.5"
          >
            <span
              className={`block h-11 w-11 rounded-md border bg-[var(--background-secondary)] p-1 transition-[border-color,box-shadow] duration-200 ${
                active
                  ? 'border-[var(--primary)] shadow-[inset_0_0_0_1px_var(--primary)]'
                  : 'border-[var(--border)] hover:border-[var(--border-hover)]'
              }`}
            >
              <Thumb index={s.index} className="h-full w-full" />
            </span>
            <span className={`font-mono text-[10px] tracking-[0.08em] ${active ? 'text-[var(--text)]' : 'text-[var(--text-tertiary)]'}`}>
              #{s.testId}
            </span>
          </button>
        )
      })}
    </div>
  )
}
