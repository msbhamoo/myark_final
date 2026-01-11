import { NextRequest, NextResponse } from 'next/server';
import { getAdminAuth, getDb } from '@/lib/firebaseAdmin';

const COLLECTION = 'opportunities';
const USERS_COLLECTION = 'users';

const getBearerToken = (request: NextRequest): string | null => {
  const header = request.headers.get('authorization') ?? request.headers.get('Authorization');
  if (!header) {
    return null;
  }
  const [scheme, token] = header.split(' ');
  if (!scheme || scheme.toLowerCase() !== 'bearer' || !token) {
    return null;
  }
  return token;
};

const toIsoString = (value: unknown): string | null => {
  if (!value) return null;
  if (value instanceof Date) return value.toISOString();
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && value && 'toDate' in value) {
    const dateValue = (value as { toDate?: () => Date | null }).toDate?.();
    if (dateValue instanceof Date && !Number.isNaN(dateValue.getTime())) {
      return dateValue.toISOString();
    }
  }
  return null;
};

const mapDocToItem = (doc: FirebaseFirestore.QueryDocumentSnapshot) => {
  const data = doc.data();
  return {
    id: doc.id,
    title: data.title ?? '',
    status: data.status ?? 'pending',
    mode: data.mode ?? 'online',
    registrationDeadline: toIsoString(data.registrationDeadline),
    createdAt: toIsoString(data.createdAt),
    updatedAt: toIsoString(data.updatedAt),
    approval: data.approval ?? null,
    registrationMode: data.registrationMode ?? 'internal',
    registrationCount: data.registrationCount ?? 0,
    category: data.category ?? data.categoryName ?? '',
    organizerName: data.organizerName ?? data.organizer ?? '',
  };
};

export async function GET(request: NextRequest) {
  try {
    const token = getBearerToken(request);
    if (!token) {
      return NextResponse.json({ error: 'Missing authorization token' }, { status: 401 });
    }

    const auth = getAdminAuth();
    const decoded = await auth.verifyIdToken(token);

    const db = getDb();
    const profileDoc = await db.collection(USERS_COLLECTION).doc(decoded.uid).get();
    if (!profileDoc.exists) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 403 });
    }

    const profileData = profileDoc.data();
    const linkedSchoolId = profileData?.linkedSchoolId ?? null;

    // Query 1: Opportunities submitted by this user
    const submittedSnapshot = await db
      .collection(COLLECTION)
      .where('submittedBy', '==', decoded.uid)
      .limit(100)
      .get();

    const submittedItems = submittedSnapshot.docs.map(mapDocToItem);
    const submittedIds = new Set(submittedItems.map(item => item.id));

    // Query 2: Opportunities where this school is the organizer (by organizerId)
    let organizerItems: ReturnType<typeof mapDocToItem>[] = [];
    if (linkedSchoolId) {
      const organizerSnapshot = await db
        .collection(COLLECTION)
        .where('organizerId', '==', linkedSchoolId)
        .limit(100)
        .get();

      // Filter out duplicates (already in submittedItems)
      organizerItems = organizerSnapshot.docs
        .filter(doc => !submittedIds.has(doc.id))
        .map(mapDocToItem);
    }

    // Merge and sort
    const allItems = [...submittedItems, ...organizerItems].sort((a, b) => {
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bTime - aTime;
    });

    return NextResponse.json({ items: allItems });
  } catch (error) {
    console.error('Failed to list submitted opportunities', error);
    return NextResponse.json({ error: 'Failed to list opportunities' }, { status: 500 });
  }
}
