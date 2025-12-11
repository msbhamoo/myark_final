/**
 * Notification Service
 * Handles push notification subscriptions and sending
 */

import { getDb } from '@/lib/firebaseAdmin';
import type {
    NotificationPreferences,
    UserNotificationToken,
    NotificationPayload,
    NotificationLog,
    DEFAULT_NOTIFICATION_PREFERENCES,
} from '@/types/notifications';
import { getPersonalizedRecommendations } from '@/lib/recommendationService';

const USERS_COLLECTION = 'users';
const NOTIFICATIONS_SUBCOLLECTION = 'notifications';
const TOKENS_SUBCOLLECTION = 'fcmTokens';
const PREFERENCES_DOC = 'preferences';
const LOGS_SUBCOLLECTION = 'notificationLogs';

/**
 * Save FCM token for a user
 */
export async function saveFCMToken(
    uid: string,
    token: string,
    platform: 'web' | 'android' | 'ios' = 'web',
    userAgent?: string
): Promise<void> {
    const db = getDb();
    const tokenRef = db
        .collection(USERS_COLLECTION)
        .doc(uid)
        .collection(TOKENS_SUBCOLLECTION)
        .doc(token);

    await tokenRef.set({
        token,
        platform,
        userAgent,
        createdAt: new Date().toISOString(),
        lastUsedAt: new Date().toISOString(),
    });
}

/**
 * Remove FCM token
 */
export async function removeFCMToken(uid: string, token: string): Promise<void> {
    const db = getDb();
    await db
        .collection(USERS_COLLECTION)
        .doc(uid)
        .collection(TOKENS_SUBCOLLECTION)
        .doc(token)
        .delete();
}

/**
 * Get all FCM tokens for a user
 */
export async function getUserFCMTokens(uid: string): Promise<UserNotificationToken[]> {
    const db = getDb();
    const snapshot = await db
        .collection(USERS_COLLECTION)
        .doc(uid)
        .collection(TOKENS_SUBCOLLECTION)
        .get();

    return snapshot.docs.map(doc => doc.data() as UserNotificationToken);
}

/**
 * Get notification preferences for a user
 */
export async function getNotificationPreferences(uid: string): Promise<NotificationPreferences> {
    const db = getDb();
    const doc = await db
        .collection(USERS_COLLECTION)
        .doc(uid)
        .collection(NOTIFICATIONS_SUBCOLLECTION)
        .doc(PREFERENCES_DOC)
        .get();

    if (!doc.exists) {
        return {
            newOpportunities: true,
            deadlineReminders: true,
            weeklyDigest: true,
            schoolActivity: true,
            applicationUpdates: true,
            pushEnabled: false,
            emailEnabled: true,
            emailFrequency: 'weekly',
        };
    }

    return doc.data() as NotificationPreferences;
}

/**
 * Update notification preferences
 */
export async function updateNotificationPreferences(
    uid: string,
    preferences: Partial<NotificationPreferences>
): Promise<NotificationPreferences> {
    const db = getDb();
    const prefRef = db
        .collection(USERS_COLLECTION)
        .doc(uid)
        .collection(NOTIFICATIONS_SUBCOLLECTION)
        .doc(PREFERENCES_DOC);

    const current = await getNotificationPreferences(uid);
    const updated = { ...current, ...preferences, updatedAt: new Date().toISOString() };

    await prefRef.set(updated, { merge: true });
    return updated;
}

/**
 * Log a notification send attempt
 */
export async function logNotification(
    uid: string,
    type: string,
    payload: NotificationPayload,
    success: boolean,
    error?: string
): Promise<void> {
    const db = getDb();

    await db
        .collection(USERS_COLLECTION)
        .doc(uid)
        .collection(LOGS_SUBCOLLECTION)
        .add({
            type,
            payload,
            success,
            error,
            sentAt: new Date().toISOString(),
        });
}

/**
 * Generate weekly digest content for a user
 */
export async function generateWeeklyDigest(uid: string): Promise<{
    opportunities: any[];
    headline: string;
    summary: string;
} | null> {
    try {
        const recommendations = await getPersonalizedRecommendations(uid, 5);

        if (!recommendations.items || recommendations.items.length === 0) {
            return null;
        }

        const topOpportunities = recommendations.items.slice(0, 5);

        // Generate headline based on categories
        const categories = [...new Set(topOpportunities.map(o => o.opportunity.categoryName || o.opportunity.category))];
        const headline = categories.length > 0
            ? `Your Weekly Picks: ${categories.slice(0, 2).join(' & ')} and more!`
            : 'Your Weekly Opportunity Digest';

        const summary = `We found ${topOpportunities.length} opportunities matching your interests. Don't miss out!`;

        return {
            opportunities: topOpportunities.map(o => ({
                id: o.opportunity.id,
                title: o.opportunity.title,
                category: o.opportunity.categoryName || o.opportunity.category,
                deadline: o.opportunity.registrationDeadline,
                matchReasons: o.matchReasons,
            })),
            headline,
            summary,
        };
    } catch (error) {
        console.error('Failed to generate weekly digest:', error);
        return null;
    }
}

/**
 * Get users who should receive weekly digest
 */
export async function getUsersForWeeklyDigest(): Promise<string[]> {
    const db = getDb();

    // Find users with weekly digest enabled
    const snapshot = await db
        .collectionGroup(NOTIFICATIONS_SUBCOLLECTION)
        .where('weeklyDigest', '==', true)
        .limit(1000)
        .get();

    const userIds = new Set<string>();

    snapshot.docs.forEach(doc => {
        // Extract user ID from path
        const pathParts = doc.ref.path.split('/');
        const usersIndex = pathParts.indexOf('users');
        if (usersIndex >= 0 && pathParts[usersIndex + 1]) {
            userIds.add(pathParts[usersIndex + 1]);
        }
    });

    return Array.from(userIds);
}

/**
 * Check if user has opps with approaching deadlines
 */
export async function checkUserDeadlineAlerts(uid: string): Promise<{
    opportunities: any[];
    urgent: number;
} | null> {
    const db = getDb();

    // Get user's saved opportunities
    const savedSnapshot = await db
        .collection(USERS_COLLECTION)
        .doc(uid)
        .collection('savedOpportunities')
        .get();

    if (savedSnapshot.empty) return null;

    const now = new Date();
    const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

    const urgentOps: any[] = [];

    for (const savedDoc of savedSnapshot.docs) {
        const oppDoc = await db.collection('opportunities').doc(savedDoc.id).get();
        if (!oppDoc.exists) continue;

        const data = oppDoc.data();
        if (!data?.registrationDeadline) continue;

        const deadline = new Date(data.registrationDeadline);
        if (deadline > now && deadline <= threeDaysFromNow) {
            urgentOps.push({
                id: oppDoc.id,
                title: data.title,
                deadline: data.registrationDeadline,
                daysLeft: Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
            });
        }
    }

    if (urgentOps.length === 0) return null;

    return {
        opportunities: urgentOps,
        urgent: urgentOps.length,
    };
}
