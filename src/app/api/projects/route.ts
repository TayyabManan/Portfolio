import { NextResponse } from 'next/server'
import { getAllProjectsFromMarkdown } from '@/lib/markdown'

export async function GET() {
  try {
    const projects = getAllProjectsFromMarkdown()
    return NextResponse.json(projects, {
      headers: {
        'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
      },
    })
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}