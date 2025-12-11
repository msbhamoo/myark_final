import { NextRequest, NextResponse } from 'next/server';
import { getAdminAuth } from '@/lib/firebaseAdmin';
import {
    generateWeeklyDigest,
    checkUserDeadlineAlerts,
} from '@/lib/notificationService';

/**
 * GET /api/notifications/digest
 * Get weekly digest content for current user (preview)
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

        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type') || 'weekly';

        if (type === 'deadline') {
            const alerts = await checkUserDeadlineAlerts(uid);
            return NextResponse.json({
                type: 'deadline',
                alerts,
            });
        }

        const digest = await generateWeeklyDigest(uid);

        if (!digest) {
            return NextResponse.json({
                type: 'weekly',
                digest: null,
                message: 'No recommendations available yet. Explore more opportunities!',
            });
        }

        return NextResponse.json({
            type: 'weekly',
            digest,
        });
    } catch (error) {
        console.error('Failed to generate digest:', error);
        return NextResponse.json(
            { error: 'Failed to generate digest' },
            { status: 500 }
        );
    }
}
