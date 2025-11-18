/**
 * Core Gamification Service
 * Handles XP tracking, badge evaluation, streak management, and leaderboard logic
 * Completely isolated and non-intrusive to existing features
 */

import {
  type Badge,
  type BadgeName,
  type UserBadge,
  type UserGamification,
  type UserStreaks,
  type Streak,
  type BadgeProgress,
} from '@/types/gamification';
import {
  BADGE_DEFINITIONS,
  BADGE_REQUIREMENTS,
  XP_REWARDS,
  LEVEL_CONFIG,
  getLevelThreshold,
  getNextLevelThreshold,
  SUBJECT_CATEGORIES,
  STREAK_CONFIG,
} from '@/constants/gamification';

/**
 * Initialize a new user gamification record
 */
export function initializeUserGamification(uid: string, schoolId?: string): UserGamification {
  const now = new Date().toISOString();
  const today = new Date().toDateString();

  return {
    uid,
    schoolId: schoolId || null,
    totalXP: 0,
    level: 1,
    badges: [],
    streaks: {
      daily: {
        type: 'daily',
        current: 0,
        best: 0,
        lastActivityDate: today,
        startDate: today,
        active: false,
      },
      weekly: {
        type: 'weekly',
        current: 0,
        best: 0,
        lastActivityDate: today,
        startDate: today,
        active: false,
      },
    },
    achievementStats: {
      opportunitiesExplored: 0,
      opportunitiesApplied: 0,
      opportunitiesSaved: 0,
      certificatesUploaded: 0,
      postsShared: 0,
      helpfulActionsCount: 0,
      subjectsExplored: new Set(),
    },
    lastXPUpdate: null,
    lastStreakUpdate: now,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Award XP for an action
 * Returns updated gamification record and any newly earned badges
 */
export function awardXP(
  gamification: UserGamification,
  xpAmount: number,
  action: string,
): {
  updated: UserGamification;
  newBadges: UserBadge[];
} {
  const updated = { ...gamification };
  updated.totalXP += xpAmount;
  updated.lastXPUpdate = new Date().toISOString();
  updated.updatedAt = new Date().toISOString();

  // Recalculate level
  updated.level = calculateLevel(updated.totalXP);

  // Evaluate badges
  const currentBadgeIds = new Set(updated.badges.map((b) => b.id));
  const newBadges: UserBadge[] = [];

  const evaluatedBadges = evaluateBadges(updated);
  evaluatedBadges.forEach((badge) => {
    if (!currentBadgeIds.has(badge.id)) {
      newBadges.push(badge);
      updated.badges.push(badge);
      updated.totalXP += XP_REWARDS.BADGE_EARNED;
    }
  });

  return { updated, newBadges };
}

/**
 * Update achievement statistics
 */
export function updateAchievementStats(
  gamification: UserGamification,
  updates: Partial<UserGamification['achievementStats']>,
): UserGamification {
  const updated = { ...gamification };
  updated.achievementStats = {
    ...updated.achievementStats,
    ...updates,
  };

  // Merge subject sets if provided
  if (updates.subjectsExplored) {
    updated.achievementStats.subjectsExplored = new Set([
      ...updated.achievementStats.subjectsExplored,
      ...updates.subjectsExplored,
    ]);
  }

  updated.updatedAt = new Date().toISOString();
  return updated;
}

/**
 * Calculate user level based on total XP
 */
export function calculateLevel(totalXP: number): number {
  for (let level = LEVEL_CONFIG.MAX_LEVEL; level >= 1; level--) {
    if (totalXP >= getLevelThreshold(level)) {
      return level;
    }
  }
  return 1;
}

/**
 * Get XP threshold for a specific level
 */
export function getLevelXPThreshold(level: number): number {
  return getLevelThreshold(level);
}

/**
 * Get XP needed to reach next level
 */
export function getXPToNextLevel(currentXP: number): number {
  const currentLevel = calculateLevel(currentXP);
  const currentLevelThreshold = getLevelThreshold(currentLevel);
  const nextLevelThreshold = getLevelThreshold(currentLevel + 1);

  if (currentLevel >= LEVEL_CONFIG.MAX_LEVEL) {
    return 0;
  }

  return nextLevelThreshold - currentXP;
}

/**
 * Evaluate and return all earned badges for a user
 */
export function evaluateBadges(gamification: UserGamification): UserBadge[] {
  const badges: UserBadge[] = [];
  const now = new Date().toISOString();

  // Build stats object for badge evaluation
  const stats = buildBadgeEvaluationStats(gamification);

  Object.entries(BADGE_REQUIREMENTS).forEach(([badgeName, requirement]) => {
    const typedBadgeName = badgeName as BadgeName;

    // Check if user already has this badge
    const alreadyHasBadge = gamification.badges.some((b) => b.id === typedBadgeName);
    if (alreadyHasBadge) return;

    // Check if requirement is met
    if (requirement.checkFunction(stats)) {
      const badgeDefinition = BADGE_DEFINITIONS[typedBadgeName];
      if (badgeDefinition) {
        badges.push({
          ...badgeDefinition,
          earnedAt: now,
        });
      }
    }
  });

  return badges;
}

/**
 * Get progress for badges not yet earned
 */
export function getBadgeProgress(gamification: UserGamification): BadgeProgress[] {
  const stats = buildBadgeEvaluationStats(gamification);
  const earnedBadgeIds = new Set(gamification.badges.map((b) => b.id));
  const progress: BadgeProgress[] = [];

  Object.entries(BADGE_REQUIREMENTS).forEach(([badgeName, requirement]) => {
    const typedBadgeName = badgeName as BadgeName;

    if (earnedBadgeIds.has(typedBadgeName)) {
      return; // Already earned
    }

    const badgeDefinition = BADGE_DEFINITIONS[typedBadgeName];
    if (!badgeDefinition) return;

    const isEarned = requirement.checkFunction(stats);

    let progressValue = 0;
    let requiredValue = 1;

    if (requirement.progressFunction) {
      const progressData = requirement.progressFunction(stats);
      progressValue = progressData.current;
      requiredValue = progressData.required;
    }

    progress.push({
      badgeName: typedBadgeName,
      progress: Math.min(100, (progressValue / requiredValue) * 100),
      currentValue: progressValue,
      requiredValue: requiredValue,
      description: requirement.criterion,
      status: isEarned ? 'earned' : progressValue > 0 ? 'in_progress' : 'locked',
    });
  });

  return progress.sort((a, b) => b.progress - a.progress);
}

/**
 * Update streaks based on activity
 */
export function updateStreaks(
  gamification: UserGamification,
  performedActivity: boolean = true,
): UserGamification {
  const updated = { ...gamification };
  const now = new Date();
  const today = now.toDateString();

  if (!performedActivity) {
    updated.lastStreakUpdate = new Date().toISOString();
    updated.updatedAt = new Date().toISOString();
    return updated;
  }

  // Update daily streak
  const lastActivityDate = gamification.streaks.daily.lastActivityDate;
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);

  const isConsecutiveDay =
    lastActivityDate === today ||
    lastActivityDate === yesterday.toDateString();

  if (isConsecutiveDay && lastActivityDate !== today) {
    // New day in streak
    updated.streaks.daily = {
      ...updated.streaks.daily,
      current: updated.streaks.daily.current + 1,
      lastActivityDate: today,
      active: true,
    };

    // Update best streak if current exceeds it
    if (updated.streaks.daily.current > updated.streaks.daily.best) {
      updated.streaks.daily.best = updated.streaks.daily.current;
    }
  } else if (lastActivityDate === today) {
    // Already active today, do nothing
    updated.streaks.daily.lastActivityDate = today;
    updated.streaks.daily.active = true;
  } else {
    // Streak broken - reset
    updated.streaks.daily = {
      ...updated.streaks.daily,
      current: 1,
      lastActivityDate: today,
      startDate: today,
      active: true,
    };
  }

  // Weekly streak logic (resets on Sunday or after 7 days)
  const lastWeeklyDate = new Date(gamification.streaks.weekly.lastActivityDate);
  const daysSinceLastActivity = Math.floor(
    (now.getTime() - lastWeeklyDate.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (daysSinceLastActivity <= 7 && daysSinceLastActivity > 0) {
    updated.streaks.weekly = {
      ...updated.streaks.weekly,
      current: updated.streaks.weekly.current + 1,
      lastActivityDate: today,
      active: true,
    };

    if (updated.streaks.weekly.current > updated.streaks.weekly.best) {
      updated.streaks.weekly.best = updated.streaks.weekly.current;
    }
  } else if (daysSinceLastActivity > 7) {
    // Weekly streak broken
    updated.streaks.weekly = {
      ...updated.streaks.weekly,
      current: 1,
      lastActivityDate: today,
      startDate: today,
      active: true,
    };
  }

  updated.lastStreakUpdate = new Date().toISOString();
  updated.updatedAt = new Date().toISOString();

  return updated;
}

/**
 * Check if streak is currently active
 */
export function isStreakActive(
  lastActivityDate: string,
  streakType: 'daily' | 'weekly' = 'daily',
): boolean {
  const lastActivity = new Date(lastActivityDate);
  const now = new Date();
  const daysDiff = Math.floor((now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));

  if (streakType === 'daily') {
    return daysDiff <= 1; // Active if activity within last 1 day
  } else {
    return daysDiff <= 7; // Active if activity within last 7 days
  }
}

/**
 * Build stats object for badge evaluation
 */
function buildBadgeEvaluationStats(gamification: UserGamification): Record<string, any> {
  const stats = gamification.achievementStats;

  // Count subjects from the set
  const subjectCounts: Record<string, number> = {};
  stats.subjectsExplored.forEach((subject) => {
    Object.entries(SUBJECT_CATEGORIES).forEach(([category, keywords]) => {
      keywords.forEach((keyword) => {
        if (subject.toLowerCase().includes(keyword.toLowerCase())) {
          subjectCounts[category] = (subjectCounts[category] || 0) + 1;
        }
      });
    });
  });

  return {
    ...stats,
    subjectCounts,
    level: gamification.level,
    totalBadges: gamification.badges.length,
    totalXP: gamification.totalXP,
    currentStreak: gamification.streaks.daily.current,
    bestStreak: Math.max(gamification.streaks.daily.best, gamification.streaks.weekly.best),
    profileCompletion: 0, // Will be updated by profile service
    academicCompletion: 0, // Will be updated by profile service
    earlyBirdCount: 0, // Will be tracked in separate collection
    appreciationCount: 0, // Will be tracked in community service
    popularSharesCount: 0, // Will be tracked in community service
    schoolRank: 0, // Will be fetched from leaderboard
    cityRank: 0, // Will be fetched from leaderboard
    globalRank: 0, // Will be fetched from leaderboard
    streakBrokenAndRestarted: false, // Flag for persistence
  };
}

/**
 * Format badge for display
 */
export function formatBadgeForDisplay(badge: UserBadge): string {
  return `${badge.icon} ${badge.displayName}`;
}

/**
 * Get badge rarity color mapping
 */
export function getBadgeRarityColor(rarity: Badge['rarity']): string {
  const rarityColors: Record<Badge['rarity'], string> = {
    common: 'bg-gray-200 text-gray-800',
    uncommon: 'bg-green-200 text-green-800',
    rare: 'bg-blue-200 text-blue-800',
    epic: 'bg-purple-200 text-purple-800',
    legendary: 'bg-yellow-200 text-yellow-800',
  };
  return rarityColors[rarity];
}

/**
 * Calculate percentage progress to next level
 */
export function getProgressToNextLevel(totalXP: number): number {
  const currentLevel = calculateLevel(totalXP);
  const currentLevelThreshold = getLevelThreshold(currentLevel);
  const nextLevelThreshold = getLevelThreshold(currentLevel + 1);

  if (currentLevel >= LEVEL_CONFIG.MAX_LEVEL) {
    return 100;
  }

  const progressXP = totalXP - currentLevelThreshold;
  const requiredXP = nextLevelThreshold - currentLevelThreshold;

  return Math.round((progressXP / requiredXP) * 100);
}

/**
 * Get gamification summary stats
 */
export function getGamificationSummary(
  gamification: UserGamification,
  leaderboardRank: number = 0,
  schoolRank?: number,
) {
  const nextLevelXP = getLevelThreshold(gamification.level + 1);
  const xpToNextLevel = Math.max(0, nextLevelXP - gamification.totalXP);

  return {
    totalXP: gamification.totalXP,
    level: gamification.level,
    badgeCount: gamification.badges.length,
    currentStreak: gamification.streaks.daily.current,
    bestStreak: Math.max(gamification.streaks.daily.best, gamification.streaks.weekly.best),
    leaderboardRank,
    schoolRank: schoolRank || 0,
    nextLevelXP,
    xpToNextLevel,
    progressToNextLevel: getProgressToNextLevel(gamification.totalXP),
    recentBadges: gamification.badges
      .sort((a, b) => new Date(b.earnedAt).getTime() - new Date(a.earnedAt).getTime())
      .slice(0, 3),
  };
}
