import { NextRequest, NextResponse } from 'next/server';
import { getDb, getAdminAuth } from '@/lib/firebaseAdmin';
import { getUserInterests } from '@/lib/userInterestsService';

/**
 * GET /api/recommendations/students-like-you
 * Collaborative filtering - opportunities applied by users with similar interests
 */
export async function GET(request: NextRequest) {
    try {
        const authHeader = request.headers.get('authorization') || request.headers.get('Authorization');

        const { searchParams } = new URL(request.url);
        const limit = Math.min(parseInt(searchParams.get('limit') || '8', 10), 20);

        if (!authHeader) {
            return NextResponse.json({ items: [], message: 'Login to see recommendations' });
        }

        const [scheme, token] = authHeader.split(' ');
        if (!scheme || scheme.toLowerCase() !== 'bearer' || !token) {
            return NextResponse.json({ items: [], message: 'Invalid authorization' });
        }

        const auth = getAdminAuth();
        let uid: string;

        try {
            const decoded = await auth.verifyIdToken(token);
            uid = decoded.uid;
        } catch {
            return NextResponse.json({ items: [], message: 'Session expired' });
        }

        const db = getDb();

        // Get current user's interests
        const userInterests = await getUserInterests(uid);
        const topCategories = Object.entries(userInterests.categories)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 3)
            .map(([cat]) => cat);

        if (topCategories.length === 0) {
            return NextResponse.json({
                items: [],
                message: 'Explore more opportunities to get personalized suggestions'
            });
        }

        // Find users with similar interests (same top categories)
        // This is a simplified version - in production, you'd use more sophisticated matching
        const similarUsersInterests = await db
            .collectionGroup('interests')
            .limit(100)
            .get();

        const similarUserIds = new Set<string>();

        similarUsersInterests.docs.forEach(doc => {
            const path = doc.ref.path;
            // Extract user ID from path: users/{uid}/metadata/interests
            const match = path.match(/users\/([^/]+)/);
            if (!match || match[1] === uid) return;

            const data = doc.data();
            const userCategories = Object.keys(data.categories || {});

            // Check if user has at least one matching category
            const hasOverlap = topCategories.some(cat => userCategories.includes(cat));
            if (hasOverlap) {
                similarUserIds.add(match[1]);
            }
        });

        if (similarUserIds.size === 0) {
            return NextResponse.json({
                items: [],
                message: 'Not enough data yet for collaborative recommendations'
            });
        }

        // Get opportunities applied/registered by similar users
        const opportunityCounts = new Map<string, number>();
        const sampleUsers = Array.from(similarUserIds).slice(0, 20);

        for (const similarUid of sampleUsers) {
            // Check registrations
            const registrations = await db
                .collection('users')
                .doc(similarUid)
                .collection('registrations')
                .limit(10)
                .get();

            registrations.docs.forEach(doc => {
                const data = doc.data();
                const oppId = data.opportunityId || doc.id;
                const count = opportunityCounts.get(oppId) || 0;
                opportunityCounts.set(oppId, count + 3); // Weight registrations highest
            });

            // Check saved
            const saved = await db
                .collection('users')
                .doc(similarUid)
                .collection('savedOpportunities')
                .limit(10)
                .get();

            saved.docs.forEach(doc => {
                const count = opportunityCounts.get(doc.id) || 0;
                opportunityCounts.set(doc.id, count + 1);
            });
        }

        // Get current user's viewed/saved/applied to exclude
        const userViewHistory = await db
            .collection('users')
            .doc(uid)
            .collection('viewHistory')
            .limit(50)
            .get();

        const userOpportunities = new Set(userViewHistory.docs.map(doc => doc.id));

        // Sort and filter
        const topOpportunityIds = Array.from(opportunityCounts.entries())
            .filter(([id]) => !userOpportunities.has(id))
            .sort(([, a], [, b]) => b - a)
            .slice(0, limit)
            .map(([id]) => id);

        // Fetch opportunity details
        const opportunities: any[] = [];

        for (const oppId of topOpportunityIds) {
            const oppDoc = await db.collection('opportunities').doc(oppId).get();
            if (!oppDoc.exists) continue;

            const data = oppDoc.data();

            // Skip closed
            if (data?.registrationDeadline) {
                if (new Date(data.registrationDeadline) < new Date()) continue;
            }

            opportunities.push({
                id: oppDoc.id,
                title: data?.title || '',
                category: data?.category || '',
                categoryId: data?.categoryId,
                categoryName: data?.categoryName,
                organizer: data?.organizer || '',
                gradeEligibility: data?.gradeEligibility || '',
                mode: data?.mode || 'online',
                startDate: data?.startDate,
                endDate: data?.endDate,
                registrationDeadline: data?.registrationDeadline,
                fee: data?.fee,
                image: data?.image,
                organizerLogo: data?.organizerLogo,
                similarStudentCount: opportunityCounts.get(oppId) || 0,
            });
        }

        return NextResponse.json({
            items: opportunities,
            similarUserCount: similarUserIds.size,
            type: 'students-like-you',
        });
    } catch (error) {
        console.error('Failed to get collaborative recommendations:', error);
        return NextResponse.json(
            { error: 'Failed to get recommendations' },
            { status: 500 }
        );
    }
}
