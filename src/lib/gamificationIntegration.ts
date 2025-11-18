/**
 * XP Award Integration Utilities
 * Non-intrusive functions to award XP for various actions
 * Can be called from existing features without disrupting their logic
 */

import type { UserGamification } from '@/types/gamification';
import { awardXP, updateStreaks, updateAchievementStats } from '@/lib/gamificationService';
import { updateUserGamification } from '@/lib/gamificationFirestore';
import { XP_REWARDS } from '@/constants/gamification';

/**
 * Safe wrapper to award XP without blocking the main operation
 * All errors are logged but not thrown
 */
async function safeAwardXP(
  uid: string,
  gamification: UserGamification,
  xpAmount: number,
  action: string,
): Promise<UserGamification | null> {
  try {
    const { updated, newBadges } = awardXP(gamification, xpAmount, action);
    const withStreaks = updateStreaks(updated, true);

    // Non-blocking save to Firestore
    updateUserGamification(uid, withStreaks).catch((err) => {
      console.error(`Failed to save XP award for ${action}:`, err);
    });

    return withStreaks;
  } catch (error) {
    console.error(`Error awarding XP for ${action}:`, error);
    return null;
  }
}

/**
 * Award XP for exploring an opportunity
 */
export async function awardXPForExploreOpportunity(
  uid: string,
  gamification: UserGamification,
  opportunityCategory?: string,
): Promise<UserGamification | null> {
  let updated = await safeAwardXP(
    uid,
    gamification,
    XP_REWARDS.EXPLORE_OPPORTUNITY,
    'explore_opportunity',
  );

  if (updated && opportunityCategory) {
    try {
      // Also track the subject
      const newSubjects = new Set(updated.achievementStats.subjectsExplored);
      newSubjects.add(opportunityCategory);
      updated = updateAchievementStats(updated, {
        opportunitiesExplored: updated.achievementStats.opportunitiesExplored + 1,
        subjectsExplored: newSubjects,
      });

      updateUserGamification(uid, updated).catch((err) => {
        console.error('Failed to save explored subject:', err);
      });
    } catch (error) {
      console.error('Error tracking explored subject:', error);
    }
  }

  return updated;
}

/**
 * Award XP for applying to an opportunity
 */
export async function awardXPForApplyOpportunity(
  uid: string,
  gamification: UserGamification,
): Promise<UserGamification | null> {
  const updated = await safeAwardXP(
    uid,
    gamification,
    XP_REWARDS.APPLY_OPPORTUNITY,
    'apply_opportunity',
  );

  if (updated) {
    try {
      const newUpdated = updateAchievementStats(updated, {
        opportunitiesApplied: updated.achievementStats.opportunitiesApplied + 1,
      });

      updateUserGamification(uid, newUpdated).catch((err) => {
        console.error('Failed to save applied opportunity:', err);
      });

      return newUpdated;
    } catch (error) {
      console.error('Error updating applied opportunity count:', error);
    }
  }

  return updated;
}

/**
 * Award XP for saving an opportunity
 */
export async function awardXPForSaveOpportunity(
  uid: string,
  gamification: UserGamification,
): Promise<UserGamification | null> {
  const updated = await safeAwardXP(
    uid,
    gamification,
    XP_REWARDS.SAVE_OPPORTUNITY,
    'save_opportunity',
  );

  if (updated) {
    try {
      const newUpdated = updateAchievementStats(updated, {
        opportunitiesSaved: updated.achievementStats.opportunitiesSaved + 1,
      });

      updateUserGamification(uid, newUpdated).catch((err) => {
        console.error('Failed to save saved opportunity:', err);
      });

      return newUpdated;
    } catch (error) {
      console.error('Error updating saved opportunity count:', error);
    }
  }

  return updated;
}

/**
 * Award XP for uploading a certificate
 */
export async function awardXPForUploadCertificate(
  uid: string,
  gamification: UserGamification,
): Promise<UserGamification | null> {
  const updated = await safeAwardXP(
    uid,
    gamification,
    XP_REWARDS.UPLOAD_CERTIFICATE,
    'upload_certificate',
  );

  if (updated) {
    try {
      const newUpdated = updateAchievementStats(updated, {
        certificatesUploaded: updated.achievementStats.certificatesUploaded + 1,
      });

      updateUserGamification(uid, newUpdated).catch((err) => {
        console.error('Failed to save certificate upload:', err);
      });

      return newUpdated;
    } catch (error) {
      console.error('Error updating certificate count:', error);
    }
  }

  return updated;
}

