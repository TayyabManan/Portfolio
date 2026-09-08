import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { rateLimit } from '@/lib/rate-limit'

/**
 * Proxy for the "Do spikes fail differently?" live demo. The models run on
 * Modal (D:\Projects\SNNs\scripts\step9_demo_api.py); this route adds the
 * shared key server-side, so the Modal URL is never free compute for whoever
 * reads the page source, and keeps the CSP's connect-src at 'self'. Same
 * shape as the chatbot route: rate limit, zod, upstream, mapped errors.
 *
 *   GET  /api/spikes  -> upstream /health (a warm-up ping; wakes the container)
 *   POST /api/spikes  -> upstream /run
 */

export const runtime = 'nodejs'
// A cold container restores from a memory snapshot in a few seconds; a
// warm run is ~1-2 s on CPU. 60 s leaves room for a cold image pull.
export const maxDuration = 60

const runSchema = z.object({
  sample: z.number().int().min(0).max(32),
  kind: z.enum(['clean', 'drop', 'noise', 'occlude', 'tshuffle']).default('clean'),
  level: z.number().int().min(0).max(4).default(0),
  seed: z.number().int().min(0).max(999_999).default(0),
})

function upstream() {
  const url = process.env.SPIKES_API_URL
  if (!url) return null
  return { base: url.replace(/\/+$/, ''), key: process.env.SPIKES_API_KEY ?? '' }
}

async function forward(path: string, init: RequestInit, timeoutMs: number) {
  const target = upstream()
  if (!target) {
    return NextResponse.json({ error: 'The demo backend is not configured.' }, { status: 503 })
  }
  try {
    const res = await fetch(`${target.base}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        'X-Demo-Key': target.key,
        ...(init.headers ?? {}),
      },
      signal: AbortSignal.timeout(timeoutMs),
      cache: 'no-store',
    })
    if (res.status === 401) {
      return NextResponse.json({ error: 'The demo backend rejected the key.' }, { status: 502 })
    }
    if (!res.ok) {
      return NextResponse.json({ error: `The demo backend answered ${res.status}.` }, { status: 502 })
    }
    return NextResponse.json(await res.json())
  } catch (err) {
    const name = (err as { name?: string })?.name
    const msg = name === 'TimeoutError' || name === 'AbortError'
      ? 'The demo backend took too long to wake up. Try again in a few seconds.'
      : 'The demo backend is unreachable right now.'
    return NextResponse.json({ error: msg }, { status: 503 })
  }
}

export async function GET(req: NextRequest) {
  const limit = await rateLimit(req, { windowMs: 60 * 1000, maxRequests: 30 })
  if (!limit.success) {
    return NextResponse.json({ error: 'Too many requests.' }, { status: 429 })
  }
  return forward('/health', { method: 'GET' }, 55_000)
}

export async function POST(req: NextRequest) {
  const limit = await rateLimit(req, { windowMs: 60 * 1000, maxRequests: 40 })
  if (!limit.success) {
    return NextResponse.json(
      { error: 'Too many runs in a minute. Give it a moment.', retryAfter: limit.reset },
      {
        status: 429,
        headers: { 'Retry-After': String(Math.ceil((limit.reset - Date.now()) / 1000)) },
      }
    )
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 })
  }
  const parsed = runSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid run request.' }, { status: 400 })
  }

  return forward('/run', { method: 'POST', body: JSON.stringify(parsed.data) }, 55_000)
}
