/**
 * Project cover generator - renders the art-directed cover images used by
 * project detail heroes, blog post headers, and OG/social cards.
 *
 * The template follows the owner-made Urdu LLM cover (the reference, which
 * this script deliberately does NOT regenerate): dark stone ground, mono
 * eyebrow, big Bricolage title, thin rule, real metric - plus this site's
 * own twist, the project's notebook chart (same vocabulary as CoverChart /
 * HeroReadout) as the right-side art in marker lime.
 *
 * Pipeline: satori (layout + fonts -> SVG) -> resvg (SVG -> PNG) -> sharp
 * (PNG -> WebP, q82) -> public/projects/<slug>.webp. Same filenames the
 * frontmatter already points at, so no code changes are ever needed.
 *
 * Run: npm run generate:covers   (network needed: fonts fetched from Google)
 * New project: add a config entry below and run again.
 */
import satori from 'satori'
import { Resvg } from '@resvg/resvg-js'
import sharp from 'sharp'
import { writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'

const OUT_DIR = 'public/projects'
const W = 1600
const H = 900

// ---------------------------------------------------------------------------
// Palette (mirrors globals.css dark theme - covers commit to the dark look,
// like the Urdu original, so they hold on any surface they're embedded in)
const INK = '#edebe8'
const INK_2 = '#a8a29e'
const INK_3 = '#78716c'
const AXIS = '#8f8a84'
const LIME = '#d9f21e'
const RULE = '#57534e'

// ---------------------------------------------------------------------------
// Per-project covers. Every number and claim comes from the project's own
// frontmatter/content - real published figures only (house rule).
const PROJECTS = [
  {
    slug: 'watertrace',
    eyebrow: 'GEOSPATIAL AI / 2002–2024 SATELLITE RECORD',
    title: 'WaterTrace',
    subtitle: 'Groundwater prediction for Pakistan from GRACE & GLDAS satellite data.',
    metric: 'R²=0.89',
    metricLabel: '· 145 districts forecast',
    chart: 'scatter-fit',
    repo: 'github.com/TayyabManan/WaterTrace',
  },
  {
    slug: 'us-visa-prediction',
    eyebrow: 'MACHINE LEARNING & MLOPS / 5-STAGE PIPELINE',
    title: 'Visa Prediction',
    subtitle: 'PERM outcome prediction that explains every decision with SHAP.',
    metric: '73.2% acc',
    metricLabel: '· threshold-tuned boosting',
    chart: 'hbars',
    repo: 'github.com/TayyabManan/US-Visa-Prediction',
  },
  {
    slug: 'face-expression-detection',
    eyebrow: 'COMPUTER VISION / RESNET-18 · RAF-DB',
    title: 'Face Expression',
    subtitle: 'Emotion recognition in group photos, served with PyTorch & Flask.',
    metric: '80% acc',
    metricLabel: '· live demo on Hugging Face',
    chart: 'accuracy',
    repo: 'github.com/TayyabManan/Face-Expression-Detection',
  },
  {
    slug: 'teacher-rank',
    eyebrow: 'WEB APPLICATION / REACT · SUPABASE',
    title: 'TeacherRank',
    subtitle: 'Structured student reviews for smarter course registration.',
    metric: '−60% bundle',
    metricLabel: '· bundle size',
    chart: 'bars-down',
    repo: 'github.com/TayyabManan/TeacherRank',
  },
  {
    slug: 'do-spikes-fail-differently',
    eyebrow: 'NEUROMORPHIC COMPUTING / SNN VS ANN · DVS128GESTURE',
    title: 'Do Spikes Fail Differently?',
    subtitle: 'A spiking network and its ReLU twin, matched in everything but the neuron.',
    metric: '+28 pts under noise',
    metricLabel: '· 18.7x energy on paper',
    chart: 'crossing',
    repo: 'tayyabmanan.com/demo/spikes',
  },
  {
    slug: 'ev-analysis',
    eyebrow: 'GEOSPATIAL AI / LAHORE SITE SELECTION',
    title: 'EV Suitability',
    subtitle: 'Charging-station siting from weighted spatial & demographic scoring.',
    metric: '90%+ coverage',
    metricLabel: '· weighted scoring',
    chart: 'coverage',
    repo: 'github.com/TayyabManan/ev-suitability-analysis',
  },
]

// ---------------------------------------------------------------------------
// Notebook charts - the CoverChart vocabulary (240x120 space) rendered as a
// standalone SVG data URI. Hand axes in quiet ink, data in marker lime.
const CHART_BODIES = {
  'scatter-fit': `
    <path d="M40 84 C100 62 160 36 222 15" stroke="${LIME}" stroke-width="1.9" fill="none" stroke-linecap="round"/>
    <g fill="${LIME}">
      <circle cx="56" cy="78" r="3.4"/><circle cx="84" cy="56" r="3.4"/>
      <circle cx="112" cy="64" r="3.4"/><circle cx="144" cy="40" r="3.4"/>
      <circle cx="176" cy="45" r="3.4"/><circle cx="206" cy="22" r="3.4"/>
    </g>`,
  'bars-up': `
    <g stroke="${LIME}" stroke-width="4" fill="none" stroke-linecap="round">
      <path d="M60 92 C60.4 84 59.7 74 60 66"/><path d="M104 92 C104.4 78 103.6 60 104 48"/>
      <path d="M148 92 C148.5 70 147.6 46 148 32"/><path d="M192 92 C192.4 60 191.5 32 192 14"/>
    </g>`,
  'bars-down': `
    <g stroke="${LIME}" stroke-width="4" fill="none" stroke-linecap="round">
      <path d="M60 92 C60.3 66 59.7 34 60 16"/><path d="M104 92 C104.3 72 103.7 52 104 42"/>
      <path d="M148 92 C148.4 80 147.6 68 148 62"/><path d="M192 92 C192.3 86 191.7 80 192 76.5"/>
    </g>`,
  hbars: `
    <g stroke="${LIME}" stroke-width="4" fill="none" stroke-linecap="round">
      <path d="M38 32 C84 31.4 130 32.5 176 31.8"/><path d="M38 58 C68 57.5 98 58.4 128 57.9"/>
      <path d="M38 84 C96 83.3 154 84.4 208 83.6"/>
    </g>`,
  accuracy: `
    <path d="M38 88 C56 85 68 40 100 30 C136 20 180 17 220 15.5" stroke="${LIME}" stroke-width="2.1" fill="none" stroke-linecap="round"/>`,
  coverage: `
    <path d="M38 78 C50 73 62 65 74 62 C92 57.5 104 60 122 52 C146 41.5 170 38 222 33 L222 96 L38 96 Z" fill="${LIME}" fill-opacity="0.13"/>
    <path d="M38 78 C50 73 62 65 74 62 C92 57.5 104 60 122 52 C146 41.5 170 38 222 33" stroke="${LIME}" stroke-width="2.1" fill="none" stroke-linecap="round"/>`,
  // SNN vs ANN accuracy under event noise (the spikes study): the ANN falls
  // steadily in quiet ink, the SNN holds and dips late in lime; they cross.
  crossing: `
    <path d="M40 17 C68 22 100 40 132 52 C162 62 194 70 222 76" stroke="${AXIS}" stroke-width="1.6" fill="none" stroke-linecap="round" opacity="0.85"/>
    <path d="M40 24 C80 24.5 130 25.5 172 31 C194 34.5 210 42 222 50" stroke="${LIME}" stroke-width="2.3" fill="none" stroke-linecap="round"/>`,
}

function chartDataUri(variant) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 120">
  <g stroke="${AXIS}" stroke-width="1.1" opacity="0.65" fill="none" stroke-linecap="round">
    <path d="M28 10 C27.5 40 27.8 72 27.4 100"/>
    <path d="M23 96.5 C80 95.8 160 96.6 228 95.7"/>
    <path d="M24.6 36 L31.2 35.6" stroke-width="0.9"/>
    <path d="M24.2 66.5 L30.8 66.9" stroke-width="0.9"/>
    <path d="M85 94 L84.6 100" stroke-width="0.9"/>
    <path d="M150 94.4 L150.5 100.2" stroke-width="0.9"/>
    <path d="M205 93.8 L205.3 99.6" stroke-width="0.9"/>
  </g>
  ${CHART_BODIES[variant]}
</svg>`
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`
}

