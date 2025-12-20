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
        const payload = await request.json().catch(() => null) as {
            schoolId?: string;
            newPassword?: string;
        } | null;

        if (!payload?.schoolId) {
            return NextResponse.json({ error: 'School ID is required' }, { status: 400 });
        }

        const { schoolId, newPassword } = payload;
        const db = getDb();
        const auth = getAdminAuth();

        // Get school data
        const schoolDoc = await db.collection(COLLECTION).doc(schoolId).get();
        if (!schoolDoc.exists) {
            return NextResponse.json({ error: 'School not found' }, { status: 404 });
        }

        const schoolData = schoolDoc.data();
        if (!schoolData?.loginEnabled || !schoolData?.linkedUserId) {
            return NextResponse.json({ error: 'School does not have login enabled' }, { status: 400 });
        }

        // Generate a random password if not provided
        const generatePassword = () => {
            const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
            let password = '';
            for (let i = 0; i < 12; i++) {
                password += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return password;
        };

        const passwordToSet = newPassword?.trim() || generatePassword();

        // Update Firebase Auth user password
        await auth.updateUser(schoolData.linkedUserId, {
            password: passwordToSet,
        });

        // Update school document with password reset timestamp
        await db.collection(COLLECTION).doc(schoolId).update({
            lastPasswordReset: new Date(),
            updatedAt: new Date(),
        });

        return NextResponse.json({
            success: true,
            message: `Password reset for ${schoolData.name}`,
            credentials: {
                email: schoolData.email,
                password: passwordToSet,
            },
        });
    } catch (error: unknown) {
        console.error('Failed to reset school password', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to reset password';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
