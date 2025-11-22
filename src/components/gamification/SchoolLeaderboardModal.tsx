'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useLeaderboard } from '@/hooks/use-gamification';
import { Trophy, Medal, Loader2, AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface SchoolLeaderboardModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  schoolId?: string;
  schoolName?: string;
}

const MEDAL_ICONS = {
  1: '🥇',
  2: '🥈',
  3: '🥉',
};

export function SchoolLeaderboardModal({
  open,
  onOpenChange,
  schoolId,
  schoolName = 'Your School',
}: SchoolLeaderboardModalProps) {
  // Use school leaderboard hook
  const { entries: leaderboardEntries, loading, error } = useLeaderboard('school', schoolId, 50);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto border-slate-200 bg-white dark:border-white/10 dark:bg-slate-950">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-primary" />
            <div>
              <DialogTitle className="text-2xl">{schoolName} Leaderboard</DialogTitle>
              <DialogDescription>
                Top students at your school, ranked by total XP earned
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {loading && (
          <div className="space-y-3 py-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 rounded-lg" />
            ))}
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-red-200/40 bg-red-50/40 p-4 dark:border-red-900/40 dark:bg-red-950/20">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
            </div>
          </div>
        )}

        {!loading && !error && leaderboardEntries && leaderboardEntries.length === 0 && (
          <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center dark:border-white/10 dark:bg-white/3">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              No students on the leaderboard yet. Check back soon!
            </p>
          </div>
        )}

        {!loading && !error && leaderboardEntries && leaderboardEntries.length > 0 && (
          <div className="space-y-2 py-4">
            {leaderboardEntries.map((entry, index) => {
              const rank = index + 1;
              const medal = MEDAL_ICONS[rank as keyof typeof MEDAL_ICONS];

              return (
                <div
                  key={entry.uid}
                  className={cn(
                    'flex items-center justify-between rounded-lg border-l-4 p-4 transition-colors',
                    {
                      'border-l-yellow-400 bg-yellow-50/50 dark:border-l-yellow-600 dark:bg-yellow-950/20':
                        rank === 1,
                      'border-l-slate-400 bg-slate-50/50 dark:border-l-slate-600 dark:bg-slate-900/20':
                        rank === 2,
                      'border-l-amber-600 bg-amber-50/50 dark:border-l-amber-700 dark:bg-amber-950/20':
                        rank === 3,
                      'border-l-[#58CC02] bg-[#DFF7C8]/30 dark:border-l-[#58CC02] dark:bg-[#58CC02]/10':
                        rank > 3,
                    },
                  )}
                >
                  <div className="flex items-center gap-4 flex-1">
                    {/* Rank and medal */}
                    <div className="flex w-12 items-center justify-center">
                      {medal ? (
                        <span className="text-2xl">{medal}</span>
                      ) : (
                        <span className="text-xl font-bold text-slate-500 dark:text-slate-400">
                          #{rank}
                        </span>
                      )}
                    </div>

                    {/* Student info */}
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-slate-900 dark:text-white truncate">
                        {entry.displayName || 'Anonymous'}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Level {entry.level} • {entry.badgeCount || 0} badges
                      </p>
                    </div>
                  </div>

                  {/* XP and level */}
                  <div className="text-right space-y-1">
                    <div className="font-bold text-slate-900 dark:text-white">
                      {entry.totalXP?.toLocaleString()} XP
                    </div>
                    <Badge
                      className={cn(
                        'text-xs font-semibold',
                        {
                          'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-200':
                            rank === 1,
                          'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200':
                            rank === 2,
                          'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200':
                            rank === 3,
                          'bg-[#DFF7C8] text-[#1A2A33] dark:bg-[#58CC02]/20 dark:text-[#DFF7C8]':
                            rank > 3,
                        },
                      )}
                    >
                      Lv {entry.level}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer note */}
        <div className="border-t border-slate-200 pt-4 mt-4 dark:border-white/10">
          <p className="text-xs text-slate-600 dark:text-slate-400">
            💡 Leaderboard is updated daily. Your position reflects total XP earned through exploring opportunities, applying, earning badges, and maintaining streaks.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
