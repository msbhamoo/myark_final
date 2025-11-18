/**
 * Gamification Firestore Data Layer
 * Handles reading/writing gamification data to Firestore
 * Completely isolated operations
 */

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  runTransaction,
} from 'firebase/firestore';
import { getFirebaseDb } from '@/lib/firebaseClient';
import type { UserGamification, UserLeaderboardEntry, SchoolLeaderboard, GlobalLeaderboard } from '@/types/gamification';
import { initializeUserGamification } from '@/lib/gamificationService';

const GAMIFICATION_COLLECTION = 'userGamification';
const GLOBAL_LEADERBOARD_COLLECTION = 'leaderboards_global';
const SCHOOL_LEADERBOARD_COLLECTION = 'leaderboards_school';

/**
 * Get user gamification data, create if doesn't exist
 */
export async function getUserGamification(uid: string, schoolId?: string): Promise<UserGamification> {
  const db = getFirebaseDb();
  const docRef = doc(db, GAMIFICATION_COLLECTION, uid);

  try {
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data() as UserGamification;

      // Convert Set back to Set if needed
      if (data.achievementStats?.subjectsExplored && !Array.isArray(data.achievementStats.subjectsExplored)) {
        data.achievementStats.subjectsExplored = new Set(data.achievementStats.subjectsExplored as any);
      }

      return data;
    }

    // Create new record
    const newGamification = initializeUserGamification(uid, schoolId);
    await setDoc(docRef, newGamification);
    return newGamification;
  } catch (error) {
    console.error('Error fetching user gamification:', error);
    return initializeUserGamification(uid, schoolId);
  }
}

/**
 * Update user gamification data
 */
export async function updateUserGamification(
  uid: string,
  gamification: UserGamification,
): Promise<void> {
  const db = getFirebaseDb();
  const docRef = doc(db, GAMIFICATION_COLLECTION, uid);

  try {
    // Convert Set to Array for Firestore
    const dataToStore = {
      ...gamification,
      achievementStats: {
        ...gamification.achievementStats,
        subjectsExplored: Array.from(gamification.achievementStats.subjectsExplored),
      },
    };

    await setDoc(docRef, dataToStore, { merge: true });
  } catch (error) {
    console.error('Error updating user gamification:', error);
    throw error;
  }
}

/**
 * Award XP to user (atomic operation)
 */
export async function awardXPToUser(
  uid: string,
  xpAmount: number,
  action: string,
  schoolId?: string,
): Promise<UserGamification> {
  const db = getFirebaseDb();
  const gamificationRef = doc(db, GAMIFICATION_COLLECTION, uid);

  try {
    const result = await runTransaction(db, async (transaction) => {
      const docSnap = await transaction.get(gamificationRef);
      let gamification: UserGamification;

      if (!docSnap.exists()) {
        gamification = initializeUserGamification(uid, schoolId);
      } else {
        gamification = docSnap.data() as UserGamification;
        if (gamification.achievementStats?.subjectsExplored) {
          gamification.achievementStats.subjectsExplored = new Set(
            gamification.achievementStats.subjectsExplored as any,
          );
        }
      }

      // Award XP
      gamification.totalXP += xpAmount;
      gamification.lastXPUpdate = new Date().toISOString();
      gamification.updatedAt = new Date().toISOString();

      // Store update
      const dataToStore = {
        ...gamification,
        achievementStats: {
          ...gamification.achievementStats,
          subjectsExplored: Array.from(gamification.achievementStats.subjectsExplored),
        },
      };

      transaction.set(gamificationRef, dataToStore, { merge: true });
      return gamification;
    });

    return result;
  } catch (error) {
    console.error('Error awarding XP:', error);
    throw error;
  }
}

/**
 * Get global leaderboard
 */
