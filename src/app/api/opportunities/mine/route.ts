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

    const snapshot = await db
      .collection(COLLECTION)
      .where('submittedBy', '==', decoded.uid)
      .limit(100)
      .get();

    const items = snapshot.docs.map((doc) => {
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
      };
    }).sort((a, b) => {
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bTime - aTime;
    });

    return NextResponse.json({ items });
  } catch (error) {
    console.error('Failed to list submitted opportunities', error);
    return NextResponse.json({ error: 'Failed to list opportunities' }, { status: 500 });
  }
}
