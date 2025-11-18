/**
 * Component: UpvoteButton
 * Displays an upvote button with count
 * Handles authentication and upvote logic
 */

'use client';

import React, { useState } from 'react';
import { useUpvotes } from '@/hooks/use-upvotes';
import { useAuth } from '@/context/AuthContext';
import { useAuthModal } from '@/hooks/use-auth-modal';

interface UpvoteButtonProps {
  opportunityId: string;
  showCount?: boolean;
  className?: string;
  onUpvoteChange?: (isUpvoted: boolean, count: number) => void;
}

export const UpvoteButton: React.FC<UpvoteButtonProps> = ({
  opportunityId,
  showCount = true,
  className = '',
  onUpvoteChange,
}) => {
  const { user } = useAuth();
  const { openAuthModal } = useAuthModal();
  const { stats, isToggling, upvote, removeUpvote } = useUpvotes(opportunityId);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = async () => {
    if (!user) {
      openAuthModal({ mode: 'login' });
      return;
    }

    setIsAnimating(true);
    const isCurrentlyUpvoted = stats?.userHasUpvoted ?? false;

    if (isCurrentlyUpvoted) {
      const success = await removeUpvote();
      if (success && stats) {
        onUpvoteChange?.(false, stats.totalCount - 1);
      }
    } else {
      const success = await upvote();
      if (success && stats) {
        onUpvoteChange?.(true, stats.totalCount + 1);
      }
    }

    setIsAnimating(false);
  };

  const isUpvoted = stats?.userHasUpvoted ?? false;
  const count = stats?.totalCount ?? 0;

  return (
    <button
      onClick={handleClick}
      disabled={isToggling || !stats}
      className={`
        inline-flex items-center gap-2 px-3 py-2 rounded-lg
        transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
        ${isUpvoted
          ? 'bg-red-100 text-red-600 hover:bg-red-200'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
        }
        ${isAnimating ? 'scale-95' : 'scale-100'}
        ${className}
      `}
      title={isUpvoted ? 'Unlike' : 'Like this opportunity'}
    >
      {/* Heart Icon */}
      <svg
        className={`w-5 h-5 transition-transform ${isAnimating ? 'scale-110' : 'scale-100'}`}
        fill={isUpvoted ? 'currentColor' : 'none'}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>

      {showCount && <span className="text-sm font-medium">{count}</span>}
    </button>
  );
};
