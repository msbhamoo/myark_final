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
    cityId: data.cityId ?? '',
    stateId: data.stateId ?? '',
    countryId: data.countryId ?? '',
    schoolLogoUrl: data.schoolLogoUrl ?? '',
    address: data.address ?? '',
    website: data.website ?? '',
    pincode: data.pincode ?? '',
    email: data.email ?? '',
    phone: data.phone ?? '',
    foundationYear: data.foundationYear ?? null,
    isVerified: Boolean(data.is_verified ?? data.isVerified ?? false),
    createdAt: data.createdAt ?? null,
    updatedAt: data.updatedAt ?? null,
    // New fields
    numberOfStudents: data.numberOfStudents ?? null,
    facilities: Array.isArray(data.facilities) ? data.facilities : [],
    type: data.type ?? '',
    principalName: data.principalName ?? '',
    principalContact: data.principalContact ?? '',
    affiliationNumber: data.affiliationNumber ?? '',
    loginEnabled: Boolean(data.loginEnabled ?? false),
    linkedUserId: data.linkedUserId ?? null,
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
      cityId: typeof payload.cityId === 'string' ? payload.cityId.trim() : '',
      stateId: typeof payload.stateId === 'string' ? payload.stateId.trim() : '',
      countryId: typeof payload.countryId === 'string' ? payload.countryId.trim() : '',
      schoolLogoUrl: typeof payload.schoolLogoUrl === 'string' ? payload.schoolLogoUrl.trim() : '',
      address: typeof payload.address === 'string' ? payload.address.trim() : '',
      website: typeof payload.website === 'string' ? payload.website.trim() : '',
      pincode: typeof payload.pincode === 'string' ? payload.pincode.trim() : '',
      email: typeof payload.email === 'string' ? payload.email.trim() : '',
      phone: typeof payload.phone === 'string' ? payload.phone.trim() : '',
      foundationYear: typeof payload.foundationYear === 'number' ? payload.foundationYear : null,
      isVerified: Boolean(payload.isVerified ?? payload.is_verified ?? false),
      createdAt: now,
      updatedAt: now,
      // New fields
      numberOfStudents: typeof payload.numberOfStudents === 'number' ? payload.numberOfStudents : null,
      facilities: Array.isArray(payload.facilities) ? payload.facilities : [],
      type: typeof payload.type === 'string' ? payload.type.trim() : '',
      principalName: typeof payload.principalName === 'string' ? payload.principalName.trim() : '',
      principalContact: typeof payload.principalContact === 'string' ? payload.principalContact.trim() : '',
      affiliationNumber: typeof payload.affiliationNumber === 'string' ? payload.affiliationNumber.trim() : '',
      loginEnabled: false,
      linkedUserId: null,
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
