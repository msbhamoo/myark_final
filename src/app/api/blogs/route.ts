import { NextResponse } from 'next/server'
import { listPublishedBlogs } from '@/lib/blogService'

export async function GET() {
  try {
    const posts = await listPublishedBlogs()
    return NextResponse.json({ posts })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
