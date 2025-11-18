/**
 * Gamification System - Central Export Module
 * Single import point for all gamification functionality
 */

// ============================================================================
// TYPES & CONSTANTS
// ============================================================================

export type {
  Badge,
  BadgeName,
  BadgeCategory,
  UserBadge,
  Streak,
  UserStreaks,
  UserGamification,
  XPEvent,
  UserLeaderboardEntry,
  SchoolLeaderboard,
  GlobalLeaderboard,
  BadgeProgress,
  GamificationStats,
  StreakType,
  LeaderboardPeriod,
  LeaderboardMetric,
} from '@/types/gamification';

export {
  BADGE_DEFINITIONS,
  BADGE_REQUIREMENTS,
  XP_REWARDS,
  LEVEL_CONFIG,
  SUBJECT_CATEGORIES,
  STREAK_CONFIG,
  LEADERBOARD_CONFIG,
  getLevelThreshold,
  getNextLevelThreshold,
} from '@/constants/gamification';

// ============================================================================
// CORE SERVICE (Pure Functions)
// ============================================================================

export {
  initializeUserGamification,
  awardXP,
  updateAchievementStats,
  calculateLevel,
  getLevelXPThreshold,
  getXPToNextLevel,
  evaluateBadges,
  getBadgeProgress,
  updateStreaks,
  isStreakActive,
  formatBadgeForDisplay,
  getBadgeRarityColor,
  getProgressToNextLevel,
  getGamificationSummary,
} from '@/lib/gamificationService';

// ============================================================================
// FIRESTORE LAYER (Data Persistence)
// ============================================================================

export {
  getUserGamification,
  updateUserGamification,
  awardXPToUser,
  getGlobalLeaderboard,
  getSchoolLeaderboard,
  getUserGlobalRank,
  getUserSchoolRank,
  batchUpdateGamification,
  getTopPerformers,
  syncUserProfileToGamification,
} from '@/lib/gamificationFirestore';

// ============================================================================
// INTEGRATION UTILITIES (Easy XP Awards)
// ============================================================================

export {
  awardXPForExploreOpportunity,
  awardXPForApplyOpportunity,
  awardXPForSaveOpportunity,
  awardXPForUploadCertificate,
  awardXPForShare,
  awardXPForHelp,
  awardXPForCompleteProfile,
  awardXPForFirstLogin,
  awardXPForCommunityPost,
  awardXPForCommunityComment,
  awardXPForCommunityUpvote,
  batchAwardXP,
  syncProfileToGamification,
} from '@/lib/gamificationIntegration';

// ============================================================================
// REACT HOOKS
// ============================================================================

export {
  useGamification,
  useLeaderboard,
  useUserRank,
  useBadgeProgress,
  useGamificationSummary,
  useStreakStatus,
} from '@/hooks/use-gamification';

// ============================================================================
// UI COMPONENTS
// ============================================================================

export {
  XPDisplay,
  BadgesDisplay,
  StreakTracker,
  LeaderboardView,
  BadgeProgressDisplay,
  AchievementSummary,
} from '@/components/gamification/ProfileGamification';

export {
  GamificationHeroSection,
} from '@/components/gamification/GamificationHeroSection';

export {
  InstagramBadgesDisplay,
} from '@/components/gamification/InstagramBadgesDisplay';

export {
  DuolingoXPProgress,
} from '@/components/gamification/DuolingoXPProgress';

export {
  StreakDisplay,
} from '@/components/gamification/StreakDisplay';

export {
  AchievementTimeline,
} from '@/components/gamification/AchievementTimeline';

export {
  StudentProfileGamificationSection,
} from '@/components/gamification/StudentProfileGamificationSection';

export {
  SchoolLeaderboardModal,
} from '@/components/gamification/SchoolLeaderboardModal';

export {
  default as GamificationPage,
  GamificationWidget,
} from '@/components/gamification/GamificationPage';

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

/**
 * In a React component:
 * 
 * import { 
 *   useGamification, 
 *   awardXPForExploreOpportunity,
 *   GamificationPage 
 * } from '@/gamification';
 * 
 * function MyComponent() {
 *   const { gamification } = useGamification(userId);
 *   
 *   const handleAction = async () => {
 *     await awardXPForExploreOpportunity(userId, gamification, 'Math');
 *   };
 *   
 *   return (
 *     <>
 *       <button onClick={handleAction}>Do Action</button>
 *       <GamificationPage uid={userId} />
 *     </>
 *   );
 * }
 */
