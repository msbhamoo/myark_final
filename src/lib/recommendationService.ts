/**
 * Recommendation Service
 * Core recommendation engine for personalized opportunity suggestions
 */

import { getDb } from '@/lib/firebaseAdmin';
import { getUserInterests, getRecentlyViewedIds, hasEnoughHistory } from '@/lib/userInterestsService';
import type { Opportunity } from '@/types/opportunity';
import type {
    UserInterests,
    ScoredOpportunity,
    RecommendationsResponse,
} from '@/types/recommendation';

const OPPORTUNITIES_COLLECTION = 'opportunities';

/**
 * Calculate category match score
 */
function calculateCategoryScore(opportunity: Opportunity, interests: UserInterests): number {
    const categoryId = opportunity.categoryId || opportunity.category;
    if (!categoryId) return 0;

    const weight = interests.categories[categoryId] || 0;
    // Normalize to 0-100 scale (max weight caps at 10 interactions)
    return Math.min(weight * 10, 100);
}

/**
 * Calculate grade match score
 */
function calculateGradeScore(opportunity: Opportunity, interests: UserInterests): number {
    if (!opportunity.gradeEligibility || interests.preferredGrades.length === 0) {
        return 50; // Neutral score if no grade info
    }

    const oppGrade = opportunity.gradeEligibility.toLowerCase();
    const hasMatch = interests.preferredGrades.some((grade) => {
        const g = grade.toLowerCase();
        return oppGrade.includes(g) || g.includes(oppGrade) || oppGrade === 'all grades';
    });

    return hasMatch ? 100 : 30;
}

/**
 * Calculate keyword match score
 */
