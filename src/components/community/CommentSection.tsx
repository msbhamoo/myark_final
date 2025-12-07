/**
 * Component: CommentSection
 * Displays comments with pagination and form
 */

'use client';

import React, { useState } from 'react';
import { useComments } from '@/hooks/use-comments';
import { CommentForm } from './CommentForm';
import { CommentItem } from './CommentItem';
import { LoadingSpinner } from '@/components/LoadingSpinner';

interface CommentSectionProps {
  entityId: string;
  entityType?: 'opportunity' | 'blog';
  limit?: number;
  showForm?: boolean;
  className?: string;
}

export const CommentSection: React.FC<CommentSectionProps> = ({
  entityId,
  entityType = 'opportunity',
  limit = 10,
  showForm = true,
  className = '',
}) => {
  const {
    comments,
    total,
    loading,
    error,
    deleteCommentById,
    postComment,
    nextPage,
    previousPage,
    hasNextPage,
    hasPreviousPage,
    currentPage,
    totalPages,
    isSubmitting,
    refetch,
  } = useComments(entityId, { limit }, entityType);

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDelete = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    setDeletingId(commentId);
    setDeleteError(null);

    const success = await deleteCommentById(commentId);

    if (!success) {
      setDeleteError('Failed to delete comment');
    }

    setDeletingId(null);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Comments ({total})
        </h3>
      </div>

      {/* Form */}
      {showForm && (
        <CommentForm
          entityId={entityId}
          entityType={entityType}
          onCommentPosted={refetch}
          postComment={postComment}
          isSubmitting={isSubmitting}
          error={error}
        />
      )}

      {/* Error Message */}
      {error && (
        <div className="rounded-lg bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-3 text-sm">
          {error}
        </div>
      )}

      {deleteError && (
        <div className="rounded-lg bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-3 text-sm">
          {deleteError}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      )}

      {/* Empty State */}
      {!loading && comments.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">
            No comments yet. Be the first to share your thoughts!
          </p>
        </div>
      )}

      {/* Comments List */}
      {!loading && comments.length > 0 && (
        <div className="space-y-3">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onDelete={handleDelete}
              isDeleting={deletingId === comment.id}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={previousPage}
            disabled={!hasPreviousPage}
            className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>

          <div className="text-sm text-gray-600 dark:text-gray-400">
            Page {currentPage} of {totalPages}
          </div>

          <button
            onClick={nextPage}
            disabled={!hasNextPage}
            className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};
