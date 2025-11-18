/**
 * Gamification Hooks
 * Client-side hooks for managing gamification state and operations
 */

'use client';

import { useCallback, useEffect, useState } from 'react';
import type { UserGamification, UserLeaderboardEntry, BadgeProgress } from '@/types/gamification';
import {
  getUserGamification,
  updateUserGamification,
  awardXPToUser,
  getGlobalLeaderboard,
  getSchoolLeaderboard,
  getUserGlobalRank,
  getUserSchoolRank,
} from '@/lib/gamificationFirestore';
import {
  awardXP,
  updateStreaks,
  updateAchievementStats,
  getBadgeProgress,
  getGamificationSummary,
} from '@/lib/gamificationService';

/**
 * Main gamification hook
 */
export function useGamification(uid: string | undefined, schoolId?: string) {
  const [gamification, setGamification] = useState<UserGamification | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load gamification data
  useEffect(() => {
    if (!uid) {
      setGamification(null);
      setLoading(false);
      return;
    }

    const loadGamification = async () => {
      try {
        setLoading(true);
        const data = await getUserGamification(uid, schoolId);
        setGamification(data);
        setError(null);
      } catch (err) {
        console.error('Error loading gamification:', err);
        setError(err instanceof Error ? err.message : 'Failed to load gamification data');
      } finally {
        setLoading(false);
      }
    };

    loadGamification();
  }, [uid, schoolId]);

  // Award XP (non-blocking)
  const awardXPAction = useCallback(
    async (xpAmount: number, action: string) => {
      if (!uid || !gamification) return null;

      try {
        const { updated, newBadges } = awardXP(gamification, xpAmount, action);

        // Update streaks
        const withStreaks = updateStreaks(updated, true);

        // Save to Firestore
        await updateUserGamification(uid, withStreaks);

        // Update local state
        setGamification(withStreaks);

        return { updated: withStreaks, newBadges };
      } catch (err) {
        console.error('Error awarding XP:', err);
        return null;
      }
    },
    [uid, gamification],
  );

  // Update achievement stats
  const updateStats = useCallback(
    async (updates: Partial<UserGamification['achievementStats']>) => {
      if (!uid || !gamification) return null;

      try {
        const updated = updateAchievementStats(gamification, updates);
        await updateUserGamification(uid, updated);
        setGamification(updated);
        return updated;
      } catch (err) {
        console.error('Error updating stats:', err);
        return null;
      }
    },
    [uid, gamification],
  );

  // Update streaks
  const updateStreakAction = useCallback(
    async (performedActivity: boolean = true) => {
      if (!uid || !gamification) return null;

      try {
        const updated = updateStreaks(gamification, performedActivity);
        await updateUserGamification(uid, updated);
        setGamification(updated);
        return updated;
      } catch (err) {
        console.error('Error updating streak:', err);
        return null;
      }
    },
    [uid, gamification],
  );

  // Add explored subject
  const addExploredSubject = useCallback(
    async (subject: string) => {
      if (!uid || !gamification) return null;

      const newSubjects = new Set(gamification.achievementStats.subjectsExplored);
      newSubjects.add(subject);

      return updateStats({ subjectsExplored: newSubjects });
    },
    [uid, gamification, updateStats],
  );

  // Increment achievement stat
  const incrementStat = useCallback(
    async (
      statKey: 'opportunitiesExplored' | 'opportunitiesApplied' | 'opportunitiesSaved' | 'certificatesUploaded' | 'postsShared' | 'helpfulActionsCount',
    ) => {
      if (!uid || !gamification) return null;

      const currentValue = gamification.achievementStats[statKey] || 0;
      return updateStats({
        [statKey]: currentValue + 1,
      });
    },
    [uid, gamification, updateStats],
  );

  // Refresh from server
  const refresh = useCallback(async () => {
    if (!uid) return null;

    try {
      const data = await getUserGamification(uid, schoolId);
      setGamification(data);
      return data;
    } catch (err) {
      console.error('Error refreshing gamification:', err);
      return null;
    }
  }, [uid, schoolId]);

  return {
    gamification,
    loading,
    error,
    awardXPAction,
    updateStats,
    updateStreakAction,
    addExploredSubject,
    incrementStat,
    refresh,
  };
}

/**
 * Leaderboard hook
 */
