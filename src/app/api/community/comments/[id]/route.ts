/**
 * API Route: PUT/DELETE /api/community/comments/[id]
 * PUT: Update a comment (for official responses or edits)
 * DELETE: Delete a comment (soft delete)
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  updateComment,
  deleteComment,
  getCommentById,
  verifyUserAuth,
} from '@/lib/communityService';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function PUT(
  request: NextRequest,
  { params }: RouteParams,
) {
  try {
    const commentId = params.id;

    if (!commentId || commentId.trim().length === 0) {
      return NextResponse.json(
        { error: 'Comment ID is required' },
        { status: 400 },
      );
    }

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

    const { content, isOfficial, officialReplyTo } = body;

    const updates: Record<string, unknown> = {};

    if (content !== undefined) {
      if (typeof content !== 'string' || content.trim().length === 0) {
        return NextResponse.json(
          { error: 'content must be a non-empty string' },
          { status: 400 },
        );
      }
      updates.content = content;
    }

    if (isOfficial !== undefined) {
      updates.isOfficial = Boolean(isOfficial);
    }

    if (officialReplyTo !== undefined) {
      updates.officialReplyTo = officialReplyTo;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'At least one field must be updated' },
        { status: 400 },
      );
    }

    // Update comment
    const updated = await updateComment(commentId, updates, userId);

    return NextResponse.json({
      success: true,
      comment: updated,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Failed to update comment', error);

    if (errorMessage.includes('not found')) {
      return NextResponse.json(
        { error: errorMessage },
        { status: 404 },
      );
    }

    if (errorMessage.includes('can only')) {
      return NextResponse.json(
        { error: errorMessage },
        { status: 403 },
      );
    }

    return NextResponse.json(
      { error: 'Failed to update comment' },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams,
) {
  try {
    const commentId = params.id;

    if (!commentId || commentId.trim().length === 0) {
      return NextResponse.json(
        { error: 'Comment ID is required' },
        { status: 400 },
      );
    }

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

    // Delete comment
    await deleteComment(commentId, userId);

    return NextResponse.json({
      success: true,
      message: 'Comment deleted successfully',
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Failed to delete comment', error);

    if (errorMessage.includes('not found')) {
      return NextResponse.json(
        { error: errorMessage },
        { status: 404 },
      );
    }

    if (errorMessage.includes('can only')) {
      return NextResponse.json(
        { error: errorMessage },
        { status: 403 },
      );
    }

    return NextResponse.json(
      { error: 'Failed to delete comment' },
      { status: 500 },
    );
  }
}
