import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/firebaseAdmin';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const quizId = params.id;
        const authHeader = request.headers.get('authorization');

        if (!authHeader) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Extract user ID from token (simplified - you should verify the token properly)
        const userId = authHeader.split(' ')[1]; // Placeholder - implement proper auth

        const db = getDb();
        const attemptsSnapshot = await db
            .collection('quizzes')
            .doc(quizId)
            .collection('attempts')
            .where('userId', '==', userId)
            .orderBy('submittedAt', 'desc')
            .limit(10)
            .get();

        const attempts = attemptsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return NextResponse.json(attempts);
    } catch (error) {
        console.error('Error fetching attempts:', error);
        return NextResponse.json({ error: 'Failed to fetch attempts' }, { status: 500 });
    }
}
