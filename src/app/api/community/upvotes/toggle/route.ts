/**
 * API Route: POST /api/community/upvotes/toggle
 * Toggle upvote for an authenticated user on an opportunity
 * Body:
 *   - opportunityId: ID of the opportunity
 *   - action: 'upvote' | 'remove'
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyUserAuth, addUpvote, removeUpvote } from '@/lib/communityService';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization header with Bearer token is required' },
        { status: 401 },
      );
    }

    const token = authHeader.substring(7);

    // Verify authentication
    let userId: string;
    try {
      const auth = await verifyUserAuth(token);
      userId = auth.uid;
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 },
      );
    }

    // Parse request body
    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 },
      );
    }

    const { opportunityId, action } = body;

    if (!opportunityId || typeof opportunityId !== 'string' || opportunityId.trim().length === 0) {
      return NextResponse.json(
        { error: 'opportunityId is required and must be a non-empty string' },
        { status: 400 },
      );
    }

    if (!action || !['upvote', 'remove'].includes(action as string)) {
      return NextResponse.json(
        { error: 'action must be either "upvote" or "remove"' },
        { status: 400 },
      );
    }

    // Process upvote/remove
    let upvoteStats;
    try {
      if (action === 'upvote') {
        upvoteStats = await addUpvote(userId, opportunityId);
      } else {
        upvoteStats = await removeUpvote(userId, opportunityId);
      }
    } catch (error) {
      console.error('Failed to toggle upvote', error);
      return NextResponse.json(
        { error: 'Failed to process upvote request' },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      upvoteStats,
      message: action === 'upvote' ? 'Upvote added successfully' : 'Upvote removed successfully',
    });
  } catch (error) {
    console.error('Upvote toggle endpoint error', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 },
    );
  }
}
