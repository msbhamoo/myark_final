/**
 * Hook to track clicks from shared links
 * Call this in components that display shared content
 */
'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export const useShareClickTracking = (opportunityId: string) => {
    const searchParams = useSearchParams();

    useEffect(() => {
        const shareCode = searchParams?.get('ref');

        if (shareCode) {
            // Store in session storage for conversion tracking
            sessionStorage.setItem('shareReferralCode', shareCode);

            // Record the click
            fetch('/api/shares/click', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    shareCode,
                    opportunityId,
                    referrer: typeof window !== 'undefined' ? document.referrer : undefined,
                }),
            }).catch((error) => {
                console.error('Failed to record share click:', error);
            });
        }
    }, [searchParams, opportunityId]);
};
