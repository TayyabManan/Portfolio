import { NextResponse } from 'next/server'
import { getAllProjectsFromMarkdown } from '@/lib/markdown'

export async function GET() {
  try {
    const projects = getAllProjectsFromMarkdown()
    return NextResponse.json(projects, {
      headers: {
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      },
    })
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}