import { NextRequest, NextResponse } from 'next/server'
import { createBlog, listAllBlogs } from '@/lib/blogService'
import { requireAdminSession } from '@/lib/adminSession'

export async function GET() {
  try {
    const posts = await listAllBlogs()
    return NextResponse.json({ posts })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    requireAdminSession(req)
    const body = await req.json()
    const post = await createBlog(body)
    return NextResponse.json({ post })
  } catch (e: any) {
    const status = e?.message === 'Unauthorized' ? 401 : 500
    return NextResponse.json({ error: e.message }, { status })
  }
}
