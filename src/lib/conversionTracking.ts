/**
 * Conversion Tracking Utility
 * Records user conversions from shared links
 */

export type ConversionType = 'viewed' | 'registered' | 'bookmarked';

export interface ConversionData {
    shareCode: string;
    opportunityId: string;
    userId?: string;
    conversionType: ConversionType;
}

/**
 * Get the share referral code from session storage
 */
export const getShareCode = (): string | null => {
    if (typeof window === 'undefined') return null;
    return sessionStorage.getItem('shareReferralCode');
};

/**
 * Clear the share referral code from session storage
 */
export const clearShareCode = (): void => {
    if (typeof window === 'undefined') return;
    sessionStorage.removeItem('shareReferralCode');
};

/**
 * Record a conversion event
 */
export const recordConversion = async (
    conversionType: ConversionType,
    opportunityId: string,
    userId?: string
): Promise<boolean> => {
    const shareCode = getShareCode();

    if (!shareCode) {
        // No share code means this wasn't from a shared link
        return false;
    }

    try {
        const response = await fetch('/api/shares/convert', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                shareCode,
                opportunityId,
                userId,
                conversionType,
            }),
        });

        if (!response.ok) {
            console.error('Failed to record conversion');
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error recording conversion:', error);
        return false;
    }
};

/**
 * Track a page view conversion
 */
export const trackViewConversion = (opportunityId: string, userId?: string) => {
    return recordConversion('viewed', opportunityId, userId);
};

/**
 * Track a registration conversion
 */
export const trackRegistrationConversion = (opportunityId: string, userId: string) => {
    return recordConversion('registered', opportunityId, userId);
};

/**
 * Track a bookmark conversion
 */
export const trackBookmarkConversion = (opportunityId: string, userId?: string) => {
    return recordConversion('bookmarked', opportunityId, userId);
};
