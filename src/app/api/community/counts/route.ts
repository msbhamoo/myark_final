/**
 * API Route: GET /api/community/counts
 * Get aggregated community counts (upvotes and comments) for an opportunity
 * Query params:
 *   - opportunityId: ID of the opportunity (required)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCommunityCounts } from '@/lib/communityService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const opportunityId = searchParams.get('opportunityId');

    if (!opportunityId || opportunityId.trim().length === 0) {
      return NextResponse.json(
        { error: 'opportunityId query parameter is required' },
        { status: 400 },
      );
    }

    const counts = await getCommunityCounts(opportunityId);

    return NextResponse.json(counts);
  } catch (error) {
    console.error('Failed to fetch community counts', error);
    return NextResponse.json(
      { error: 'Failed to fetch community counts' },
      { status: 500 },
    );
  }
}