/**
 * Award XP for sharing content
 */
export async function awardXPForShare(
  uid: string,
  gamification: UserGamification,
): Promise<UserGamification | null> {
  const updated = await safeAwardXP(uid, gamification, XP_REWARDS.SHARE_CONTENT, 'share_content');

  if (updated) {
    try {
      const newUpdated = updateAchievementStats(updated, {
        postsShared: updated.achievementStats.postsShared + 1,
      });

      updateUserGamification(uid, newUpdated).catch((err) => {
        console.error('Failed to save share:', err);
      });

      return newUpdated;
    } catch (error) {
      console.error('Error updating share count:', error);
    }
  }

  return updated;
}

/**
 * Award XP for helping another student
 */
export async function awardXPForHelp(
  uid: string,
  gamification: UserGamification,
): Promise<UserGamification | null> {
  const updated = await safeAwardXP(
    uid,
    gamification,
    XP_REWARDS.HELP_OTHER_STUDENT,
    'help_other_student',
  );

  if (updated) {
    try {
      const newUpdated = updateAchievementStats(updated, {
        helpfulActionsCount: updated.achievementStats.helpfulActionsCount + 1,
      });

      updateUserGamification(uid, newUpdated).catch((err) => {
        console.error('Failed to save help action:', err);
      });

      return newUpdated;
    } catch (error) {
      console.error('Error updating help count:', error);
    }
  }

  return updated;
}

/**
 * Award XP for completing profile section
 */
export async function awardXPForCompleteProfile(
  uid: string,
  gamification: UserGamification,
): Promise<UserGamification | null> {
  return safeAwardXP(uid, gamification, XP_REWARDS.COMPLETE_PROFILE, 'complete_profile');
}

/**
 * Award XP for first login
 */
export async function awardXPForFirstLogin(
  uid: string,
  gamification: UserGamification,
): Promise<UserGamification | null> {
  return safeAwardXP(uid, gamification, XP_REWARDS.FIRST_LOGIN, 'first_login');
}

/**
 * Award XP for community post
 */
export async function awardXPForCommunityPost(
  uid: string,
  gamification: UserGamification,
): Promise<UserGamification | null> {
  return safeAwardXP(uid, gamification, XP_REWARDS.COMMUNITY_POST, 'community_post');
}

/**
 * Award XP for community comment
 */
export async function awardXPForCommunityComment(
  uid: string,
  gamification: UserGamification,
): Promise<UserGamification | null> {
  return safeAwardXP(uid, gamification, XP_REWARDS.COMMUNITY_COMMENT, 'community_comment');
}

/**
 * Award XP for receiving upvote/appreciation
 */
export async function awardXPForCommunityUpvote(
  uid: string,
  gamification: UserGamification,
): Promise<UserGamification | null> {
  return safeAwardXP(uid, gamification, XP_REWARDS.COMMUNITY_UPVOTE, 'community_upvote');
}

/**
 * Batch award XP (for bulk operations)
 */
export async function batchAwardXP(
  updates: Array<{
    uid: string;
    gamification: UserGamification;
    xpAmount: number;
    action: string;
  }>,
): Promise<void> {
  await Promise.all(
    updates.map(({ uid, gamification, xpAmount, action }) =>
      safeAwardXP(uid, gamification, xpAmount, action),
    ),
  );
}

/**
 * Sync user profile info when they update it
 * Updates gamification record with profile data for leaderboard display
 */
export async function syncProfileToGamification(
  uid: string,
  profileData: {
    displayName?: string;
    photoUrl?: string;
    schoolId?: string;
    schoolName?: string;
  },
): Promise<void> {
  try {
    // This would be handled by gamificationFirestore.syncUserProfileToGamification
    // Import and call if needed
  } catch (error) {
    console.error('Error syncing profile to gamification:', error);
  }
}
