import { getDb } from '@/lib/firebaseAdmin';
import { NextResponse } from 'next/server';
import { getDefaultRewardConfig } from '@/lib/badgeSystem';

const SETTINGS_COLLECTION = 'settings';
const REWARDS_DOC = 'rewards';

/**
 * GET /api/rewards/config
 * Get reward system configuration
 */
export async function GET() {
    try {
        const db = getDb();
        const configDoc = await db.collection(SETTINGS_COLLECTION).doc(REWARDS_DOC).get();

        if (!configDoc.exists) {
            // Return default config
            return NextResponse.json(getDefaultRewardConfig());
        }

        return NextResponse.json(configDoc.data());
    } catch (error) {
        console.error('Error fetching reward config:', error);
        return NextResponse.json(
            { error: 'Failed to fetch configuration' },
            { status: 500 }
        );
    }
}

/**
 * PUT /api/rewards/config
 * Update reward system configuration (Admin only)
 */
export async function PUT(request: Request) {
    try {
        const config = await request.json();

        // TODO: Add admin authentication check here

        const db = getDb();
        await db.collection(SETTINGS_COLLECTION).doc(REWARDS_DOC).set(config);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating reward config:', error);
        return NextResponse.json(
            { error: 'Failed to update configuration' },
            { status: 500 }
        );
    }
}
