import { NextResponse } from 'next/server';
import { getDb } from '@/lib/firebaseAdmin';

export const dynamic = 'force-dynamic';

const STUDENT_PROFILE_COLLECTION = 'studentProfiles';
const SCHOOLS_COLLECTION = 'schools';
const REGISTRATIONS_COLLECTION = 'opportunity_registrations';

interface StudentWithRegistrations {
    uid: string;
    displayName: string;
    email: string | null;
    photoUrl: string | null;
    schoolInfo: {
        schoolName: string | null;
        board: string | null;
        className: string | null;
    };
    stats: {
        competitionsParticipated: number;
        totalAwards: number;
    };
    createdAt: unknown;
    appliedOpportunities: Array<{
        opportunityId: string;
        opportunityTitle: string;
        registeredAt: string | null;
    }>;
}

export async function GET(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id: schoolId } = await context.params;
        if (!schoolId) {
            return NextResponse.json({ error: 'School ID is required' }, { status: 400 });
        }

        const db = getDb();

        // Get school info to find school name
        const schoolDoc = await db.collection(SCHOOLS_COLLECTION).doc(schoolId).get();
        if (!schoolDoc.exists) {
            return NextResponse.json({ error: 'School not found' }, { status: 404 });
        }

        const schoolData = schoolDoc.data();
        const schoolName = schoolData?.name;

        if (!schoolName) {
            return NextResponse.json({ error: 'School name not found' }, { status: 400 });
        }

        // Find students whose schoolInfo.schoolName matches this school
        const studentsSnapshot = await db.collection(STUDENT_PROFILE_COLLECTION)
            .where('schoolInfo.schoolName', '==', schoolName)
            .limit(500)
            .get();

        // Also search by schoolId if present
        const studentsByIdSnapshot = await db.collection(STUDENT_PROFILE_COLLECTION)
            .where('schoolId', '==', schoolId)
            .limit(500)
            .get();

        // Combine and deduplicate student UIDs
        const studentUids = new Set<string>();
        const studentDocs = new Map<string, FirebaseFirestore.QueryDocumentSnapshot>();

        studentsSnapshot.docs.forEach(doc => {
            studentUids.add(doc.id);
            studentDocs.set(doc.id, doc);
        });
        studentsByIdSnapshot.docs.forEach(doc => {
            studentUids.add(doc.id);
            studentDocs.set(doc.id, doc);
        });

        // Get registrations for all these students
        const registrationsByStudent = new Map<string, Array<{
            opportunityId: string;
            opportunityTitle: string;
            registeredAt: string | null;
        }>>();

        if (studentUids.size > 0) {
            const studentUidsArray = Array.from(studentUids);
            // Firestore 'in' query supports max 30 items
            const chunks: string[][] = [];
            for (let i = 0; i < studentUidsArray.length; i += 30) {
                chunks.push(studentUidsArray.slice(i, i + 30));
            }

            for (const chunk of chunks) {
                try {
                    // Query by studentUid (used by bulk-apply)
                    const regsSnapshot = await db.collection(REGISTRATIONS_COLLECTION)
                        .where('studentUid', 'in', chunk)
                        .limit(500)
                        .get();

                    regsSnapshot.docs.forEach(doc => {
                        const data = doc.data();
                        // Handle both studentUid (bulk-apply) and userId (individual registration)
                        const uid = data.studentUid || data.userId;
                        if (uid && chunk.includes(uid)) {
                            if (!registrationsByStudent.has(uid)) {
                                registrationsByStudent.set(uid, []);
                            }
                            registrationsByStudent.get(uid)!.push({
                                opportunityId: data.opportunityId ?? '',
                                opportunityTitle: data.opportunityTitle ?? 'Unknown',
                                registeredAt: data.registeredAt?.toDate?.().toISOString() ?? data.registeredAt ?? null,
                            });
                        }
                    });

                    // Also query by userId (used by individual registration)
                    const regsByUserIdSnapshot = await db.collection(REGISTRATIONS_COLLECTION)
                        .where('userId', 'in', chunk)
                        .limit(500)
                        .get();

                    regsByUserIdSnapshot.docs.forEach(doc => {
                        const data = doc.data();
                        const uid = data.userId;
                        if (uid && chunk.includes(uid)) {
                            // Check if we already have this registration
                            const existing = registrationsByStudent.get(uid);
                            const alreadyExists = existing?.some(r => r.opportunityId === data.opportunityId);
                            if (!alreadyExists) {
                                if (!registrationsByStudent.has(uid)) {
                                    registrationsByStudent.set(uid, []);
                                }
                                registrationsByStudent.get(uid)!.push({
                                    opportunityId: data.opportunityId ?? '',
                                    opportunityTitle: data.opportunityTitle ?? 'Unknown',
                                    registeredAt: data.registeredAt?.toDate?.().toISOString() ?? data.registeredAt ?? null,
                                });
                            }
                        }
                    });
                } catch (regError) {
                    console.error('Failed to fetch registrations for chunk:', regError);
                    // Continue with other chunks
                }
            }
        }

        // Build student list with registrations
        const students: StudentWithRegistrations[] = [];
        studentDocs.forEach((doc, uid) => {
            const data = doc.data();
            students.push({
                uid,
                displayName: data.displayName ?? data.name ?? 'Unknown',
                email: data.email ?? null,
                photoUrl: data.photoUrl ?? data.photoURL ?? null,
                schoolInfo: {
                    schoolName: data.schoolInfo?.schoolName ?? null,
                    board: data.schoolInfo?.board ?? null,
                    className: data.schoolInfo?.className ?? null,
                },
                stats: {
                    competitionsParticipated: data.stats?.competitionsParticipated ?? 0,
                    totalAwards: data.stats?.totalAwards ?? 0,
                },
                createdAt: data.createdAt ?? null,
                appliedOpportunities: registrationsByStudent.get(uid) ?? [],
            });
        });

        return NextResponse.json({
            students,
            total: students.length,
            schoolName,
            schoolId,
        });
    } catch (error) {
        console.error('Failed to load students for school', error);
        return NextResponse.json({ error: 'Failed to load students' }, { status: 500 });
    }
}
