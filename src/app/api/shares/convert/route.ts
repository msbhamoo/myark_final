import { getDb } from '@/lib/firebaseAdmin';
import { NextResponse } from 'next/server';
import type { ConversionType } from '@/lib/conversionTracking';

const SHARES_COLLECTION = 'shares';
const CLICKS_COLLECTION = 'shareClicks';

interface ConvertRequest {
    shareCode: string;
    opportunityId: string;
    userId?: string;
    conversionType: ConversionType;
}

export async function POST(request: Request) {
    try {
        const body: ConvertRequest = await request.json();
        const { shareCode, opportunityId, userId, conversionType } = body;

        const adminDb = getDb();

        // Get visitor info for linking
        const ipAddress = request.headers.get('x-forwarded-for') ||
            request.headers.get('x-real-ip') ||
            'unknown';
        const userAgent = request.headers.get('user-agent') || 'unknown';
        const visitorId = Buffer.from(`${ipAddress}_${userAgent}`).toString('base64').substring(0, 20);

        // Find the most recent click record for this share and visitor
        const clicksSnapshot = await adminDb
            .collection(CLICKS_COLLECTION)
            .where('shareCode', '==', shareCode)
            .where('visitorId', '==', visitorId)
            .orderBy('clickedAt', 'desc')
            .limit(1)
            .get();

        if (!clicksSnapshot.empty) {
            const clickDoc = clicksSnapshot.docs[0];
            const clickRecordId = clickDoc.id;

            // Update the click record with conversion
            const updateData: any = {
                [`actions.${conversionType === 'viewed' ? 'viewedOpportunity' : conversionType}`]: true,
            };

            if (conversionType === 'registered') {
                updateData['actions.registeredAt'] = new Date().toISOString();
            } else if (conversionType === 'bookmarked') {
                updateData['actions.bookmarkedAt'] = new Date().toISOString();
            }

            if (userId) {
                updateData.userId = userId;
            }

            await adminDb.collection(CLICKS_COLLECTION).doc(clickRecordId).update(updateData);
        }

        // Update the share record conversions
        const shareRef = adminDb.collection(SHARES_COLLECTION).doc(shareCode);
        const shareDoc = await shareRef.get();

        if (shareDoc.exists) {
            const shareData = shareDoc.data();
            const conversions = shareData?.conversions || {
                registered: 0,
                bookmarked: 0,
                viewed: 0,
            };

            conversions[conversionType] = (conversions[conversionType] || 0) + 1;

            await shareRef.update({
                conversions,
                lastConversionAt: new Date().toISOString(),
            });

            // Update rewards for share owner
            const shareOwnerId = shareData?.sharedBy?.userId;
            if (shareOwnerId) {
                try {
                    const { updateUserRewards, getRewardConfig } = await import('@/lib/badgeSystem');
                    const config = await getRewardConfig();
                    if (config) {
                        await updateUserRewards(shareOwnerId, {
                            points: config.pointsPerConversion,
                            conversions: 1,
                        });
                    }
                } catch (rewardError) {
                    console.error('Error updating conversion rewards:', rewardError);
                }
            }
        }

        return NextResponse.json({
            success: true,
            message: `${conversionType} conversion recorded`
        });
    } catch (error) {
        console.error('Error recording conversion:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Failed to record conversion',
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
