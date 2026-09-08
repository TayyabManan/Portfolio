/**
 * The two series keys the demo's charts use in their legends: a solid lime
 * stroke for the spiking network, a dashed ink stroke for the ordinary one.
 * Shared so a table header, a legend, and a readout all say "SNN" the same
 * way. Decorative: the text beside it carries the name.
 */
export const SERIES_STROKE = {
  snn: { stroke: 'var(--accent-ink)', dash: undefined },
  ann: { stroke: 'var(--text)', dash: '5 4' },
} as const

export default function SeriesKey({ kind, className }: { kind: 'snn' | 'ann'; className?: string }) {
  const s = SERIES_STROKE[kind]
  return (
    <svg
      width="18"
      height="6"
      viewBox="0 0 18 6"
      aria-hidden="true"
      className={`inline-block shrink-0 align-middle ${className ?? ''}`}
    >
      <path d="M1 3 H17" stroke={s.stroke} strokeWidth="2" strokeLinecap="round" strokeDasharray={s.dash} />
    </svg>
  )
}
