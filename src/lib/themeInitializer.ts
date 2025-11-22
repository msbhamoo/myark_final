/**
 * Theme Initializer
 * Loads and applies theme configuration on app startup
 * Implements caching for performance
 */

'use client';

import { ThemeConfig } from '@/types/theme';
import { applyThemeToCSSVariables } from '@/lib/themeUtils';

const THEME_CACHE_KEY = 'myark_theme';
const THEME_CACHE_DURATION = 1000 * 60 * 60; // 1 hour

interface CachedTheme {
    theme: ThemeConfig;
    timestamp: number;
}

/**
 * Load theme from cache or Firebase
 */
export async function loadTheme(): Promise<ThemeConfig> {
    try {
        // Check cache first
        const cached = getCachedTheme();
        if (cached) {
            return cached;
        }

        // Fetch from API
        const response = await fetch('/api/theme');
        if (!response.ok) {
            throw new Error('Failed to fetch theme');
        }

        const data = await response.json();
        const theme = data.theme as ThemeConfig;

        // Cache the theme
        cacheTheme(theme);

        return theme;
    } catch (error) {
        console.error('Failed to load theme:', error);
        // Return null to use default CSS variables
        throw error;
    }
}

/**
 * Get theme from localStorage cache
 */
function getCachedTheme(): ThemeConfig | null {
    if (typeof window === 'undefined') return null;

    try {
        const cached = localStorage.getItem(THEME_CACHE_KEY);
        if (!cached) return null;

        const { theme, timestamp } = JSON.parse(cached) as CachedTheme;

        // Check if cache is still valid
        if (Date.now() - timestamp > THEME_CACHE_DURATION) {
            localStorage.removeItem(THEME_CACHE_KEY);
            return null;
        }

        return theme;
    } catch (error) {
        console.error('Failed to read theme cache:', error);
        return null;
    }
}

/**
 * Save theme to localStorage cache
 */
function cacheTheme(theme: ThemeConfig): void {
    if (typeof window === 'undefined') return;

    try {
        const cached: CachedTheme = {
            theme,
            timestamp: Date.now(),
        };
        localStorage.setItem(THEME_CACHE_KEY, JSON.stringify(cached));
    } catch (error) {
        console.error('Failed to cache theme:', error);
    }
}

/**
 * Clear theme cache (useful after theme update)
 */
export function clearThemeCache(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(THEME_CACHE_KEY);
}

/**
 * Initialize and apply theme
 */
export async function initializeTheme(): Promise<void> {
    try {
        const theme = await loadTheme();
        applyThemeToCSSVariables(theme);
    } catch (error) {
        console.error('Failed to initialize theme:', error);
        // App will use default CSS variables
    }
}

/**
 * Update theme (clears cache and reloads)
 */
export async function updateThemeAndReload(): Promise<void> {
    clearThemeCache();
    await initializeTheme();
    // Reload page to apply changes
    window.location.reload();
}
