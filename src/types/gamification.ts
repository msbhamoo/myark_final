/**
 * Gamification Types
 * Comprehensive type definitions for the gamification system
 */

export type BadgeName =
  | 'FirstStep'
  | 'ExplorerMode'
  | 'OpportunityHunter'
  | 'EarlyBird'
  | 'StayCurious'
  | 'ConsistencyKing'
  | 'MathNinja'
  | 'ScienceChamp'
  | 'CodeWizard'
  | 'WordWarrior'
  | 'GKGladiator'
  | 'ArtSoul'
  | 'SportsStar'
  | 'BrainiacBadge'
  | 'TopHelper'
  | 'FriendlyGuide'
  | 'TrendSpotter'
  | 'InfluencerBadge'
  | 'CertificateCollector'
  | 'AchievementWallBuilder'
  | 'VerifiedScholar'
  | 'ProfilePro'
  | 'StarPortfolio'
  | 'StreakHero'
  | 'StreakMaster'
  | 'StreakLegend'
  | 'NeverGiveUp'
  | 'DailyGrinder'
  | 'AllRounder'
  | 'RisingStar'
  | 'SchoolPride'
  | 'CityChampion'
  | 'MyarkChampion';

export type BadgeCategory =
  | 'first_steps'
  | 'exploration'
  | 'subject_mastery'
  | 'social'
  | 'achievement'
  | 'consistency'
  | 'community'
  | 'portfolio'
  | 'leaderboard';

export type StreakType = 'daily' | 'weekly' | 'monthly';

export type LeaderboardPeriod = 'all_time' | 'month' | 'week';

export type LeaderboardMetric = 'xp' | 'badge_count' | 'streak_count';

export interface Badge {
  id: BadgeName;
  name: string;
  displayName: string;
  description: string;
  category: BadgeCategory;
  icon: string; // emoji or icon class
  color: string; // tailwind color
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  earnedAt?: string | null;
  schoolSpecific?: boolean; // Whether badge is school-level
  globalOnly?: boolean; // Whether badge is only global
}

export interface UserBadge extends Badge {
  earnedAt: string;
  progress?: number; // 0-100 for badges in progress
}

export interface Streak {
  type: StreakType;
  current: number;
  best: number;
  lastActivityDate: string; // ISO date string
  startDate: string; // ISO date string
  active: boolean; // Whether streak is currently active
}

export interface UserStreaks {
  daily: Streak;
  weekly: Streak;
}

export interface UserGamification {
  uid: string;
  schoolId?: string | null;
  totalXP: number;
  level: number;
  badges: UserBadge[];
  streaks: UserStreaks;
  achievementStats: {
    opportunitiesExplored: number;
    opportunitiesApplied: number;
    opportunitiesSaved: number;
    certificatesUploaded: number;
    postsShared: number;
    helpfulActionsCount: number;
    subjectsExplored: Set<string>;
  };
  lastXPUpdate: string | null;
  lastStreakUpdate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface XPEvent {
  type:
    | 'explore_opportunity'
    | 'apply_opportunity'
    | 'save_opportunity'
    | 'upload_certificate'
    | 'share_content'
    | 'help_other_student'
    | 'explore_subject'
    | 'complete_profile'
    | 'first_login'
    | 'community_post'
    | 'community_comment'
    | 'community_upvote'
    | 'badge_earned';
  xpAmount: number;
  timestamp: string;
  description: string;
}

export interface UserLeaderboardEntry {
  uid: string;
  displayName: string;
  photoUrl?: string | null;
  schoolId?: string | null;
  schoolName?: string | null;
  totalXP: number;
  level: number;
  badgeCount: number;
  bestStreak: number;
  rank: number;
}

export interface SchoolLeaderboard {
  schoolId: string;
  schoolName: string;
  entries: UserLeaderboardEntry[];
  generatedAt: string;
}

export interface GlobalLeaderboard {
  entries: UserLeaderboardEntry[];
  generatedAt: string;
}

export interface BadgeProgress {
  badgeName: BadgeName;
  progress: number; // 0-100
  currentValue: number;
  requiredValue: number;
  description: string;
  status: 'locked' | 'in_progress' | 'earned';
}

export interface GamificationStats {
  totalXP: number;
  level: number;
  badgeCount: number;
  currentStreak: number;
  bestStreak: number;
  leaderboardRank: number;
  schoolRank?: number;
  nextLevelXP: number;
  xpToNextLevel: number;
  recentBadges: UserBadge[];
  badgesInProgress: BadgeProgress[];
}
