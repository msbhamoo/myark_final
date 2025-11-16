import { NextRequest, NextResponse } from 'next/server'
import { deleteBlog, getBlogById, updateBlog } from '@/lib/blogService'
import { requireAdminSession } from '@/lib/adminSession'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const post = await getBlogById(id)
    if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ post })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    requireAdminSession(req)
    const { id } = await params
    const body = await req.json()
    const post = await updateBlog(id, body)
    if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ post })
  } catch (e: any) {
    const status = e?.message === 'Unauthorized' ? 401 : 500
    return NextResponse.json({ error: e.message }, { status })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    requireAdminSession(req)
    const { id } = await params
    await deleteBlog(id)
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    const status = e?.message === 'Unauthorized' ? 401 : 500
    return NextResponse.json({ error: e.message }, { status })
  }
}
