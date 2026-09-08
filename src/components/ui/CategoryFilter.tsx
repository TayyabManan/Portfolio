'use client'

interface CategoryFilterProps {
  categories: string[]
  selected: string
  onSelect: (category: string) => void
  /** Optional display transform (e.g. blog capitalizes its lowercase categories). */
  formatLabel?: (category: string) => string
  /** Accessible group name; the indexes keep the default. */
  label?: string
  /** Extra wrapper classes (the demo page overrides the index margin). */
  className?: string
}

/**
 * Category filter shared by the projects and blog grids. Pure presentation -
 * each page supplies its own onSelect (both wrap the FLIP capture();
 * projects also resets pagination).
 *
 * A text tab strip in the header nav's grammar (review 2026-09-03): the
 * active filter carries the same 2px ink underline as the active nav link,
 * the rest are secondary text that inks on hover. The old row of six FILLED
 * chips was the heaviest element on either index and stacked three rows
 * deep on a phone before the first card. One row, horizontally scrollable
 * on narrow screens (edge-bled so the strip runs to the viewport edge like
 * the nav does), scrollbar hidden - the strip's own hairline is the rail.
 */
export default function CategoryFilter({ categories, selected, onSelect, formatLabel, label = 'Filter by category', className }: CategoryFilterProps) {
  return (
    // py-1 on the scroll container: overflow-x:auto makes it clip on BOTH
    // axes, and the global focus ring draws 2px outside the button with a 2px
    // offset - without vertical room the ring's top and bottom edges were
    // clipped away (review 2026-09-03).
    <div className={`-mx-4 -my-1 mb-11 overflow-x-auto px-4 py-1 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${className ?? ''}`}>
      <div
        role="group"
        aria-label={label}
        className="flex w-max min-w-full gap-6 border-b border-[var(--border)] sm:gap-8"
      >
        {categories.map((category) => {
          const active = selected === category
          return (
            // The unlayered `button { min-width: 44px }` rule in globals.css
            // beats any width utility, so a short label ("All") would sit
            // centered in a 44px box, inset from the heading's left edge, with
            // a 44px underline. The label span owns the padding and the
            // underline instead: text-left keeps the label flush, the bar
            // spans the word, and the 44px box stays as the touch target.
            <button
              key={category}
              type="button"
              onClick={() => onSelect(category)}
              aria-pressed={active}
              className={`relative -mb-px flex items-start whitespace-nowrap text-left text-sm font-medium transition-colors sm:text-base ${
                active
                  ? 'text-[var(--text)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text)]'
              }`}
            >
              <span className="relative inline-block py-3">
                {formatLabel ? formatLabel(category) : category}
                {/* Underline bar rendered for every tab; the active one is
                    drawn (class-driven, SSR-correct) - same bar as the nav. */}
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
      </div>
    </div>
  )
}
