import { NextRequest, NextResponse } from 'next/server'
import { incrementShare } from '@/lib/blogService'
import { ShareCounts } from '@/types/blog'

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    const { network } = await req.json()
    if (!['facebook','twitter','linkedin','whatsapp','other'].includes(network)) {
      return NextResponse.json({ error: 'Invalid network' }, { status: 400 })
    }
    await incrementShare(slug, network as keyof ShareCounts)
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
