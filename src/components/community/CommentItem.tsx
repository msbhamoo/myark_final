/**
 * Component: CommentItem
 * Displays a single comment
 */

'use client';

import React, { useState } from 'react';
import type { Comment } from '@/types/community';
import { useAuth } from '@/context/AuthContext';

interface CommentItemProps {
  comment: Comment;
  onDelete?: (commentId: string) => void;
  onReply?: (commentId: string) => void;
  isDeleting?: boolean;
  className?: string;
}

export const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  onDelete,
  onReply,
  isDeleting = false,
  className = '',
}) => {
  const { user } = useAuth();
  const [showActions, setShowActions] = useState(false);
  const isOwnComment = user?.uid === comment.userId;
  const isOfficialResponse = comment.isOfficial;

  // Format timestamp
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return 'just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;

      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return 'unknown time';
    }
  };

  return (
    <div
      className={`
        rounded-lg border border-gray-200 dark:border-gray-700
        bg-white dark:bg-gray-900 p-4 transition-colors
        ${isOfficialResponse ? 'ring-2 ring-green-400 dark:ring-green-600' : ''}
        ${className}
      `}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Official Badge */}
      {isOfficialResponse && (
        <div className="mb-2">
          <span className="inline-block px-2 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200 text-xs font-medium">
            ✓ Official Response
          </span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {/* Avatar */}
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white text-sm font-medium">
            {comment.userName?.charAt(0) ?? comment.userEmail?.charAt(0) ?? 'U'}
          </div>

          {/* Name and timestamp */}
          <div className="min-w-0">
            <p className="font-medium text-gray-900 dark:text-white truncate">
              {comment.userName ?? comment.userEmail?.split('@')[0] ?? 'Anonymous'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {formatDate(comment.createdAt)}
            </p>
          </div>
        </div>

        {/* Actions Menu */}
        {(showActions || isDeleting) && (
          <div className="flex-shrink-0 flex gap-1">
            {isOwnComment && onDelete && (
              <button
                onClick={() => onDelete(comment.id)}
                disabled={isDeleting}
                className="p-1 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors disabled:opacity-50"
                title="Delete comment"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            )}
            {onReply && !isOfficialResponse && (
              <button
                onClick={() => onReply(comment.id)}
                className="p-1 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                title="Reply to comment"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h10a8 8 0 018 8v2M3 10l6-6m-6 6l-6-6"
                  />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      {!comment.isDeleted ? (
        <div className="mt-2 text-gray-700 dark:text-gray-300 text-sm whitespace-pre-wrap break-words">
          {comment.content}
        </div>
      ) : (
        <div className="mt-2 text-gray-500 dark:text-gray-400 text-sm italic">
          This comment has been deleted
        </div>
      )}
    </div>
  );
};
