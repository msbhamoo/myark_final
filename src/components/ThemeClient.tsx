/**
 * Theme Client Component
 * Initializes theme on client-side mount
 */

'use client';

import { useEffect } from 'react';
import { initializeTheme } from '@/lib/themeInitializer';

export function ThemeClient() {
    useEffect(() => {
        // Initialize theme on mount
        initializeTheme().catch((error) => {
            console.error('Theme initialization failed:', error);
        });
    }, []);

    return null; // This is a non-rendering component
}
