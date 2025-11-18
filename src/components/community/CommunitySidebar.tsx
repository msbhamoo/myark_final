/**
 * Component: CommunitySidebar
 * Displays community engagement stats and quick actions
 */

'use client';

import React from 'react';
import { useCommunityCounts } from '@/hooks/use-community-counts';
import { UpvoteButton } from './UpvoteButton';
import { ShareButton } from './ShareButton';
import { LoadingSpinner } from '@/components/LoadingSpinner';

interface CommunitySidebarProps {
  opportunityId: string;
  opportunityTitle: string;
  opportunitySlug?: string;
  className?: string;
}

export const CommunitySidebar: React.FC<CommunitySidebarProps> = ({
  opportunityId,
  opportunityTitle,
  opportunitySlug,
  className = '',
}) => {
  const { counts, loading, error } = useCommunityCounts(opportunityId, 30000); // Poll every 30s

  return (
    <div
      className={`
        rounded-lg border border-gray-200 dark:border-gray-700
        bg-white dark:bg-gray-900 p-4 space-y-4
        ${className}
      `}
    >
      {/* Header */}
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Community
      </h3>

      {/* Error */}
      {error && (
        <div className="text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Stats */}
      {loading ? (
        <div className="flex justify-center py-4">
          <LoadingSpinner />
        </div>
      ) : (
        counts && (
          <div className="space-y-2">
            {/* Upvotes */}
            <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
              <span className="text-sm text-gray-600 dark:text-gray-400">Upvotes</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {counts.upvotes}
              </span>
            </div>

            {/* Comments */}
            <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
              <span className="text-sm text-gray-600 dark:text-gray-400">Comments</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {counts.comments}
              </span>
            </div>
          </div>
        )
      )}

      {/* Divider */}
      <div className="border-t border-gray-200 dark:border-gray-700" />

      {/* Actions */}
      <div className="space-y-2">
        <UpvoteButton
          opportunityId={opportunityId}
          showCount={true}
          className="w-full justify-center"
        />
        <ShareButton
          opportunityId={opportunityId}
          opportunityTitle={opportunityTitle}
          opportunitySlug={opportunitySlug}
          showLabel={true}
          className="w-full justify-center"
        />
      </div>

      {/* Tip */}
      <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
        <p className="text-xs text-blue-700 dark:text-blue-300">
          💡 Tip: Help others by sharing your experience in the comments!
        </p>
      </div>
    </div>
  );
};
