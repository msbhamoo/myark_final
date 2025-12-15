import { NextRequest, NextResponse } from 'next/server';
import { getDb, getAdminAuth } from '@/lib/firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id: quizId } = await context.params;

        // Get auth token from header
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const token = authHeader.split('Bearer ')[1];
        const auth = getAdminAuth();

        // Verify token and get user
        let decodedToken;
        try {
            decodedToken = await auth.verifyIdToken(token);
        } catch (error) {
            return NextResponse.json(
                { success: false, error: 'Invalid token' },
                { status: 401 }
            );
        }

        const userId = decodedToken.uid;
        const userName = decodedToken.name || decodedToken.email?.split('@')[0] || 'User';
        const userEmail = decodedToken.email || null;

        const db = getDb();
        const quizRef = db.collection('quizzes').doc(quizId);
        const quizDoc = await quizRef.get();

        if (!quizDoc.exists) {
            return NextResponse.json(
                { success: false, error: 'Quiz not found' },
                { status: 404 }
            );
        }

        const quiz = quizDoc.data();

        // Check if registration deadline has passed
        if (quiz?.registrationDeadline) {
            const deadline = new Date(quiz.registrationDeadline);
            if (new Date() > deadline) {
                return NextResponse.json(
                    { success: false, error: 'Registration deadline has passed' },
                    { status: 400 }
                );
            }
        }

        // Check if user is already registered
        const registeredUsers = quiz?.registeredUsers || [];
        if (registeredUsers.includes(userId)) {
            return NextResponse.json(
                { success: true, message: 'Already registered', alreadyRegistered: true, isRegistered: true }
            );
        }

        // Register the user
        await quizRef.update({
            registeredUsers: FieldValue.arrayUnion(userId),
            registrationCount: FieldValue.increment(1),
        });

        // Create a registration document for tracking
        await db.collection('quizzes').doc(quizId).collection('registrations').add({
            userId,
            userName,
            userEmail,
            registeredAt: new Date().toISOString(),
        });

        return NextResponse.json({
            success: true,
            message: 'Successfully registered for quiz',
            isRegistered: true,
            registeredAt: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to register for quiz' },
            { status: 500 }
        );
    }
}


// Check registration status
export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id: quizId } = await context.params;

        // Get auth token from header
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                { isRegistered: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const token = authHeader.split('Bearer ')[1];
        const auth = getAdminAuth();

        // Verify token and get user
        let decodedToken;
        try {
            decodedToken = await auth.verifyIdToken(token);
        } catch (error) {
            return NextResponse.json(
                { isRegistered: false, error: 'Invalid token' },
                { status: 401 }
            );
        }

        const userId = decodedToken.uid;

        const db = getDb();
        const quizDoc = await db.collection('quizzes').doc(quizId).get();

        if (!quizDoc.exists) {
            return NextResponse.json(
                { isRegistered: false, error: 'Quiz not found' },
                { status: 404 }
            );
        }

        const quiz = quizDoc.data();
        const registeredUsers = quiz?.registeredUsers || [];
        const isRegistered = registeredUsers.includes(userId);

        // Get registration date if registered
        let registeredAt = null;
        if (isRegistered) {
            const regSnapshot = await db
                .collection('quizzes')
                .doc(quizId)
                .collection('registrations')
                .where('userId', '==', userId)
                .limit(1)
                .get();

            if (!regSnapshot.empty) {
                registeredAt = regSnapshot.docs[0].data().registeredAt;
            }
        }

        return NextResponse.json({
            isRegistered,
            registeredAt,
            registrationRequired: !!quiz?.registrationDeadline,
            registrationDeadline: quiz?.registrationDeadline || null,
        });
    } catch (error) {
        console.error('Error checking registration:', error);
        return NextResponse.json(
            { isRegistered: false, error: 'Failed to check registration status' },
            { status: 500 }
        );
    }
}
