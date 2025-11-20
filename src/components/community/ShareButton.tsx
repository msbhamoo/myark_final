/**
 * Component: ShareButton
 * Displays a share button for opportunities
 * Uses native sharing or clipboard fallback
 */

'use client';

import React, { useState } from 'react';
import { Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
      <Button
        variant="outline"
        onClick={handleShare}
        disabled={isSharing}
        className={`border-slate-200 dark:border-slate-700 ${className}`}
        title="Share this opportunity"
      >
        <Share2 className="h-4 w-4" />
        {showLabel && <span className="ml-2">Share</span>}
      </Button>

      {/* Feedback message */}
      {showFeedback && (
        <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gray-900 text-white text-sm px-3 py-1 rounded-lg pointer-events-none z-50">
          {getShareMethod() === 'native' ? 'Shared!' : 'Link copied!'}
        </div>
      )}
    </div>
  );
};