export async function getGlobalLeaderboard(
  topN: number = 100,
): Promise<UserLeaderboardEntry[]> {
  const db = getFirebaseDb();

  try {
    const q = query(
      collection(db, GAMIFICATION_COLLECTION),
      orderBy('totalXP', 'desc'),
      limit(topN),
    );

    const snapshot = await getDocs(q);
    const entries: UserLeaderboardEntry[] = [];

    snapshot.docs.forEach((doc, index) => {
      const data = doc.data() as any;
      entries.push({
        uid: doc.id,
        displayName: data.displayName || 'Student',
        photoUrl: data.photoUrl,
        schoolId: data.schoolId,
        schoolName: data.schoolName,
        totalXP: data.totalXP || 0,
        level: data.level || 1,
        badgeCount: data.badges?.length || 0,
        bestStreak: Math.max(
          data.streaks?.daily?.best || 0,
          data.streaks?.weekly?.best || 0,
        ),
        rank: index + 1,
      });
    });

    return entries;
  } catch (error) {
    console.error('Error fetching global leaderboard:', error);
    return [];
  }
}

/**
 * Get school leaderboard
 */
export async function getSchoolLeaderboard(
  schoolId: string,
  topN: number = 50,
): Promise<SchoolLeaderboard> {
  const db = getFirebaseDb();

  try {
    const q = query(
      collection(db, GAMIFICATION_COLLECTION),
      where('schoolId', '==', schoolId),
      orderBy('totalXP', 'desc'),
      limit(topN),
    );

    const snapshot = await getDocs(q);
    const entries: UserLeaderboardEntry[] = [];

    snapshot.docs.forEach((doc, index) => {
      const data = doc.data() as any;
      entries.push({
        uid: doc.id,
        displayName: data.displayName || 'Student',
        photoUrl: data.photoUrl,
        schoolId: data.schoolId,
        schoolName: data.schoolName,
        totalXP: data.totalXP || 0,
        level: data.level || 1,
        badgeCount: data.badges?.length || 0,
        bestStreak: Math.max(
          data.streaks?.daily?.best || 0,
          data.streaks?.weekly?.best || 0,
        ),
        rank: index + 1,
      });
    });

    return {
      schoolId,
      schoolName: entries[0]?.schoolName || 'School',
      entries,
      generatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error fetching school leaderboard:', error);
    return {
      schoolId,
      schoolName: 'School',
      entries: [],
      generatedAt: new Date().toISOString(),
    };
  }
}

/**
 * Get user's rank in global leaderboard
 */
export async function getUserGlobalRank(uid: string): Promise<number> {
  const db = getFirebaseDb();

  try {
    // Get current user's XP
    const userDocRef = doc(db, GAMIFICATION_COLLECTION, uid);
    const userSnap = await getDoc(userDocRef);

    if (!userSnap.exists()) {
      return 0;
    }

    const userXP = (userSnap.data() as any).totalXP || 0;

    // Count users with more XP
    const q = query(
      collection(db, GAMIFICATION_COLLECTION),
      where('totalXP', '>', userXP),
    );

    const snapshot = await getDocs(q);
    return snapshot.size + 1;
  } catch (error) {
    console.error('Error calculating user global rank:', error);
    return 0;
  }
}

/**
 * Get user's rank in school leaderboard
 */
export async function getUserSchoolRank(uid: string, schoolId: string): Promise<number> {
  const db = getFirebaseDb();

  try {
    // Get current user's XP
    const userDocRef = doc(db, GAMIFICATION_COLLECTION, uid);
    const userSnap = await getDoc(userDocRef);

    if (!userSnap.exists()) {
      return 0;
    }

    const userXP = (userSnap.data() as any).totalXP || 0;

    // Count users in same school with more XP
    const q = query(
      collection(db, GAMIFICATION_COLLECTION),
      where('schoolId', '==', schoolId),
      where('totalXP', '>', userXP),
    );

    const snapshot = await getDocs(q);
    return snapshot.size + 1;
  } catch (error) {
    console.error('Error calculating user school rank:', error);
    return 0;
  }
}

/**
 * Batch update gamification stats (for bulk operations)
 */
export async function batchUpdateGamification(
  updates: Array<{ uid: string; data: Partial<UserGamification> }>,
): Promise<void> {
  const db = getFirebaseDb();

  try {
    // Execute updates in batches of 500 (Firestore transaction limit)
    const batchSize = 500;

    for (let i = 0; i < updates.length; i += batchSize) {
      const batch = updates.slice(i, i + batchSize);

      await Promise.all(
        batch.map(({ uid, data }) => {
          const docRef = doc(db, GAMIFICATION_COLLECTION, uid);
          const dataToStore = {
            ...data,
            achievementStats: data.achievementStats
              ? {
                  ...data.achievementStats,
                  subjectsExplored:
                    data.achievementStats.subjectsExplored instanceof Set
                      ? Array.from(data.achievementStats.subjectsExplored)
                      : data.achievementStats.subjectsExplored,
                }
              : undefined,
          };

          return updateDoc(docRef, dataToStore);
        }),
      );
    }
  } catch (error) {
    console.error('Error in batch update:', error);
    throw error;
  }
}

/**
 * Get top performers by metric (for dashboard/analytics)
 */
export async function getTopPerformers(
  metric: 'xp' | 'badges' | 'streak' = 'xp',
  topN: number = 10,
): Promise<UserLeaderboardEntry[]> {
  const db = getFirebaseDb();

  try {
    let q;

    if (metric === 'xp') {
      q = query(
        collection(db, GAMIFICATION_COLLECTION),
        orderBy('totalXP', 'desc'),
        limit(topN),
      );
    } else if (metric === 'badges') {
      // Note: Firestore can't directly order by array length
      // We'll need to fetch all and sort client-side
      q = query(collection(db, GAMIFICATION_COLLECTION), limit(topN * 5));
    } else {
      // For streak, we'd need a denormalized field
      q = query(collection(db, GAMIFICATION_COLLECTION), limit(topN * 5));
    }

    const snapshot = await getDocs(q);
    const entries: UserLeaderboardEntry[] = [];

    snapshot.docs.forEach((doc) => {
      const data = doc.data() as any;
      let sortKey = data.totalXP || 0;

      if (metric === 'badges') {
        sortKey = -(data.badges?.length || 0);
      } else if (metric === 'streak') {
        sortKey = -(Math.max(data.streaks?.daily?.best || 0, data.streaks?.weekly?.best || 0));
      }

      entries.push({
        uid: doc.id,
        displayName: data.displayName || 'Student',
        photoUrl: data.photoUrl,
        schoolId: data.schoolId,
        schoolName: data.schoolName,
        totalXP: data.totalXP || 0,
        level: data.level || 1,
        badgeCount: data.badges?.length || 0,
        bestStreak: Math.max(
          data.streaks?.daily?.best || 0,
          data.streaks?.weekly?.best || 0,
        ),
        rank: 0,
      });
    });

    // Sort by the appropriate metric
    if (metric === 'badges') {
      entries.sort((a, b) => b.badgeCount - a.badgeCount);
    } else if (metric === 'streak') {
      entries.sort((a, b) => b.bestStreak - a.bestStreak);
    } else {
      entries.sort((a, b) => b.totalXP - a.totalXP);
    }

    // Assign ranks
    entries.forEach((entry, index) => {
      entry.rank = index + 1;
    });

    return entries.slice(0, topN);
  } catch (error) {
    console.error('Error fetching top performers:', error);
    return [];
  }
}

/**
 * Sync user profile info to gamification record (for leaderboard display)
 */
export async function syncUserProfileToGamification(
  uid: string,
  profileData: { displayName?: string; photoUrl?: string; schoolId?: string; schoolName?: string },
): Promise<void> {
  const db = getFirebaseDb();
  const docRef = doc(db, GAMIFICATION_COLLECTION, uid);

  try {
    await updateDoc(docRef, {
      displayName: profileData.displayName,
      photoUrl: profileData.photoUrl,
      schoolId: profileData.schoolId,
      schoolName: profileData.schoolName,
    });
  } catch (error) {
    console.error('Error syncing profile to gamification:', error);
    // Fail silently - this is not critical
  }
}
