# Design System

The visual language for this portfolio. Use this as the source of truth when adding or
editing UI. The goal is one cohesive product: every page should share the same tokens,
type scale, spacing rhythm, and component treatment.

---

## 1. Color tokens

Colors are **CSS custom properties** consumed in components as `bg-[var(--token)]`,
`text-[var(--token)]`, `border-[var(--token)]`, etc. The explicit `[var(--token)]`
arbitrary-value form is the codebase convention — do **not** introduce Tailwind `@theme`
color utilities (`bg-primary` and friends); one convention only.

### Source of truth

- **`src/app/globals.css` is canonical.** `:root` defines the light theme,
  `[data-theme="dark"]` defines the dark theme, and
  `@media (prefers-contrast: high)` overrides both for the OS high-contrast setting.
- **Theme switching only flips the `data-theme` attribute on `<html>`.** A pre-paint
  inline script in `src/app/layout.tsx` resolves `localStorage` / system preference (no
  flash of wrong theme); `applyTheme()` in `src/contexts/ThemeContext.tsx` flips the
  attribute on toggle. Neither writes token values.
- **`src/lib/themes.ts`** is a small mirror of the **light** palette for the rare non-CSS
  contexts (route metadata in `layout.tsx`, the self-contained `global-error.tsx`).
  If you change a color in `globals.css`, mirror it there.

### Token reference

