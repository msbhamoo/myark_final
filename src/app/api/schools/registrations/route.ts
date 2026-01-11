import { NextRequest, NextResponse } from 'next/server';
import { getAdminAuth, getDb } from '@/lib/firebaseAdmin';

const OPPORTUNITIES_COLLECTION = 'opportunities';
const REGISTRATIONS_COLLECTION = 'opportunity_registrations';
const USERS_COLLECTION = 'users';

export const dynamic = 'force-dynamic';

const getBearerToken = (request: NextRequest): string | null => {
    const header = request.headers.get('authorization') ?? request.headers.get('Authorization');
    if (!header) return null;
    const [scheme, token] = header.split(' ');
    if (!scheme || scheme.toLowerCase() !== 'bearer' || !token) return null;
    return token;
};

export async function GET(request: NextRequest) {
    try {
        const token = getBearerToken(request);
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const auth = getAdminAuth();
        const decoded = await auth.verifyIdToken(token);

        const db = getDb();
        const profileDoc = await db.collection(USERS_COLLECTION).doc(decoded.uid).get();
        if (!profileDoc.exists) {
            return NextResponse.json({ error: 'Profile not found' }, { status: 403 });
        }

        const profileData = profileDoc.data();
        const linkedSchoolId = profileData?.linkedSchoolId;

        if (!linkedSchoolId) {
            return NextResponse.json({ error: 'No linked school found' }, { status: 403 });
        }

        // Get all opportunities for this school (by organizerId)
        const opportunitiesSnapshot = await db
            .collection(OPPORTUNITIES_COLLECTION)
            .where('organizerId', '==', linkedSchoolId)
            .get();

        // Also get opportunities submitted by this user
        const submittedSnapshot = await db
            .collection(OPPORTUNITIES_COLLECTION)
            .where('submittedBy', '==', decoded.uid)
            .get();

        // Combine and dedupe opportunity IDs
        const opportunityIds = new Set<string>();
        const opportunityTitles = new Map<string, string>();

        opportunitiesSnapshot.docs.forEach(doc => {
            opportunityIds.add(doc.id);
            opportunityTitles.set(doc.id, doc.data().title || 'Untitled');
        });
        submittedSnapshot.docs.forEach(doc => {
            opportunityIds.add(doc.id);
            if (!opportunityTitles.has(doc.id)) {
                opportunityTitles.set(doc.id, doc.data().title || 'Untitled');
            }
        });

        if (opportunityIds.size === 0) {
            return NextResponse.json({ items: [] });
        }

        // Fetch all registrations and filter by opportunity IDs
        const registrationsSnapshot = await db.collection(REGISTRATIONS_COLLECTION).get();

        const items = registrationsSnapshot.docs
            .map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    studentUid: data.studentUid,
                    studentName: data.studentName,
                    studentEmail: data.studentEmail,
                    className: data.className,
                    schoolName: data.schoolName,
                    profileSlug: data.profileSlug,
                    registeredAt: data.registeredAt,
                    opportunityId: data.opportunityId,
                    opportunityTitle: data.opportunityTitle || opportunityTitles.get(data.opportunityId) || 'Unknown',
                    registrationType: data.registrationType || 'internal',
                };
            })
            .filter(item => opportunityIds.has(item.opportunityId))
            .sort((a, b) => new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime());

        return NextResponse.json({
            items,
            totalCount: items.length,
            opportunityCount: opportunityIds.size,
        });
    } catch (error) {
        console.error('Failed to fetch school registrations', error);
        return NextResponse.json({ error: 'Failed to fetch registrations' }, { status: 500 });
    }
}
