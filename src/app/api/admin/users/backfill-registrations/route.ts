import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/firebaseAdmin';
import { hasAdminSessionFromRequest, getAdminSession } from '@/lib/adminSession';

/**
 * One-time migration endpoint to backfill opportunitiesApplied count for all users
 * This counts registrations from the opportunity_registrations collection
 * and updates each user document
 */
export async function POST(request: NextRequest) {
    // Check admin authentication and require superadmin
    if (!hasAdminSessionFromRequest(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const session = getAdminSession(request);
    if (session?.role !== 'superadmin') {
        return NextResponse.json({ error: 'Forbidden: Superadmin only' }, { status: 403 });
    }

    try {
        const db = getDb();
        const usersSnapshot = await db.collection('users').get();
        const registrationsSnapshot = await db.collection('opportunity_registrations').get();

        // Build a map of userId => count
        const userRegistrationCounts = new Map<string, number>();

        registrationsSnapshot.docs.forEach(doc => {
            const data = doc.data();
            const studentUid = data.studentUid;
            if (studentUid) {
                userRegistrationCounts.set(
                    studentUid,
                    (userRegistrationCounts.get(studentUid) || 0) + 1
                );
            }
        });

        // Update each user document
        const batch = db.batch();
        let updateCount = 0;

        usersSnapshot.docs.forEach(userDoc => {
            const count = userRegistrationCounts.get(userDoc.id) || 0;
            batch.update(userDoc.ref, { opportunitiesApplied: count });
            updateCount++;
        });

        await batch.commit();

        return NextResponse.json({
            success: true,
            message: `Updated ${updateCount} users with registration counts`,
            updatedUsers: updateCount,
            totalRegistrations: registrationsSnapshot.size,
        });
    } catch (error: any) {
        console.error('Backfill error:', error);
        return NextResponse.json({
            error: 'Failed to backfill data',
            details: error.message
        }, { status: 500 });
    }
}
