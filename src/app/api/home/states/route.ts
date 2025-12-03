import { NextResponse } from 'next/server';
import { getHomeStates } from '@/lib/homeService';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const items = await getHomeStates();
    return NextResponse.json({ items });
  } catch (error) {
    console.error('Failed to fetch state opportunities', error);
    return NextResponse.json({ error: 'Failed to fetch state opportunities' }, { status: 500 });
  }
}
