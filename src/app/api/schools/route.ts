import { NextResponse } from 'next/server';
import { getDb } from '@/lib/firebaseAdmin';
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
    board: data.board ?? '',
    medium: data.medium ?? '',
    grades: data.grades ?? '',
    studentsCount: data.studentsCount ?? 0,
    established: data.established ?? null,
    image: data.image ?? undefined,
    isVerified: Boolean(data.is_verified ?? data.isVerified ?? false),
    rating: data.rating ?? 0,
    fees: data.fees ?? '',
    facilities: Array.isArray(data.facilities) ? data.facilities : [],
    address: data.address ?? undefined,
    phone: data.phone ?? undefined,
    email: data.email ?? undefined,
    website: data.website ?? undefined,
    principalName: data.principalName ?? undefined,
    affiliation: data.affiliation ?? undefined,
    topAchievers: Array.isArray(data.topAchievers) ? data.topAchievers : undefined,
    createdAt: data.createdAt ?? null,
    updatedAt: data.updatedAt ?? null,
  };
};

export async function GET(request: Request) {
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
