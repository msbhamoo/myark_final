import { getDb } from '@/lib/firebaseAdmin';
import type { RecordShareRequest, RecordShareResponse, ShareRecord } from '@/types/shareTracking';
import { hashString } from '@/lib/trackingUtils';
import { NextResponse } from 'next/server';

const SHARES_COLLECTION = 'shares';

/**
 * Generate a unique share tracking code
 * Duplicated here to avoid client/server import issues
 */
function generateShareCode(userId?: string): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);

    if (userId) {
        const userHash = userId.substring(0, 8);
        return `usr_${userHash}_${timestamp}${random}`;
    } else {
        return `anon_${timestamp}${random}`;
    }
}

export async function POST(request: Request) {
    try {
        const body: RecordShareRequest = await request.json();
        const {
            opportunityId,
            opportunityTitle,
            opportunitySlug,
            shareMethod,
            platform,
            userId,
            userEmail,
            userName,
        } = body;

        // Generate unique share code
        const shareCode = generateShareCode(userId);

        // Get IP and User Agent for anonymous tracking
        const ipAddress = request.headers.get('x-forwarded-for') ||
            request.headers.get('x-real-ip') ||
            'unknown';
        const userAgent = request.headers.get('user-agent') || 'unknown';

        // Create share record
        const shareRecord: ShareRecord = {
            id: shareCode,
            shareCode,
            sharedBy: {
                userId: userId || null,
                userEmail: userEmail || null,
                userName: userName || null,
                isAuthenticated: !!userId,
                ipAddress: userId ? undefined : hashString(ipAddress),
                userAgent: userId ? undefined : userAgent,
            },
            opportunityId,
            opportunityTitle,
            opportunitySlug: opportunitySlug || null, // Convert undefined to null
            shareMethod,
            platform,
            clickCount: 0,
            uniqueVisitors: 0,
            conversions: {
                registered: 0,
                bookmarked: 0,
                viewed: 0,
            },
            sharedAt: new Date().toISOString(),
            isActive: true,
        };

        // Remove undefined values from sharedBy to avoid Firestore errors
        if (shareRecord.sharedBy.ipAddress === undefined) {
            delete (shareRecord.sharedBy as any).ipAddress;
        }
        if (shareRecord.sharedBy.userAgent === undefined) {
            delete (shareRecord.sharedBy as any).userAgent;
        }

        // Save to Firestore using Admin SDK
        const adminDb = getDb();
        await adminDb.collection(SHARES_COLLECTION).doc(shareCode).set(shareRecord);

        // Update user rewards (always track, even if rewards disabled)
        if (userId) {
            try {
                const { updateUserRewards, getRewardConfig } = await import('@/lib/badgeSystem');
                const config = await getRewardConfig();
                if (config) {
                    await updateUserRewards(userId, {
                        points: config.pointsPerShare,
                        shares: 1,
                    });
                }
            } catch (rewardError) {
                console.error('Error updating rewards:', rewardError);
                // Don't fail the share if rewards update fails
            }
        }

        const response: RecordShareResponse = {
            success: true,
            shareCode,
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error('Error recording share:', error);
        console.error('Error details:', {
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
            error: error
        });
        return NextResponse.json(
            {
                success: false,
                message: 'Failed to record share',
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
