/**
 * Hook to track view conversions for shared links
 * Call this in components that display opportunity details
 */
'use client';

import { useEffect, useRef } from 'react';
import { trackViewConversion } from '@/lib/conversionTracking';

export const useViewConversionTracking = (opportunityId: string, userId?: string) => {
    const hasTracked = useRef(false);

    useEffect(() => {
        // Only track once per page load
        if (hasTracked.current) return;

        // Track the view conversion
        trackViewConversion(opportunityId, userId).then((success) => {
            if (success) {
                hasTracked.current = true;
            }
        });
    }, [opportunityId, userId]);
};
