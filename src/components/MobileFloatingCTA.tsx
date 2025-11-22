'use client';

import { Clock, BookmarkIcon, Share2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import type { Opportunity } from '@/types/opportunity';
import { useEffect, useState } from 'react';

interface MobileFloatingCTAProps {
  opportunity: Opportunity;
  deadline: string;
  fee: string;
  registrationClosed: boolean;
  onRegisterClick: () => void;
  onBookmarkClick: () => void;
  isBookmarked: boolean;
  bookmarkLoading?: boolean;
  isRegistered?: boolean;
  registeredAt?: string | null;
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
  isRegistered = false,
  registeredAt,
}: MobileFloatingCTAProps) {
  const isMobile = useIsMobile();
  const [showFloating, setShowFloating] = useState(false);

  useEffect(() => {
    if (!isMobile) {
      setShowFloating(false);
      return;
    }

    const handleScroll = () => {
      // Check if sticky tab bar element exists
      const tabBar = document.getElementById('sticky-tab-bar');
      if (!tabBar) {
        setShowFloating(false);
        return;
      }

      // Get the position of the tab bar
      const tabBarRect = tabBar.getBoundingClientRect();
      const headerOffset = 140; // Approximate sticky header height on mobile

      // Show floating CTA when tab bar is sticky (at or past sticky position)
      const isTabBarSticky = tabBarRect.top <= headerOffset + 10;
      setShowFloating(isTabBarSticky);
    };

    // Initial check
    handleScroll();

    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isMobile]);

  // Only render on mobile devices AND when scrolled past tabs
  if (!isMobile || !showFloating) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-white via-white to-white/95 dark:from-slate-950 dark:via-slate-950 dark:to-slate-950/95 border-t border-slate-200 dark:border-slate-700 backdrop-blur-sm shadow-lg animate-in slide-in-from-bottom duration-300">
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
              <Clock className="h-3.5 w-3.5 text-primary flex-shrink-0" />
              <span className="truncate">Deadline: {deadline}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Register Button or Registered Status */}
          {isRegistered ? (
            <div className="h-10 px-4 flex items-center gap-2 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 rounded-md font-semibold border border-emerald-200 dark:border-emerald-500/30">
              <span className="text-sm">Registered</span>
            </div>
          ) : (
            <Button
              onClick={onRegisterClick}
              disabled={registrationClosed}
              className="h-10 px-3 bg-gradient-to-r from-chart-1 to-chart-2 text-white text-sm font-semibold hover:from-chart-2 hover:to-chart-3 disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {registrationClosed ? 'Closed' : 'Register'}
            </Button>
          )}

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
              className={`h-4 w-4 ${isBookmarked ? 'fill-current text-primary' : ''}`}
            />
          </Button>
        </div>
      </div>
    </div>
  );
}
