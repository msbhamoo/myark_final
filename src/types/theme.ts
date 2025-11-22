/**
 * Theme System Type Definitions
 * Comprehensive type definitions for the admin-configurable theme system
 */

import { Timestamp } from 'firebase/firestore';

// ============================================================================
// Color Types
// ============================================================================

export interface ThemeColors {
    // Primary brand colors (for buttons, links, CTAs)
    primary: string;           // Main brand color e.g., #58CC02
    primaryDark: string;       // Darker shade for gradients e.g., #3FA001
    primaryDarker: string;     // Darkest shade for accents e.g., #4DBB00

    // Accent colors (for backgrounds, badges, highlights)
    accent: string;            // Light accent e.g., #DFF7C8
    accentForeground: string;  // Text on accent backgrounds e.g., #1A2A33

    // Semantic colors
    success: string;           // Success states e.g., #10B981
    warning: string;           // Warning states e.g., #F59E0B
    error: string;             // Error states e.g., #EF4444
    info: string;              // Info states e.g., #3B82F6

    // Base UI colors
    background: string;        // Page background
    foreground: string;        // Main text color
    card: string;              // Card backgrounds
    cardForeground: string;    // Text on cards
    border: string;            // Border color
    input: string;             // Input backgrounds
    ring: string;              // Focus ring color

    // Muted colors
    muted: string;             // Muted backgrounds
    mutedForeground: string;   // Muted text

    // Secondary colors
    secondary: string;          // Secondary buttons/elements
    secondaryForeground: string; // Text on secondary elements
}

export interface ThemeDarkMode {
    // Dark mode variant of all colors
    primary: string;
    primaryDark: string;
    primaryDarker: string;
    accent: string;
    accentForeground: string;
    success: string;
    warning: string;
    error: string;
    info: string;
    background: string;
    foreground: string;
    card: string;
    cardForeground: string;
    border: string;
    input: string;
    ring: string;
    muted: string;
    mutedForeground: string;
    secondary: string;
    secondaryForeground: string;
}

// ============================================================================
// Typography Types
// ============================================================================

export interface ThemeTypography {
    // Font families
    fontFamily: {
        sans: string;      // Primary sans-serif font
        serif: string;     // Serif font for headings
        mono: string;      // Monospace font for code
    };

    // Font sizes (in rem)
    fontSize: {
        xs: string;        // Extra small: 0.75rem
        sm: string;        // Small: 0.875rem
        base: string;      // Base: 1rem
        lg: string;        // Large: 1.125rem
        xl: string;        // Extra large: 1.25rem
        '2xl': string;     // 2XL: 1.5rem
        '3xl': string;     // 3XL: 1.875rem
        '4xl': string;     // 4XL: 2.25rem
        '5xl': string;     // 5XL: 3rem
    };

    // Line heights
    lineHeight: {
        tight: string;     // 1.25
        normal: string;    // 1.5
        relaxed: string;   // 1.75
        loose: string;     // 2
    };

    // Font weights
    fontWeight: {
        light: number;     // 300
        normal: number;    // 400
        medium: number;    // 500
        semibold: number;  // 600
        bold: number;      // 700
        extrabold: number; // 800
    };
}

// ============================================================================
// Spacing Types
// ============================================================================

export interface ThemeSpacing {
    // Border radius (in rem)
    borderRadius: {
        none: string;      // 0
        sm: string;        // 0.125rem
        base: string;      // 0.25rem
        md: string;        // 0.375rem
        lg: string;        // 0.5rem
        xl: string;        // 0.75rem
        '2xl': string;     // 1rem
        '3xl': string;     // 1.5rem
        full: string;      // 9999px
    };

    // Spacing scale (in rem)
    spacing: {
        0: string;         // 0
        1: string;         // 0.25rem
        2: string;         // 0.5rem
        3: string;         // 0.75rem
        4: string;         // 1rem
        5: string;         // 1.25rem
        6: string;         // 1.5rem
        8: string;         // 2rem
        10: string;        // 2.5rem
        12: string;        // 3rem
        16: string;        // 4rem
        20: string;        // 5rem
        24: string;        // 6rem
    };
}

// ============================================================================
// Main Theme Configuration
// ============================================================================

export interface ThemeConfig {
    id: string;
    name: string;
    description?: string;
    version: number;

