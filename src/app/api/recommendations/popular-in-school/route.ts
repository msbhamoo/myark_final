import { NextRequest, NextResponse } from 'next/server';
import { getDb, getAdminAuth } from '@/lib/firebaseAdmin';

/**
 * GET /api/recommendations/popular-in-school
 * Returns opportunities popular among students from the same school
 */
export async function GET(request: NextRequest) {
    try {
        // Get authorization header
        const authHeader = request.headers.get('authorization') || request.headers.get('Authorization');

        const { searchParams } = new URL(request.url);
        const limit = Math.min(parseInt(searchParams.get('limit') || '8', 10), 20);

        if (!authHeader) {
            return NextResponse.json({ items: [], message: 'Login to see what\'s popular in your school' });
        }

        const [scheme, token] = authHeader.split(' ');
        if (!scheme || scheme.toLowerCase() !== 'bearer' || !token) {
            return NextResponse.json({ items: [], message: 'Invalid authorization' });
        }

        // Verify token
        const auth = getAdminAuth();
        let uid: string;

        try {
            const decoded = await auth.verifyIdToken(token);
            uid = decoded.uid;
        } catch {
            return NextResponse.json({ items: [], message: 'Session expired' });
        }

        const db = getDb();

        // Get user's school
        const userDoc = await db.collection('users').doc(uid).get();
        if (!userDoc.exists) {
            return NextResponse.json({ items: [], message: 'Profile not found' });
        }

        // Try to get school from user profile or student profile
        const userData = userDoc.data();
        let schoolName = userData?.schoolInfo?.schoolName;

        if (!schoolName) {
            // Try student profile
            const profileDoc = await db.collection('studentProfiles').doc(uid).get();
            if (profileDoc.exists) {
                schoolName = profileDoc.data()?.schoolInfo?.schoolName;
            }
        }

        if (!schoolName) {
            return NextResponse.json({
                items: [],
                message: 'Add your school to see what\'s popular there'
            });
        }

        // Find other students from the same school
        const schoolStudents = await db
            .collection('users')
            .where('schoolInfo.schoolName', '==', schoolName)
            .limit(100)
            .get();

        const studentUids = schoolStudents.docs
            .map(doc => doc.id)
            .filter(id => id !== uid); // Exclude current user

        if (studentUids.length === 0) {
            return NextResponse.json({
                items: [],
                schoolName,
                message: 'Be the first from your school to explore!'
            });
        }

        // Count opportunity views/saves from school students
        const opportunityCounts = new Map<string, number>();

        // Check view history of school students (sample up to 20 students)
        const sampleUids = studentUids.slice(0, 20);

        for (const studentUid of sampleUids) {
            const viewHistory = await db
                .collection('users')
                .doc(studentUid)
                .collection('viewHistory')
                .orderBy('viewedAt', 'desc')
                .limit(10)
                .get();

            viewHistory.docs.forEach(doc => {
                const count = opportunityCounts.get(doc.id) || 0;
                opportunityCounts.set(doc.id, count + 1);
            });

            // Also check saved opportunities
            const saved = await db
                .collection('users')
                .doc(studentUid)
                .collection('savedOpportunities')
                .limit(10)
                .get();

            saved.docs.forEach(doc => {
                const count = opportunityCounts.get(doc.id) || 0;
                opportunityCounts.set(doc.id, count + 2); // Weight saves higher
            });
        }

        if (opportunityCounts.size === 0) {
            return NextResponse.json({
                items: [],
                schoolName,
                message: 'Your schoolmates haven\'t explored yet'
            });
        }

        // Sort by count and get top opportunities
        const topOpportunityIds = Array.from(opportunityCounts.entries())
            .sort(([, a], [, b]) => b - a)
            .slice(0, limit)
            .map(([id]) => id);

        // Fetch opportunity details
        const opportunities: any[] = [];

        for (const oppId of topOpportunityIds) {
            const oppDoc = await db.collection('opportunities').doc(oppId).get();
            if (!oppDoc.exists) continue;

            const data = oppDoc.data();

            // Skip closed opportunities
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
                schoolPopularity: opportunityCounts.get(oppId) || 0,
            });
        }

        return NextResponse.json({
            items: opportunities,
            schoolName,
            studentCount: studentUids.length + 1, // Include current user
            type: 'popular-in-school',
        });
    } catch (error) {
        console.error('Failed to get popular in school:', error);
        return NextResponse.json(
            { error: 'Failed to get school recommendations' },
            { status: 500 }
        );
    }
}
