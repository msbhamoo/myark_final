/**
 * API Route: GET /api/community/upvotes
 * Get upvote statistics for an opportunity
 * Query params:
 *   - opportunityId: ID of the opportunity
 */

import { NextRequest, NextResponse } from 'next/server';
import { getUpvoteStats } from '@/lib/communityService';

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

    // Extract user ID from Authorization header if present
    const authHeader = request.headers.get('Authorization');
    let userId: string | undefined;

    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      try {
        // In a real app, you'd verify the token here
        // For now, we'll let the client pass the userId if authenticated
        userId = searchParams.get('userId') ?? undefined;
      } catch (error) {
        // Token invalid, proceed without user context
      }
    }

    const stats = await getUpvoteStats(opportunityId, userId);

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Failed to fetch upvote stats', error);
    return NextResponse.json(
      { error: 'Failed to fetch upvote statistics' },
      { status: 500 },
    );
  }
}
