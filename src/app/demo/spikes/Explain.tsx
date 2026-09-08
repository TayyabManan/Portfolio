import type { ReactNode } from 'react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'

/**
 * "How is this calculated?" disclosure for the demo page. The FAQ's native
 * <details>/<summary> grammar (same chevron turn, same fade-in, same
 * hairline above the answer) without the card, so it can sit directly under
 * the figure it explains as one quiet mono line and cost nothing until
 * opened. Everything inside ships in the HTML.
 */
export default function Explain({
  summary,
  children,
  className,
}: {
  summary: string
  children: ReactNode
  className?: string
}) {
  return (
    <details className={`group ${className ?? ''}`}>
      <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 py-1 font-mono text-[11px] tracking-[0.08em] text-[var(--text-secondary)] transition-colors duration-200 hover:text-[var(--text)] [&::-webkit-details-marker]:hidden">
        <ChevronDownIcon
          aria-hidden="true"
          className="h-3.5 w-3.5 shrink-0 transition-transform duration-200 group-open:rotate-180"
        />
        <span>{summary}</span>
      </summary>
      <div className="mt-2 max-w-3xl space-y-3 border-t border-[var(--border)] pt-4 text-sm leading-relaxed text-[var(--text-secondary)] animate-in fade-in slide-in-from-top-1 duration-200 ease-out">
        {children}
      </div>
    </details>
  )
}
