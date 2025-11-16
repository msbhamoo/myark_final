import { NextRequest, NextResponse } from 'next/server'
import { incrementView } from '@/lib/blogService'

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    await incrementView(slug)
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
