import { NextResponse } from 'next/server';
import { getDb, getAdminAuth } from '@/lib/firebaseAdmin';
import { hasAdminSessionFromRequest } from '@/lib/adminSession';

export const dynamic = 'force-dynamic';

const COLLECTION = 'schools';

export async function POST(request: Request) {
    if (!hasAdminSessionFromRequest(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const payload = await request.json().catch(() => null) as { schoolId?: string } | null;
        if (!payload?.schoolId) {
            return NextResponse.json({ error: 'School ID is required' }, { status: 400 });
        }

        const { schoolId } = payload;
        const db = getDb();
        const auth = getAdminAuth();

        // Get school data
        const schoolDoc = await db.collection(COLLECTION).doc(schoolId).get();
        if (!schoolDoc.exists) {
            return NextResponse.json({ error: 'School not found' }, { status: 404 });
        }

        const schoolData = schoolDoc.data();
        if (!schoolData?.email) {
            return NextResponse.json({ error: 'School must have an email address' }, { status: 400 });
        }

        if (!schoolData?.isVerified) {
            return NextResponse.json({ error: 'School must be verified before creating login' }, { status: 400 });
        }

        if (schoolData?.loginEnabled && schoolData?.linkedUserId) {
            return NextResponse.json({ error: 'Login already exists for this school' }, { status: 400 });
        }

        // Generate a random password
        const generatePassword = () => {
            const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
            let password = '';
            for (let i = 0; i < 12; i++) {
                password += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return password;
        };

        const tempPassword = generatePassword();

        // Create Firebase Auth user
        const userRecord = await auth.createUser({
            email: schoolData.email,
            password: tempPassword,
            displayName: schoolData.name,
            emailVerified: false,
        });

        // Create user document in Firestore
        await db.collection('users').doc(userRecord.uid).set({
            uid: userRecord.uid,
            email: schoolData.email,
            displayName: schoolData.name,
            accountType: 'school',
            linkedSchoolId: schoolId,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        // Update school document
        await db.collection(COLLECTION).doc(schoolId).update({
            loginEnabled: true,
            linkedUserId: userRecord.uid,
            updatedAt: new Date(),
        });

        // In production, you would send an email with credentials here
        // For now, we'll return the temp password (in production, this should be removed)
        console.log(`School login created: ${schoolData.email} / ${tempPassword}`);

        return NextResponse.json({
            success: true,
            message: `Login created for ${schoolData.name}`,
            // Remove in production - just for initial testing
            credentials: {
                email: schoolData.email,
                tempPassword,
            },
        });
    } catch (error: unknown) {
        console.error('Failed to create school login', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to create login';

        // Check for Firebase auth specific errors
        if (typeof error === 'object' && error !== null && 'code' in error) {
            const fbError = error as { code: string };
            if (fbError.code === 'auth/email-already-exists') {
                return NextResponse.json({ error: 'An account with this email already exists' }, { status: 400 });
            }
        }

        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
