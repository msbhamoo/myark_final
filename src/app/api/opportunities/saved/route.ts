import { NextRequest, NextResponse } from 'next/server';
import type { Firestore } from 'firebase-admin/firestore';
import { getAdminAuth, getDb } from '@/lib/firebaseAdmin';
import { getOpportunitiesByIds } from '@/lib/opportunityService';
import type { Opportunity } from '@/types/opportunity';

const USERS_COLLECTION = 'users';
const SAVED_SUBCOLLECTION = 'savedOpportunities';

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

const getSavedCollection = (db: Firestore, uid: string) =>
  db.collection(USERS_COLLECTION).doc(uid).collection(SAVED_SUBCOLLECTION);

export async function GET(request: NextRequest) {
  try {
    const token = getBearerToken(request);
    if (!token) {
      return NextResponse.json({ error: 'Missing authorization token' }, { status: 401 });
    }

    const auth = getAdminAuth();
    const decoded = await auth.verifyIdToken(token);

    const db = getDb();
    const snapshot = await getSavedCollection(db, decoded.uid).orderBy('savedAt', 'desc').limit(50).get();

    if (snapshot.empty) {
      return NextResponse.json({ items: [] });
    }

    const savedDocs = snapshot.docs;
    const ids = savedDocs.map((doc) => doc.id);

    const opportunities = await getOpportunitiesByIds(ids);
    const opportunitiesById = new Map(opportunities.map((item) => [item.id, item]));

    const items: Array<Opportunity> = [];

    savedDocs.forEach((doc) => {
      const opportunity = opportunitiesById.get(doc.id);
      if (!opportunity) {
        return;
      }
      const data = doc.data();
      opportunitiesById.set(doc.id, opportunity);
      items.push({
        ...opportunity,
        savedAt: toIsoString(data.savedAt),
      });
    });

    return NextResponse.json({ items });
  } catch (error) {
    console.error('Failed to fetch saved opportunities', error);
    return NextResponse.json({ error: 'Failed to fetch saved opportunities' }, { status: 500 });
  }
}
