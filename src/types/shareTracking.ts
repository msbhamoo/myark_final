/**
 * Share Tracking Types
 * Database models for tracking opportunity shares and analytics
 */

/**
 * Share record stored in Firestore
 */
export interface ShareRecord {
    id: string;
    shareCode: string; // Unique tracking code

    // Who shared
    sharedBy: {
        userId: string | null; // null if anonymous
        userEmail: string | null;
        userName: string | null;
        isAuthenticated: boolean;
        ipAddress?: string; // Hashed for anonymous
        userAgent?: string;
    };

    // What was shared
    opportunityId: string;
    opportunityTitle: string;
    opportunitySlug?: string | null; // Allow null or undefined

    // Share method
    shareMethod: 'native' | 'clipboard' | 'whatsapp' | 'facebook' | 'twitter' | 'other';
    platform: 'mobile' | 'desktop';

    // Metrics
    clickCount: number;
    uniqueVisitors: number;
    conversions: {
        registered: number;
        bookmarked: number;
        viewed: number;
    };

    // Timestamps
    sharedAt: string; // ISO timestamp
    lastClickAt?: string;

    // Status
    isActive: boolean;
}

/**
 * Individual click on a shared link
 */
export interface ShareClick {
    id: string;
    shareCode: string; // Reference to ShareRecord

    // Visitor info
    visitorId: string; // Hash of IP + User Agent
    userId?: string; // Set if they log in

    // Visit details
    clickedAt: string;
    ipAddress: string;
    userAgent: string;
    referrer?: string;

    // Actions taken
    actions: {
        viewedOpportunity: boolean;
        registered: boolean;
        bookmarked: boolean;
        registeredAt?: string;
    };
}

/**
 * Request to record a new share
 */
export interface RecordShareRequest {
    opportunityId: string;
    opportunityTitle: string;
    opportunitySlug?: string;
    shareMethod: 'native' | 'clipboard' | 'whatsapp' | 'facebook' | 'twitter' | 'other';
    platform: 'mobile' | 'desktop';
    userId?: string;
    userEmail?: string;
    userName?: string;
}

/**
 * Response from recording a share
 */
export interface RecordShareResponse {
    success: boolean;
    shareCode: string;
    message?: string;
}

/**
 * Request to record a click on shared link
 */
export interface RecordClickRequest {
    shareCode: string;
    opportunityId: string;
    referrer?: string;
}

/**
 * Share analytics data
 */
export interface ShareAnalytics {
    totalShares: number;
    totalClicks: number;
    totalConversions: number;
    conversionRate: number;
    clickThroughRate: number;

    shareBreakdown: {
        authenticated: number;
        anonymous: number;
    };

    topShares: ShareRecord[];
    recentShares: ShareRecord[];

    // Time series data
    sharesOverTime?: Array<{
        date: string;
        shares: number;
        clicks: number;
    }>;
}

/**
 * Reward system configuration (admin setting)
 */
export interface RewardSystemConfig {
    enabled: boolean;
    pointsPerShare: number;
    pointsPerClick: number;
    pointsPerConversion: number;

    badges: {
        [key: string]: {
            name: string;
            description: string;
            requirement: number; // Number needed to unlock
            icon: string;
        };
    };
}

/**
 * User rewards data
 */
export interface UserRewards {
    userId: string;
    totalPoints: number;
    totalShares: number;
    totalClicks: number;
    totalConversions: number;
    badges: string[]; // Badge IDs earned
    rank?: number; // Leaderboard position
}
