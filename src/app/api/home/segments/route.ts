import { NextResponse } from 'next/server';
import { getHomeSegments } from '@/lib/homeService';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const items = await getHomeSegments();
    return NextResponse.json({ items });
  } catch (error) {
    console.error('Failed to fetch home segments', error);
    return NextResponse.json({ error: 'Failed to fetch home segments' }, { status: 500 });
  }
}
