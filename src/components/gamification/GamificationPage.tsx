/**
 * Complete Gamification Page Component
 * Displays all gamification features in student profile
 * Can be embedded in dashboard or as standalone page
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useGamification, useLeaderboard, useUserRank, useBadgeProgress, useGamificationSummary, useStreakStatus } from '@/hooks/use-gamification';
import {
  XPDisplay,
  BadgesDisplay,
  StreakTracker,
  LeaderboardView,
  BadgeProgressDisplay,
  AchievementSummary,
} from '@/components/gamification/ProfileGamification';
import type { UserGamification } from '@/types/gamification';
import { RefreshCw, Zap, Trophy, Target, Award, TrendingUp } from 'lucide-react';

interface GamificationPageProps {
  uid: string;
  schoolId?: string;
  compact?: boolean; // Show minimal version
}

export default function GamificationPage({
  uid,
  schoolId,
  compact = false,
}: GamificationPageProps) {
  const { gamification, loading, awardXPAction } = useGamification(uid, schoolId);
  const { entries: globalLeaderboard } = useLeaderboard('global', undefined, 20);
  const { entries: schoolLeaderboard } = useLeaderboard('school', schoolId, 15);
  const { globalRank, schoolRank } = useUserRank(uid, schoolId);
  const badgeProgress = useBadgeProgress(gamification);
  const summary = useGamificationSummary(gamification, globalRank, schoolRank);
  const streakStatus = useStreakStatus(gamification);

  if (loading || !gamification || !summary) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-32 bg-gray-200 rounded-lg" />
        <div className="h-40 bg-gray-200 rounded-lg" />
        <div className="h-60 bg-gray-200 rounded-lg" />
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${compact ? 'space-y-4' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg text-white">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <h1 className={`font-bold text-gray-900 ${compact ? 'text-xl' : 'text-2xl'}`}>
              Your Achievements
            </h1>
            <p className="text-sm text-gray-600">
              Keep playing and earning rewards!
            </p>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <AchievementSummary
        level={summary.level}
        totalXP={summary.totalXP}
        badgeCount={summary.badgeCount}
        currentStreak={summary.currentStreak}
        globalRank={summary.leaderboardRank}
        schoolRank={summary.schoolRank}
        className={compact ? 'grid-cols-2' : ''}
      />

      {!compact && (
        <>
          {/* XP and Level Progress */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              <h2 className="text-lg font-semibold text-gray-900">Experience & Levels</h2>
            </div>
            <XPDisplay
              totalXP={summary.totalXP}
              level={summary.level}
              nextLevelXP={summary.nextLevelXP}
              className="shadow-sm"
            />
          </div>

          {/* Streaks */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-orange-500" />
              <h2 className="text-lg font-semibold text-gray-900">Activity Streaks</h2>
            </div>
            <StreakTracker gamification={gamification} />
          </div>

          {/* Earned Badges */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg font-semibold text-gray-900">Earned Badges</h2>
            </div>
            <BadgesDisplay badges={gamification.badges} maxDisplay={24} />
          </div>

          {/* Badges in Progress */}
          {badgeProgress.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-500" />
                <h2 className="text-lg font-semibold text-gray-900">Badges in Progress</h2>
              </div>
              <BadgeProgressDisplay progress={badgeProgress} maxDisplay={8} />
            </div>
          )}

          {/* Global Leaderboard */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg font-semibold text-gray-900">Global Leaderboard</h2>
            </div>
            <LeaderboardView
              entries={globalLeaderboard}
              userRank={globalRank}
              scope="global"
              className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
            />
          </div>

          {/* School Leaderboard */}
          {schoolId && schoolLeaderboard.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-blue-500" />
                <h2 className="text-lg font-semibold text-gray-900">School Leaderboard</h2>
              </div>
              <LeaderboardView
                entries={schoolLeaderboard}
                userRank={schoolRank}
                scope="school"
                className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
              />
            </div>
          )}

          {/* Info Section */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">How to Earn XP & Badges?</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Explore opportunities (10 XP each)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Apply to opportunities (25 XP each)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Save opportunities (15 XP each)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Upload certificates (50 XP each)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Share and help others (20-30 XP each)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Maintain daily streaks for consistency bonuses</span>
              </li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

/**
 * Compact gamification widget for dashboard integration
 */
export function GamificationWidget({
  uid,
  schoolId,
}: {
  uid: string;
  schoolId?: string;
}) {
  const { gamification, loading } = useGamification(uid, schoolId);
  const { globalRank } = useUserRank(uid, schoolId);
  const summary = useGamificationSummary(gamification, globalRank);
  const streakStatus = useStreakStatus(gamification);

  if (loading || !gamification || !summary) {
    return (
      <div className="animate-pulse h-32 bg-gray-200 rounded-lg" />
    );
  }

  return (
    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-4 border border-purple-200">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">Your Progress</h3>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-white rounded p-2 text-center">
          <div className="text-lg font-bold text-purple-600">{summary.level}</div>
          <div className="text-xs text-gray-600">Level</div>
        </div>

        <div className="bg-white rounded p-2 text-center">
          <div className="text-lg font-bold text-blue-600">{summary.totalXP}</div>
          <div className="text-xs text-gray-600">XP</div>
        </div>

        <div className="bg-white rounded p-2 text-center">
          <div className="text-lg font-bold text-yellow-600">{summary.badgeCount}</div>
          <div className="text-xs text-gray-600">Badges</div>
        </div>

        <div className="bg-white rounded p-2 text-center">
          <div className="text-lg font-bold text-orange-600">{streakStatus.currentDailyStreak}</div>
          <div className="text-xs text-gray-600">Streak</div>
        </div>
      </div>

      {gamification.badges.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-700">Recent Badges</p>
          <div className="flex gap-1 flex-wrap">
            {gamification.badges
              .slice(-5)
              .reverse()
              .map((badge) => (
                <div key={badge.id} title={badge.description}>
                  <span className="text-lg cursor-pointer hover:scale-110 transition-transform">
                    {badge.icon}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
