/**
 * Theme Utility Functions
 * Helper functions for theme validation, conversion, and application
 */

import {
    ThemeConfig,
    ThemeColors,
    ThemeValidationResult,
    ThemeValidationError,
    DEFAULT_THEME_COLORS,
    DEFAULT_DARK_MODE,
    DEFAULT_TYPOGRAPHY,
    DEFAULT_SPACING,
} from '@/types/theme';

// ============================================================================
// Color Validation
// ============================================================================

/**
 * Validates if a string is a valid hex color
 */
export function isValidHexColor(color: string): boolean {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
}

/**
 * Validates if a color has acceptable contrast ratio
 * @param foreground - Foreground color (hex)
 * @param background - Background color (hex)
 * @param minRatio - Minimum contrast ratio (default: 4.5 for WCAG AA)
 */
export function hasGoodContrast(
    foreground: string,
    background: string,
    minRatio: number = 4.5
): boolean {
    const ratio = getContrastRatio(foreground, background);
    return ratio >= minRatio;
}

/**
 * Calculate contrast ratio between two colors
 */
export function getContrastRatio(color1: string, color2: string): number {
    const lum1 = getRelativeLuminance(color1);
    const lum2 = getRelativeLuminance(color2);
    const lighter = Math.max(lum1, lum2);
    const darker = Math.min(lum1, lum2);
    return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Get relative luminance of a color
 */
function getRelativeLuminance(hex: string): number {
    const rgb = hexToRgb(hex);
    if (!rgb) return 0;

    const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((val) => {
        val = val / 255;
        return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Convert hex color to RGB
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
        }
        : null;
}

/**
 * Convert RGB to hex color
 */
export function rgbToHex(r: number, g: number, b: number): string {
    return '#' + [r, g, b].map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }).join('');
}

// ============================================================================
// Theme Validation
// ============================================================================

/**
 * Validates all colors in the theme configuration
 */
