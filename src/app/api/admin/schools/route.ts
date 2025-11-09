import { NextResponse } from 'next/server';
import { getDb } from '@/lib/firebaseAdmin';
import { hasAdminSessionFromRequest } from '@/lib/adminSession';
import type { QueryDocumentSnapshot } from 'firebase-admin/firestore';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const COLLECTION = 'schools';

const serializeDoc = (doc: QueryDocumentSnapshot) => {
  const data = doc.data();
  return {
    id: doc.id,
    name: data.name ?? '',
    city: data.city ?? '',
    state: data.state ?? '',
    country: data.country ?? '',
    isVerified: Boolean(data.is_verified ?? data.isVerified ?? false),
    createdAt: data.createdAt ?? null,
    updatedAt: data.updatedAt ?? null,
  };
};

export async function GET(request: Request) {
  if (!hasAdminSessionFromRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const db = getDb();
    const snapshot = await db.collection(COLLECTION).orderBy('updatedAt', 'desc').limit(200).get();
    const items = snapshot.docs.map(serializeDoc);
    return NextResponse.json({ items });
  } catch (error) {
    console.error('Failed to list schools', error);
    return NextResponse.json({ error: 'Failed to list schools' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!hasAdminSessionFromRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const payload = await request.json().catch(() => null) as Record<string, unknown> | null;
    if (!payload) {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const name = typeof payload.name === 'string' ? payload.name.trim() : '';
    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const now = new Date();
    const docData = {
      name,
      city: typeof payload.city === 'string' ? payload.city.trim() : '',
      state: typeof payload.state === 'string' ? payload.state.trim() : '',
      country: typeof payload.country === 'string' ? payload.country.trim() : '',
      isVerified: Boolean(payload.isVerified ?? payload.is_verified ?? false),
      createdAt: now,
      updatedAt: now,
    };

    const db = getDb();
    const docRef = await db.collection(COLLECTION).add(docData);
    const docSnapshot = await docRef.get();
    return NextResponse.json({ item: serializeDoc(docSnapshot as QueryDocumentSnapshot) }, { status: 201 });
  } catch (error) {
    console.error('Failed to create school', error);
    return NextResponse.json({ error: 'Failed to create school' }, { status: 500 });
  }
}
