import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';

const db = getDb();

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const quizId = params.id;

        // Fetch quiz data
        const quizDoc = await db.collection('quizzes').doc(quizId).get();

        if (!quizDoc.exists) {
            return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
        }

        const quizData = { id: quizDoc.id, ...quizDoc.data() };

        // Check if view should be counted (session-based)
        const viewCookie = request.cookies.get(`quiz_${quizId}_viewed`);
        let viewIncremented = false;

        if (!viewCookie) {
            // Increment view count only if not viewed in this session
            await db.collection('quizzes').doc(quizId).update({
                views: FieldValue.increment(1),
            });
            viewIncremented = true;
        }

        const response = NextResponse.json({
            success: true,
            quiz: quizData,
            viewIncremented,
        });

        // Set cookie to track this view (expires in 24 hours)
        if (viewIncremented) {
            response.cookies.set(`quiz_${quizId}_viewed`, 'true', {
                maxAge: 86400, // 24 hours
                httpOnly: true,
                sameSite: 'lax',
            });
        }

        return response;
    } catch (error) {
        console.error('Error fetching quiz:', error);
        return NextResponse.json(
            { error: 'Failed to fetch quiz' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const quizId = params.id;

        // Check if quiz exists
        const quizDoc = await db.collection('quizzes').doc(quizId).get();
        if (!quizDoc.exists) {
            return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
        }

        // Delete all submissions for this quiz
        const submissionsSnapshot = await db
            .collection('quizzes')
            .doc(quizId)
            .collection('submissions')
            .get();

        const batch = db.batch();
        submissionsSnapshot.docs.forEach((doc) => {
            batch.delete(doc.ref);
        });

        // Delete all registrations
        const registrationsSnapshot = await db
            .collection('quizzes')
            .doc(quizId)
            .collection('registrations')
            .get();

        registrationsSnapshot.docs.forEach((doc) => {
            batch.delete(doc.ref);
        });

        // Delete the quiz itself
        batch.delete(db.collection('quizzes').doc(quizId));

        await batch.commit();

        return NextResponse.json({ success: true, message: 'Quiz deleted successfully' });
    } catch (error) {
        console.error('Failed to delete quiz', error);
        return NextResponse.json({ error: 'Failed to delete quiz' }, { status: 500 });
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const quizId = params.id;
        const body = await request.json();

        // Check if quiz exists
        const quizDoc = await db.collection('quizzes').doc(quizId).get();
        if (!quizDoc.exists) {
            return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
        }

        // Calculate total marks and questions from updated data
        const totalMarks = body.questions?.reduce((sum: number, q: any) => sum + q.marks, 0) || 0;
        const totalQuestions = body.questions?.length || 0;

        // Update quiz data
        const updateData = {
            title: body.title,
            description: body.description,
            categoryId: body.categoryId,
            thumbnailUrl: body.thumbnailUrl,
            startDate: body.startDate,
            endDate: body.endDate,
            registrationDeadline: body.registrationDeadline || '',
            attemptLimit: body.attemptLimit,
            homeSegmentId: body.homeSegmentId || '',
            updatedAt: new Date().toISOString(),
            'quizConfig.questions': body.questions,
            'quizConfig.settings': body.settings,
            'quizConfig.leaderboardSettings': body.leaderboardSettings,
            'quizConfig.totalMarks': totalMarks,
            'quizConfig.totalQuestions': totalQuestions,
        };

        await db.collection('quizzes').doc(quizId).update(updateData);

        return NextResponse.json({ success: true, message: 'Quiz updated successfully' });
    } catch (error) {
        console.error('Failed to update quiz', error);
        return NextResponse.json({ error: 'Failed to update quiz' }, { status: 500 });
    }
}
