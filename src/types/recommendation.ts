/**
 * Recommendation System Types
 * Types for personalized opportunity recommendations
 */

import type { Opportunity } from './opportunity';

/**
 * User's inferred interests based on behavior
 */
export interface UserInterests {
    /** Category ID/name -> interaction count */
    categories: Record<string, number>;
    /** Keyword -> weight (higher = more interested) */
    keywords: Record<string, number>;
    /** Preferred opportunity modes */
    preferredModes: ('online' | 'offline' | 'hybrid')[];
    /** Preferred grade levels */
    preferredGrades: string[];
    /** Last time interests were updated */
    lastUpdated: string;
}

/**
 * Individual opportunity view event
 */
export interface OpportunityViewEvent {
    opportunityId: string;
    category: string;
    categoryId?: string;
    keywords: string[];
    viewedAt: string;
    /** Time spent on page in seconds */
    durationSeconds?: number;
}

/**
 * Opportunity with recommendation score
 */
export interface ScoredOpportunity {
    opportunity: Opportunity;
    /** Score from 0-100 */
    score: number;
    /** Human-readable reasons for recommendation */
    matchReasons: string[];
}

/**
 * Response from recommendations API
 */
export interface RecommendationsResponse {
    items: ScoredOpportunity[];
    /** Whether user has enough history for personalization */
    userHasHistory: boolean;
    /** Type of recommendations returned */
    type: 'personalized' | 'trending' | 'fallback';
}

/**
 * User behavior summary stored in Firestore
 */
export interface UserBehaviorSummary {
    totalViews: number;
    totalSaves: number;
    totalApplications: number;
    recentCategories: string[];
    recentKeywords: string[];
    firstInteraction: string;
    lastInteraction: string;
}

/**
 * Configuration for recommendation scoring
 */
export interface RecommendationConfig {
    categoryWeight: number;
    gradeWeight: number;
    keywordWeight: number;
    recencyWeight: number;
    deadlineWeight: number;
    popularityWeight: number;
}

/**
 * Default recommendation scoring weights
 */
export const DEFAULT_RECOMMENDATION_CONFIG: RecommendationConfig = {
    categoryWeight: 0.35,
    gradeWeight: 0.25,
    keywordWeight: 0.20,
    recencyWeight: 0.10,
    deadlineWeight: 0.05,
    popularityWeight: 0.05,
};
