import { NextRequest, NextResponse } from 'next/server';
import { getAdminAuth } from '@/lib/firebaseAdmin';
import {
    saveFCMToken,
    removeFCMToken,
    getUserFCMTokens,
} from '@/lib/notificationService';

/**
 * POST /api/notifications/subscribe
 * Subscribe to push notifications by saving FCM token
 */
export async function POST(request: NextRequest) {
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
        const { fcmToken, platform = 'web' } = body;

        if (!fcmToken) {
            return NextResponse.json({ error: 'FCM token is required' }, { status: 400 });
        }

        const userAgent = request.headers.get('user-agent') || undefined;

        await saveFCMToken(uid, fcmToken, platform, userAgent);

        return NextResponse.json({
            success: true,
            message: 'Subscribed to push notifications',
        });
    } catch (error) {
        console.error('Failed to subscribe to notifications:', error);
        return NextResponse.json(
            { error: 'Failed to subscribe' },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/notifications/subscribe
 * Unsubscribe from push notifications by removing FCM token
 */
export async function DELETE(request: NextRequest) {
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

        const url = new URL(request.url);
        const fcmToken = url.searchParams.get('token');

        if (!fcmToken) {
            return NextResponse.json({ error: 'FCM token is required' }, { status: 400 });
        }

        await removeFCMToken(uid, fcmToken);

        return NextResponse.json({
            success: true,
            message: 'Unsubscribed from push notifications',
        });
    } catch (error) {
        console.error('Failed to unsubscribe from notifications:', error);
        return NextResponse.json(
            { error: 'Failed to unsubscribe' },
            { status: 500 }
        );
    }
}

/**
 * GET /api/notifications/subscribe
 * Check subscription status
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

        const tokens = await getUserFCMTokens(uid);

        return NextResponse.json({
            subscribed: tokens.length > 0,
            tokenCount: tokens.length,
            platforms: [...new Set(tokens.map(t => t.platform))],
        });
    } catch (error) {
        console.error('Failed to check subscription:', error);
        return NextResponse.json(
            { error: 'Failed to check subscription' },
            { status: 500 }
        );
    }
}
