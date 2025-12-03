/**
 * Hash a string for privacy (simple hash for visitor IDs)
 */
export const hashString = (str: string): string => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(36);
};

/**
 * Get visitor ID from IP and User Agent (hashed for privacy)
 */
export const getVisitorId = (ipAddress: string, userAgent: string): string => {
    return hashString(`${ipAddress}_${userAgent}`);
};