export function useLeaderboard(
  scope: 'global' | 'school' = 'global',
  schoolId?: string,
  topN: number = 100,
) {
  const [entries, setEntries] = useState<UserLeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        setLoading(true);
        let data: any;

        if (scope === 'global') {
          data = await getGlobalLeaderboard(topN);
        } else if (scope === 'school' && schoolId) {
          const schoolData = await getSchoolLeaderboard(schoolId, topN);
          data = schoolData.entries;
        }

        setEntries(data || []);
        setError(null);
      } catch (err) {
        console.error('Error loading leaderboard:', err);
        setError(err instanceof Error ? err.message : 'Failed to load leaderboard');
        setEntries([]);
      } finally {
        setLoading(false);
      }
    };

    loadLeaderboard();
  }, [scope, schoolId, topN]);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      let data: any;

      if (scope === 'global') {
        data = await getGlobalLeaderboard(topN);
      } else if (scope === 'school' && schoolId) {
        const schoolData = await getSchoolLeaderboard(schoolId, topN);
        data = schoolData.entries;
      }

      setEntries(data || []);
      setError(null);
    } catch (err) {
      console.error('Error refreshing leaderboard:', err);
      setError(err instanceof Error ? err.message : 'Failed to refresh leaderboard');
    } finally {
      setLoading(false);
    }
  }, [scope, schoolId, topN]);

  return { entries, loading, error, refresh };
}

/**
 * User rank hook
 */
export function useUserRank(uid: string | undefined, schoolId?: string) {
  const [globalRank, setGlobalRank] = useState<number>(0);
  const [schoolRank, setSchoolRank] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!uid) {
      setGlobalRank(0);
      setSchoolRank(0);
      setLoading(false);
      return;
    }

    const loadRanks = async () => {
      try {
        setLoading(true);
        const global = await getUserGlobalRank(uid);
        setGlobalRank(global);

        if (schoolId) {
          const school = await getUserSchoolRank(uid, schoolId);
          setSchoolRank(school);
        }

        setError(null);
      } catch (err) {
        console.error('Error loading ranks:', err);
        setError(err instanceof Error ? err.message : 'Failed to load ranks');
      } finally {
        setLoading(false);
      }
    };

    loadRanks();
  }, [uid, schoolId]);

  return { globalRank, schoolRank, loading, error };
}

/**
 * Badge progress hook
 */
export function useBadgeProgress(gamification: UserGamification | null) {
  const [progress, setProgress] = useState<BadgeProgress[]>([]);

  useEffect(() => {
    if (!gamification) {
      setProgress([]);
      return;
    }

    const badgeProgress = getBadgeProgress(gamification);
    setProgress(badgeProgress);
  }, [gamification]);

  return progress;
}

/**
 * Gamification summary hook
 */
export function useGamificationSummary(
  gamification: UserGamification | null,
  leaderboardRank: number = 0,
  schoolRank?: number,
) {
  const [summary, setSummary] = useState<ReturnType<typeof getGamificationSummary> | null>(null);

  useEffect(() => {
    if (!gamification) {
      setSummary(null);
      return;
    }

    const summaryData = getGamificationSummary(gamification, leaderboardRank, schoolRank);
    setSummary(summaryData);
  }, [gamification, leaderboardRank, schoolRank]);

  return summary;
}

/**
 * Streak status hook
 */
export function useStreakStatus(gamification: UserGamification | null) {
  const [streakStatus, setStreakStatus] = useState({
    dailyStreakActive: false,
    weeklyStreakActive: false,
    currentDailyStreak: 0,
    bestStreak: 0,
  });

  useEffect(() => {
    if (!gamification) {
      return;
    }

    const now = new Date();
    const today = now.toDateString();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);

    const dailyActive =
      gamification.streaks.daily.lastActivityDate === today ||
      gamification.streaks.daily.lastActivityDate === yesterday.toDateString();

    const daysSinceWeeklyActivity = Math.floor(
      (now.getTime() - new Date(gamification.streaks.weekly.lastActivityDate).getTime()) /
        (1000 * 60 * 60 * 24),
    );

    const weeklyActive = daysSinceWeeklyActivity <= 7;
    const bestStreak = Math.max(
      gamification.streaks.daily.best,
      gamification.streaks.weekly.best,
    );

    setStreakStatus({
      dailyStreakActive: dailyActive,
      weeklyStreakActive: weeklyActive,
      currentDailyStreak: gamification.streaks.daily.current,
      bestStreak,
    });
  }, [gamification]);

  return streakStatus;
}