export function validateThemeColors(colors: Partial<ThemeColors>): ThemeValidationResult {
    const errors: ThemeValidationError[] = [];

    // Validate each color is a valid hex
    Object.entries(colors).forEach(([key, value]) => {
        if (value && !isValidHexColor(value)) {
            errors.push({
                field: key,
                message: `Invalid hex color format`,
                value,
            });
        }
    });

    // Validate contrast ratios for critical color pairs
    if (colors.foreground && colors.background) {
        if (!hasGoodContrast(colors.foreground, colors.background)) {
            errors.push({
                field: 'foreground/background',
                message: 'Insufficient contrast ratio (minimum 4.5:1 required)',
            });
        }
    }

    if (colors.accentForeground && colors.accent) {
        if (!hasGoodContrast(colors.accentForeground, colors.accent)) {
            errors.push({
                field: 'accentForeground/accent',
                message: 'Insufficient contrast ratio on accent colors',
            });
        }
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
}

/**
 * Validates complete theme configuration
 */
export function validateThemeConfig(config: Partial<ThemeConfig>): ThemeValidationResult {
    const errors: ThemeValidationError[] = [];

    // Validate name
    if (config.name && config.name.trim().length < 3) {
        errors.push({
            field: 'name',
            message: 'Theme name must be at least 3 characters',
            value: config.name,
        });
    }

    // Validate colors
    if (config.colors) {
        const colorValidation = validateThemeColors(config.colors);
        errors.push(...colorValidation.errors);
    }

    // Validate dark mode colors
    if (config.darkMode) {
        const darkModeValidation = validateThemeColors(config.darkMode as any);
        errors.push(...darkModeValidation.errors.map(e => ({
            ...e,
            field: `darkMode.${e.field}`,
        })));
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
}

// ============================================================================
// Theme Application
// ============================================================================

/**
 * Apply theme colors to CSS variables
 */
export function applyThemeToCSSVariables(config: ThemeConfig): void {
    const root = document.documentElement;

    // Apply light mode colors
    Object.entries(config.colors).forEach(([key, value]) => {
        const cssVarName = `--${camelToKebab(key)}`;
        root.style.setProperty(cssVarName, value);
    });

    // Explicitly set chart colors for gradients (mapping from primary brand colors)
    if (config.colors.primary) root.style.setProperty('--chart-1', config.colors.primary);
    if (config.colors.primaryDark) root.style.setProperty('--chart-2', config.colors.primaryDark);
    if (config.colors.primaryDarker) root.style.setProperty('--chart-3', config.colors.primaryDarker);

    // Apply dark mode colors (scoped to .dark class)
    const darkStyles = Object.entries(config.darkMode)
        .map(([key, value]) => `--${camelToKebab(key)}: ${value};`)
        .join('\n  ');

    // Add chart colors to dark mode
    const darkChartStyles = [
        `--chart-1: ${config.darkMode.primary};`,
        `--chart-2: ${config.darkMode.primaryDark};`,
        `--chart-3: ${config.darkMode.primaryDarker};`
    ].join('\n  ');

    // Create or update dynamic style tag for dark mode
    let styleTag = document.getElementById('theme-dark-mode');
    if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = 'theme-dark-mode';
        document.head.appendChild(styleTag);
    }
    styleTag.textContent = `
      .dark {
        ${darkStyles}
        ${darkChartStyles}
      }
    `;

    // Apply typography
    if (config.typography) {
        root.style.setProperty('--font-sans', config.typography.fontFamily.sans);
        root.style.setProperty('--font-serif', config.typography.fontFamily.serif);
        root.style.setProperty('--font-mono', config.typography.fontFamily.mono);
    }

    // Apply spacing
    if (config.spacing) {
        root.style.setProperty('--radius', config.spacing.borderRadius.md);
    }
}

/**
 * Convert camelCase to kebab-case
 */
function camelToKebab(str: string): string {
    return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
}

// ============================================================================
// Theme Export/Import
// ============================================================================

/**
 * Export theme configuration as JSON
 */
export function exportTheme(config: ThemeConfig): string {
    return JSON.stringify(config, null, 2);
}

/**
 * Import theme from JSON string
 */
export function importTheme(jsonString: string): ThemeConfig | null {
    try {
        const config = JSON.parse(jsonString) as ThemeConfig;
        const validation = validateThemeConfig(config);

        if (!validation.isValid) {
            console.error('Invalid theme configuration:', validation.errors);
            return null;
        }

        return config;
    } catch (error) {
        console.error('Failed to parse theme JSON:', error);
        return null;
    }
}

// ============================================================================
// Default Theme Generator
// ============================================================================

/**
 * Creates a complete default theme configuration
 */
export function createDefaultTheme(): Omit<ThemeConfig, 'id' | 'createdAt' | 'updatedAt'> {
    return {
        name: 'Myark Green (Default)',
        description: 'The default Myark theme with green branding',
        version: 1,
        colors: DEFAULT_THEME_COLORS,
        darkMode: DEFAULT_DARK_MODE,
        typography: DEFAULT_TYPOGRAPHY,
        spacing: DEFAULT_SPACING,
        isActive: true,
        isDefault: true,
    };
}

// ============================================================================
// Color Manipulation
// ============================================================================

/**
 * Darken a hex color by a percentage
 */
export function darkenColor(hex: string, percent: number): string {
    const rgb = hexToRgb(hex);
    if (!rgb) return hex;

    const factor = 1 - percent / 100;
    return rgbToHex(
        Math.round(rgb.r * factor),
        Math.round(rgb.g * factor),
        Math.round(rgb.b * factor)
    );
}

/**
 * Lighten a hex color by a percentage
 */
export function lightenColor(hex: string, percent: number): string {
    const rgb = hexToRgb(hex);
    if (!rgb) return hex;

    const factor = percent / 100;
    return rgbToHex(
        Math.min(255, Math.round(rgb.r + (255 - rgb.r) * factor)),
        Math.min(255, Math.round(rgb.g + (255 - rgb.g) * factor)),
        Math.min(255, Math.round(rgb.b + (255 - rgb.b) * factor))
    );
}

/**
 * Generate a color palette from a base color
 */
export function generateColorPalette(baseColor: string): {
    primary: string;
    primaryDark: string;
    primaryDarker: string;
    accent: string;
} {
    return {
        primary: baseColor,
        primaryDark: darkenColor(baseColor, 15),
        primaryDarker: darkenColor(baseColor, 25),
        accent: lightenColor(baseColor, 60),
    };
}
