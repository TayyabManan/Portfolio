# tayyabmanan.com

Source for my portfolio: seven ML projects with live demos, the write-ups behind them, a resume, and a live experiment you can run from the browser. Built with Next.js and deployed on Vercel.

Live site: [tayyabmanan.com](https://tayyabmanan.com)

## What is here

- **Projects.** Seven case studies in `content/projects/`, each with a headline metric, a notebook-style cover chart, a live demo, and a repo link. The index filters by domain.
- **Writing.** Six long-form posts in `content/blog/`, with a table of contents, code highlighting, and FAQ and HowTo structured data from the frontmatter.
- **Live demo.** `/demo/spikes` runs the spiking-vs-ReLU study from [do-spikes-fail-differently](https://github.com/TayyabManan/do-spikes-fail-differently) on real event-camera recordings. The page calls a Modal backend through a server-side proxy that holds the key.
- **Resume.** Rendered in the browser, downloadable as a PDF, with an assistant that answers questions about it from the OpenAI API.
- **Contact.** A form with validation, a rate limit per IP, a honeypot field, and a push notification on submission.
- **Chrome.** Light and dark themes, a command palette on Ctrl+K or Cmd+K, and a design system with a hand-drawn chart motif. Every animation honors the reduced-motion setting.

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15.5, App Router, React 19, TypeScript in strict mode |
| Styling | Tailwind CSS v4 over CSS custom-property tokens |
| Motion | CSS for feedback, GSAP and the Web Animations API for signature moments, scroll reveals on the home page |
| Content | Markdown with gray-matter frontmatter, rendered by react-markdown and remark-gfm |
| Forms and APIs | react-hook-form, zod, an in-memory rate limiter, Radix Toast |
| Integrations | OpenAI (resume assistant), Modal (demo backend), ntfy.sh (contact notifications), Vercel Analytics and Speed Insights |
| Hosting | Vercel, deployed from `main` |

## Running it locally

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

The site runs without any environment variables. Each integration switches on when its variable is set and degrades to a clear message when it is not.

| Variable | Used by |
|---|---|
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Search Console verification tag |
| `OPENAI_API_KEY` | `/api/chatbot`, the resume assistant. Server-side only. |
| `NTFY_TOPIC` | `/api/contact`, push notification on a new message |
| `SPIKES_API_URL`, `SPIKES_API_KEY` | `/api/spikes`, the proxy to the demo backend. Server-side only. |

Scripts:

| Command | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint with the Next.js config |
| `npm run generate:covers` | Render the project cover images. Pass a slug to render one. |
| `npm run generate:favicons` | Render the favicon set from the logo |

## Layout

```
content/
  projects/         one markdown file per project
  blog/             one markdown file per post
public/
  projects/         cover images (generated) and evidence screenshots
  demo/             assets for the live demo
  llms.txt          a plain-text index of the site for language models
scripts/            cover and favicon generators (satori, resvg, sharp)
src/
  app/              routes, API routes under app/api, metadata, sitemap
  components/       layout, home sections, ui, effects (doodles, hero readout)
  lib/              markdown loader, validation, rate limiting, demo data
  contexts/, hooks/ theme, command palette, mount transitions
DESIGN_SYSTEM.md    tokens, type scale, component and motion rules
```

## Adding a project or a post

A project is one markdown file in `content/projects/`. The frontmatter carries the card: `title`, `subtitle`, `description`, `category`, `metric`, `metricChart`, `techStack`, `image`, `demoUrl`, `githubUrl`, `featured`, `date`. The home page shows the three newest featured projects. Two conventions matter:

- `metric` is a real published figure with its context, for example `79.5% win vs base` rather than a bare percentage.
- `image` is the Open Graph cover. Add an entry to `scripts/generate-covers.mjs` and run the generator; do not hand a screenshot to this field. Screenshots and figures go in `public/projects/screens/` and are placed in the markdown body, where they render inside a captioned frame.

A post is one markdown file in `content/blog/` with `title`, `description`, `date`, `category`, `tags`, `image`, `readTime`, and optional `faqs` and `howTo` blocks that become structured data.

`DESIGN_SYSTEM.md` is the source of truth for anything visible. Read it before adding UI.

## Security

Security headers and a Content Security Policy are set in `next.config.ts`. Every API route validates its input with zod and rate limits per IP. Keys for OpenAI and the demo backend never reach the browser; the demo page talks only to its same-origin proxy. The contact form carries a honeypot field. Third-party scripts are limited to Google Analytics and Vercel's analytics.

## License

Released under CC0 1.0. See `LICENSE`.
