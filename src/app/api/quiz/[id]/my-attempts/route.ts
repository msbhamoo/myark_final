import { NextRequest, NextResponse } from 'next/server';
import { getDb, getAdminAuth } from '@/lib/firebaseAdmin';

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id: quizId } = await context.params;
        const authHeader = request.headers.get('authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.split('Bearer ')[1];
        const auth = getAdminAuth();

        // Verify token and get user
        let decodedToken;
        try {
            decodedToken = await auth.verifyIdToken(token);
        } catch (error) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const userId = decodedToken.uid;

        const db = getDb();

        // Fetch all attempts and filter client-side to avoid composite index requirement
        const attemptsSnapshot = await db
            .collection('quizzes')
            .doc(quizId)
            .collection('attempts')
            .get();

        const attempts = attemptsSnapshot.docs
            .map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
            .filter((attempt: any) => attempt.userId === userId)
            .sort((a: any, b: any) => {
                // Sort by submittedAt descending
                const dateA = new Date(a.submittedAt || 0).getTime();
                const dateB = new Date(b.submittedAt || 0).getTime();
                return dateB - dateA;
            })
            .slice(0, 10);

        return NextResponse.json({ success: true, attempts });
    } catch (error) {
        console.error('Error fetching attempts:', error);
        return NextResponse.json({ error: 'Failed to fetch attempts' }, { status: 500 });
    }
}
