/**
 * Gamification Constants
 * XP rewards, badge definitions, and achievement criteria
 */

import type { Badge, BadgeName, StreakType } from '@/types/gamification';

// XP Reward Configuration
export const XP_REWARDS = {
  EXPLORE_OPPORTUNITY: 10,
  APPLY_OPPORTUNITY: 25,
  SAVE_OPPORTUNITY: 15,
  UPLOAD_CERTIFICATE: 50,
  SHARE_CONTENT: 20,
  HELP_OTHER_STUDENT: 30,
  EXPLORE_SUBJECT: 5,
  COMPLETE_PROFILE: 100,
  FIRST_LOGIN: 20,
  COMMUNITY_POST: 25,
  COMMUNITY_COMMENT: 10,
  COMMUNITY_UPVOTE: 5,
  BADGE_EARNED: 25, // Bonus XP when earning a badge
};

// Leveling System
export const LEVEL_CONFIG = {
  BASE_XP_PER_LEVEL: 100,
  XP_INCREMENT: 50, // Increases every level
  MAX_LEVEL: 50,
};

export const getLevelThreshold = (level: number): number => {
  if (level === 1) return 0;
  let totalXP = 0;
  for (let i = 1; i < level; i++) {
    totalXP += LEVEL_CONFIG.BASE_XP_PER_LEVEL + (i - 1) * LEVEL_CONFIG.XP_INCREMENT;
  }
  return totalXP;
};

export const getNextLevelThreshold = (level: number): number => {
  return LEVEL_CONFIG.BASE_XP_PER_LEVEL + (level - 1) * LEVEL_CONFIG.XP_INCREMENT;
};

