import { NextRequest, NextResponse } from 'next/server';
import { getAdminAuth } from '@/lib/firebaseAdmin';
import {
    getNotificationPreferences,
    updateNotificationPreferences,
} from '@/lib/notificationService';

/**
 * GET /api/notifications/preferences
 * Get user's notification preferences
 */
export async function GET(request: NextRequest) {
    try {
        const authHeader = request.headers.get('authorization') || request.headers.get('Authorization');

        if (!authHeader) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const [scheme, token] = authHeader.split(' ');
        if (!scheme || scheme.toLowerCase() !== 'bearer' || !token) {
            return NextResponse.json({ error: 'Invalid authorization' }, { status: 401 });
        }

        const auth = getAdminAuth();
        let uid: string;

        try {
            const decoded = await auth.verifyIdToken(token);
            uid = decoded.uid;
        } catch {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const preferences = await getNotificationPreferences(uid);

        return NextResponse.json(preferences);
    } catch (error) {
        console.error('Failed to get preferences:', error);
        return NextResponse.json(
            { error: 'Failed to get preferences' },
            { status: 500 }
        );
    }
}

/**
 * PUT /api/notifications/preferences
 * Update user's notification preferences
 */
export async function PUT(request: NextRequest) {
    try {
        const authHeader = request.headers.get('authorization') || request.headers.get('Authorization');

        if (!authHeader) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const [scheme, token] = authHeader.split(' ');
        if (!scheme || scheme.toLowerCase() !== 'bearer' || !token) {
            return NextResponse.json({ error: 'Invalid authorization' }, { status: 401 });
        }

        const auth = getAdminAuth();
        let uid: string;

        try {
            const decoded = await auth.verifyIdToken(token);
            uid = decoded.uid;
        } catch {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const body = await request.json();

        // Validate fields
        const validFields = [
            'newOpportunities',
            'deadlineReminders',
            'weeklyDigest',
            'schoolActivity',
            'applicationUpdates',
            'pushEnabled',
            'emailEnabled',
            'emailFrequency',
        ];

        const updates: Record<string, any> = {};
        for (const field of validFields) {
            if (field in body) {
                updates[field] = body[field];
            }
        }

        const updated = await updateNotificationPreferences(uid, updates);

        return NextResponse.json(updated);
    } catch (error) {
        console.error('Failed to update preferences:', error);
        return NextResponse.json(
            { error: 'Failed to update preferences' },
            { status: 500 }
        );
    }
}
