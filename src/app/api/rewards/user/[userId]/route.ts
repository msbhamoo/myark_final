import { getDb } from '@/lib/firebaseAdmin';
import { NextResponse } from 'next/server';

/**
 * GET /api/rewards/user/[userId]
 * Get user's rewards data
 */
export async function GET(
    request: Request,
    { params }: { params: { userId: string } }
) {
    try {
        const { userId } = params;

        const db = getDb();
        const userRewardsDoc = await db.collection('userRewards').doc(userId).get();

        if (!userRewardsDoc.exists) {
            // Return empty rewards
            return NextResponse.json({
                userId,
                totalPoints: 0,
                totalShares: 0,
                totalClicks: 0,
                totalConversions: 0,
                badges: [],
                rank: null,
            });
        }

        return NextResponse.json(userRewardsDoc.data());
    } catch (error) {
        console.error('Error fetching user rewards:', error);
        return NextResponse.json(
            { error: 'Failed to fetch rewards' },
            { status: 500 }
        );
    }
}
