/**
 * Badge System - Award and track user achievements
 */

import { getDb } from '@/lib/firebaseAdmin';

export interface Badge {
    id: string;
    name: string;
    description: string;
    requirement: number;
    icon: string;
    type: 'shares' | 'clicks' | 'conversions' | 'rank';
}

export const DEFAULT_BADGES: Badge[] = [
    {
        id: 'first-share',
        name: 'First Share',
        description: 'Shared your first opportunity',
        requirement: 1,
        icon: '🎉',
        type: 'shares',
    },
    {
        id: 'super-sharer',
        name: 'Super Sharer',
        description: 'Shared 10 opportunities',
        requirement: 10,
        icon: '🌟',
        type: 'shares',
    },
    {
        id: 'mega-sharer',
        name: 'Mega Sharer',
        description: 'Shared 50 opportunities',
        requirement: 50,
        icon: '⭐',
        type: 'shares',
    },
    {
        id: 'viral-master',
        name: 'Viral Master',
        description: 'Generated 100+ total clicks',
        requirement: 100,
        icon: '🚀',
        type: 'clicks',
    },
    {
        id: 'influencer',
        name: 'Influencer',
        description: 'Generated 500+ clicks',
        requirement: 500,
        icon: '💫',
        type: 'clicks',
    },
    {
        id: 'converter',
        name: 'Converter',
        description: 'Achieved 50+ conversions',
        requirement: 50,
        icon: '💎',
        type: 'conversions',
    },
    {
        id: 'top-performer',
        name: 'Top Performer',
        description: 'Reached top 10 on leaderboard',
        requirement: 10,
        icon: '🏆',
        type: 'rank',
    },
];

/**
 * Check and award badges to a user based on their stats
 */
export async function checkAndAwardBadges(userId: string): Promise<string[]> {
    const db = getDb();

    // Get user rewards
    const userRewardsRef = db.collection('userRewards').doc(userId);
    const userDoc = await userRewardsRef.get();

    if (!userDoc.exists) {
        return [];
    }

    const userData = userDoc.data();
    const currentBadges = userData?.badges || [];
    const newBadges: string[] = [];

    // Check each badge
    for (const badge of DEFAULT_BADGES) {
        // Skip if already earned
        if (currentBadges.includes(badge.id)) {
            continue;
        }

        // Check requirement
        let qualifies = false;
        switch (badge.type) {
            case 'shares':
                qualifies = (userData?.totalShares || 0) >= badge.requirement;
                break;
            case 'clicks':
                qualifies = (userData?.totalClicks || 0) >= badge.requirement;
                break;
            case 'conversions':
                qualifies = (userData?.totalConversions || 0) >= badge.requirement;
                break;
            case 'rank':
                qualifies = (userData?.rank || 999) <= badge.requirement;
                break;
        }

        if (qualifies) {
            newBadges.push(badge.id);
        }
    }

    // Award new badges
    if (newBadges.length > 0) {
        await userRewardsRef.update({
            badges: [...currentBadges, ...newBadges],
            lastUpdated: new Date().toISOString(),
        });
    }

    return newBadges;
}

/**
 * Update user rewards (points and stats)
 */
export async function updateUserRewards(
    userId: string,
    update: {
        points?: number;
        shares?: number;
        clicks?: number;
        conversions?: number;
    }
): Promise<void> {
    const db = getDb();
    const userRewardsRef = db.collection('userRewards').doc(userId);

    // Get current data
    const doc = await userRewardsRef.get();

    if (!doc.exists) {
        // Create new rewards record
        await userRewardsRef.set({
            userId,
            totalPoints: update.points || 0,
            totalShares: update.shares || 0,
            totalClicks: update.clicks || 0,
            totalConversions: update.conversions || 0,
            badges: [],
            rank: null,
            lastUpdated: new Date().toISOString(),
        });
    } else {
        // Update existing
        const current = doc.data();
        await userRewardsRef.update({
            totalPoints: (current?.totalPoints || 0) + (update.points || 0),
            totalShares: (current?.totalShares || 0) + (update.shares || 0),
            totalClicks: (current?.totalClicks || 0) + (update.clicks || 0),
            totalConversions: (current?.totalConversions || 0) + (update.conversions || 0),
            lastUpdated: new Date().toISOString(),
        });
    }

    // Check for new badges
    await checkAndAwardBadges(userId);
}

/**
 * Get default reward configuration
 */
export function getDefaultRewardConfig() {
    return {
        enabled: true,
        pointsPerShare: 10,
        pointsPerClick: 2,
        pointsPerConversion: 50,
        badges: DEFAULT_BADGES,
    };
}

/**
 * Get reward configuration from Firestore
 */
export async function getRewardConfig() {
    const db = getDb();
    const configDoc = await db.collection('settings').doc('rewards').get();

    if (!configDoc.exists) {
        return getDefaultRewardConfig();
    }

    return configDoc.data();
}
