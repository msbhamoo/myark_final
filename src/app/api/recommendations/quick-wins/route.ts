import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/firebaseAdmin';

/**
 * GET /api/recommendations/quick-wins
 * Returns opportunities with easy application process (free, online, no complex requirements)
 */
export async function GET(request: NextRequest) {
    try {
        const db = getDb();

        // Parse limit from query params
        const { searchParams } = new URL(request.url);
        const limit = Math.min(parseInt(searchParams.get('limit') || '8', 10), 20);

        // Find opportunities that are:
        // - Free (no fee or fee is 0 or "free")
        // - Online mode
        // - Active status
        // - Has registration deadline in the future
        const snapshot = await db
            .collection('opportunities')
            .where('status', '==', 'approved')
            .where('mode', '==', 'online')
            .orderBy('registrationDeadline', 'asc')
            .limit(50) // Fetch more to filter
            .get();

        const now = new Date();
        const quickWins: any[] = [];

        snapshot.docs.forEach((doc) => {
            if (quickWins.length >= limit) return;

            const data = doc.data();

            // Check deadline is in future
            if (data.registrationDeadline) {
                const deadline = new Date(data.registrationDeadline);
                if (deadline < now) return;
            }

            // Check if free
            const fee = data.fee?.toString().toLowerCase().trim();
            const isFree = !fee || fee === 'free' || fee === '0' || fee === 'nil';

            if (!isFree) return;

            quickWins.push({
                id: doc.id,
                title: data.title || '',
                category: data.category || '',
                categoryId: data.categoryId,
                categoryName: data.categoryName,
                organizer: data.organizer || '',
                gradeEligibility: data.gradeEligibility || '',
                mode: data.mode || 'online',
                startDate: data.startDate,
                endDate: data.endDate,
                registrationDeadline: data.registrationDeadline,
                registrationDeadlineTBD: data.registrationDeadlineTBD,
                fee: data.fee,
                image: data.image,
                organizerLogo: data.organizerLogo,
                views: data.views,
            });
        });

        return NextResponse.json({
            items: quickWins,
            type: 'quick-wins',
        });
    } catch (error) {
        console.error('Failed to get quick wins:', error);
        return NextResponse.json(
            { error: 'Failed to get quick wins' },
            { status: 500 }
        );
    }
}
