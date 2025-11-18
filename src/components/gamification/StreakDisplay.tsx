'use client';

import React, { useMemo } from 'react';
import type { UserGamification } from '@/types/gamification';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Flame, Calendar, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StreakDisplayProps {
  gamification: UserGamification;
  className?: string;
}

export function StreakDisplay({ gamification, className = '' }: StreakDisplayProps) {
  const { streaks } = gamification;

  // Calculate days until streak resets
  const daysUntilReset = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastActivity = new Date(streaks.daily.lastActivityDate);
    lastActivity.setHours(0, 0, 0, 0);

    const daysSinceLastActivity = Math.floor(
      (today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24)
    );

    return 1 - daysSinceLastActivity; // 1 = today, 0 = tomorrow is last day, -1 = already reset
  }, [streaks.daily.lastActivityDate]);

  const isStreakActive = streaks.daily.current > 0 && daysUntilReset >= 0;

  return (
    <div className={cn('space-y-4', className)}>
      {/* Daily Streak Card */}
      <div className="relative overflow-hidden rounded-3xl border-2 border-orange-300 bg-gradient-to-br from-orange-50 via-red-50 to-orange-50 p-6 shadow-lg dark:border-orange-700/50 dark:from-orange-950/50 dark:via-red-950/30 dark:to-orange-950/50">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-gradient-to-bl from-orange-400/20 to-transparent blur-3xl" />
          <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-gradient-to-tr from-red-400/10 to-transparent blur-3xl" />
        </div>

        <div className="relative z-10 space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-widest text-orange-700 dark:text-orange-300">
                Daily Streak
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black text-orange-900 dark:text-orange-100">
                  {streaks.daily.current}
                </span>
                <span className="animate-bounce text-4xl" style={{ animationDelay: '0s' }}>
                  🔥
                </span>
              </div>
            </div>
            {isStreakActive && (
              <Badge className="flex items-center gap-1 bg-emerald-500 px-3 py-1 text-xs font-bold text-white">
                <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
                Active
              </Badge>
            )}
          </div>

          {/* Streak info */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-white/40 p-3 dark:bg-white/5">
              <p className="text-xs font-semibold text-orange-700 dark:text-orange-300">
                Personal Best
              </p>
              <p className="mt-1 text-2xl font-bold text-orange-900 dark:text-orange-100">
                {streaks.daily.best}
              </p>
            </div>
            <div className="rounded-xl bg-white/40 p-3 dark:bg-white/5">
              <p className="text-xs font-semibold text-orange-700 dark:text-orange-300">
                {daysUntilReset > 0 ? 'Reset in' : 'Streak ended'}
              </p>
              <p className="mt-1 text-2xl font-bold text-orange-900 dark:text-orange-100">
                {daysUntilReset > 0 ? `${daysUntilReset}d` : '0d'}
              </p>
            </div>
          </div>

          {/* Encouragement message */}
          <div className="rounded-xl border border-orange-300/50 bg-orange-100/30 p-3 dark:border-orange-700/50 dark:bg-orange-950/30">
            <p className="text-sm font-medium text-orange-900 dark:text-orange-100">
              {streaks.daily.current === 0
                ? '💪 Start your streak today! Complete any activity to begin.'
                : daysUntilReset > 0
                  ? `🔥 Keep it up! One more action to maintain your ${streaks.daily.current}-day streak!`
                  : '⏰ Your streak will reset tomorrow. Come back soon!'}
            </p>
          </div>
        </div>
      </div>

      {/* Weekly Streak Card */}
      <div className="relative overflow-hidden rounded-3xl border-2 border-purple-300 bg-gradient-to-br from-purple-50 via-violet-50 to-purple-50 p-6 shadow-lg dark:border-purple-700/50 dark:from-purple-950/50 dark:via-violet-950/30 dark:to-purple-950/50">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-gradient-to-bl from-purple-400/20 to-transparent blur-3xl" />
          <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-gradient-to-tr from-violet-400/10 to-transparent blur-3xl" />
        </div>

        <div className="relative z-10 space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-widest text-purple-700 dark:text-purple-300">
                Weekly Streak
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black text-purple-900 dark:text-purple-100">
                  {streaks.weekly.current}
                </span>
                <span className="text-4xl">⭐</span>
              </div>
            </div>
            <Trophy className="h-8 w-8 text-purple-600 dark:text-purple-400" />
          </div>

          {/* Weekly info */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-white/40 p-3 dark:bg-white/5">
              <p className="text-xs font-semibold text-purple-700 dark:text-purple-300">
                Weekly Best
              </p>
              <p className="mt-1 text-2xl font-bold text-purple-900 dark:text-purple-100">
                {streaks.weekly.best}
              </p>
            </div>
            <div className="rounded-xl bg-white/40 p-3 dark:bg-white/5">
              <p className="text-xs font-semibold text-purple-700 dark:text-purple-300">
                Weeks Active
              </p>
              <p className="mt-1 text-2xl font-bold text-purple-900 dark:text-purple-100">
                {streaks.weekly.current}
              </p>
            </div>
          </div>

          {/* Weekly encouragement */}
          <div className="rounded-xl border border-purple-300/50 bg-purple-100/30 p-3 dark:border-purple-700/50 dark:bg-purple-950/30">
            <p className="text-sm font-medium text-purple-900 dark:text-purple-100">
              {streaks.weekly.current === 0
                ? '🎯 Build a weekly habit! Stay active throughout the week.'
                : `🏆 Amazing! You've maintained ${streaks.weekly.current} weeks of consistency!`}
            </p>
          </div>
        </div>
      </div>

      {/* Mini calendar view - Last 14 days */}
      <div className="space-y-3 rounded-2xl border border-slate-200 bg-white/50 p-4 dark:border-white/10 dark:bg-white/3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">
            <Calendar className="mb-1 mr-2 inline h-4 w-4" />
            Last 14 Days
          </p>
          <Badge variant="outline" className="text-xs">
            {calculateActivityDays(streaks.daily.lastActivityDate)} active
          </Badge>
        </div>

        {/* Day grid */}
        <div className="grid grid-cols-7 gap-2">
          {getLast14Days().map((day, idx) => {
            const isToday = isDateToday(day);
            const isLastActivityDay = isDateToday(new Date(streaks.daily.lastActivityDate));

            return (
              <div
                key={idx}
                className={cn(
                  'flex h-10 items-center justify-center rounded-lg text-xs font-bold transition-all',
                  isToday && isLastActivityDay
                    ? 'bg-gradient-to-br from-orange-400 to-red-400 text-white shadow-lg dark:from-orange-500 dark:to-red-500'
                    : 'bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-white/60',
                )}
                title={day.toDateString()}
              >
                {isToday && isLastActivityDay ? <Flame className="h-4 w-4" /> : day.getDate()}
              </div>
            );
          })}
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400">
          Week starts Monday. Orange = active days this week.
        </p>
      </div>
    </div>
  );
}

/**
 * Helper function to get last 14 days
 */
function getLast14Days(): Date[] {
  const days: Date[] = [];
  const today = new Date();
  for (let i = 13; i >= 0; i--) {
    const day = new Date(today);
    day.setDate(today.getDate() - i);
    days.push(day);
  }
  return days;
}

/**
 * Helper function to check if date is today
 */
function isDateToday(date: Date | string): boolean {
  const d = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
}

/**
 * Calculate number of active days in last 14 days
 */
function calculateActivityDays(lastActivityDate: string): number {
  const last = new Date(lastActivityDate);
  const today = new Date();
  const days = Math.ceil((today.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(0, 14 - days);
}
