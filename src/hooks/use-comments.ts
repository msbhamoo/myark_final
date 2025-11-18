/**
 * Hook: useComments
 * Manages comment state and mutations for an opportunity
 * Handles loading, error states, pagination, and sorting
 */

'use client';

import { useState, useCallback, useEffect } from 'react';
import type { Comment, CommentListResponse } from '@/types/community';
import { useAuth } from '@/context/AuthContext';

export interface UseCommentsOptions {
  limit?: number;
  initialOffset?: number;
  sortBy?: 'recent' | 'oldest';
  autoFetch?: boolean;
}

export const useComments = (
  opportunityId: string,
  options: UseCommentsOptions = {},
) => {
  const { user, getIdToken } = useAuth();
  const {
    limit = 20,
    initialOffset = 0,
    sortBy = 'recent',
    autoFetch = true,
  } = options;

  const [comments, setComments] = useState<Comment[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(initialOffset);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch comments
  const fetchComments = useCallback(
    async (pageOffset: number = initialOffset) => {
      try {
        setError(null);
        setLoading(true);

        const params = new URLSearchParams({
          opportunityId,
          limit: Math.min(limit, 100).toString(),
          offset: Math.max(pageOffset, 0).toString(),
          sortBy,
        });

        const response = await fetch(`/api/community/comments?${params}`);

        if (!response.ok) {
          throw new Error('Failed to fetch comments');
        }

        const data = (await response.json()) as CommentListResponse;
        setComments(data.comments);
        setTotal(data.total);
        setOffset(data.offset);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred';
        setError(errorMessage);
        console.error('Failed to fetch comments', err);
      } finally {
        setLoading(false);
      }
    },
    [opportunityId, limit, sortBy, initialOffset],
  );

  // Initial fetch
  useEffect(() => {
    if (autoFetch) {
      fetchComments();
    }
  }, [autoFetch, fetchComments]);

  // Create comment
  const postComment = useCallback(
    async (content: string, userName?: string): Promise<Comment | null> => {
      if (!user) {
        setError('You must be logged in to post a comment');
        return null;
      }

      setIsSubmitting(true);
      try {
        setError(null);
        const token = await getIdToken();

        if (!token) {
          throw new Error('Failed to get authentication token');
        }

        const response = await fetch('/api/community/comments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            opportunityId,
            content,
            userName: userName || user.displayName || 'Anonymous',
          }),
        });

        if (!response.ok) {
          const errorData = (await response.json()) as Record<string, unknown>;
          throw new Error(
            typeof errorData.error === 'string'
              ? errorData.error
              : 'Failed to post comment',
          );
        }

        const data = (await response.json()) as { comment: Comment };
        const newComment = data.comment;

        // Update state with new comment
        setComments((prevComments) => {
          // Only prepend if we're on the first page and sorting by recent
          if (offset === 0 && sortBy === 'recent') {
            return [newComment, ...prevComments];
          }
          return prevComments;
        });

        setTotal((prevTotal) => prevTotal + 1);

        return newComment;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred';
        setError(errorMessage);
        console.error('Failed to post comment', err);
        return null;
      } finally {
        setIsSubmitting(false);
      }
    },
    [opportunityId, user, getIdToken, offset, sortBy],
  );

  // Update comment
  const updateCommentById = useCallback(
    async (
      commentId: string,
      updates: {
        content?: string;
        isOfficial?: boolean;
        officialReplyTo?: string;
      },
    ): Promise<Comment | null> => {
      try {
        setError(null);
        const token = await getIdToken();

        if (!token) {
          throw new Error('Failed to get authentication token');
        }

        const response = await fetch(`/api/community/comments/${commentId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updates),
        });

        if (!response.ok) {
          const errorData = (await response.json()) as Record<string, unknown>;
          throw new Error(
            typeof errorData.error === 'string'
              ? errorData.error
              : 'Failed to update comment',
          );
        }

        const data = (await response.json()) as { comment: Comment };
        const updatedComment = data.comment;

        // Update in local state
        setComments(
          comments.map((c) => (c.id === commentId ? updatedComment : c)),
        );

        return updatedComment;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred';
        setError(errorMessage);
        console.error('Failed to update comment', err);
        return null;
      }
    },
    [getIdToken, comments],
  );

  // Delete comment
  const deleteCommentById = useCallback(
    async (commentId: string): Promise<boolean> => {
      try {
        setError(null);
        const token = await getIdToken();

        if (!token) {
          throw new Error('Failed to get authentication token');
        }

        const response = await fetch(`/api/community/comments/${commentId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = (await response.json()) as Record<string, unknown>;
          throw new Error(
            typeof errorData.error === 'string'
              ? errorData.error
              : 'Failed to delete comment',
          );
        }

        // Remove from local state
        setComments(comments.filter((c) => c.id !== commentId));
        setTotal(Math.max(0, total - 1));

        return true;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred';
        setError(errorMessage);
        console.error('Failed to delete comment', err);
        return false;
      }
    },
    [getIdToken, comments, total],
  );

  // Pagination helpers
  const nextPage = useCallback(() => {
    const newOffset = offset + limit;
    if (newOffset < total) {
      setOffset(newOffset);
      fetchComments(newOffset);
    }
  }, [offset, limit, total, fetchComments]);

  const previousPage = useCallback(() => {
    const newOffset = Math.max(0, offset - limit);
    setOffset(newOffset);
    fetchComments(newOffset);
  }, [offset, limit, fetchComments]);

  const goToPage = useCallback(
    (pageNumber: number) => {
      if (pageNumber < 1) {
        return;
      }
      const newOffset = (pageNumber - 1) * limit;
      if (newOffset < total) {
        setOffset(newOffset);
        fetchComments(newOffset);
      }
    },
    [limit, total, fetchComments],
  );

  const hasNextPage = offset + limit < total;
  const hasPreviousPage = offset > 0;
  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(total / limit);

  return {
    comments,
    total,
    loading,
    error,
    isSubmitting,
    offset,
    limit,
    sortBy,
    postComment,
    updateCommentById,
    deleteCommentById,
    refetch: () => fetchComments(offset),
    nextPage,
    previousPage,
    goToPage,
    hasNextPage,
    hasPreviousPage,
    currentPage,
    totalPages,
  };
};
