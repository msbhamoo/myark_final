/**
 * Component: ShareButton
 * Displays a share button for opportunities
 * Uses native sharing or clipboard fallback
 */

'use client';

import React, { useState } from 'react';
import {
  shareOpportunityWithMetadata,
  getShareMethod,
} from '@/lib/shareUtil';

interface ShareButtonProps {
  opportunityId: string;
  opportunityTitle: string;
  opportunitySlug?: string;
  description?: string;
  baseUrl?: string;
  showLabel?: boolean;
  className?: string;
  onShare?: (method: 'native' | 'clipboard') => void;
}

export const ShareButton: React.FC<ShareButtonProps> = ({
  opportunityId,
  opportunityTitle,
  opportunitySlug,
  description,
  baseUrl = typeof window !== 'undefined' ? window.location.origin : '',
  showLabel = true,
  className = '',
  onShare,
}) => {
  const [isSharing, setIsSharing] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleShare = async () => {
    setIsSharing(true);
    try {
      const shareMethod = getShareMethod();
      const success = await shareOpportunityWithMetadata({
        opportunityId,
        opportunityTitle,
        opportunitySlug,
        description,
        baseUrl,
        analyticsCallback: onShare,
      });

      if (success) {
        setShowFeedback(true);
        setTimeout(() => setShowFeedback(false), 2000);
      }
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={handleShare}
        disabled={isSharing}
        className={`
          inline-flex items-center gap-2 px-3 py-2 rounded-lg
          transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
          border border-border/50 dark:border-white/20
          hover:bg-white/90 dark:hover:bg-slate-800/50
          bg-white/85 dark:bg-slate-800/70
          text-slate-700 dark:text-slate-300
          shadow-sm
          ${className}
        `}
        title="Share this opportunity"
      >
        {/* Share Icon */}
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.684 13.342C9.589 12.75 10 11.888 10 11c0-2.21-1.791-4-4-4s-4 1.79-4 4 1.791 4 4 4c.868 0 1.69-.205 2.404-.558m7.232-4.542a4 4 0 010 5.656m3.534-3.534a4 4 0 010 5.656M9 20H5a2 2 0 01-2-2V7a2 2 0 012-2h4m0 0h6a2 2 0 012 2v10a2 2 0 01-2 2h-6m0 0V5a2 2 0 012-2h3.5A1.5 1.5 0 0121 4.5v13a1.5 1.5 0 01-1.5 1.5h-5"
          />
        </svg>
      </button>

      {/* Feedback message */}
      {showFeedback && (
        <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gray-900 text-white text-sm px-3 py-1 rounded-lg pointer-events-none z-50">
          {getShareMethod() === 'native' ? 'Shared!' : 'Link copied!'}
        </div>
      )}
    </div>
  );
};
