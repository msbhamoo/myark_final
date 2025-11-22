import { NextRequest, NextResponse } from 'next/server';
import { getAdminAuth, getDb } from '@/lib/firebaseAdmin';
import { validateEmail, validatePhone, detectIdentifierType, generateSyntheticEmail } from '@/lib/authHelpers';

/**
 * POST /api/auth/check-account
 * 
 * Checks if an account exists for the given identifier (email or phone)
 * and returns the authentication email to use for Firebase sign-in.
 * 
 * Request Body:
 * {
 *   "identifier": "user@example.com" | "9876543210"
 * }
 * 
 * Response:
 * {
 *   "exists": true,
 *   "identifierType": "email" | "phone",
 *   "authEmail": "user@example.com" | "9876543210@myark.temp"
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
        const identifierType = detectIdentifierType(identifier);

        if (!identifierType) {
            return NextResponse.json(
                { error: 'Invalid email or phone number format.' },
                { status: 400 }
            );
        }

        const auth = getAdminAuth();
        const db = getDb();

        // Handle email identifier
        if (identifierType === 'email') {
            try {
                // Check if user exists in Firebase Auth
                await auth.getUserByEmail(identifier);

                return NextResponse.json({
                    exists: true,
                    identifierType: 'email',
                    authEmail: identifier,
                });
            } catch (error: any) {
                if (error.code === 'auth/user-not-found') {
                    return NextResponse.json({
                        exists: false,
                        identifierType: 'email',
                        authEmail: identifier,
                    });
                }
                throw error;
            }
        }

        // Handle phone identifier
        if (identifierType === 'phone') {
            // Query Firestore for user with this mobile number
            const usersRef = db.collection('users');
            const snapshot = await usersRef.where('mobileNumber', '==', identifier).limit(1).get();

            if (!snapshot.empty) {
                const userData = snapshot.docs[0].data();

                // Return the auth email (could be actual email or synthetic)
                const authEmail = userData.email && validateEmail(userData.email)
                    ? userData.email
                    : generateSyntheticEmail(identifier);

                return NextResponse.json({
                    exists: true,
                    identifierType: 'phone',
                    authEmail,
                });
            }

            // Phone number not found - return synthetic email for potential sign-up
            return NextResponse.json({
                exists: false,
                identifierType: 'phone',
                authEmail: generateSyntheticEmail(identifier),
            });
        }

        // Should never reach here due to earlier validation
        return NextResponse.json(
            { error: 'Unknown identifier type' },
            { status: 400 }
        );

    } catch (error) {
        console.error('Error checking account:', error);
        return NextResponse.json(
            { error: 'Failed to check account. Please try again.' },
            { status: 500 }
        );
    }
}
