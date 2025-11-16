import { NextRequest, NextResponse } from 'next/server'
import { getBlogBySlug } from '@/lib/blogService'

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    const post = await getBlogBySlug(slug)
    if (!post || post.status !== 'published') return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ post })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
