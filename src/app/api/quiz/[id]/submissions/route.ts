import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/firebaseAdmin';

const db = getDb();

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const quizId = params.id;

        // Fetch all submissions/attempts
        const submissionsSnapshot = await db
            .collection('quizzes')
            .doc(quizId)
            .collection('attempts')
            .orderBy('submittedAt', 'desc')
            .get();

        const submissions = submissionsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        return NextResponse.json({
            success: true,
            submissions,
        });
    } catch (error) {
        console.error('Error fetching submissions:', error);
        return NextResponse.json(
            { error: 'Failed to fetch submissions' },
            { status: 500 }
        );
    }
}
