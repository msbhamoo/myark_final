import { NextResponse } from 'next/server';
import { getDb } from '@/lib/firebaseAdmin';
import { hasAdminSessionFromRequest } from '@/lib/adminSession';
import type { QueryDocumentSnapshot } from 'firebase-admin/firestore';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const COLLECTION = 'users';

const serializeDoc = (doc: QueryDocumentSnapshot) => {
  const data = doc.data();
  return {
    id: doc.id,
    email: data.email ?? '',
    role: data.role ?? 'student',
    firstName: data.first_name ?? data.firstName ?? '',
    lastName: data.last_name ?? data.lastName ?? '',
    createdAt: data.createdAt ?? null,
    updatedAt: data.updatedAt ?? null,
  };
};

const normaliseRole = (role: unknown) => {
  if (typeof role !== 'string') {
    return 'student';
  }
  const value = role.trim();
  if (!value) return 'student';
  return value;
};

export async function GET(request: Request) {
  if (!hasAdminSessionFromRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const db = getDb();
    const snapshot = await db.collection(COLLECTION).orderBy('createdAt', 'desc').limit(200).get();
    const items = snapshot.docs.map(serializeDoc);
    return NextResponse.json({ items });
  } catch (error) {
    console.error('Failed to list users', error);
    return NextResponse.json({ error: 'Failed to list users' }, { status: 500 });
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

    const email = typeof payload.email === 'string' ? payload.email.trim() : '';
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const now = new Date();
    const docData = {
      email,
      role: normaliseRole(payload.role),
      firstName: typeof payload.firstName === 'string' ? payload.firstName.trim() : typeof payload.first_name === 'string' ? payload.first_name.trim() : '',
      lastName: typeof payload.lastName === 'string' ? payload.lastName.trim() : typeof payload.last_name === 'string' ? payload.last_name.trim() : '',
      createdAt: now,
      updatedAt: now,
    };

    const db = getDb();
    const docRef = await db.collection(COLLECTION).add(docData);
    const docSnapshot = await docRef.get();
    return NextResponse.json({ item: serializeDoc(docSnapshot as QueryDocumentSnapshot) }, { status: 201 });
  } catch (error) {
    console.error('Failed to create user', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}
