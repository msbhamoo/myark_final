import { getDb } from '@/lib/firebaseAdmin';
import { NextResponse } from 'next/server';
import { hashString } from '@/lib/trackingUtils';
import type { RecordClickRequest, ShareClick } from '@/types/shareTracking';

const SHARES_COLLECTION = 'shares';
const CLICKS_COLLECTION = 'shareClicks';

export async function POST(request: Request) {
    try {
        const body: RecordClickRequest = await request.json();
        const { shareCode, opportunityId, referrer } = body;

        // Get visitor info
        const ipAddress = request.headers.get('x-forwarded-for') ||
            request.headers.get('x-real-ip') ||
            'unknown';
        const userAgent = request.headers.get('user-agent') || 'unknown';
        const visitorId = hashString(`${ipAddress}_${userAgent}`);

        // Create click record
        const clickRecord: ShareClick = {
            id: `${shareCode}_${Date.now()}`,
            shareCode,
            visitorId,
            clickedAt: new Date().toISOString(),
            ipAddress: hashString(ipAddress),
            userAgent,
            referrer,
            actions: {
                viewedOpportunity: true,
                registered: false,
                bookmarked: false,
            },
        };

        const adminDb = getDb();

        // Save click record
        await adminDb.collection(CLICKS_COLLECTION).doc(clickRecord.id).set(clickRecord);

        // Update share record statistics
        const shareRef = adminDb.collection(SHARES_COLLECTION).doc(shareCode);
        const shareDoc = await shareRef.get();

        if (shareDoc.exists) {
            const shareData = shareDoc.data();
            await shareRef.update({
                clickCount: (shareData?.clickCount || 0) + 1,
                lastClickAt: new Date().toISOString(),
            });

            // Update rewards for share owner
            const shareOwnerId = shareData?.sharedBy?.userId;
            if (shareOwnerId) {
                try {
                    const { updateUserRewards, getRewardConfig } = await import('@/lib/badgeSystem');
                    const config = await getRewardConfig();
                    if (config) {
                        await updateUserRewards(shareOwnerId, {
                            points: config.pointsPerClick,
                            clicks: 1,
                        });
                    }
                } catch (rewardError) {
                    console.error('Error updating click rewards:', rewardError);
                }
            }
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error recording click:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to record click' },
            { status: 500 }
        );
    }
}
