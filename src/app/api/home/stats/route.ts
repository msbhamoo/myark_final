import { NextResponse } from 'next/server';
import { getHomeStats } from '@/lib/homeService';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const data = await getHomeStats();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to fetch home stats', error);
    return NextResponse.json({ stats: {} }, { status: 200 });
  }
}
