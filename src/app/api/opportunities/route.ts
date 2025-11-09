import { NextRequest, NextResponse } from 'next/server';
import { getOpportunities } from '@/lib/opportunityService';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const segment = searchParams.get('segment') ?? undefined;
    const category = searchParams.get('category') ?? undefined;
    const search = searchParams.get('search') ?? undefined;
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? Math.min(parseInt(limitParam, 10) || 24, 100) : undefined;

    const data = await getOpportunities({ segment, category, search, limit });

    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to fetch opportunities', error);
    return NextResponse.json({ error: 'Failed to fetch opportunities' }, { status: 500 });
  }
}