// Badge Definitions
export const BADGE_DEFINITIONS: Record<BadgeName, Badge> = {
  // First Steps
  FirstStep: {
    id: 'FirstStep',
    name: 'First Step Badge',
    displayName: '🚀 First Step',
    description: 'Welcome to Myark! Complete your profile to take your first step.',
    category: 'first_steps',
    icon: '🚀',
    color: 'blue',
    rarity: 'common',
  },
  // Exploration
  ExplorerMode: {
    id: 'ExplorerMode',
    name: 'Explorer Mode ON',
    displayName: '🗺️ Explorer',
    description: 'Explore 5 different opportunities across various categories.',
    category: 'exploration',
    icon: '🗺️',
    color: 'cyan',
    rarity: 'common',
  },
  OpportunityHunter: {
    id: 'OpportunityHunter',
    name: 'Opportunity Hunter',
    displayName: '🎯 Opportunity Hunter',
    description: 'Apply to 5 opportunities to earn this achievement.',
    category: 'exploration',
    icon: '🎯',
    color: 'purple',
    rarity: 'uncommon',
  },
  EarlyBird: {
    id: 'EarlyBird',
    name: 'Early Bird',
    displayName: '🌅 Early Bird',
    description: 'Be among the first to discover and apply for new opportunities.',
    category: 'exploration',
    icon: '🌅',
    color: 'yellow',
    rarity: 'uncommon',
  },
  StayCurious: {
    id: 'StayCurious',
    name: 'Stay Curious',
    displayName: '🧠 Stay Curious',
    description: 'Explore opportunities in 5 different subject areas.',
    category: 'exploration',
    icon: '🧠',
    color: 'indigo',
    rarity: 'uncommon',
  },
  // Consistency
  ConsistencyKing: {
    id: 'ConsistencyKing',
    name: 'Consistency King/Queen',
    displayName: '👑 Consistency',
    description: 'Maintain a 7-day streak of platform activity.',
    category: 'consistency',
    icon: '👑',
    color: 'amber',
    rarity: 'rare',
  },
  // Subject Mastery
  MathNinja: {
    id: 'MathNinja',
    name: 'Math Ninja',
    displayName: '🥷 Math Ninja',
    description: 'Explore and apply for 3+ math-related opportunities.',
    category: 'subject_mastery',
    icon: '🥷',
    color: 'red',
    rarity: 'uncommon',
  },
  ScienceChamp: {
    id: 'ScienceChamp',
    name: 'Science Champ',
    displayName: '🔬 Science Champ',
    description: 'Explore and apply for 3+ science-related opportunities.',
    category: 'subject_mastery',
    icon: '🔬',
    color: 'green',
    rarity: 'uncommon',
  },
  CodeWizard: {
    id: 'CodeWizard',
    name: 'Code Wizard',
    displayName: '🧙 Code Wizard',
    description: 'Explore and apply for 3+ coding/programming opportunities.',
    category: 'subject_mastery',
    icon: '🧙',
    color: 'blue',
    rarity: 'uncommon',
  },
  WordWarrior: {
    id: 'WordWarrior',
    name: 'Word Warrior',
    displayName: '✍️ Word Warrior',
    description: 'Explore and apply for 3+ writing/literature opportunities.',
    category: 'subject_mastery',
    icon: '✍️',
    color: 'pink',
    rarity: 'uncommon',
  },
  GKGladiator: {
    id: 'GKGladiator',
    name: 'GK Gladiator',
    displayName: '⚔️ GK Gladiator',
    description: 'Explore and apply for 3+ general knowledge opportunities.',
    category: 'subject_mastery',
    icon: '⚔️',
    color: 'slate',
    rarity: 'uncommon',
  },
  ArtSoul: {
    id: 'ArtSoul',
    name: 'Art & Soul',
    displayName: '🎨 Art & Soul',
    description: 'Explore and apply for 3+ arts/creative opportunities.',
    category: 'subject_mastery',
    icon: '🎨',
    color: 'violet',
    rarity: 'uncommon',
  },
  SportsStar: {
    id: 'SportsStar',
    name: 'Sports Star',
    displayName: '⚽ Sports Star',
    description: 'Explore and apply for 3+ sports opportunities.',
    category: 'subject_mastery',
    icon: '⚽',
    color: 'orange',
    rarity: 'uncommon',
  },
  BrainiacBadge: {
    id: 'BrainiacBadge',
    name: 'Brainiac Badge',
    displayName: '🧩 Brainiac',
    description: 'Master 5+ different subject categories.',
    category: 'subject_mastery',
    icon: '🧩',
    color: 'fuchsia',
    rarity: 'rare',
  },
  // Social & Community
  TopHelper: {
    id: 'TopHelper',
    name: 'Top Helper',
    displayName: '🤝 Top Helper',
    description: 'Help 5+ other students through community interactions.',
    category: 'social',
    icon: '🤝',
    color: 'rose',
    rarity: 'uncommon',
  },
  FriendlyGuide: {
    id: 'FriendlyGuide',
    name: 'Friendly Guide',
    displayName: '👋 Friendly Guide',
    description: 'Receive appreciation from 3+ different students.',
    category: 'social',
    icon: '👋',
    color: 'teal',
    rarity: 'uncommon',
  },
  TrendSpotter: {
    id: 'TrendSpotter',
    name: 'Trend Spotter',
    displayName: '📈 Trend Spotter',
    description: 'Share 3 popular opportunities that get high engagement.',
    category: 'social',
    icon: '📈',
    color: 'cyan',
    rarity: 'rare',
  },
  InfluencerBadge: {
    id: 'InfluencerBadge',
    name: 'Influencer Badge',
    displayName: '⭐ Influencer',
    description: 'Share 10+ opportunities with high community engagement.',
    category: 'social',
    icon: '⭐',
    color: 'yellow',
    rarity: 'epic',
  },
  // Achievement & Portfolio
  CertificateCollector: {
    id: 'CertificateCollector',
    name: 'Certificate Collector',
    displayName: '📜 Certificate Collector',
    description: 'Upload 3+ certificates to your profile.',
    category: 'achievement',
    icon: '📜',
    color: 'emerald',
    rarity: 'uncommon',
  },
  AchievementWallBuilder: {
    id: 'AchievementWallBuilder',
    name: 'Achievement Wall Builder',
    displayName: '🏆 Achievement Builder',
    description: 'Add 5+ achievements to your portfolio.',
    category: 'achievement',
    icon: '🏆',
    color: 'amber',
    rarity: 'uncommon',
  },
  VerifiedScholar: {
    id: 'VerifiedScholar',
    name: 'Verified Scholar',
    displayName: '✅ Verified Scholar',
    description: 'Complete all academic sections of your profile.',
    category: 'achievement',
    icon: '✅',
    color: 'green',
    rarity: 'rare',
  },
  ProfilePro: {
    id: 'ProfilePro',
    name: 'Profile Pro',
    displayName: '💎 Profile Pro',
    description: 'Complete 90%+ of your profile information.',
    category: 'portfolio',
    icon: '💎',
    color: 'blue',
    rarity: 'epic',
  },
  StarPortfolio: {
    id: 'StarPortfolio',
    name: 'Star Portfolio',
    displayName: '⭐ Star Portfolio',
    description: 'Achieve a 100% complete profile with all sections filled.',
    category: 'portfolio',
    icon: '⭐',
    color: 'purple',
    rarity: 'epic',
  },
  // Streak Badges
  StreakHero: {
    id: 'StreakHero',
    name: 'Streak Hero',
    displayName: '🔥 Streak Hero',
    description: 'Maintain a 7-day activity streak.',
    category: 'consistency',
    icon: '🔥',
    color: 'orange',
    rarity: 'uncommon',
  },
  StreakMaster: {
    id: 'StreakMaster',
    name: 'Streak Master',
    displayName: '🔥🔥 Streak Master',
    description: 'Maintain a 21-day activity streak.',
    category: 'consistency',
    icon: '🔥',
    color: 'red',
    rarity: 'rare',
  },
  StreakLegend: {
    id: 'StreakLegend',
    name: 'Streak Legend',
    displayName: '🔥🔥🔥 Streak Legend',
    description: 'Maintain a 30-day activity streak.',
    category: 'consistency',
    icon: '🔥',
    color: 'amber',
    rarity: 'epic',
  },
  NeverGiveUp: {
    id: 'NeverGiveUp',
    name: 'Never Give Up Badge',
    displayName: '💪 Never Give Up',
    description: 'Break a streak and restart - earning badges through persistence.',
    category: 'consistency',
    icon: '💪',
    color: 'pink',
    rarity: 'rare',
  },
  DailyGrinder: {
    id: 'DailyGrinder',
    name: 'Daily Grinder',
    displayName: '⏰ Daily Grinder',
    description: 'Log in and perform actions for 15 consecutive days.',
    category: 'consistency',
    icon: '⏰',
    color: 'indigo',
    rarity: 'uncommon',
  },
  AllRounder: {
    id: 'AllRounder',
    name: 'All-Rounder Badge',
    displayName: '🎯 All-Rounder',
    description: 'Earn 10+ different badges.',
    category: 'achievement',
    icon: '🎯',
    color: 'violet',
    rarity: 'epic',
  },
  RisingStar: {
    id: 'RisingStar',
    name: 'Rising Star',
    displayName: '⭐ Rising Star',
    description: 'Reach Level 10.',
    category: 'leaderboard',
    icon: '⭐',
    color: 'yellow',
    rarity: 'rare',
  },
  SchoolPride: {
    id: 'SchoolPride',
    name: 'School Pride Badge',
    displayName: '🏫 School Pride',
    description: 'Rank in top 10 of your school leaderboard.',
    category: 'leaderboard',
    icon: '🏫',
    color: 'blue',
    rarity: 'rare',
    schoolSpecific: true,
  },
  CityChampion: {
    id: 'CityChampion',
    name: 'City Champion',
    displayName: '🏅 City Champion',
    description: 'Rank in top 10 across all schools in your city.',
    category: 'leaderboard',
    icon: '🏅',
    color: 'amber',
    rarity: 'epic',
    globalOnly: true,
  },
  MyarkChampion: {
    id: 'MyarkChampion',
    name: 'Myark Champion',
    displayName: '👑 Myark Champion',
    description: 'Rank in top 100 globally on the Myark platform.',
    category: 'leaderboard',
    icon: '👑',
    color: 'purple',
    rarity: 'legendary',
    globalOnly: true,
  },
};