| Token | Light | Dark | High-contrast | Role |
|---|---|---|---|---|
| `--primary` | `#292524` | `#e2ded9` | `#0000ff` | Primary action - **the ink** (ink-primary system, Aug 2026: interactive primary is the ink, not a hue; the identity is stone + ink + rationed lime). Softened one step from pure near-black after owner review - contrast lives in a window, not at its ceiling |
| `--primary-hover` | `#3f3b36` | `#d3cec8` | `#0000cc` | Primary hover - one surface step, never an opacity fade |
| `--primary-light` | `#e9e7e4` | `rgba(237,235,232,.14)` | `#e6e6ff` | Primary tint |
| `--on-primary` | `#fafaf9` | `#1c1917` | `#ffffff` | Label ON a primary fill. Buttons are foreground-on-background (Geist polarity pattern) - never hardcode `text-white` |
| `--background` | `#fafaf9` | `#1c1917` | `#ffffff` | Page background |
| `--background-secondary` | `#f5f5f4` | `#292524` | `#f0f0f0` | Card / panel surface |
| `--background-tertiary` | `#e7e5e4` | `#3b3835` | `#e0e0e0` | Subtle fills / hovers |
| `--text` | `#292524` | `#edebe8` | `#000000` | Primary text (light softened from #1c1917 - ~14.5:1, editorial band) |
| `--text-reading` | `#423d37` | `#cfcbc4` | `#000000` | **Long-form reading ink** (all markdown reading bodies - blog + project pages, ~10:1) - max contrast is a strain over thousands of words; UI text stays on `--text` |
| `--text-secondary` | `#57534e` | `#a8a29e` | `#1a1a1a` | Secondary / body text |
| `--text-tertiary` | `#78716c` | `#8f8a84` | `#333333` | Meta / muted (dark nudged lighter so 12-14px labels clear WCAG AA on #1c1917) |
| `--border` | `#d6d3d1` | `#3b3835` | `#000000` | Default border |
| `--border-hover` | `#a8a29e` | `#57534e` | `#333333` | Border hover (non-interactive) |
| `--success` | `#16a34a` | `#4ade80` | `#008000` | Success |
| `--error` | `#dc2626` | `#f87171` | `#cc0000` | Error |
| `--warning` | `#d97706` | `#fbbf24` | `#cc6600` | Warning |
| `--accent` | `#d9f21e` | `#d9f21e` | `#4d5e00` | Marker lime — the highlighter itself (swipes, doodle marks). Same lime in both themes. Never body text, never buttons/borders/focus outside the 404 |
| `--accent-ink` | `#4d5e00` | `#d9f21e` | `#3a4700` | Lime legible **as text**/stroke. Light needs a dark olive on near-white (6.9:1); dark can keep the bright marker lime on stone (14:1) |
| `--accent-contrast` | `#1c1917` | `#1c1917` | `#ffffff` | Text sitting **on solid lime** (the marker-highlight word) |
| `--accent-flood` | `#def33f` | `#2d330b` | `#ffffff` | 404 page surface — the one place lime floods |
| `--info` | `#3568d4` | `#5b8cdf` | `#0066cc` | Semantic info blue - **decoupled from `--primary`** in the ink migration; status use only |
| `--overlay` | `rgb(28 25 23 / .5)` | `rgba(0,0,0,.6)` | `rgb(0 0 0 / .6)` | Modal / menu scrim |

> `--accent` is the personality layer's **marker lime** (kill-boring pass) with a
> **closed budget** on normal pages — lime (bright `--accent`, or the legible
> `--accent-ink`) appears ONLY on: the hero `production` highlight, eyebrow index
> numerals, project-cover chart data ink (CoverChart — this slot absorbed the old
> metric-chip sparklines), the ScatterOutlier circle, and the HeroReadout
> chart line, the SNN data ink on the live-demo page (/demo/spikes: the spiking
> series in its charts, bars, and rasters), Education's home bullet markers, and the 404/500 hand-drawn
> ellipses — plus `::selection`, where the marker literally highlights
> selected text (background wash only, 45% light / 30% dark; foreground is
> never restyled). Anything else is a no. It floods only the 404 (`.flood-404` scope in
> globals.css, with local `--on-flood*` / `--flood-btn-*` vars per theme). `--info`
> is the semantic status blue (decoupled from primary); green/amber stay reserved
> for status semantics. JS mirror: `src/lib/themes.ts`.
>
> **`--accent` vs `--accent-ink` (owner-confirmed):** large marker surfaces/swipes
> use `--accent` (same vivid lime both themes). Anything small enough that raw lime
> would wash out on the light stone background — chart strokes, chip sparklines,
> eyebrow numerals, the readout line — uses `--accent-ink` (dark olive in light,
> bright lime in dark). Do not "fix" the light-mode olive back to bright lime; it was
> tried and reverted for exactly this reason.

### Tints

- Transparent fills and hovers use opacity modifiers: `bg-[var(--primary)]/10`,
  `border-[var(--success)]/30`, etc.
- `--primary-light` is the **solid** tint color — use it where transparency would stack
  wrong (e.g. a tinted fill that sits over another tint).

### Elevation & motion tokens

| Token | Notes |
|---|---|
| `--elevation-sm` / `--elevation-md` / `--elevation-lg` | Warm-tinted in light, heavier black in dark, strongest in high-contrast. Consumed by Tailwind's `shadow-sm/md/lg` utilities via the `@theme inline` block in `globals.css`. `shadow-xl` / `shadow-2xl` intentionally keep Tailwind defaults. |
| `--transition-speed` | `200ms` (global default for interactive elements) |
| `--transition-timing` | `cubic-bezier(0.4, 0, 0.2, 1)` |
| `--transition-duration-micro` | `150ms` — state decorations (icon swaps, chips, tooltips). Registered in `@theme static`, so `duration-micro` is a real utility and `animate-in/out` pick it up via `--tw-duration`. JS mirror: `src/lib/motion-tokens.ts`. |
| `--transition-duration-morph` | `300ms` — container height/size morphs (`duration-morph`) |
| `--ease-morph` | `cubic-bezier(0.32, 0.72, 0, 1)` — fast start, soft landing, for container morphs (`ease-morph`). Exits run ~30% faster with plain `ease-in` (bare `duration-100`/`duration-200`, deliberately not tokenized). |

---

## 2. Typography

Loaded via `next/font/google` in `src/app/layout.tsx` (self-hosted — no Google Fonts
preconnect needed); base rules in `globals.css`.

| Use | Family | Variable | Notes |
|---|---|---|---|
| Display / headings | Bricolage Grotesque | `--font-heading` | variable, **opsz axis loaded** (12–96): hero sizes get the display cut automatically |
| Body, UI **and reading** | Hanken Grotesk | `--font-body` | variable + italics; warm humanist grotesque (replaced Geist — borrowed Vercel identity, cool tone vs warm stone). Owner-decided (Aug 2026): one family for prose and chrome — the Newsreader serif experiment for articles was tried and retired |
| Annotations + code | IBM Plex Mono | `--font-plex-mono` | 400/500; engineering-document lineage (replaced Geist Mono with the body swap) |

> IBM Plex Mono is the **annotation voice**: section eyebrows (`Eyebrow.tsx`), doodle
> captions (`diverged`, `n=0`), cover metrics, and code blocks. The next/font
> variable is deliberately `--font-plex-mono` (not `--font-mono`): the Tailwind
> `@theme inline` keys `--font-mono` and `--font-sans` in globals.css map to the
> next/font variables, and naming both sides the same would make the emitted
> defaults self-referential. `preload: false` on mono — it sits below the fold;
> `code, pre` fall back to Consolas where body classes are absent (global-error).

Heading weights (globals.css): `h1, h2` **600**, `h3–h6` 500 — display weight is
capped at 600 (type reads heavier as it grows; Bricolage's ink traps shout at 700 ×
display sizes). 700 survives only at document scale (Resume's small headings) where
weight compensates for size — plus two owner-sacred brand marks outside the scale:
the footer wordmark (`font-extrabold`, untouchable) and the header logo lockup
(`font-bold`).
Headings: `letter-spacing: -0.02em` (h3–h6 `-0.01em`), `line-height: 1.2`, `text-wrap: balance`.
Body: `line-height: 1.6`, `text-wrap: pretty`.

### Reading typography (blog + project bodies)

Long-form bodies are set in **Hanken Grotesk on a 65ch measure** (one family
for prose and chrome — the Newsreader serif experiment was retired, see §2
table): wrapper `article-body max-w-[65ch] text-[1.0625rem] leading-[1.7]
text-[var(--text-reading)] lg:text-lg` — 17px rising to 18px on large
viewports (reading distance grows with the screen), leading 1.7 (a
large-x-height sans wants the top of the leading band), the dedicated reading
ink (~10:1 — softer than UI `--text`, darker than the old secondary gray),
left-aligned (justification retired), block paragraph spacing, **no indents**
(code blocks and lists reset indent logic). Paragraphs/lists inherit the
wrapper cascade; inline code scales at `0.85em`. In dark mode the
`.article-body` rule in globals.css raises the body to weight 440 (Hanken is
a variable font) — light-on-dark optically thins type; the rule was ported
from the retired serif because the reasoning is face-agnostic. Inside reading
bodies: headings stay Bricolage, tables return to `font-sans text-sm`, code
stays mono.

Post headers use the annotation voice for meta — one mono line
(`category · date · read time`, 11px uppercase) above the title, matching the
blog cards. No icon meta rows, no visible byline (the author lives in the
JSON-LD), and at most **three** tag chips.

**Project headers use the SAME grammar (review, Sep 2026):** mono eyebrow
(`category · month year`), title, the subtitle as the one lede,
the tech stack as a plain mono line (`React · Flask · …`, never a
disclosure or chip row), then the Live Demo / Source Code actions, then the
rule. The frontmatter `description` is SEO metadata only — it repeats the
body's Overview paragraph and is not rendered in the header. No "Featured"
pill, no calendar icon, no "N technologies" toggle.

**Breadcrumbs end in the page**, not its category: `Home › Projects ›
WaterTrace Pakistan`. The category already leads the eyebrow one line
below; a trail that ends in "Geospatial AI" on a project page is wayfinding
that lies. The current crumb truncates at `max-w-md`.

**One reading voice, everywhere (uniformity rule, Aug 2026):** every
markdown-rendered body — blog posts AND project pages — uses the same
treatment, supplied by `src/lib/reading-prose.tsx` (`READING_BODY_CLASS` +
`readingComponents()`, with optional heading ids for the blog TOC). Never
restyle prose inline in a page component — extend the shared module, so the
two surfaces cannot drift apart again. Sources: Butterick / Bringhurst 66ch,
iA 140% leading, Baymard 50–75 CPL.

### Links (ink-link grammar)

Text links share the ink, so **the underline is the affordance** (WCAG G183 —
color alone cannot distinguish same-ink links): `font-medium text-[var(--text)]
underline decoration-[var(--text)]/30 underline-offset-[0.15em]
hover:decoration-[var(--text)]` with a `text-decoration-color` transition
(GOV.UK offset, Medium hairline-then-strengthen). Applies to prose links and
standalone text links; nav/chrome links rely on position, cards on their border
gesture, section CTAs on the arrow.

### Type scale (apply these exact classes)

| Role | Classes |
|---|---|
| H1 — page title | `text-4xl sm:text-5xl font-semibold` |
| H1 — Hero only (intentionally oversized, fluid) | `text-[clamp(2.5rem,7.3vw,6.25rem)] font-semibold leading-[1.05]! tracking-[-0.02em]!` — owner taste call, deliberately under the 7.25rem measure-fill ceiling |
| H2 — section heading | `text-3xl sm:text-4xl font-semibold` |
| H2 — interior subsection (About page sections) | `text-2xl sm:text-3xl font-semibold` — display-size H2s on utility sections read as shouting |
| H3 — card title | `text-lg sm:text-xl font-semibold` |
| Page intro / subtitle | `text-lg sm:text-xl text-[var(--text-secondary)]` |
| Section intro | `text-base sm:text-lg text-[var(--text-secondary)]` |
| Card description / meta | `text-sm text-[var(--text-secondary)]` |

> The **Hero H1** is a sanctioned exception to the fixed scale — and since the
> home restructure it is **the claim, not the job title**: "I build ML systems
> that make it to production", with the marker swipe on the final word and the
> title demoted to the eyebrow ("Tayyab Manan · AI/ML Engineer" — no
> "Hello, I'm": template greetings read as generated). The homepage hero renders two responsive layouts
> (`src/components/sections/Hero.tsx`): **below `lg`** the single-column hero
> sets the claim at `text-4xl sm:text-6xl md:text-7xl font-semibold
> leading-[1.1]!` (this `<h1>` is the page's sole H1); **at `lg` and up** the
> editorial twin (a `<p>`) uses the fluid `clamp(2.5rem, 7.3vw, 6.25rem)`
> above across **two balanced lines with a manual `<br/>`**. The ceiling is
> **measured, not guessed**: line one runs ~10em in Hanken at −0.02em
> tracking, so 7.25rem is the largest cap that clears the container's 1216px
> inner width (~95% measure-fill) — but the shipped cap is the OWNER'S taste
> call at 6.25rem (~77% fill, Aug 2026); fill is the ceiling, not the target.
> Don't "round up" without re-measuring, and don't push it back to the ceiling.
> Leading 1.05 (display band); kicker rhythm is tight-above/air-below —
> eyebrow→headline `mt-4`, headline→meta `mt-7`. No other heading may use a
> fluid `clamp()` scale.
> The `!` on `leading`/`tracking` is required: the base `h1…h6` rule in `globals.css`
> (`line-height: 1.2; letter-spacing: -0.02em`) is unlayered and would otherwise win over
> the utilities. The tight `0.98` leading keeps the headline compact when it wraps.
>
> The Resume page is a deliberate exception: it uses a denser document scale
> (`text-lg` section headers / `text-base` entry titles / `text-sm` body & meta) inside a
> narrower `max-w-4xl` "paper" container. The 404/500 pages' oversized error codes
> (`text-6xl sm:text-7xl` / `text-6xl`) are also deliberate emphasis.

---

## 3. Layout & spacing

| Role | Classes |
|---|---|
| Full-page wrapper | `py-16 sm:py-24 min-h-[100dvh]` |
| Homepage section wrapper | `py-16 sm:py-24` |
| Container | `mx-auto max-w-7xl px-4 sm:px-6 lg:px-8` (Resume keeps `max-w-4xl`) |
| Card grid gap | `gap-8` |
| Large 2-column layout gap | `gap-12` (About bio/profile, Contact) |
| List spacing | `space-y-3` default · `space-y-2` dense meta · `space-y-4` paragraph blocks |
| Heading → intro | `mb-4` |
| Header block → grid | `mb-12` |

---

## 4. Components

### Card (the standard surface — calm since the Aug 2026 premium pass)

```
rounded-xl border border-[var(--border)] p-6 sm:p-8
transition-[border-color] duration-200 hover:border-[var(--primary)]   ← interactive cards only
```

- Background: `bg-[var(--background)]` or `bg-[var(--background-secondary)]`.
- **Depth is hairline + surface, never elevation theater.** No card lifts,
  grows a shadow, or zooms its imagery on hover — the old
  `hover:-translate-y-1 hover:shadow-lg` treatment is retired.
- **Interactive cards (Project, Blog)** get exactly one hover gesture: the
  border hairline turns `--primary`. The Project card's cover chart
  re-sketches (WAAPI) as part of that same gesture. Each card is a single
  link (stretched-link `::after` on the title for the Project card; the Blog
  card is one `<Link>`), with a `has-[a:focus-visible]` ring where the link
  is nested.
- **Non-interactive surfaces (Education, the Resume sheet)** are
  static ink: border + background, no hover styles at all — hover feedback on
  something that does nothing is noise.
- **Blog cards are text-first**: mono meta line (category · date), title,
  three-line description, mono read-time pinned to the bottom. No thumbnail —
  the screenshots live inside the posts as evidence.

### Project cover (`src/components/ui/ProjectCover.tsx`)

The card's image slot renders **composed DOM, not a screenshot**: an
`aspect-video` panel on `bg-[var(--background-secondary)]` with a hairline
`border-b`, containing the category (mono annotation voice, 11px/0.14em
uppercase), the project's notebook **CoverChart** (240×120, HeroReadout
anatomy: quiet `--text-tertiary` hand axes + data ink in `--accent-ink`),
and a bottom row with the real `metric:` (mono 12px, `tabular-nums`, real
content — never aria-hidden) against the chart's axis caption
(`COVER_CAPTIONS`, mono 11px). Cover text sits on `--background-secondary`,
where tertiary ink computes ~4.4:1 (under AA) — category and caption use
`--text-secondary`. Metrics carry their baseline or context
(`80% acc · 7 classes`, `79.5% win rate` against the `win rate vs base`
caption) — a bare accuracy number invites skepticism; the bottom row is
`flex-wrap` so the longest metric+caption pairs wrap instead of overflowing
at the narrowest 3-column band. Theme-aware for free; in print and
high-contrast the chart hides via `data-doodle` and the cover degrades to a
clean typographic panel. Frontmatter `metricChart` picks the drawing, so no
two covers repeat.

### Cover images (`scripts/generate-covers.mjs`)

`project.image` is an **art-directed 1600×900 cover image**, not a
screenshot — and since the evidence pass it is the **OG/social card only**,
never rendered in-page: on detail pages and blog posts it repeated the
header's title/subtitle/metric as pixels and outranked the real evidence by
position. Identity is the typographic header's job; proof is the evidence
figure's job; the cover's job is link unfurls. The template follows
the owner-made Urdu LLM cover — dark stone ground, drawn lime diamond + mono
eyebrow, big Bricolage title, subtitle, thin rule, real metric in lime, site +
repo footer — plus the project's notebook chart (the CoverChart vocabulary) as
the right-side art. Generated at build-author time by
`npm run generate:covers` (satori → resvg → sharp → WebP q82; static Fontsource
WOFFs, NOT Google css2 TTFs — those are variable and satori can't instance
them). Covers write to the same `public/projects/<slug>.webp` filenames the
frontmatter points at, so adding a project = one config entry in the script +
one run. `urdu-llm-fine-tuning.webp` is the owner-made original and is never
regenerated. Every metric/claim on a cover must be a real published figure.
Raw product screenshots, where they earn their place, belong inside
project/blog markdown bodies — never as the cover.

### Evidence figures (screenshots in reading bodies)

Product screenshots are the site's proof layer and live **inside project/blog
markdown bodies** (never as covers). Raw screenshots clashed with the ink
palette and were once removed wholesale — the fix is not filtering the
product (evidence must stay honest) but **containing** it: every body image
renders inside the ink mat via the shared `img` renderer in
`src/lib/reading-prose.tsx`:

- `<figure>` on `--background-secondary`, `rounded-xl`, hairline border —
  the mat mediates between the product's foreign palette and the page.
- The markdown **alt text renders as a mono annotation `<figcaption>`**
  (11px, tracking 0.08em, secondary ink, `aria-hidden` — the alt already
  speaks for screen readers). Caption voice: lowercase, terse, factual,
  `·` separators, real numbers only.
- A markdown **title of `"app"`** — `![caption](/path "app")` — adds the
  browser-chrome row: three hairline `border-hover` dots, monochrome,
  never traffic-light colors. Use it for windowed-app shots; charts, maps,
  and diagrams get the plain mat.
- Dark mode eases figures to `brightness(0.88)` (globals.css) so bright
  UIs don't glow like lightboxes on the dark stone; high contrast resets
  the filter. Brightness only — never tint evidence.
- Images must sit alone on their markdown line (the `p` renderer unwraps
  image-only paragraphs; figure-in-p is invalid HTML).

**Capture discipline:** shoot the product **doing its job** (a real answer
generated, a populated chart, live counts), never an empty landing state if
it can be helped; 1440×810 viewport at 2× (headless Chrome / puppeteer with
real waits for async data), banners dismissed with the privacy-preserving
choice; export 1600-wide WebP q82 to `public/projects/screens/<slug>.webp`.
Every number visible in a caption must be really on the screenshot.

### Radius scale

| Element type | Radius |
|---|---|
| Buttons, inputs, small utility surfaces | `rounded-lg` |
| Cards, dialogs, overlay panels | `rounded-xl` |
| Emphasis / CTA boxes, mobile menu sheet | `rounded-2xl` |
| Rectangular badges & chips | `rounded-md` |
| Tag pills, dots, avatars | `rounded-full` |
| Micro elements (kbd chips, inline code, < 24px) | `rounded` |

### Buttons (3 tiers)

| Tier | Classes | Use |
|---|---|---|
| Large / primary CTA | `px-6 sm:px-8 py-3 sm:py-4 rounded-lg` | Hero, page CTAs, form submit |
| Secondary CTA | `px-6 py-3 rounded-lg` | Supporting actions |
| Compact / utility | `px-4 py-2 rounded-lg` | Toolbar buttons, filters, download |

Primary fill: `bg-[var(--primary)] text-[var(--on-primary)] hover:bg-[var(--primary-hover)]` — ink button, label follows the polarity (light: ink/near-white; dark: near-white/ink).
Outline: `border border-[var(--border)] hover:border-[var(--primary)] hover:text-[var(--primary)]`
(1px hairline — `border-2` retired in the premium pass; the 2px weight
survives only where it's semantic: the high-contrast override and the 404
flood button).
Press feedback: `active:scale-[0.98]` with `transition-[background-color,transform]`.
Section-end CTAs are **quiet text links** on the grid's edge
(`All projects →`, primary color, arrow nudge on hover) — never a centered
filled button below a grid.

### Filter tabs (`src/components/ui/CategoryFilter.tsx`)

The projects and blog indexes filter with a **text tab strip** in the nav's
grammar: a hairline under the row, the active tab in `--text` with the same
2px `--primary` underline as the active nav link, the rest `--text-secondary`
inking on hover. One row, horizontally scrollable below `lg` (edge-bled by
`-mx-4 sm:-mx-6`, scrollbar hidden). Never filled chips — the old six-chip
row was the loudest element on the page and stacked three rows deep on a
phone before the first card.

### Hairline rows (Education / Experience / Certifications / home Background)

The one list grammar for résumé-shaped content: `border-t` per row, title
left with the mono period right (`sm:justify-between`), institution line,
optional one-line detail. No left rails, no timelines, no icon boxes, no
cards. Period ink is `--text-secondary` (tertiary at 12px falls under AA on
secondary surfaces).

### Contact page

Speaks the About/hero grammar: a `<dl>` of mono-eyebrow labels (Email /
Elsewhere / Where and when) over ink-link text, one availability sentence
above a hairline, and the form's hairline inputs directly on the page — no
icon-in-tinted-box rows, no bordered social squares, no card around the
form. The submit button is auto-width from `sm` up.

### Header chrome

The scrolled nav is an opaque hairline pill (`border` + `--background`) —
no shadow, no 95% opacity (page text bled through the Resume button
mid-scroll). Mark and wordmark keep one size in both states. Nav links
change **color only** on hover (no background tint, no shortcut tooltip —
keyboard shortcuts belong to the command palette); the active link carries
the 2px underline.

### Numbered index pills

A right-aligned rail of **content-hugging** rounded pills (the hero's desktop
focus-area index). Each pill is a link with a heading-font label and a trailing `↗`.
On hover/focus, a `--primary` fill (with a slightly arced, flat-bottomed cap)
**slides up from below** to cover the pill — carrying the project's real metric in
`--on-primary` — while the base label slides up and out and the pill **expands
leftward** from its rest width (full − 32px) to the rail's pinned full width, the
arrow fading in as one gesture. GSAP-driven, desktop / fine-pointer only, and
gated on `desktopMotionOK()` (see `src/components/sections/Hero.tsx`) — under
reduced motion the effect never arms and the pills keep their complete static
rest state (inset-ring hover still works; it's a CSS transition the global
gate zeroes to an instant swap).

Each pill has **three stacked copies** of the content:

```
// Rail:  ul.flex.w-fit.flex-col.gap-3 (GSAP pins the ul at its intrinsic px width)
// Pill (link):  group relative isolate ml-auto flex w-[calc(100%-2rem)] overflow-hidden
//               rounded-full px-5 py-3 shadow-[inset_0_0_0_1px_var(--border)]
//               hover:shadow-[inset_0_0_0_1px_var(--primary)]  (inset ring, not a border)
//
// 1. Sizer  — in-flow, `invisible`, aria-hidden. Stacks BOTH label and metric in one grid
//             cell so the pill sizes to the wider copy; the absolute layers can't resize it.
// 2. Base   — `absolute inset-0`, the visible/accessible label (+ hidden arrow). GSAP tweens
//             it `yPercent: -100` on hover (exits upward).
// 3. Fill   — `absolute inset-0`, `bg-[var(--primary)]` + the metric in `--on-primary`,
//             aria-hidden. Parked below (`yPercent: 100, y: 18`); GSAP tweens it to `0` to
//             cover. Its arced cap is a flat-bottomed dome (`border-radius:
//             50% 50% 0 0 / 100% 100% 0 0`, `bottom:calc(100%-1px)`). The row width tweens
//             rest → full and `[data-index-arrow]` fades/slides in, all in the same 0.32s.
//
// In/out use explicit tweens (not timeline.reverse) — both 0.32s power3.out — so the fill
// enters and exits at the same speed. Animated layers carry `will-change-transform`.
```

### Motion

Three tiers, each with its own engine — and ONE reduced-motion stance
(compliance pass, Aug 2026): **every tier honors the OS setting.** The CSS
tier is zeroed by the global gate; the JS tiers check `motionOK()`
(`src/lib/motion-tokens.ts`) at bind/play time, because inline WAAPI/GSAP
styles are outside the CSS rule's reach. The old deliberate bypass is
retired — the owner's want-motion-despite-RM preference is now the
`localStorage 'motion'='always'` override, toggled from the command palette
("Enable Motion", shown only to reduced-motion users). Every gated surface
must stay fully functional motionless: end states stand alone, charts render
complete, swaps are instant.

| Tier | Engine | Numbers | Reduced motion |
|---|---|---|---|
| Feedback micro-interactions (icon swaps, popover/banner entrances, form errors, height morphs) | Plain CSS (`duration-micro`/`duration-morph`, `ease-morph`, `animate-in/out`) | micro 150ms ease-out · morph 300ms ease-morph · exits ~30% faster ease-in · staggers 30–80ms/item | **Zeroed** by the global gate — every end state must stand alone as an instant snap |
| Status/signature JS motion (nav underline handoff, toast lifecycle morph, palette row cascade) | GSAP (`src/lib/gsap.ts` loaders, `desktopMotionOK()`-gated) or WAAPI `el.animate` (zero bundle, works on mobile; `motionOK()`-gated) | same bands as above | **Honored** — gates skip binding; instant end states |
| Scroll reveals / grid morphs | GSAP `MOTION` tokens (`power3.out`, 0.6/0.55s, stagger 0.1) | see `src/lib/gsap.ts` | **Honored** — content is never hidden, so nothing reveals: it's simply visible |

Duration ladder within CSS work: `duration-75` keyboard-selection feedback (palette —
deliberate sub-band exception so the highlight tracks held arrow-key repeats),
`duration-micro` (150ms) state decorations, `duration-200` interactive default
(`--transition-speed`), `duration-morph` (300ms) container morphs, `duration-300`
image zooms/overlays.

Rules: animate height only via `grid-template-rows 0fr↔1fr` (+ `overflow-hidden
min-h-0` inner) or transform — never `top/left/max-height`. Enumerate transition
properties; no new `transition-all`. `data-essential-motion` is for status
indication only (census: chat dots, toast loading spinner — the hero entrance
lost its exemption in the compliance pass; it was decorative) — a frozen
spinner reads as a stalled request. No framer-motion anywhere in ClientLayout's tree (Header, Footer,
Toast, OfflineBanner, CommandPalette) — it would enter every route's First Load JS.
Exit-capable conditional UI uses `useMountTransition` (`src/hooks/`) +
`data-[state=open/closed]:animate-in/out`. Icons that swap state carry
`.icon-swap-in` + a `key` so the remount replays the pop.

Toast enter/exit animations use `tw-animate-css` classes (`animate-in` / `animate-out`,
imported in `globals.css`); the in-place `sending → sent/failed` morph
(`toast.promise`) is WAAPI in `ToastItem`.

#### Keyframe boards (state names match the code)

- **Theme toggle** — `moon-resting` ⇄ `sun-resting`: stacked icons counter-rotate ±90° while cross-fading, 150ms; driven by `[data-theme]` CSS so pre-hydration state is correct (`Header.tsx` + globals.css).
- **Contact banner** — `closed → open → closed`: grid row 0fr→1fr + fade 300ms ease-morph; close 200ms ease-in; content retained via `lastStatus`; `inert` when closed.
- **Inline field error** — `absent → error-resting → absent`: fade + 4px slide-down on mount 150ms; removal instant (clearing negative feedback shouldn't linger).
- **Share popover** — `closed → open → closed`: fade+zoom 0.95 from bottom-right 150ms; exit 100ms ease-in then unmount (`useMountTransition`).
- **BackToTop** — `hidden ⇄ visible`: always mounted; fade + 8px rise 200ms; hidden is unfocusable/click-through.
- **OfflineBanner** — `absent → open → closed`: slide up from bottom edge 300ms; exit 200ms ease-in then unmount.
- **Copy buttons (CodeBlock, ShareButtons)** — `idle → copied → idle`: icon remount pop via `.icon-swap-in`, 150ms; reverts after 2s.
- **Tech-stack collapse** — `collapsed ⇄ expanded`: grid row morph 300ms ease-morph / 200ms ease-in; chevron keeps its 200ms rotate.
- **FAQ** — `closed ⇄ open`: chevron rotate 200ms; answer fade+slide 200ms; height morph is an `interpolate-size` progressive enhancement (Chromium-only).
- **Nav underline** — `rest → handoff-out → handoff-in → rest'`: old bar scaleX→0 120ms ease-in toward the new link; new bar scaleX→1 180ms power3.out from the facing side, +60ms; GSAP `loadCore()`, desktop-only, `clearProps` at rest (`useNavUnderline.ts`).
- **Toast lifecycle** — `hidden → sending → sent|failed → dismissed`: one Radix Root updated in place (`toast.promise`); height morph 300ms ease-morph + content rise 180ms via WAAPI; icon pop on variant change; auto-dismiss 5s after settle.
- **Palette rows** — `shell-open → populating → settled`: first 10 rows rise 4px + fade, 150ms each, 30ms stagger, first open only; filtering never staggers.
- **Hero focus readout** (`HeroReadout.tsx`, desktop `xl:` beside the pill index) — `hidden → drawn → morphing → hidden`. At rest the panel is `opacity:0` (empty). Pointer/focus on a pill fades the panel in (WAAPI) while the pen draws that area's notebook chart left-to-right (`strokeDashoffset`); moving to another pill MorphSVGs the single data line into the next chart (0.55s power2.inOut) and crossfades the scatter dots; leaving the stack fades the panel out, keeping its last contents. `d` is React-rendered once, then owned imperatively (setAttribute / MorphSVG) so re-renders never fight the tween. Fail-visible: no MorphSVG chunk → hard-swap. Charts map area→shape: CV→accuracy curve, Production→win-rate bars, Geospatial→regression scatter (the only one with dots), Neuromorphic→two
  crossing accuracy lines (the study's `crossing` cover chart). Kept deliberately clean — a detailed-charts variant was built and reverted.

### Personality layer (kill-boring pass)

One recurring motif — **lab-notebook plot doodles** (`src/components/effects/NotebookDoodles.tsx`:
ScatterOutlier, CoverChart (+ COVER_CAPTIONS), EmptyAxes, DivergedCurve,
Scatter404 — unused doodles are deleted, not kept in reserve). One pen: 1–1.5px `currentColor` strokes, round caps, wobble baked into the
path literals (never runtime randomness — hydration), `vector-effect: non-scaling-stroke`,
`aria-hidden` + `data-doodle` (hidden in print and high-contrast).

Hard rules:
- **Placement**: only in already-empty whitespace, absolutely positioned or trailing
  in-flow; max ONE doodle per viewport on normal pages; never inside `[data-reveal]`
  nodes (their transforms create a containing block). Current census: hero focus
  index (HeroReadout — hidden at rest; hovering a pill draws that area's notebook
  chart beside the stack and GSAP-MorphSVG morphs the data line between charts;
  loader `loadMorphSVG()` in gsap.ts), about header (ScatterOutlier), project-card
  covers (CoverChart per frontmatter `metricChart`, WAAPI re-sketch on card
  hover — card imagery, so exempt from the one-per-viewport cap), empty states
  (EmptyAxes + `n=0`), 500 (DivergedCurve + `diverged`),
  404 (Scatter404 + `you are here (n=1)`). The owner cut the footer/section-chrome
  AxisTicks after review: ambient ruler-ticks read as rendering glitches. A doodle
  must be anchored to a real block (index, card, empty state) — never free-floating
  page chrome.
- **Opacity ceilings**: `.doodle` = 0.55 light / 0.42 dark. Full-pressure ink only on
  the 404; the 500 runs a deliberately calmer raised tertiary at 0.70 (errors should
  feel calm). (`.doodle` is unlayered — a Tailwind opacity utility will NOT override it;
  set color/opacity directly when deviating, as the 500 page does.)
- **Motion is interaction-only**: placed/ambient doodles are static ink and never
  animate on load or scroll. The only two that move do so on interaction — the
  HeroReadout morphs its chart on pill hover (GSAP MorphSVG via `loadMorphSVG()`,
  desktop `xl:` only) and project-cover CoverCharts re-sketch on card hover
  (WAAPI); both honor reduced motion via `motionOK()` (charts render complete
  either way - the animation is only a flourish). WiggleLine stays the only
  *ambient* living line.
- **Sterile zones**: resume page, blog article bodies, project detail bodies, contact form.
- **Copy discipline**: annotations ≤3 words, mono, lowercase.
- **No handwriting fonts** — the hand-drawn feel lives exclusively in the SVG paths.
- The `.marker-highlight` word ("production", the hero **headline** on both
  breakpoints since the home restructure) is the single normal-page lime
  moment; high contrast flattens it to an underline.
- Eyebrows (`src/components/ui/Eyebrow.tsx`): mono 11px/500, uppercase, tracking .16em,
  numbered on home only (`01 / SELECTED WORK` · `02 / WRITING` · `03 / BACKGROUND` —
  the home FAQ left in the restructure; contact/about keep theirs); a `<p>`, never a heading.
- Project-cover metrics read from frontmatter `metric:` — real published numbers
  only. Each cover picks its notebook chart via frontmatter `metricChart`
  (scatter-fit / bars-up / bars-down / hbars / accuracy / coverage / roc /
  line), so no two covers share a drawing. **Where a real published series
  exists, the chart plots it**: `bars-up` is the Urdu win-rate progression
  (v1 51.5% / v2 66% / v3 79.5%) and `bars-down` is TeacherRank's bundle
  before/after (450KB→180KB), proportions baked into the path literals with
  the wobble (hydration rule — never runtime randomness). Variants without a
  published series stay stylized and decorative; do not invent data points
  for them. The metric text is real content (not aria-hidden). See "Project
  cover" in §4.

### Z-index ladder (fixed/floating chrome)

| Layer | Value |
|---|---|
| Mobile menu sheet | `95` (inline style in Header) |
| Header, toast viewport, resume chatbot | `z-[100]` |
| Offline banner | `z-[110]` |
| Command palette, keyboard-shortcuts modal (topmost) | `z-[120]` |

### Overlays / scrims

Use the themed token, never raw black:
```
bg-[var(--overlay)]
```
Applied to the command palette, mobile menu, and keyboard-shortcuts modal.

---

## 5. Rules

1. **Always use tokens.** No raw hex / `rgb()` / Tailwind palette colors (`text-gray-500`,
   `bg-slate-900`) in components — they bypass the theme and break dark mode.
   Known exceptions: third-party brand marks (Reddit orange in ShareButtons) and `global-error.tsx` (which sources its inline styles from
   `themes.light` because it replaces the root layout).
2. **Scrims use `--overlay`**, not `bg-black/xx`.
3. **`globals.css` is canonical** for theme values; `src/lib/themes.ts` only mirrors the
   light palette for non-CSS contexts (see §1).
4. **Match the scale.** New headings/cards/buttons should reuse the exact class strings above
   rather than inventing one-off sizes.
5. **Accessibility is baked in** (globals.css): 44px min touch targets, `:focus-visible`
   outline using `--primary`, high-contrast token overrides, and `prefers-reduced-motion`
   handling — don't remove these.
