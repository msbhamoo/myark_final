/**
 * Component: CommentForm
 * Form for posting new comments
 */

'use client';

import React, { useState } from 'react';
import { useComments } from '@/hooks/use-comments';
import { useAuth } from '@/context/AuthContext';
import { useAuthModal } from '@/hooks/use-auth-modal';

interface CommentFormProps {
  opportunityId: string;
  onCommentPosted?: () => void;
  placeholder?: string;
  className?: string;
  postComment: (content: string, userName?: string) => Promise<any>;
  isSubmitting: boolean;
  error?: string | null;
}

export const CommentForm: React.FC<CommentFormProps> = ({
  opportunityId,
  onCommentPosted,
  placeholder = 'Ask a question or share your thoughts...',
  className = '',
  postComment,
  isSubmitting,
  error,
}) => {
  const { user } = useAuth();
  const { openAuthModal } = useAuthModal();

  const [content, setContent] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      openAuthModal({ mode: 'login' });
      return;
    }

    if (!content.trim()) {
      setSubmitError('Please enter a comment');
      return;
    }

    setSubmitError(null);
    const result = await postComment(content, user.displayName ?? undefined);

    if (result) {
      setContent('');
      setIsExpanded(false);
      onCommentPosted?.();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 ${className}`}
    >
      <div className="flex gap-3">
        {/* User Avatar */}
        {user && (
          <div className="flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-sm font-medium">
              {user.displayName?.charAt(0) ?? user.email?.charAt(0) ?? 'U'}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            onBlur={() => {
              if (!content.trim()) {
                setIsExpanded(false);
              }
            }}
            placeholder={placeholder}
            disabled={isSubmitting || !user}
            className={`
              w-full rounded-lg border border-gray-300 dark:border-gray-600
              bg-white dark:bg-gray-800 text-gray-900 dark:text-white
              px-3 py-2 transition-all resize-none
              placeholder:text-gray-500 dark:placeholder:text-gray-400
              focus:outline-none focus:ring-2 focus:ring-blue-500
              disabled:opacity-50 disabled:cursor-not-allowed
              ${isExpanded ? 'min-h-[120px]' : 'min-h-[40px]'}
            `}
          />

          {/* Error Message */}
          {(submitError || error) && (
            <div className="mt-2 text-sm text-red-600 dark:text-red-400">
              {submitError || error}
            </div>
          )}

          {/* Action Buttons */}
          {isExpanded && (
            <div className="mt-3 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setContent('');
                  setIsExpanded(false);
                  setSubmitError(null);
                }}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !content.trim() || !user}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Posting...' : 'Post'}
              </button>
            </div>
          )}

          {!user && !isExpanded && (
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              <button
                type="button"
                onClick={() => openAuthModal({ mode: 'login' })}
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Sign in
              </button>
              {' '}to post a comment
            </div>
          )}
        </div>
      </div>
    </form>
  );
};