// Badge Requirements
export const BADGE_REQUIREMENTS: Record<
  BadgeName,
  {
    criterion: string;
    checkFunction: (stats: any) => boolean;
    progressFunction?: (stats: any) => { current: number; required: number };
  }
> = {
  FirstStep: {
    criterion: 'Complete your profile',
    checkFunction: (stats) => stats.profileCompletion >= 30,
  },
  ExplorerMode: {
    criterion: 'Explore 5 opportunities',
    checkFunction: (stats) => stats.opportunitiesExplored >= 5,
    progressFunction: (stats) => ({
      current: stats.opportunitiesExplored,
      required: 5,
    }),
  },
  OpportunityHunter: {
    criterion: 'Apply to 5 opportunities',
    checkFunction: (stats) => stats.opportunitiesApplied >= 5,
    progressFunction: (stats) => ({
      current: stats.opportunitiesApplied,
      required: 5,
    }),
  },
  EarlyBird: {
    criterion: 'Apply to new opportunities quickly',
    checkFunction: (stats) => stats.earlyBirdCount >= 3,
    progressFunction: (stats) => ({
      current: stats.earlyBirdCount || 0,
      required: 3,
    }),
  },
  StayCurious: {
    criterion: 'Explore 5 different subjects',
    checkFunction: (stats) => stats.subjectsExplored?.size >= 5,
    progressFunction: (stats) => ({
      current: stats.subjectsExplored?.size || 0,
      required: 5,
    }),
  },
  ConsistencyKing: {
    criterion: 'Maintain 7-day streak',
    checkFunction: (stats) => stats.bestStreak >= 7,
  },
  MathNinja: {
    criterion: '3+ math opportunities',
    checkFunction: (stats) => (stats.subjectCounts?.['Math'] || 0) >= 3,
  },
  ScienceChamp: {
    criterion: '3+ science opportunities',
    checkFunction: (stats) => (stats.subjectCounts?.['Science'] || 0) >= 3,
  },
  CodeWizard: {
    criterion: '3+ coding opportunities',
    checkFunction: (stats) => (stats.subjectCounts?.['Coding'] || 0) >= 3,
  },
  WordWarrior: {
    criterion: '3+ writing opportunities',
    checkFunction: (stats) => (stats.subjectCounts?.['Writing'] || 0) >= 3,
  },
  GKGladiator: {
    criterion: '3+ GK opportunities',
    checkFunction: (stats) => (stats.subjectCounts?.['GK'] || 0) >= 3,
  },
  ArtSoul: {
    criterion: '3+ arts opportunities',
    checkFunction: (stats) => (stats.subjectCounts?.['Arts'] || 0) >= 3,
  },
  SportsStar: {
    criterion: '3+ sports opportunities',
    checkFunction: (stats) => (stats.subjectCounts?.['Sports'] || 0) >= 3,
  },
  BrainiacBadge: {
    criterion: 'Master 5+ subjects',
    checkFunction: (stats) => Object.values(stats.subjectCounts || {}).filter((count: any) => count >= 2).length >= 5,
  },
  TopHelper: {
    criterion: 'Help 5+ students',
    checkFunction: (stats) => stats.helpfulActionsCount >= 5,
    progressFunction: (stats) => ({
      current: stats.helpfulActionsCount,
      required: 5,
    }),
  },
  FriendlyGuide: {
    criterion: 'Get appreciated by 3+ students',
    checkFunction: (stats) => stats.appreciationCount >= 3,
  },
  TrendSpotter: {
    criterion: 'Share 3 popular opportunities',
    checkFunction: (stats) => stats.popularSharesCount >= 3,
  },
  InfluencerBadge: {
    criterion: 'Share 10+ popular opportunities',
    checkFunction: (stats) => stats.popularSharesCount >= 10,
    progressFunction: (stats) => ({
      current: stats.popularSharesCount || 0,
      required: 10,
    }),
  },
  CertificateCollector: {
    criterion: 'Upload 3+ certificates',
    checkFunction: (stats) => stats.certificatesUploaded >= 3,
    progressFunction: (stats) => ({
      current: stats.certificatesUploaded,
      required: 3,
    }),
  },
  AchievementWallBuilder: {
    criterion: 'Add 5+ achievements',
    checkFunction: (stats) => stats.achievementsCount >= 5,
    progressFunction: (stats) => ({
      current: stats.achievementsCount,
      required: 5,
    }),
  },
  VerifiedScholar: {
    criterion: 'Complete academic profile',
    checkFunction: (stats) => stats.academicCompletion >= 90,
  },
  ProfilePro: {
    criterion: '90%+ profile complete',
    checkFunction: (stats) => stats.profileCompletion >= 90,
  },
  StarPortfolio: {
    criterion: '100% profile complete',
    checkFunction: (stats) => stats.profileCompletion >= 100,
  },
  StreakHero: {
    criterion: '7-day streak',
    checkFunction: (stats) => stats.bestStreak >= 7,
  },
  StreakMaster: {
    criterion: '21-day streak',
    checkFunction: (stats) => stats.bestStreak >= 21,
  },
  StreakLegend: {
    criterion: '30-day streak',
    checkFunction: (stats) => stats.bestStreak >= 30,
  },
  NeverGiveUp: {
    criterion: 'Break and restart streak',
    checkFunction: (stats) => stats.streakBrokenAndRestarted === true,
  },
  DailyGrinder: {
    criterion: '15 consecutive days active',
    checkFunction: (stats) => stats.currentStreak >= 15,
  },
  AllRounder: {
    criterion: '10+ different badges',
    checkFunction: (stats) => stats.totalBadges >= 10,
    progressFunction: (stats) => ({
      current: stats.totalBadges,
      required: 10,
    }),
  },
  RisingStar: {
    criterion: 'Reach Level 10',
    checkFunction: (stats) => stats.level >= 10,
  },
  SchoolPride: {
    criterion: 'Top 10 in school',
    checkFunction: (stats) => stats.schoolRank <= 10,
  },
  CityChampion: {
    criterion: 'Top 10 in city',
    checkFunction: (stats) => stats.cityRank <= 10,
  },
  MyarkChampion: {
    criterion: 'Top 100 globally',
    checkFunction: (stats) => stats.globalRank <= 100,
  },
};

