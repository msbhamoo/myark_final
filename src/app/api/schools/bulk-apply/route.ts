import { NextResponse } from 'next/server';
import { getDb, getAdminAuth } from '@/lib/firebaseAdmin';

export const dynamic = 'force-dynamic';

const OPPORTUNITIES_COLLECTION = 'opportunities';
const REGISTRATIONS_COLLECTION = 'opportunity_registrations';
const STUDENT_PROFILE_COLLECTION = 'studentProfiles';
const SCHOOLS_COLLECTION = 'schools';

interface BulkApplyRequest {
    opportunityId: string;
    studentUids: string[];
    schoolId: string;
}

export async function POST(request: Request) {
    try {
        // Verify auth token
        const token = request.headers.get('authorization')?.split('Bearer ')[1];
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const auth = getAdminAuth();
        let user;
        try {
            user = await auth.verifyIdToken(token);
        } catch {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const payload = await request.json().catch(() => null) as BulkApplyRequest | null;
        if (!payload?.opportunityId || !payload?.studentUids?.length || !payload?.schoolId) {
            return NextResponse.json({
                error: 'opportunityId, studentUids, and schoolId are required'
            }, { status: 400 });
        }

        const { opportunityId, studentUids, schoolId } = payload;
        const db = getDb();

        // Verify user is linked to this school
        const userDoc = await db.collection('users').doc(user.uid).get();
        const userData = userDoc.data();
        if (userData?.accountType !== 'school' || userData?.linkedSchoolId !== schoolId) {
            return NextResponse.json({ error: 'Not authorized for this school' }, { status: 403 });
        }

        // Get school info
        const schoolDoc = await db.collection(SCHOOLS_COLLECTION).doc(schoolId).get();
        if (!schoolDoc.exists) {
            return NextResponse.json({ error: 'School not found' }, { status: 404 });
        }
        const schoolData = schoolDoc.data();

        // Verify opportunity exists and has internal registration
        const opportunityDoc = await db.collection(OPPORTUNITIES_COLLECTION).doc(opportunityId).get();
        if (!opportunityDoc.exists) {
            return NextResponse.json({ error: 'Opportunity not found' }, { status: 404 });
        }

        const opportunityData = opportunityDoc.data();
        if (opportunityData?.registrationMode !== 'internal') {
            return NextResponse.json({
                error: 'This opportunity does not accept internal (bulk) registrations'
            }, { status: 400 });
        }

        // Process registrations in batches
        const results = {
            success: 0,
            failed: 0,
            errors: [] as { uid: string; error: string }[],
        };

        const batch = db.batch();
        const now = new Date().toISOString();

        for (const studentUid of studentUids) {
            try {
                // Check if already registered
                const registrationId = `${opportunityId}_${studentUid}`;
                const existingReg = await db.collection(REGISTRATIONS_COLLECTION).doc(registrationId).get();

                if (existingReg.exists) {
                    results.errors.push({ uid: studentUid, error: 'Already registered' });
                    results.failed++;
                    continue;
                }

                // Get student profile
                const studentDoc = await db.collection(STUDENT_PROFILE_COLLECTION).doc(studentUid).get();
                const studentData = studentDoc.data();

                // Create registration
                const registrationRef = db.collection(REGISTRATIONS_COLLECTION).doc(registrationId);
                batch.set(registrationRef, {
                    studentUid,
                    studentName: studentData?.displayName ?? 'Unknown',
                    studentEmail: studentData?.email ?? null,
                    className: studentData?.schoolInfo?.className ?? null,
                    schoolName: schoolData?.name ?? null,
                    schoolId,
                    profileSlug: studentData?.slug ?? null,
                    registeredAt: now,
                    opportunityId,
                    opportunityTitle: opportunityData?.title,
                    registrationType: 'bulk',
                    registeredBy: 'school',
                    registeredBySchoolId: schoolId,
                });

                results.success++;
            } catch (err) {
                results.errors.push({ uid: studentUid, error: (err as Error).message });
                results.failed++;
            }
        }

        // Commit batch
        await batch.commit();

        // Update opportunity registration count
        if (results.success > 0) {
            const opportunityRef = db.collection(OPPORTUNITIES_COLLECTION).doc(opportunityId);
            await opportunityRef.update({
                registrationCount: (opportunityData?.registrationCount || 0) + results.success,
            });
        }

        return NextResponse.json({
            success: results.success,
            failed: results.failed,
            errors: results.errors.length > 0 ? results.errors : undefined,
        });
    } catch (error) {
        console.error('Bulk apply failed', error);
        return NextResponse.json({ error: 'Failed to process bulk registration' }, { status: 500 });
    }
}