// ---------------------------------------------------------------------------
// Fonts: static WOFF instances from Fontsource's CDN. NOT Google's css2 TTFs -
// those are variable fonts, which satori cannot instance (titles silently
// rendered at the default weight instead of 600). Static files are exact.
async function fetchFont(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Font fetch failed ${res.status}: ${url}`)
  return Buffer.from(await res.arrayBuffer())
}

const FONTSOURCE = 'https://cdn.jsdelivr.net/npm'

async function loadFonts() {
  const [bricolage600, hanken400, plex400, plex500] = await Promise.all([
    fetchFont(`${FONTSOURCE}/@fontsource/bricolage-grotesque@5/files/bricolage-grotesque-latin-600-normal.woff`),
    fetchFont(`${FONTSOURCE}/@fontsource/hanken-grotesk@5/files/hanken-grotesk-latin-400-normal.woff`),
    fetchFont(`${FONTSOURCE}/@fontsource/ibm-plex-mono@5/files/ibm-plex-mono-latin-400-normal.woff`),
    fetchFont(`${FONTSOURCE}/@fontsource/ibm-plex-mono@5/files/ibm-plex-mono-latin-500-normal.woff`),
  ])
  return [
    { name: 'Bricolage Grotesque', data: bricolage600, weight: 600, style: 'normal' },
    { name: 'Hanken Grotesk', data: hanken400, weight: 400, style: 'normal' },
    { name: 'IBM Plex Mono', data: plex400, weight: 400, style: 'normal' },
    { name: 'IBM Plex Mono', data: plex500, weight: 500, style: 'normal' },
  ]
}

// ---------------------------------------------------------------------------
// Layout (satori object-JSX; every multi-child div must be display:flex)
const el = (type, style, children) => ({ type, props: { style, children } })
const txt = (style, s) => el('div', { display: 'flex', ...style }, s)

function coverTree(p) {
  return el(
    'div',
    {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      padding: '76px 84px 64px',
      background: 'radial-gradient(circle at 28% 18%, #221e1c 0%, #1c1917 52%, #161311 100%)',
      fontFamily: 'Hanken Grotesk',
    },
    [
      // Eyebrow (diamond is drawn, not typed - Plex Mono has no U+25C6)
      el('div', { display: 'flex', alignItems: 'center', gap: '22px' }, [
        el(
          'div',
          {
            display: 'flex',
            width: '17px',
            height: '17px',
            backgroundColor: LIME,
            transform: 'rotate(45deg)',
          },
          undefined
        ),
        txt(
          {
            color: INK_2,
            fontFamily: 'IBM Plex Mono',
            fontWeight: 500,
            fontSize: '27px',
            letterSpacing: '7px',
          },
          p.eyebrow
        ),
      ]),

      // Middle: title/subtitle left, notebook chart right
      el(
        'div',
        { display: 'flex', flex: 1, alignItems: 'center', gap: '70px', marginTop: '10px' },
        [
          el('div', { display: 'flex', flexDirection: 'column', flex: 1 }, [
            txt(
              {
                fontFamily: 'Bricolage Grotesque',
                fontWeight: 600,
                fontSize: '116px',
                lineHeight: 1.02,
                letterSpacing: '-2.5px',
                color: INK,
              },
              p.title
            ),
            txt(
              {
                marginTop: '30px',
                fontSize: '33px',
                lineHeight: 1.45,
                color: INK_2,
                maxWidth: '660px',
              },
              p.subtitle
            ),
          ]),
          {
            type: 'img',
            props: { src: chartDataUri(p.chart), width: 560, height: 280 },
          },
        ]
      ),

      // Rule + metric
      el('div', { display: 'flex', flexDirection: 'column' }, [
        el('div', { display: 'flex', width: '560px', height: '1px', backgroundColor: RULE }, undefined),
        el('div', { display: 'flex', alignItems: 'baseline', gap: '20px', marginTop: '26px' }, [
          txt(
            { fontFamily: 'IBM Plex Mono', fontWeight: 500, fontSize: '37px', color: LIME },
            p.metric
          ),
          txt(
            { fontFamily: 'IBM Plex Mono', fontSize: '29px', color: INK_2 },
            p.metricLabel
          ),
        ]),
      ]),

      // Footer
      el(
        'div',
        {
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '54px',
          fontFamily: 'IBM Plex Mono',
          fontSize: '24px',
          color: INK_3,
        },
        [txt({}, 'tayyabmanan.com'), txt({}, p.repo)]
      ),
    ]
  )
}

// ---------------------------------------------------------------------------
async function main() {
  console.log('Fetching fonts...')
  const fonts = await loadFonts()
  await mkdir(OUT_DIR, { recursive: true })

  // Optional slug filter: `node scripts/generate-covers.mjs <slug>` renders
  // one cover without touching the others' files.
  const only = process.argv[2]
  const targets = only ? PROJECTS.filter((p) => p.slug === only) : PROJECTS
  if (only && targets.length === 0) throw new Error(`no cover config for slug ${only}`)

  for (const p of targets) {
    const svg = await satori(coverTree(p), { width: W, height: H, fonts })
    const png = new Resvg(svg, { fitTo: { mode: 'width', value: W } }).render().asPng()
    const out = path.join(OUT_DIR, `${p.slug}.webp`)
    await writeFile(out, await sharp(png).webp({ quality: 82 }).toBuffer())
    console.log('wrote', out)
  }
  console.log(`Done - ${targets.length} cover(s) generated (urdu-llm-fine-tuning.webp is the owner-made original, untouched).`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