// Subject Categories
export const SUBJECT_CATEGORIES = {
  Math: ['Math', 'Mathematics', 'Arithmetic', 'Algebra', 'Geometry'],
  Science: ['Science', 'Biology', 'Chemistry', 'Physics', 'Astronomy'],
  Coding: ['Coding', 'Programming', 'Web Development', 'App Development', 'Software'],
  Writing: ['Writing', 'Literature', 'English', 'Essay', 'Content Writing'],
  GK: ['General Knowledge', 'GK', 'Current Affairs', 'History', 'Geography'],
  Arts: ['Arts', 'Art', 'Design', 'Graphic Design', 'Drawing', 'Painting'],
  Sports: ['Sports', 'Football', 'Cricket', 'Basketball', 'Athletics', 'Swimming'],
};

// Streak Configuration
export const STREAK_CONFIG: Record<StreakType, { intervalDays: number; name: string }> = {
  daily: {
    intervalDays: 1,
    name: 'Daily Streak',
  },
  weekly: {
    intervalDays: 7,
    name: 'Weekly Streak',
  },
  monthly: {
    intervalDays: 30,
    name: 'Monthly Streak',
  },
};

// Leaderboard Configuration
export const LEADERBOARD_CONFIG = {
  TOP_N_GLOBAL: 100,
  TOP_N_SCHOOL: 50,
  TOP_N_CITY: 100,
  CACHE_DURATION_MINUTES: 60,
};
