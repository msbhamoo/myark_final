import { NextRequest, NextResponse } from 'next/server';
import type { Firestore } from 'firebase-admin/firestore';
import { getAdminAuth, getDb } from '@/lib/firebaseAdmin';

const USERS_COLLECTION = 'users';
const SAVED_SUBCOLLECTION = 'savedOpportunities';
const OPPORTUNITIES_COLLECTION = 'opportunities';

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
  if (!value) {
    return null;
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (typeof value === 'string') {
    return value;
  }
  if (typeof value === 'object' && value !== null && 'toDate' in value) {
    try {
      const dateValue = (value as { toDate?: () => Date | null }).toDate?.();
      if (dateValue instanceof Date && !Number.isNaN(dateValue.getTime())) {
        return dateValue.toISOString();
      }
    } catch {
      return null;
    }
  }
  return null;
};

const authenticateRequest = async (request: NextRequest) => {
  const token = getBearerToken(request);
  if (!token) {
    return null;
  }
  try {
    const auth = getAdminAuth();
    const decoded = await auth.verifyIdToken(token);
    return { token, uid: decoded.uid };
  } catch (error) {
    console.error('Failed to verify auth token for saved opportunity request', error);
    return null;
  }
};

const getSavedDocRef = (db: Firestore, uid: string, opportunityId: string) =>
  db.collection(USERS_COLLECTION).doc(uid).collection(SAVED_SUBCOLLECTION).doc(opportunityId);

const ensureOpportunityExists = async (db: Firestore, opportunityId: string) => {
  const snapshot = await db.collection(OPPORTUNITIES_COLLECTION).doc(opportunityId).get();
  return snapshot.exists ? snapshot : null;
};

export async function GET(request: NextRequest, context: any) {
  try {
    const authContext = await authenticateRequest(request);
    if (!authContext) {
      return NextResponse.json({ isSaved: false });
    }
    const params = (context && context.params) as { id?: string | string[] } | undefined;
    const idParam = params?.id;
    const id = Array.isArray(idParam) ? idParam[0] : idParam ?? '';

    const db = getDb();
    const doc = await getSavedDocRef(db, authContext.uid, id).get();
    const savedAt = toIsoString(doc.data()?.savedAt);
    return NextResponse.json({ isSaved: doc.exists, savedAt });
  } catch (error) {
    console.error('Failed to check saved opportunity state', error);
    return NextResponse.json({ error: 'Failed to resolve saved opportunity state' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, context: any) {
  try {
    const authContext = await authenticateRequest(request);
    if (!authContext) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const params = (context && context.params) as { id?: string | string[] } | undefined;
    const idParam = params?.id;
    const id = Array.isArray(idParam) ? idParam[0] : idParam ?? '';

    const db = getDb();
    const opportunityDoc = await ensureOpportunityExists(db, id);
    if (!opportunityDoc) {
      return NextResponse.json({ error: 'Opportunity not found' }, { status: 404 });
    }

    const data = opportunityDoc.data() ?? {};
    const payload = {
      opportunityId: id,
      savedAt: new Date(),
      opportunityTitle: data.title ?? '',
      category: data.category ?? '',
      organizer: data.organizer ?? '',
      registrationDeadline: toIsoString(data.registrationDeadline),
    };
    await getSavedDocRef(db, authContext.uid, id).set(payload, { merge: true });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to save opportunity bookmark', error);
    return NextResponse.json({ error: 'Failed to save opportunity' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: any) {
  try {
    const authContext = await authenticateRequest(request);
    if (!authContext) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const params = (context && context.params) as { id?: string | string[] } | undefined;
    const idParam = params?.id;
    const id = Array.isArray(idParam) ? idParam[0] : idParam ?? '';

    const db = getDb();
    await getSavedDocRef(db, authContext.uid, id).delete();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to remove saved opportunity', error);
    return NextResponse.json({ error: 'Failed to remove saved opportunity' }, { status: 500 });
  }
}
