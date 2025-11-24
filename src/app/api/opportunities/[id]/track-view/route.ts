import { NextRequest, NextResponse } from 'next/server';
import { getDb, getAdminAuth } from '@/lib/firebaseAdmin';

/**
 * Track when a user views an opportunity
 * Increments the opportunitiesViewed counter on the user document
 */
export async function POST(
    req: NextRequest,
    ctx: any,
) {
    const params = (ctx && ctx.params) as { id?: string | string[] } | undefined;
    const idParam = params?.id;
    const opportunityId = Array.isArray(idParam) ? idParam[0] : idParam ?? '';

    if (!opportunityId) {
        return NextResponse.json({ error: 'Opportunity ID is required' }, { status: 400 });
    }

    // Get authenticated user
    let user;
    try {
        const token = req.headers.get('authorization')?.split('Bearer ')[1];
        if (!token) {
            // If no token, don't track (anonymous view)
            return NextResponse.json({ success: true, tracked: false });
        }
        const auth = getAdminAuth();
        user = await auth.verifyIdToken(token);
    } catch (error) {
        console.error('Error verifying auth token:', error);
        // If token is invalid, don't track
        return NextResponse.json({ success: true, tracked: false });
    }

    if (!user) {
        return NextResponse.json({ success: true, tracked: false });
    }

    try {
        const db = getDb();
        const userRef = db.collection('users').doc(user.uid);
        const userDoc = await userRef.get();

        if (userDoc.exists) {
            // Increment the counter
            await userRef.update({
                opportunitiesViewed: (userDoc.data()?.opportunitiesViewed || 0) + 1,
                lastActiveAt: new Date(),
            });
        } else {
            // Create the user document if it doesn't exist
            await userRef.set({
                uid: user.uid,
                email: user.email || null,
                opportunitiesViewed: 1,
                lastActiveAt: new Date(),
                createdAt: new Date(),
                updatedAt: new Date(),
            }, { merge: true });
        }

        return NextResponse.json({ success: true, tracked: true });
    } catch (error) {
        console.error('Error tracking opportunity view:', error);
        // Don't fail the request if tracking fails
        return NextResponse.json({ success: true, tracked: false });
    }
}
