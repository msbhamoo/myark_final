'use client';

import React, { useMemo } from 'react';
import type { UserGamification } from '@/types/gamification';
import { getNextLevelThreshold, getLevelThreshold } from '@/constants/gamification';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Zap, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DuolingoXPProgressProps {
  gamification: UserGamification;
  className?: string;
  showMilestones?: boolean;
}

export function DuolingoXPProgress({
  gamification,
  className = '',
  showMilestones = true,
}: DuolingoXPProgressProps) {
  const { totalXP, level } = gamification;

  // Calculate progress info
  const progressData = useMemo(() => {
    const currentLevelThreshold = getLevelThreshold(level);
    const nextLevelThreshold = getNextLevelThreshold(level + 1);

    const xpInCurrentLevel = totalXP - currentLevelThreshold;
    const xpNeededForNextLevel = nextLevelThreshold - currentLevelThreshold;
    const progressPercent = Math.min(100, Math.max(0, (xpInCurrentLevel / xpNeededForNextLevel) * 100));

    return {
      currentLevel: level,
      nextLevel: level + 1,
      currentLevelXP: currentLevelThreshold,
      nextLevelXP: nextLevelThreshold,
      xpInCurrentLevel,
      xpNeededForNextLevel,
      progressPercent,
      totalXP,
      isMaxLevel: level >= 50,
    };
  }, [totalXP, level]);

  // Milestone markers
  const milestones = useMemo(
    () =>
      showMilestones
        ? [
            { percent: 0, label: 'Start' },
            { percent: 25, label: 'Quarter' },
            { percent: 50, label: 'Halfway' },
            { percent: 75, label: '3/4' },
            { percent: 100, label: 'Level Up!' },
          ]
        : [],
    [showMilestones],
  );

  const getMilestoneReward = (percent: number): number => {
    const baseReward = 50;
    if (percent === 0) return 0;
    if (percent === 25) return baseReward;
    if (percent === 50) return baseReward * 1.5;
    if (percent === 75) return baseReward * 2;
    if (percent === 100) return baseReward * 2.5;
    return 0;
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header with level info */}
      <div className="flex items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {progressData.isMaxLevel
                ? 'You\'ve Reached Max Level!'
                : `Level ${progressData.currentLevel} → ${progressData.nextLevel}`}
            </h3>
            {!progressData.isMaxLevel && (
              <Badge className="flex items-center gap-1 bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-950 dark:text-amber-200">
                <TrendingUp className="h-3 w-3" />
                {Math.round(progressData.progressPercent)}%
              </Badge>
            )}
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {progressData.isMaxLevel
              ? `${progressData.totalXP.toLocaleString()} total XP`
              : `${progressData.xpInCurrentLevel.toLocaleString()} / ${progressData.xpNeededForNextLevel.toLocaleString()} XP`}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">
            Total Earned
          </p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">
            {(progressData.totalXP / 1000).toFixed(1)}
            <span className="text-lg font-semibold text-slate-600 dark:text-slate-400">k</span>
          </p>
        </div>
      </div>

      {/* Main XP progress bar with animation */}
      {!progressData.isMaxLevel && (
        <div className="space-y-3">
          {/* Progress bar container */}
          <div className="relative">
            {/* Background gradient */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-slate-100 to-slate-50 dark:from-white/10 dark:to-white/5" />

            {/* Animated background shimmer */}
            <div className="absolute inset-0 overflow-hidden rounded-full">
              <div
                className="h-full w-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"
                style={{
                  animation: 'shimmer 2s infinite',
                }}
              />
            </div>

            {/* Main progress bar */}
            <div className="relative h-4 overflow-hidden rounded-full">
              <Progress
                value={progressData.progressPercent}
                className="h-full bg-slate-200 dark:bg-white/10"
              />

              {/* Animated gradient fill */}
              <div
                className="absolute inset-y-0 left-0 h-full bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 transition-all duration-700 ease-out dark:from-indigo-500 dark:via-purple-500 dark:to-pink-500"
                style={{ width: `${progressData.progressPercent}%` }}
              />

              {/* Shimmer effect on progress */}
              <div
                className="absolute inset-y-0 left-0 h-full w-full bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse"
                style={{ width: `${progressData.progressPercent}%` }}
              />
            </div>
          </div>

          {/* Milestone markers and rewards */}
          {showMilestones && (
            <div className="relative pt-2">
              {/* Milestone line */}
              <div className="absolute inset-x-0 top-4 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent dark:via-white/20" />

              {/* Milestone markers */}
              <div className="flex justify-between px-1">
                {milestones.map((milestone) => {
                  const isReached = progressData.progressPercent >= milestone.percent;
                  const reward = getMilestoneReward(milestone.percent);

                  return (
                    <div
                      key={milestone.percent}
                      className="flex flex-col items-center gap-1"
                    >
                      {/* Milestone dot */}
                      <div
                        className={cn(
                          'h-3 w-3 rounded-full transition-all duration-300',
                          isReached
                            ? 'bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg shadow-indigo-300/50 dark:shadow-indigo-500/50'
                            : 'bg-slate-300 dark:bg-white/20',
                        )}
                      />

                      {/* Reward badge */}
                      {reward > 0 && (
                        <Badge
                          className={cn(
                            'mt-1 flex items-center gap-1 text-xs font-bold',
                            isReached
                              ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-200'
                              : 'bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-white/50',
                          )}
                        >
                          <Zap className="h-2.5 w-2.5" />
                          +{reward.toLocaleString()}
                        </Badge>
                      )}

                      {/* Label */}
                      <span
                        className={cn(
                          'text-xs font-medium',
                          isReached
                            ? 'text-slate-900 dark:text-white'
                            : 'text-slate-500 dark:text-slate-400',
                        )}
                      >
                        {milestone.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Stats grid */}
      <div className="grid gap-3 sm:grid-cols-3">
        {/* Current level */}
        <div className="rounded-2xl border border-indigo-200 bg-indigo-50/50 p-4 dark:border-indigo-900/30 dark:bg-indigo-950/20">
          <p className="text-xs font-semibold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
            Current Level
          </p>
          <p className="mt-2 text-3xl font-bold text-indigo-900 dark:text-indigo-100">
            {progressData.currentLevel}
          </p>
          <p className="mt-1 text-xs text-indigo-600 dark:text-indigo-400">
            {progressData.currentLevel >= 50 ? 'Max reached' : `${progressData.xpInCurrentLevel.toLocaleString()} XP in level`}
          </p>
        </div>

        {/* XP remaining */}
        {!progressData.isMaxLevel && (
          <div className="rounded-2xl border border-purple-200 bg-purple-50/50 p-4 dark:border-purple-900/30 dark:bg-purple-950/20">
            <p className="text-xs font-semibold uppercase tracking-wider text-purple-700 dark:text-purple-300">
              XP to Next Level
            </p>
            <p className="mt-2 text-3xl font-bold text-purple-900 dark:text-purple-100">
              {Math.max(0, progressData.xpNeededForNextLevel - progressData.xpInCurrentLevel).toLocaleString()}
            </p>
            <p className="mt-1 text-xs text-purple-600 dark:text-purple-400">
              {Math.round((progressData.xpNeededForNextLevel - progressData.xpInCurrentLevel) / 10)} actions
            </p>
          </div>
        )}

        {/* Total stats */}
        <div className="rounded-2xl border border-pink-200 bg-pink-50/50 p-4 dark:border-pink-900/30 dark:bg-pink-950/20">
          <p className="text-xs font-semibold uppercase tracking-wider text-pink-700 dark:text-pink-300">
            Total Progress
          </p>
          <p className="mt-2 text-3xl font-bold text-pink-900 dark:text-pink-100">
            {Math.round((progressData.totalXP / getLevelThreshold(50)) * 100)}%
          </p>
          <p className="mt-1 text-xs text-pink-600 dark:text-pink-400">
            of max level
          </p>
        </div>
      </div>

      {/* Motivational message */}
      <div className="rounded-2xl border border-green-200 bg-green-50/50 p-4 dark:border-green-900/30 dark:bg-green-950/20">
        <p className="text-sm font-semibold text-green-900 dark:text-green-100">
          {progressData.progressPercent < 25
            ? '🚀 You\'re just getting started! Keep going!'
            : progressData.progressPercent < 50
              ? '⭐ You\'re making great progress! Almost halfway there!'
              : progressData.progressPercent < 75
                ? '🔥 Burning hot! You\'re on fire!'
                : progressData.progressPercent < 100
                  ? '💪 Just a tiny bit more! Level up is within reach!'
                  : '🏆 You\'ve mastered this level! Ready for the next challenge?'}
        </p>
      </div>

      {/* Animation keyframes */}
      <style>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}