    // Color configuration
    colors: ThemeColors;
    darkMode: ThemeDarkMode;

    // Typography configuration
    typography: ThemeTypography;

    // Spacing configuration
    spacing: ThemeSpacing;

    // Metadata
    createdAt: Timestamp | Date;
    updatedAt: Timestamp | Date;
    createdBy?: string;      // User ID who created this theme
    isActive: boolean;       // Whether this theme is currently active
    isDefault: boolean;      // Whether this is a default/system theme
}

// ============================================================================
// Theme Preset Types
// ============================================================================

export type ThemePresetName = 'green' | 'blue' | 'purple' | 'orange' | 'red';

export interface ThemePreset {
    name: string;
    displayName: string;
    description: string;
    colors: Pick<ThemeColors, 'primary' | 'primaryDark' | 'primaryDarker' | 'accent' | 'accentForeground'>;
}

// ============================================================================
// Theme API Response Types
// ============================================================================

export interface GetThemeResponse {
    success: boolean;
    theme?: ThemeConfig;
    error?: string;
}

export interface UpdateThemeRequest {
    colors?: Partial<ThemeColors>;
    darkMode?: Partial<ThemeDarkMode>;
    typography?: Partial<ThemeTypography>;
    spacing?: Partial<ThemeSpacing>;
    name?: string;
    description?: string;
}

export interface UpdateThemeResponse {
    success: boolean;
    theme?: ThemeConfig;
    error?: string;
}

// ============================================================================
// Theme Utility Types
// ============================================================================

export interface ThemeValidationError {
    field: string;
    message: string;
    value?: string;
}

export interface ThemeValidationResult {
    isValid: boolean;
    errors: ThemeValidationError[];
}

// ============================================================================
// Default Theme Constants
// ============================================================================

export const DEFAULT_THEME_COLORS: ThemeColors = {
    // Primary - Myark Green
    primary: '#58CC02',
    primaryDark: '#3FA001',
    primaryDarker: '#4DBB00',

    // Accent
    accent: '#DFF7C8',
    accentForeground: '#1A2A33',

    // Semantic
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',

    // Base
    background: '#FFFFFF',
    foreground: '#1A2A33',
    card: '#F6F6F6',
    cardForeground: '#1A2A33',
    border: '#E5E7EB',
    input: '#FFFFFF',
    ring: '#58CC02',

    // Muted
    muted: '#D1D5DB',
    mutedForeground: '#6B7280',

    // Secondary
    secondary: '#E5E7EB',
    secondaryForeground: '#1A2A33',
};

export const DEFAULT_DARK_MODE: ThemeDarkMode = {
    primary: '#58CC02',
    primaryDark: '#3FA001',
    primaryDarker: '#4DBB00',
    accent: '#DFF7C8',
    accentForeground: '#0F172A',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
    background: '#0F172A',
    foreground: '#F1F5F9',
    card: '#1E293B',
    cardForeground: '#F1F5F9',
    border: '#334155',
    input: '#1E293B',
    ring: '#58CC02',
    muted: '#334155',
    mutedForeground: '#94A3B8',
    secondary: '#334155',
    secondaryForeground: '#F1F5F9',
};

export const DEFAULT_TYPOGRAPHY: ThemeTypography = {
    fontFamily: {
        sans: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        serif: 'Georgia, serif',
        mono: '"Fira Code", Consolas, Monaco, monospace',
    },
    fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
    },
    lineHeight: {
        tight: '1.25',
        normal: '1.5',
        relaxed: '1.75',
        loose: '2',
    },
    fontWeight: {
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
        extrabold: 800,
    },
};

export const DEFAULT_SPACING: ThemeSpacing = {
    borderRadius: {
        none: '0',
        sm: '0.125rem',
        base: '0.25rem',
        md: '0.375rem',
        lg: '0.5rem',
        xl: '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        full: '9999px',
    },
    spacing: {
        0: '0',
        1: '0.25rem',
        2: '0.5rem',
        3: '0.75rem',
        4: '1rem',
        5: '1.25rem',
        6: '1.5rem',
        8: '2rem',
        10: '2.5rem',
        12: '3rem',
        16: '4rem',
        20: '5rem',
        24: '6rem',
    },
};
