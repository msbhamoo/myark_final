/**
 * Theme API - GET /api/theme
 * Retrieves the current active theme configuration
 */

import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/firebaseAdmin';
import { ThemeConfig, UpdateThemeRequest } from '@/types/theme';
import { createDefaultTheme, validateThemeConfig } from '@/lib/themeUtils';
import { hasAdminSessionFromRequest } from '@/lib/adminSession';

export async function GET() {
    try {
        const db = getDb();
        const themeDoc = await db.collection('appConfig').doc('theme').get();

        if (!themeDoc.exists) {
            // Return default theme if none exists yet
            const defaultTheme = createDefaultTheme();
            return NextResponse.json({
                success: true,
                theme: {
                    ...defaultTheme,
                    id: 'default',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            });
        }

        const theme = themeDoc.data() as ThemeConfig;

        return NextResponse.json({
            success: true,
            theme,
        });
    } catch (error) {
        console.error('Failed to fetch theme:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to fetch theme',
            },
            { status: 500 }
        );
    }
}

/**
 * Theme API - PUT /api/theme
 * Updates the theme configuration (admin only)
 */
export async function PUT(request: NextRequest) {
    // Check admin session
    if (!hasAdminSessionFromRequest(request)) {
        return NextResponse.json(
            { success: false, error: 'Unauthorized - Admin access required' },
            { status: 401 }
        );
    }

    try {
        // Parse request body
        const updateData: UpdateThemeRequest = await request.json();

        // Get current theme or create default
        const db = getDb();
        const themeRef = db.collection('appConfig').doc('theme');
        const themeDoc = await themeRef.get();

        let currentTheme: ThemeConfig;

        if (!themeDoc.exists) {
            // Create new theme from default
            const defaultTheme = createDefaultTheme();
            currentTheme = {
                ...defaultTheme,
                id: 'theme',
                createdAt: new Date(),
                updatedAt: new Date(),
            } as ThemeConfig;
        } else {
            currentTheme = themeDoc.data() as ThemeConfig;
        }

        // Merge updates with current theme
        const updatedTheme: ThemeConfig = {
            ...currentTheme,
            ...(updateData.name && { name: updateData.name }),
            ...(updateData.description && { description: updateData.description }),
            ...(updateData.colors && { colors: { ...currentTheme.colors, ...updateData.colors } }),
            ...(updateData.darkMode && { darkMode: { ...currentTheme.darkMode, ...updateData.darkMode } }),
            ...(updateData.typography && { typography: { ...currentTheme.typography, ...updateData.typography } }),
            ...(updateData.spacing && { spacing: { ...currentTheme.spacing, ...updateData.spacing } }),
            version: currentTheme.version + 1,
            updatedAt: new Date(),
        };

        // Validate theme
        const validation = validateThemeConfig(updatedTheme);
        if (!validation.isValid) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Theme validation failed',
                    validationErrors: validation.errors,
                },
                { status: 400 }
            );
        }

        // Save to Firebase
        await themeRef.set(updatedTheme, { merge: true });

        return NextResponse.json({
            success: true,
            theme: updatedTheme,
        });

    } catch (error) {
        console.error('Failed to update theme:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to update theme',
            },
            { status: 500 }
        );
    }
}
