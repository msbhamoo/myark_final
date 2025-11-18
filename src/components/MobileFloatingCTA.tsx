'use client';

import { Clock, BookmarkIcon, Share2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import type { Opportunity } from '@/types/opportunity';

interface MobileFloatingCTAProps {
  opportunity: Opportunity;
  deadline: string;
  fee: string;
  registrationClosed: boolean;
  onRegisterClick: () => void;
  onBookmarkClick: () => void;
  isBookmarked: boolean;
  bookmarkLoading?: boolean;
}

export function MobileFloatingCTA({
  opportunity,
  deadline,
  fee,
  registrationClosed,
  onRegisterClick,
  onBookmarkClick,
  isBookmarked,
  bookmarkLoading = false,
}: MobileFloatingCTAProps) {
  const isMobile = useIsMobile();

  // Only render on mobile devices
  if (!isMobile) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-white via-white to-white/95 dark:from-slate-950 dark:via-slate-950 dark:to-slate-950/95 border-t border-slate-200 dark:border-slate-700 backdrop-blur-sm shadow-lg">
      {/* Content Container */}
      <div className="mx-auto max-w-[1920px] px-4 py-3 flex items-center gap-2">
        {/* Price and Deadline Info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col gap-1">
            <div className="flex items-baseline gap-2">
              <p className="text-xs text-slate-500 dark:text-slate-400">Fee:</p>
              <p className="text-lg font-bold text-emerald-600 dark:text-emerald-300">{fee}</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
              <Clock className="h-3.5 w-3.5 text-orange-400 flex-shrink-0" />
              <span className="truncate">Deadline: {deadline}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Register Button */}
          <Button
            onClick={onRegisterClick}
            disabled={registrationClosed}
            className="h-10 px-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-sm font-semibold hover:from-orange-600 hover:to-pink-600 disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {registrationClosed ? 'Closed' : 'Register'}
          </Button>

          {/* Bookmark Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={onBookmarkClick}
            disabled={bookmarkLoading}
            className="h-10 w-10 border-slate-200 dark:border-white/20 text-slate-600 dark:text-white hover:bg-white/90 dark:hover:bg-white/10"
            title={isBookmarked ? 'Remove from saved' : 'Save opportunity'}
          >
            <BookmarkIcon
              className={`h-4 w-4 ${isBookmarked ? 'fill-current text-orange-400' : ''}`}
            />
          </Button>

          {/* Share Button */}
          {/* <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 border-slate-200 dark:border-white/20 text-slate-600 dark:text-white hover:bg-white/90 dark:hover:bg-white/10"
            title="Share opportunity"
          >
            <Share2 className="h-4 w-4" />
          </Button> */}
        </div>
      </div>
    </div>
  );
}
