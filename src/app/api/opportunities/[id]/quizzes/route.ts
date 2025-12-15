import { NextResponse } from 'next/server';
import { getDb } from '@/lib/firebaseAdmin';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * GET /api/opportunities/[id]/quizzes
 * Returns all quizzes linked to a specific opportunity
 */
export async function GET(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;

        if (!id) {
            return NextResponse.json(
                { error: 'Opportunity ID is required' },
                { status: 400 }
            );
        }

        const db = getDb();

        // Fetch all quizzes and filter by opportunityId
        // Using client-side filter to avoid needing composite index
        const snapshot = await db.collection('quizzes').get();

        const quizzes = snapshot.docs
            .map((doc) => {
                const data = doc.data();
                return {
                    id: doc.id,
                    title: data.title || '',
                    description: data.description || '',
                    thumbnailUrl: data.thumbnailUrl || '',
                    startDate: data.startDate || '',
                    endDate: data.endDate || '',
                    visibility: data.visibility || 'draft',
                    totalQuestions: data.quizConfig?.totalQuestions || 0,
                    totalMarks: data.quizConfig?.totalMarks || 0,
                    duration: data.quizConfig?.settings?.totalDuration || 0,
                    attemptLimit: data.attemptLimit || 1,
                    submissionCount: data.submissionCount || 0,
                    opportunityId: data.opportunityId,
                };
            })
            .filter((quiz) => quiz.opportunityId === id)
            .sort((a, b) => {
                // Sort by startDate descending
                return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
            });

        return NextResponse.json({
            success: true,
            quizzes,
            total: quizzes.length,
        });
    } catch (error) {
        console.error('Error fetching quizzes for opportunity:', error);
        return NextResponse.json(
            { error: 'Failed to fetch quizzes' },
            { status: 500 }
        );
    }
}
