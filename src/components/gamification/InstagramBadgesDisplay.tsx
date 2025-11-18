'use client';

import React, { useMemo } from 'react';
import type { UserGamification } from '@/types/gamification';
import { BADGE_DEFINITIONS } from '@/constants/gamification';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Lock, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InstagramBadgesProps {
  badges: UserGamification['badges'];
  allBadges?: typeof BADGE_DEFINITIONS;
  maxDisplay?: number;
  showProgress?: boolean;
  className?: string;
}

const RARITY_COLORS = {
  legendary: {
    light: 'from-yellow-300 via-orange-300 to-red-300',
    border: 'border-yellow-400',
    bg: 'bg-yellow-100 dark:bg-yellow-950',
    textColor: 'text-yellow-700 dark:text-yellow-200',
  },
  epic: {
    light: 'from-purple-400 via-pink-400 to-rose-400',
    border: 'border-purple-400',
    bg: 'bg-purple-100 dark:bg-purple-950',
    textColor: 'text-purple-700 dark:text-purple-200',
  },
  rare: {
    light: 'from-blue-400 via-cyan-400 to-teal-400',
    border: 'border-blue-400',
    bg: 'bg-blue-100 dark:bg-blue-950',
    textColor: 'text-blue-700 dark:text-blue-200',
  },
  uncommon: {
    light: 'from-green-400 via-emerald-400 to-teal-400',
    border: 'border-green-400',
    bg: 'bg-green-100 dark:bg-green-950',
    textColor: 'text-green-700 dark:text-green-200',
  },
  common: {
    light: 'from-slate-300 via-slate-400 to-slate-500',
    border: 'border-slate-400',
    bg: 'bg-slate-100 dark:bg-slate-900',
    textColor: 'text-slate-700 dark:text-slate-200',
  },
};

export function InstagramBadgesDisplay({
  badges,
  allBadges = BADGE_DEFINITIONS,
  maxDisplay = 12,
  showProgress = true,
  className = '',
}: InstagramBadgesProps) {
  // Sort badges by rarity and earned date
  const sortedBadges = useMemo(() => {
    const rarityOrder = { legendary: 0, epic: 1, rare: 2, uncommon: 3, common: 4 };
    return [...badges].sort((a, b) => {
      const rarityDiff = rarityOrder[a.rarity] - rarityOrder[b.rarity];
      if (rarityDiff !== 0) return rarityDiff;
      return new Date(b.earnedAt).getTime() - new Date(a.earnedAt).getTime();
    });
  }, [badges]);

  // Calculate badges by rarity
  const badgesByRarity = useMemo(() => {
    const acc = { legendary: 0, epic: 0, rare: 0, uncommon: 0, common: 0 };
    badges.forEach((b) => {
      acc[b.rarity]++;
    });
    return acc;
  }, [badges]);

  if (badges.length === 0) {
    return (
      <div className={cn('space-y-4', className)}>
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center dark:border-white/10 dark:bg-white/3">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            No badges earned yet. Complete challenges to unlock achievements! 🎯
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Rarity breakdown */}
      {showProgress && (
        <div className="grid gap-3 sm:grid-cols-5">
          {(Object.keys(badgesByRarity) as Array<keyof typeof badgesByRarity>).map((rarity) => {
            const colors = RARITY_COLORS[rarity];
            return (
              <div
                key={rarity}
                className={cn(
                  'rounded-xl border-2 p-3 text-center transition-colors hover:bg-opacity-80',
                  colors.border,
                  colors.bg,
                )}
              >
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                  {rarity === 'legendary' && '👑'}
                  {rarity === 'epic' && '🟣'}
                  {rarity === 'rare' && '🔵'}
                  {rarity === 'uncommon' && '🟢'}
                  {rarity === 'common' && '⚪'}
                  <span className="ml-1">{rarity}</span>
                </div>
                <div className={cn('mt-1 text-2xl font-bold', colors.textColor)}>
                  {badgesByRarity[rarity]}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Instagram-style highlight grid */}
      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <TooltipProvider>
          {sortedBadges.slice(0, maxDisplay).map((badge) => {
            const definition = allBadges[badge.id];
            const colors = RARITY_COLORS[badge.rarity];

            return (
              <Tooltip key={badge.id}>
                <TooltipTrigger asChild>
                  <div className="group cursor-pointer">
                    <div
                      className={cn(
                        'relative aspect-square overflow-hidden rounded-2xl border-2 transition-all duration-300',
                        'flex items-center justify-center text-4xl',
                        'hover:scale-105 hover:shadow-lg',
                        colors.border,
                        `bg-gradient-to-br ${colors.light}`,
                      )}
                    >
                      {/* Badge icon */}
                      <span className="drop-shadow-lg">{definition?.icon ?? '🏆'}</span>

                      {/* Earned checkmark */}
                      <div className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-white shadow-md">
                        ✓
                      </div>

                      {/* Rarity indicator */}
                      <Badge
                        className={cn(
                          'absolute bottom-1 left-1 text-xs font-bold capitalize',
                          colors.bg,
                          colors.textColor,
                        )}
                      >
                        {badge.rarity}
                      </Badge>
                    </div>

                    {/* Badge name below */}
                    <p className="mt-2 text-center text-xs font-semibold text-slate-900 dark:text-white line-clamp-2">
                      {definition?.displayName ?? badge.id}
                    </p>
                  </div>
                </TooltipTrigger>

                <TooltipContent className="max-w-xs">
                  <div className="text-left">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{definition?.icon ?? '🏆'}</span>
                      <div>
                        <p className="font-semibold">{definition?.displayName}</p>
                        <Badge
                          className={cn(
                            'mt-0.5 capitalize',
                            colors.bg,
                            colors.textColor,
                          )}
                        >
                          {badge.rarity}
                        </Badge>
                      </div>
                    </div>
                    <p className="mt-2 text-xs text-slate-300">
                      {definition?.description}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      Category: {definition?.category}
                    </p>
                    <p className="mt-1 text-xs text-emerald-300">
                      ✓ Earned {new Date(badge.earnedAt).toLocaleDateString()}
                    </p>
                  </div>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </TooltipProvider>

        {/* Locked badges preview if not all shown */}
        {badges.length > maxDisplay && (
          <div className="flex items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 dark:border-white/20 dark:bg-white/5">
            <div className="text-center">
              <Lock className="mx-auto h-6 w-6 text-slate-400 dark:text-white/40" />
              <p className="mt-2 text-xs font-semibold text-slate-600 dark:text-white/60">
                +{badges.length - maxDisplay}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Show all link */}
      {badges.length > maxDisplay && (
        <div className="flex items-center justify-center pt-4">
          <a
            href="#all-badges"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            View all {badges.length} badges →
          </a>
        </div>
      )}

      {/* Achievements summary */}
      {badges.length > 0 && (
        <div className="rounded-2xl border border-white/20 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-pink-500/10 p-4 backdrop-blur-sm dark:border-white/10">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                Badges Collected
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {badges.length}
                <span className="ml-2 text-sm font-normal text-slate-600 dark:text-slate-400">
                  of 32
                </span>
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                Rarest Badge
              </p>
              <p className="text-lg font-bold text-slate-900 dark:text-white">
                {badges.some((b) => b.rarity === 'legendary')
                  ? '👑 Legendary'
                  : badges.some((b) => b.rarity === 'epic')
                    ? '🟣 Epic'
                    : 'Keep grinding!'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
