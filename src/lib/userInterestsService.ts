/**
 * User Interests Service
 * Tracks and manages user interests based on their behavior
 */

import type { Firestore, DocumentData } from 'firebase-admin/firestore';
import { FieldValue } from 'firebase-admin/firestore';
import { getDb } from '@/lib/firebaseAdmin';
import type { UserInterests, OpportunityViewEvent } from '@/types/recommendation';
import type { Opportunity } from '@/types/opportunity';

const USERS_COLLECTION = 'users';
const INTERESTS_DOC = 'interests';
const VIEW_HISTORY_COLLECTION = 'viewHistory';

// Maximum number of view events to keep per user
const MAX_VIEW_HISTORY = 100;

// Weight decay for older interactions
const INTERACTION_WEIGHT = 1;
const KEYWORD_WEIGHT = 0.5;

/**
 * Get Firestore references for user interests
 */
function getInterestsRef(db: Firestore, uid: string) {
    return db.collection(USERS_COLLECTION).doc(uid).collection('metadata').doc(INTERESTS_DOC);
}

function getViewHistoryRef(db: Firestore, uid: string) {
    return db.collection(USERS_COLLECTION).doc(uid).collection(VIEW_HISTORY_COLLECTION);
}

/**
 * Initialize empty user interests
 */
function createEmptyInterests(): UserInterests {
    return {
        categories: {},
        keywords: {},
        preferredModes: [],
        preferredGrades: [],
        lastUpdated: new Date().toISOString(),
    };
}

/**
 * Get user interests from Firestore
 */
export async function getUserInterests(uid: string): Promise<UserInterests> {
    const db = getDb();
    const ref = getInterestsRef(db, uid);
    const doc = await ref.get();

    if (!doc.exists) {
        return createEmptyInterests();
    }

    const data = doc.data() as DocumentData;
    return {
        categories: data.categories || {},
        keywords: data.keywords || {},
        preferredModes: Array.isArray(data.preferredModes) ? data.preferredModes : [],
        preferredGrades: Array.isArray(data.preferredGrades) ? data.preferredGrades : [],
        lastUpdated: data.lastUpdated || new Date().toISOString(),
    };
}

/**
 * Extract keywords from opportunity
 */
function extractKeywords(opportunity: Opportunity): string[] {
    const keywords: string[] = [];

    // Add search keywords if available
    if (Array.isArray(opportunity.searchKeywords)) {
        keywords.push(...opportunity.searchKeywords);
    }

    // Add category as keyword
    if (opportunity.category) {
        keywords.push(opportunity.category.toLowerCase());
    }
    if (opportunity.categoryName) {
        keywords.push(opportunity.categoryName.toLowerCase());
    }

    // Extract words from title (filter common words)
    if (opportunity.title) {
        const titleWords = opportunity.title
            .toLowerCase()
            .split(/\s+/)
            .filter((word) => word.length > 3)
            .filter((word) => !['the', 'and', 'for', 'with', 'from', 'this', 'that', 'your'].includes(word));
        keywords.push(...titleWords.slice(0, 5)); // Max 5 words from title
    }

    // Dedupe and return
    return [...new Set(keywords)].slice(0, 15);
}

/**
 * Track an opportunity view and update user interests
 */
export async function trackOpportunityView(
    uid: string,
    opportunity: Opportunity,
    durationSeconds?: number,
): Promise<void> {
    const db = getDb();
    const now = new Date().toISOString();

    const keywords = extractKeywords(opportunity);

    // Create view event
    const viewEvent: OpportunityViewEvent = {
        opportunityId: opportunity.id,
        category: opportunity.category || 'unknown',
        categoryId: opportunity.categoryId,
        keywords,
        viewedAt: now,
        durationSeconds,
    };

    // Add to view history (for audit/ML later)
    const viewHistoryRef = getViewHistoryRef(db, uid);
    await viewHistoryRef.doc(opportunity.id).set(viewEvent, { merge: true });

    // Update interests with incremental weights
    const interestsRef = getInterestsRef(db, uid);

    const categoryKey = opportunity.categoryId || opportunity.category || 'unknown';
    const categoryUpdate: Record<string, any> = {
        [`categories.${categoryKey}`]: FieldValue.increment(INTERACTION_WEIGHT),
        lastUpdated: now,
    };

    // Update keyword weights
    const keywordUpdates: Record<string, any> = {};
    keywords.forEach((keyword) => {
        // Sanitize keyword for Firestore field path (replace dots and slashes)
        const safeKeyword = keyword.replace(/[./$#[\]]/g, '_');
        keywordUpdates[`keywords.${safeKeyword}`] = FieldValue.increment(KEYWORD_WEIGHT);
    });

    // Update preferred mode
    if (opportunity.mode) {
        categoryUpdate[`preferredModes`] = FieldValue.arrayUnion(opportunity.mode);
    }

    // Update preferred grades
    if (opportunity.gradeEligibility) {
        categoryUpdate[`preferredGrades`] = FieldValue.arrayUnion(opportunity.gradeEligibility);
    }

    await interestsRef.set(
        {
            ...categoryUpdate,
            ...keywordUpdates,
        },
        { merge: true },
    );

    // Cleanup old view history (keep last MAX_VIEW_HISTORY)
    const oldViews = await viewHistoryRef
        .orderBy('viewedAt', 'desc')
        .offset(MAX_VIEW_HISTORY)
        .limit(50)
        .get();

    if (!oldViews.empty) {
        const batch = db.batch();
        oldViews.docs.forEach((doc) => batch.delete(doc.ref));
        await batch.commit();
    }
}

/**
 * Get recent view history for a user
 */
export async function getRecentViewHistory(uid: string, limit = 20): Promise<OpportunityViewEvent[]> {
    const db = getDb();
    const viewHistoryRef = getViewHistoryRef(db, uid);

    const snapshot = await viewHistoryRef
        .orderBy('viewedAt', 'desc')
        .limit(limit)
        .get();

    return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
            opportunityId: doc.id,
            category: data.category || 'unknown',
            categoryId: data.categoryId,
            keywords: Array.isArray(data.keywords) ? data.keywords : [],
            viewedAt: data.viewedAt || '',
            durationSeconds: data.durationSeconds,
        };
    });
}

/**
 * Get IDs of recently viewed opportunities (for exclusion from recommendations)
 */
export async function getRecentlyViewedIds(uid: string, limit = 10): Promise<string[]> {
    const history = await getRecentViewHistory(uid, limit);
    return history.map((event) => event.opportunityId);
}

/**
 * Check if user has enough interaction history for personalization
 */
export async function hasEnoughHistory(uid: string): Promise<boolean> {
    const interests = await getUserInterests(uid);
    const categoryCount = Object.keys(interests.categories).length;
    const totalInteractions = Object.values(interests.categories).reduce((sum, count) => sum + count, 0);

    // Need at least 2 categories or 3 total interactions
    return categoryCount >= 2 || totalInteractions >= 3;
}

/**
 * Get top categories for a user
 */
export async function getTopCategories(uid: string, limit = 5): Promise<string[]> {
    const interests = await getUserInterests(uid);

    return Object.entries(interests.categories)
        .sort(([, a], [, b]) => b - a)
        .slice(0, limit)
        .map(([category]) => category);
}

/**
 * Get top keywords for a user
 */
export async function getTopKeywords(uid: string, limit = 10): Promise<string[]> {
    const interests = await getUserInterests(uid);

    return Object.entries(interests.keywords)
        .sort(([, a], [, b]) => b - a)
        .slice(0, limit)
        .map(([keyword]) => keyword);
}
