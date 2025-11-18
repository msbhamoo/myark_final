/**
 * Gamification Profile Components
 * Reusable components for displaying gamification data in student profile
 */

'use client';

import React, { useMemo } from 'react';
import type { UserGamification, UserLeaderboardEntry, BadgeProgress } from '@/types/gamification';
import { BADGE_DEFINITIONS, getLevelThreshold, getNextLevelThreshold } from '@/constants/gamification';

/**
 * XP and Level Display
 */
export function XPDisplay({
  totalXP,
  level,
  currentLevelXP,
  nextLevelXP,
  className = '',
}: {
  totalXP: number;
  level: number;
  currentLevelXP?: number;
  nextLevelXP?: number;
  className?: string;
}) {
  const current = currentLevelXP ?? getLevelThreshold(level);
  const next = nextLevelXP ?? getNextLevelThreshold(level + 1);

  const xpInCurrentLevel = totalXP - current;
  const xpNeededForLevel = next - current;
  const progressPercent = Math.round((xpInCurrentLevel / xpNeededForLevel) * 100);

  return (
    <div className={`bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Level {level}</h3>
          <p className="text-sm text-gray-600">{totalXP.toLocaleString()} XP</p>
        </div>
        <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          {level}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs text-gray-600">
          <span>Level Progress</span>
          <span>{progressPercent}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="text-xs text-gray-500">
          {xpInCurrentLevel.toLocaleString()} / {xpNeededForLevel.toLocaleString()} XP
        </p>
      </div>
    </div>
  );
}

/**
 * Badges Display Component
 */
export function BadgesDisplay({
  badges,
  maxDisplay = 12,
  className = '',
}: {
  badges: UserGamification['badges'];
  maxDisplay?: number;
  className?: string;
}) {
  const displayBadges = useMemo(() => {
    return badges.sort((a, b) => new Date(b.earnedAt).getTime() - new Date(a.earnedAt).getTime()).slice(0, maxDisplay);
  }, [badges, maxDisplay]);

  const sortedByRarity = useMemo(() => {
    const rarityOrder = { legendary: 0, epic: 1, rare: 2, uncommon: 3, common: 4 };
    return [...displayBadges].sort(
      (a, b) => rarityOrder[a.rarity] - rarityOrder[b.rarity],
    );
  }, [displayBadges]);

  if (badges.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <p className="text-gray-500">No badges earned yet. Keep exploring to earn your first badge!</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Badges ({badges.length})</h3>
        {badges.length > maxDisplay && (
          <span className="text-sm text-gray-600">Showing {maxDisplay} of {badges.length}</span>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {sortedByRarity.map((badge) => (
          <div
            key={badge.id}
            className="group relative flex flex-col items-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
            title={badge.description}
          >
            <div className="text-3xl mb-1">{badge.icon}</div>
            <span className="text-xs font-medium text-center text-gray-700 truncate">
              {badge.displayName}
            </span>

            {/* Rarity indicator */}
            <div className={`mt-1 h-1 w-3 rounded-full ${badge.color}`} />

            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10 shadow-lg">
              {badge.description}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Streak Tracker Component
 */
export function StreakTracker({
  gamification,
  className = '',
}: {
  gamification: UserGamification;
  className?: string;
}) {
  const daily = gamification.streaks.daily;
  const weekly = gamification.streaks.weekly;

  const now = new Date();
  const today = now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);

  const isDailyActive =
    daily.lastActivityDate === today || daily.lastActivityDate === yesterday.toDateString();

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${className}`}>
      {/* Daily Streak */}
      <div className={`rounded-lg p-5 ${isDailyActive ? 'bg-orange-50 border border-orange-200' : 'bg-gray-50 border border-gray-200'}`}>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-gray-900">Daily Streak</h4>
          <span className="text-2xl">🔥</span>
        </div>

        <div className="space-y-3">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-orange-600">{daily.current}</span>
            <span className="text-sm text-gray-600">days</span>
            {isDailyActive && <span className="text-xs bg-orange-200 text-orange-800 px-2 py-1 rounded-full font-semibold">Active</span>}
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-gray-200">
            <span className="text-xs text-gray-600">Personal Best</span>
            <span className="font-semibold text-gray-900">{daily.best} days</span>
          </div>

          {!isDailyActive && daily.current > 0 && (
            <p className="text-xs text-gray-500 italic">
              Come back tomorrow to continue your streak!
            </p>
          )}
        </div>
      </div>

      {/* Weekly Streak */}
      <div className={`rounded-lg p-5 ${weekly.current > 0 ? 'bg-purple-50 border border-purple-200' : 'bg-gray-50 border border-gray-200'}`}>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-gray-900">Weekly Streak</h4>
          <span className="text-2xl">📅</span>
        </div>

        <div className="space-y-3">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-purple-600">{weekly.current}</span>
            <span className="text-sm text-gray-600">weeks</span>
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-gray-200">
            <span className="text-xs text-gray-600">Personal Best</span>
            <span className="font-semibold text-gray-900">{weekly.best} weeks</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Leaderboard Component
 */
export function LeaderboardView({
  entries,
  userRank,
  scope = 'global',
  className = '',
}: {
  entries: UserLeaderboardEntry[];
  userRank?: number;
  scope?: 'global' | 'school';
  className?: string;
}) {
  if (entries.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <p className="text-gray-500">No leaderboard data available yet.</p>
      </div>
    );
  }

  const getMedalEmoji = (rank: number): string => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  return (
    <div className={className}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {scope === 'global' ? 'Global Leaderboard' : 'School Leaderboard'}
      </h3>

      <div className="space-y-2">
        {entries.map((entry, index) => (
          <div
            key={entry.uid}
            className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
              userRank === entry.rank
                ? 'bg-blue-100 border border-blue-300'
                : 'bg-gray-50 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="text-lg font-semibold text-gray-600 w-8">
                {getMedalEmoji(entry.rank)}
              </div>

              <div className="min-w-0 flex-1">
                <p className="font-medium text-gray-900 truncate">{entry.displayName}</p>
                {entry.schoolName && scope === 'global' && (
                  <p className="text-xs text-gray-500 truncate">{entry.schoolName}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 ml-2">
              <div className="text-right">
                <p className="font-semibold text-gray-900">{entry.totalXP.toLocaleString()}</p>
                <p className="text-xs text-gray-500">XP</p>
              </div>
              <div className="text-center">
                <p className="font-semibold text-gray-900">Lv{entry.level}</p>
                <p className="text-xs text-gray-500">{entry.badgeCount}⭐</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Badge Progress Component
 */
export function BadgeProgressDisplay({
  progress,
  maxDisplay = 5,
  className = '',
}: {
  progress: BadgeProgress[];
  maxDisplay?: number;
  className?: string;
}) {
  const displayProgress = useMemo(() => {
    return progress
      .filter((p) => p.status !== 'locked' || p.progress > 0)
      .slice(0, maxDisplay);
  }, [progress, maxDisplay]);

  if (displayProgress.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      <h4 className="text-sm font-semibold text-gray-900 mb-3">Badges in Progress</h4>

      <div className="space-y-3">
        {displayProgress.map((badge) => {
          const badgeDef = BADGE_DEFINITIONS[badge.badgeName];
          if (!badgeDef) return null;

          return (
            <div key={badge.badgeName} className="rounded-lg p-3 bg-gray-50">
              <div className="flex items-start gap-3 mb-2">
                <span className="text-2xl">{badgeDef.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-gray-900 truncate">{badgeDef.displayName}</p>
                  <p className="text-xs text-gray-600">{badge.description}</p>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-semibold text-gray-900">
                    {badge.currentValue}/{badge.requiredValue}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 h-1.5 rounded-full transition-all"
                    style={{ width: `${badge.progress}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {progress.length > maxDisplay && (
        <p className="text-xs text-gray-500 mt-3">
          +{progress.length - maxDisplay} more badges to unlock
        </p>
      )}
    </div>
  );
}

/**
 * Achievement Summary Card
 */
export function AchievementSummary({
  level,
  totalXP,
  badgeCount,
  currentStreak,
  globalRank,
  schoolRank,
  className = '',
}: {
  level: number;
  totalXP: number;
  badgeCount: number;
  currentStreak: number;
  globalRank: number;
  schoolRank?: number;
  className?: string;
}) {
  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 gap-3 ${className}`}>
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 text-center">
        <div className="text-2xl font-bold text-blue-600">{level}</div>
        <div className="text-xs text-gray-600 font-medium">Level</div>
      </div>

      <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 text-center">
        <div className="text-2xl font-bold text-purple-600">{totalXP.toLocaleString()}</div>
        <div className="text-xs text-gray-600 font-medium">Total XP</div>
      </div>

      <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 text-center">
        <div className="text-2xl font-bold text-yellow-600">{badgeCount}</div>
        <div className="text-xs text-gray-600 font-medium">Badges</div>
      </div>

      <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 text-center">
        <div className="text-2xl font-bold text-orange-600">{currentStreak}</div>
        <div className="text-xs text-gray-600 font-medium">Day Streak</div>
      </div>

      {globalRank > 0 && (
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600">#{globalRank}</div>
          <div className="text-xs text-gray-600 font-medium">Global Rank</div>
        </div>
      )}

      {schoolRank && schoolRank > 0 && (
        <div className="bg-gradient-to-br from-rose-50 to-rose-100 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-rose-600">#{schoolRank}</div>
          <div className="text-xs text-gray-600 font-medium">School Rank</div>
        </div>
      )}
    </div>
  );
}
