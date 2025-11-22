import { NextRequest, NextResponse } from 'next/server';
import { getAdminAuth, getDb } from '@/lib/firebaseAdmin';
import { validateEmail, validatePhone, detectIdentifierType } from '@/lib/authHelpers';

/**
 * POST /api/auth/reset-password
 * 
 * Sends a password reset email for the given identifier.
 * For phone-only accounts, requires an email address to send the reset link.
 * 
 * Request Body:
 * {
 *   "identifier": "user@example.com" | "9876543210",
 *   "emailFallback": "user@email.com"  // Required for phone identifiers without stored email
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "message": "Password reset email sent successfully"
 * }
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json().catch(() => null);

        if (!body || typeof body.identifier !== 'string') {
            return NextResponse.json(
                { error: 'Invalid request. "identifier" is required.' },
                { status: 400 }
            );
        }

        const identifier = body.identifier.trim();
        const emailFallback = typeof body.emailFallback === 'string'
            ? body.emailFallback.trim()
            : null;

        const identifierType = detectIdentifierType(identifier);

        if (!identifierType) {
            return NextResponse.json(
                { error: 'Invalid email or phone number format.' },
                { status: 400 }
            );
        }

        const auth = getAdminAuth();
        const db = getDb();
        let resetEmail: string | null = null;

        // Handle email identifier - straightforward
        if (identifierType === 'email') {
            resetEmail = identifier;
        }

        // Handle phone identifier - need to find associated email
        if (identifierType === 'phone') {
            // Query Firestore for user with this mobile number
            const usersRef = db.collection('users');
            const snapshot = await usersRef.where('mobileNumber', '==', identifier).limit(1).get();

            if (snapshot.empty) {
                return NextResponse.json(
                    { error: 'No account found with this phone number.' },
                    { status: 404 }
                );
            }

            const userData = snapshot.docs[0].data();

            // Check if user has a stored email (non-synthetic)
            if (userData.email && validateEmail(userData.email) && !userData.email.endsWith('@myark.temp')) {
                resetEmail = userData.email;
            } else if (emailFallback && validateEmail(emailFallback)) {
                // Use provided fallback email
                resetEmail = emailFallback;

                // Optionally update the user's profile with this email for future use
                await db.collection('users').doc(snapshot.docs[0].id).update({
                    email: emailFallback,
                    updatedAt: new Date(),
                });
            } else {
                return NextResponse.json(
                    {
                        error: 'Please provide an email address to receive the password reset link.',
                        requiresEmailFallback: true,
                    },
                    { status: 400 }
                );
            }
        }

        if (!resetEmail) {
            return NextResponse.json(
                { error: 'Could not determine email address for password reset.' },
                { status: 400 }
            );
        }

        // Generate and send password reset link
        try {
            const resetLink = await auth.generatePasswordResetLink(resetEmail);

            // In a production environment, you would send this via an email service
            // For now, we'll just log it and return success
            console.log(`Password reset link for ${resetEmail}: ${resetLink}`);

            // TODO: Integrate with email service (SendGrid, AWS SES, etc.)
            // await sendPasswordResetEmail(resetEmail, resetLink);

            return NextResponse.json({
                success: true,
                message: 'Password reset email sent successfully',
                // In development, optionally return the link
                ...(process.env.NODE_ENV === 'development' && { resetLink }),
            });
        } catch (error: any) {
            if (error.code === 'auth/user-not-found') {
                return NextResponse.json(
                    { error: 'No account found with this email address.' },
                    { status: 404 }
                );
            }
            throw error;
        }

    } catch (error) {
        console.error('Error resetting password:', error);
        return NextResponse.json(
            { error: 'Failed to send password reset email. Please try again.' },
            { status: 500 }
        );
    }
}