function calculateKeywordScore(opportunity: Opportunity, interests: UserInterests): number {
    const oppKeywords = [
        ...(opportunity.searchKeywords || []),
        opportunity.category,
        opportunity.categoryName,
        ...(opportunity.title?.toLowerCase().split(/\s+/) || []),
    ]
        .filter(Boolean)
        .map((k) => k?.toLowerCase().replace(/[./$#[\]]/g, '_'));

    if (oppKeywords.length === 0) return 50;

    let matchScore = 0;
    let matchCount = 0;

    oppKeywords.forEach((keyword) => {
        if (keyword && interests.keywords[keyword]) {
            matchScore += interests.keywords[keyword];
            matchCount++;
        }
    });

    if (matchCount === 0) return 30;

    // Normalize based on matches (max 100)
    return Math.min((matchScore / matchCount) * 20, 100);
}

/**
 * Calculate recency boost (newer opportunities score higher)
 */
function calculateRecencyScore(opportunity: Opportunity): number {
    // Use startDate or current date if not available
    const dateStr = opportunity.startDate;
    if (!dateStr) return 50;

    const date = new Date(dateStr);
    const now = new Date();
    const daysDiff = Math.floor((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    // Future events get boost, past events get penalty
    if (daysDiff > 0 && daysDiff <= 30) return 100; // Starting within 30 days
    if (daysDiff > 30 && daysDiff <= 60) return 80;
    if (daysDiff > 60 && daysDiff <= 90) return 60;
    if (daysDiff < 0) return 20; // Already started
    return 50;
}

/**
 * Calculate deadline urgency score
 */
function calculateDeadlineScore(opportunity: Opportunity): number {
    const deadline = opportunity.registrationDeadline;
    if (!deadline || opportunity.registrationDeadlineTBD) return 50;

    const deadlineDate = new Date(deadline);
    const now = new Date();
    const daysUntil = Math.floor((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    // Urgency boost for approaching deadlines
    if (daysUntil < 0) return 0; // Expired
    if (daysUntil <= 3) return 100; // Very urgent
    if (daysUntil <= 7) return 90;
    if (daysUntil <= 14) return 70;
    if (daysUntil <= 30) return 50;
    return 30;
}

/**
 * Calculate popularity score based on views
 */
function calculatePopularityScore(opportunity: Opportunity): number {
    const views = opportunity.views || 0;
    // Log scale for views
    if (views >= 1000) return 100;
    if (views >= 500) return 80;
    if (views >= 100) return 60;
    if (views >= 50) return 40;
    if (views >= 10) return 20;
    return 10;
}

/**
 * Generate match reasons for a scored opportunity
 */
function generateMatchReasons(
    opportunity: Opportunity,
    interests: UserInterests,
    scores: { category: number; grade: number; keyword: number },
): string[] {
    const reasons: string[] = [];

    if (scores.category >= 70) {
        const categoryName = opportunity.categoryName || opportunity.category;
        reasons.push(`Based on your interest in ${categoryName}`);
    }

    if (scores.grade >= 80) {
        reasons.push('Matches your grade level');
    }

    if (scores.keyword >= 60) {
        reasons.push('Related to topics you explore');
    }

    // Add deadline urgency reason
    const deadline = opportunity.registrationDeadline;
    if (deadline && !opportunity.registrationDeadlineTBD) {
        const daysUntil = Math.floor(
            (new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
        );
        if (daysUntil >= 0 && daysUntil <= 7) {
            reasons.push('Registration closing soon');
        }
    }

    // Fallback reason
    if (reasons.length === 0) {
        reasons.push('Trending opportunity');
    }

    return reasons.slice(0, 2); // Max 2 reasons
}

/**
 * Calculate overall recommendation score for an opportunity
 */
function calculateScore(opportunity: Opportunity, interests: UserInterests): ScoredOpportunity {
    const categoryScore = calculateCategoryScore(opportunity, interests);
    const gradeScore = calculateGradeScore(opportunity, interests);
    const keywordScore = calculateKeywordScore(opportunity, interests);
    const recencyScore = calculateRecencyScore(opportunity);
    const deadlineScore = calculateDeadlineScore(opportunity);
    const popularityScore = calculatePopularityScore(opportunity);

    // Weighted average
    const totalScore =
        categoryScore * 0.35 +
        gradeScore * 0.25 +
        keywordScore * 0.20 +
        recencyScore * 0.10 +
        deadlineScore * 0.05 +
        popularityScore * 0.05;

    const matchReasons = generateMatchReasons(opportunity, interests, {
        category: categoryScore,
        grade: gradeScore,
        keyword: keywordScore,
    });

    return {
        opportunity,
        score: Math.round(totalScore),
        matchReasons,
    };
}

/**
 * Get personalized recommendations for a user
 */
export async function getPersonalizedRecommendations(
    uid: string,
    limit = 10,
): Promise<RecommendationsResponse> {
    const db = getDb();

    // Check if user has enough history
    const hasHistory = await hasEnoughHistory(uid);

    if (!hasHistory) {
        // Return trending opportunities for new users
        return getTrendingRecommendations(limit);
    }

    // Get user interests and recently viewed IDs
    const [interests, recentlyViewedIds] = await Promise.all([
        getUserInterests(uid),
        getRecentlyViewedIds(uid, 20),
    ]);

    const recentlyViewedSet = new Set(recentlyViewedIds);

    // Fetch active opportunities
    const snapshot = await db
        .collection(OPPORTUNITIES_COLLECTION)
        .where('status', '==', 'approved')
        .orderBy('registrationDeadline', 'asc')
        .limit(100) // Fetch more to filter and score
        .get();

    if (snapshot.empty) {
        return {
            items: [],
            userHasHistory: true,
            type: 'personalized',
        };
    }

    // Score and filter opportunities
    const scoredOpportunities: ScoredOpportunity[] = [];

    snapshot.docs.forEach((doc) => {
        // Skip recently viewed
        if (recentlyViewedSet.has(doc.id)) return;

        const data = doc.data();

        // Skip closed opportunities
        if (data.registrationDeadline) {
            const deadline = new Date(data.registrationDeadline);
            if (deadline < new Date()) return;
        }

        const opportunity: Opportunity = {
            id: doc.id,
            title: data.title || '',
            category: data.category || '',
            categoryId: data.categoryId,
            categoryName: data.categoryName,
            organizer: data.organizer || '',
            gradeEligibility: data.gradeEligibility || '',
            mode: data.mode || 'online',
            startDate: data.startDate,
            endDate: data.endDate,
            registrationDeadline: data.registrationDeadline,
            registrationDeadlineTBD: data.registrationDeadlineTBD,
            fee: data.fee,
            image: data.image,
            description: data.description,
            searchKeywords: data.searchKeywords,
            views: data.views,
            organizerLogo: data.organizerLogo,
        };

        scoredOpportunities.push(calculateScore(opportunity, interests));
    });

    // Sort by score descending
    scoredOpportunities.sort((a, b) => b.score - a.score);

    return {
        items: scoredOpportunities.slice(0, limit),
        userHasHistory: true,
        type: 'personalized',
    };
}

/**
 * Get trending opportunities (fallback for new users)
 */
export async function getTrendingRecommendations(limit = 10): Promise<RecommendationsResponse> {
    const db = getDb();

    try {
        // Try with index-based query first
        const snapshot = await db
            .collection(OPPORTUNITIES_COLLECTION)
            .where('status', '==', 'approved')
            .orderBy('views', 'desc')
            .limit(limit)
            .get();

        const items: ScoredOpportunity[] = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                opportunity: {
                    id: doc.id,
                    title: data.title || '',
                    category: data.category || '',
                    categoryId: data.categoryId,
                    categoryName: data.categoryName,
                    organizer: data.organizer || '',
                    gradeEligibility: data.gradeEligibility || '',
                    mode: data.mode || 'online',
                    startDate: data.startDate,
                    endDate: data.endDate,
                    registrationDeadline: data.registrationDeadline,
                    registrationDeadlineTBD: data.registrationDeadlineTBD,
                    fee: data.fee,
                    image: data.image,
                    description: data.description,
                    views: data.views,
                    organizerLogo: data.organizerLogo,
                },
                score: 50 + Math.min((data.views || 0) / 10, 50),
                matchReasons: ['Trending opportunity'],
            };
        });

        return {
            items,
            userHasHistory: false,
            type: 'trending',
        };
    } catch (error: any) {
        // If index error, fallback to simpler query with client-side sort
        console.warn('Trending query failed, using fallback:', error.message);

        const snapshot = await db
            .collection(OPPORTUNITIES_COLLECTION)
            .where('status', '==', 'approved')
            .limit(50)
            .get();

        const allItems: ScoredOpportunity[] = [];

        snapshot.docs.forEach((doc) => {
            const data = doc.data();

            // Skip expired opportunities
            if (data.registrationDeadline) {
                const deadline = new Date(data.registrationDeadline);
                if (deadline < new Date()) return;
            }

            allItems.push({
                opportunity: {
                    id: doc.id,
                    title: data.title || '',
                    category: data.category || '',
                    categoryId: data.categoryId,
                    categoryName: data.categoryName,
                    organizer: data.organizer || '',
                    gradeEligibility: data.gradeEligibility || '',
                    mode: data.mode || 'online',
                    startDate: data.startDate,
                    endDate: data.endDate,
                    registrationDeadline: data.registrationDeadline,
                    registrationDeadlineTBD: data.registrationDeadlineTBD,
                    fee: data.fee,
                    image: data.image,
                    description: data.description,
                    views: data.views || 0,
                    organizerLogo: data.organizerLogo,
                },
                score: 50 + Math.min((data.views || 0) / 10, 50),
                matchReasons: ['Trending opportunity'],
            });
        });

        // Sort by views descending
        allItems.sort((a, b) => (b.opportunity.views || 0) - (a.opportunity.views || 0));

        return {
            items: allItems.slice(0, limit),
            userHasHistory: false,
            type: 'trending',
        };
    }
}

/**
 * Get similar opportunities based on category and keywords
 */
export async function getSimilarOpportunities(
    opportunityId: string,
    limit = 6,
): Promise<Opportunity[]> {
    const db = getDb();

    // Get the source opportunity
    const sourceDoc = await db.collection(OPPORTUNITIES_COLLECTION).doc(opportunityId).get();

    if (!sourceDoc.exists) {
        return [];
    }

    const sourceData = sourceDoc.data();
    const sourceCategory = sourceData?.categoryId || sourceData?.category;

    if (!sourceCategory) {
        return [];
    }

    // Find opportunities in the same category
    const snapshot = await db
        .collection(OPPORTUNITIES_COLLECTION)
        .where('status', '==', 'approved')
        .where('categoryId', '==', sourceCategory)
        .limit(limit + 1) // +1 to exclude source
        .get();

    const similar: Opportunity[] = [];

    snapshot.docs.forEach((doc) => {
        if (doc.id === opportunityId) return; // Skip source
        if (similar.length >= limit) return;

        const data = doc.data();

        // Skip expired
        if (data.registrationDeadline) {
            const deadline = new Date(data.registrationDeadline);
            if (deadline < new Date()) return;
        }

        similar.push({
            id: doc.id,
            title: data.title || '',
            category: data.category || '',
            categoryId: data.categoryId,
            categoryName: data.categoryName,
            organizer: data.organizer || '',
            gradeEligibility: data.gradeEligibility || '',
            mode: data.mode || 'online',
            startDate: data.startDate,
            endDate: data.endDate,
            registrationDeadline: data.registrationDeadline,
            registrationDeadlineTBD: data.registrationDeadlineTBD,
            fee: data.fee,
            image: data.image,
            organizerLogo: data.organizerLogo,
        });
    });

    return similar;
}
