/**
 * Community Interactions Firebase Service
 * Server-side service for managing upvotes, comments, and community data
 * Uses Firebase Admin SDK for secure operations
 */

import {
  getDb,
  getAdminAuth,
} from './firebaseAdmin';
import type {
  Upvote,
  UpvoteStats,
  Comment,
  CommentListResponse,
  CommunityCounts,
} from '@/types/community';
import { Timestamp, FieldValue } from 'firebase-admin/firestore';

const UPVOTES_COLLECTION = 'communityUpvotes';
const COMMENTS_COLLECTION = 'communityComments';

/**
 * Convert Firestore timestamp to ISO string
 */
const toIsoString = (value: unknown): string => {
  if (typeof value === 'string') {
    return value;
  }
  if (value instanceof Timestamp) {
    return value.toDate().toISOString();
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  return new Date().toISOString();
};

/**
 * Verify user is authenticated
 */
export const verifyUserAuth = async (
  token: string,
  expectedUid?: string,
): Promise<{ uid: string; email: string | null }> => {
  try {
    const auth = getAdminAuth();
    const decodedToken = await auth.verifyIdToken(token);

    if (expectedUid && decodedToken.uid !== expectedUid) {
      throw new Error('Token UID does not match expected UID');
    }

    return {
      uid: decodedToken.uid,
      email: decodedToken.email ?? null,
    };
  } catch (error) {
    throw new Error(`Authentication failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Check if a user has upvoted an opportunity
 */
export const getUserUpvoteStatus = async (
  userId: string,
  opportunityId: string,
): Promise<boolean> => {
  const db = getDb();
  const query = await db
    .collection(UPVOTES_COLLECTION)
    .where('userId', '==', userId)
    .where('opportunityId', '==', opportunityId)
    .limit(1)
    .get();

  return !query.empty;
};

/**
 * Get total upvote count for an opportunity
 */
export const getUpvoteCount = async (opportunityId: string): Promise<number> => {
  const db = getDb();
  const query = await db
    .collection(UPVOTES_COLLECTION)
    .where('opportunityId', '==', opportunityId)
    .count()
    .get();

  return query.data().count;
};

/**
 * Get upvote statistics for an opportunity (with optional user status)
 */
export const getUpvoteStats = async (
  opportunityId: string,
  userId?: string,
): Promise<UpvoteStats> => {
  const [totalCount, userHasUpvoted] = await Promise.all([
    getUpvoteCount(opportunityId),
    userId ? getUserUpvoteStatus(userId, opportunityId) : Promise.resolve(false),
  ]);

  return {
    opportunityId,
    totalCount,
    userHasUpvoted,
  };
};

/**
 * Add an upvote for a user on an opportunity
 */
export const addUpvote = async (
  userId: string,
  opportunityId: string,
): Promise<UpvoteStats> => {
  const db = getDb();

  // Check if already upvoted
  const existing = await getUserUpvoteStatus(userId, opportunityId);
  if (existing) {
    return getUpvoteStats(opportunityId, userId);
  }

  const upvoteRef = db.collection(UPVOTES_COLLECTION).doc();
  const upvote: Upvote = {
    userId,
    opportunityId,
    createdAt: new Date().toISOString(),
  };

  await upvoteRef.set(upvote);

  return getUpvoteStats(opportunityId, userId);
};

/**
 * Remove an upvote for a user on an opportunity
 */
export const removeUpvote = async (
  userId: string,
  opportunityId: string,
): Promise<UpvoteStats> => {
  const db = getDb();

  const query = await db
    .collection(UPVOTES_COLLECTION)
    .where('userId', '==', userId)
    .where('opportunityId', '==', opportunityId)
    .get();

  const batch = db.batch();
  query.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });

  await batch.commit();

  return getUpvoteStats(opportunityId, userId);
};

/**
 * Create a new comment on an opportunity or blog
 */
export const createComment = async (
  userId: string,
  userEmail: string,
  userName: string,
  entityId: string,
  content: string,
  entityType: 'opportunity' | 'blog' = 'opportunity',
): Promise<Comment> => {
  const db = getDb();

  if (!content || content.trim().length === 0) {
    throw new Error('Comment content cannot be empty');
  }

  const sanitizedContent = content.trim();
  if (sanitizedContent.length > 5000) {
    throw new Error('Comment content exceeds maximum length of 5000 characters');
  }

  const commentRef = db.collection(COMMENTS_COLLECTION).doc();
  const now = new Date().toISOString();

  const comment: Comment = {
    id: commentRef.id,
    userId,
    userEmail,
    userName,
    opportunityId: entityId, // Keep field name for backward compatibility
    entityType, // New field to distinguish between opportunities and blogs
    content: sanitizedContent,
    createdAt: now,
    isOfficial: false,
    isDeleted: false,
  };

  await commentRef.set(comment);

  return comment;
};

/**
 * Get comments for an opportunity or blog with pagination
 */
export const getComments = async (
  entityId: string,
  limit: number = 20,
  offset: number = 0,
  sortBy: 'recent' | 'oldest' = 'recent',
  entityType: 'opportunity' | 'blog' = 'opportunity',
): Promise<CommentListResponse> => {
  const db = getDb();

  if (limit <= 0 || limit > 100) {
    limit = 20;
  }

  if (offset < 0) {
    offset = 0;
  }

  try {
    // First, try with composite index (if available)
    try {
      // Build query based on entity type
      // For opportunities, also match comments without entityType (backward compatibility)
      let baseQuery = db
        .collection(COMMENTS_COLLECTION)
        .where('opportunityId', '==', entityId)
        .where('isDeleted', '==', false);

      // For blogs, filter only blog comments
      if (entityType === 'blog') {
        baseQuery = baseQuery.where('entityType', '==', 'blog');
      }

      // Get total count
      const countQuery = await baseQuery.count().get();
      const total = countQuery.data().count;

      // Get paginated results with composite index
      let query = baseQuery;

      // Sort
      const orderBy = sortBy === 'recent' ? 'desc' : 'asc';
      query = query.orderBy('createdAt', orderBy);

      const comments = await query.offset(offset).limit(limit).get();

      return {
        comments: comments.docs.map((doc) => ({
          ...doc.data(),
          createdAt: toIsoString(doc.data().createdAt),
          updatedAt: doc.data().updatedAt ? toIsoString(doc.data().updatedAt) : undefined,
        } as Comment)),
        total,
        limit,
        offset,
      };
    } catch (indexError: unknown) {
      // If composite index is missing, fall back to simple query
      const errorMessage = indexError instanceof Error ? indexError.message : String(indexError);
      if (errorMessage.includes('index') || errorMessage.includes('FAILED_PRECONDITION')) {
        console.warn('Composite index not available. Using fallback query.', indexError);

        // Fallback: Get all active comments and filter/sort in-memory
        let fallbackQuery = db
          .collection(COMMENTS_COLLECTION)
          .where('opportunityId', '==', entityId)
          .where('isDeleted', '==', false);

        if (entityType === 'blog') {
          fallbackQuery = fallbackQuery.where('entityType', '==', 'blog');
        }

        const allDocs = await fallbackQuery.get();

        const allComments = allDocs.docs
          .map((doc) => ({
            ...doc.data(),
            createdAt: toIsoString(doc.data().createdAt),
            updatedAt: doc.data().updatedAt ? toIsoString(doc.data().updatedAt) : undefined,
          } as Comment))
          .sort((a, b) => {
            const timeA = new Date(a.createdAt).getTime();
            const timeB = new Date(b.createdAt).getTime();
            return sortBy === 'recent' ? timeB - timeA : timeA - timeB;
          });

        const paginatedComments = allComments.slice(offset, offset + limit);

        return {
          comments: paginatedComments,
          total: allComments.length,
          limit,
          offset,
        };
      }
      throw indexError;
    }
  } catch (error: unknown) {
    console.error('Error fetching comments:', error);
    throw error;
  }
};

/**
 * Update a comment (for official responses or edits)
 */
export const updateComment = async (
  commentId: string,
  updates: Partial<Pick<Comment, 'content' | 'isOfficial' | 'officialReplyTo'>>,
  userId?: string,
): Promise<Comment> => {
  const db = getDb();
  const docRef = db.collection(COMMENTS_COLLECTION).doc(commentId);
  const doc = await docRef.get();

  if (!doc.exists) {
    throw new Error('Comment not found');
  }

  const comment = doc.data() as Comment;

  // If updating content, verify ownership (or admin/organizer status would go here)
  if (updates.content && userId && comment.userId !== userId) {
    throw new Error('You can only edit your own comments');
  }

  const updateData: Record<string, unknown> = {
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  await docRef.update(updateData);

  const updated = await docRef.get();
  const updatedComment = updated.data() as Comment;

  return {
    ...updatedComment,
    createdAt: toIsoString(updatedComment.createdAt),
    updatedAt: toIsoString(updatedComment.updatedAt),
  };
};

/**
 * Soft delete a comment
 */
export const deleteComment = async (
  commentId: string,
  userId: string,
): Promise<void> => {
  const db = getDb();
  const docRef = db.collection(COMMENTS_COLLECTION).doc(commentId);
  const doc = await docRef.get();

  if (!doc.exists) {
    throw new Error('Comment not found');
  }

  const comment = doc.data() as Comment;

  // Verify ownership (or admin status would go here)
  if (comment.userId !== userId) {
    throw new Error('You can only delete your own comments');
  }

  await docRef.update({
    isDeleted: true,
    updatedAt: new Date().toISOString(),
  });
};

/**
 * Get community engagement counts for an opportunity
 */
export const getCommunityCounts = async (
  opportunityId: string,
): Promise<CommunityCounts> => {
  const [upvoteCount, commentCountResult] = await Promise.all([
    getUpvoteCount(opportunityId),
    getComments(opportunityId, 1, 0).then((result) => result.total),
  ]);

  return {
    opportunityId,
    upvotes: upvoteCount,
    comments: commentCountResult,
  };
};

/**
 * Get a specific comment by ID
 */
export const getCommentById = async (commentId: string): Promise<Comment | null> => {
  const db = getDb();
  const doc = await db.collection(COMMENTS_COLLECTION).doc(commentId).get();

  if (!doc.exists) {
    return null;
  }

  const comment = doc.data() as Comment;
  return {
    ...comment,
    createdAt: toIsoString(comment.createdAt),
    updatedAt: comment.updatedAt ? toIsoString(comment.updatedAt) : undefined,
  };
};
