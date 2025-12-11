import { NextRequest, NextResponse } from 'next/server';
import { getDb, getAdminAuth } from '@/lib/firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';
import { revalidateTag } from 'next/cache';
import { trackOpportunityView } from '@/lib/userInterestsService';
import type { Opportunity } from '@/types/opportunity';

/**
 * Track when a user views an opportunity
 * Increments the opportunitiesViewed counter on the user document
 * Also tracks interests for personalized recommendations
 */
export async function POST(
    req: NextRequest,
    ctx: { params: Promise<{ id: string }> },
) {
    const { id: opportunityId } = await ctx.params;

    if (!opportunityId) {
        return NextResponse.json({ error: 'Opportunity ID is required' }, { status: 400 });
    }

    // Track unique views for the opportunity
    const cookieStore = req.cookies;
    const viewCookieName = `viewed_opp_${opportunityId}`;
    const hasViewed = cookieStore.get(viewCookieName);

    let viewIncremented = false;
    let opportunityData: Record<string, any> | undefined;

    if (!hasViewed) {
        try {
            const db = getDb();
            const opportunityRef = db.collection('opportunities').doc(opportunityId);

            // Get opportunity data for interest tracking
            const oppDoc = await opportunityRef.get();
            if (oppDoc.exists) {
                opportunityData = oppDoc.data();
            }

            // Increment the views counter atomically
            await opportunityRef.update({
                views: FieldValue.increment(1)
            });
            viewIncremented = true;
        } catch (error) {
            console.error('Error incrementing opportunity view count:', error);
            // Continue execution even if increment fails
        }
    }

    // Get authenticated user for history tracking
    let user;
    try {
        const token = req.headers.get('authorization')?.split('Bearer ')[1];
        if (token) {
            const auth = getAdminAuth();
            user = await auth.verifyIdToken(token);
        }
    } catch (error) {
        console.error('Error verifying auth token:', error);
    }

    // Track user history and interests if logged in
    if (user) {
        // Track interests for personalized recommendations
        if (opportunityData) {
            try {
                const opportunity: Opportunity = {
                    id: opportunityId,
                    title: opportunityData.title || '',
                    category: opportunityData.category || '',
                    categoryId: opportunityData.categoryId,
                    categoryName: opportunityData.categoryName,
                    organizer: opportunityData.organizer || '',
                    gradeEligibility: opportunityData.gradeEligibility || '',
                    mode: opportunityData.mode || 'online',
                    searchKeywords: opportunityData.searchKeywords,
                };
                await trackOpportunityView(user.uid, opportunity);
            } catch (error) {
                console.error('Error tracking user interests:', error);
            }
        }

        try {
            const db = getDb();
            const userRef = db.collection('users').doc(user.uid);
            const userDoc = await userRef.get();

            if (userDoc.exists) {
                await userRef.update({
                    opportunitiesViewed: (userDoc.data()?.opportunitiesViewed || 0) + 1,
                    lastActiveAt: new Date(),
                });
            } else {
                await userRef.set({
                    uid: user.uid,
                    email: user.email || null,
                    opportunitiesViewed: 1,
                    lastActiveAt: new Date(),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }, { merge: true });
            }
        } catch (error) {
            console.error('Error tracking user history:', error);
        }
    }

    const response = NextResponse.json({
        success: true,
        tracked: !!user,
        viewIncremented
    });

    // Set cookie if this was a new view
    if (viewIncremented) {
        response.cookies.set(viewCookieName, 'true', {
            maxAge: 60 * 60 * 24, // 24 hours
            path: '/',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
        });

        // Revalidate the opportunities cache
        revalidateTag('opportunities', 'max');
    }

    return response;
}
