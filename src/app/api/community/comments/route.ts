/**
 * API Route: POST/GET /api/community/comments
 * GET: Fetch comments for an opportunity with pagination
 * POST: Create a new comment on an opportunity
 * Query params (GET):
 *   - opportunityId: ID of the opportunity (required)
 *   - limit: Number of comments to fetch (default: 20, max: 100)
 *   - offset: Pagination offset (default: 0)
 *   - sortBy: Sort order 'recent' or 'oldest' (default: 'recent')
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  getComments,
  createComment,
  verifyUserAuth,
} from '@/lib/communityService';

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

    const limit = Math.min(
      parseInt(searchParams.get('limit') ?? '20', 10) || 20,
      100,
    );
    const offset = Math.max(parseInt(searchParams.get('offset') ?? '0', 10) || 0, 0);
    const sortBy = (searchParams.get('sortBy') ?? 'recent') as 'recent' | 'oldest';

    const result = await getComments(opportunityId, limit, offset, sortBy);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Failed to fetch comments', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 },
    );
  }
}

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
    let userEmail: string | null;
    try {
      const auth = await verifyUserAuth(token);
      userId = auth.uid;
      userEmail = auth.email;
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

    const { opportunityId, content, userName } = body;

    if (!opportunityId || typeof opportunityId !== 'string' || opportunityId.trim().length === 0) {
      return NextResponse.json(
        { error: 'opportunityId is required and must be a non-empty string' },
        { status: 400 },
      );
    }

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'content is required and must be a non-empty string' },
        { status: 400 },
      );
    }

    const displayName = typeof userName === 'string'
      ? userName.trim()
      : userEmail?.split('@')[0] ?? 'Anonymous User';

    if (displayName.length === 0) {
      return NextResponse.json(
        { error: 'A valid user name or email is required' },
        { status: 400 },
      );
    }

    // Create comment
    const comment = await createComment(
      userId,
      userEmail ?? 'anonymous@example.com',
      displayName,
      opportunityId,
      content,
    );

    return NextResponse.json({
      success: true,
      comment,
    }, { status: 201 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Failed to create comment', error);

    // Return appropriate status code based on error type
    if (errorMessage.includes('exceeds maximum length')) {
      return NextResponse.json(
        { error: errorMessage },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 },
    );
  }
}
