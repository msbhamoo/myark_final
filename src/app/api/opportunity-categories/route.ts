import { NextResponse } from 'next/server';
import { getDb } from '@/lib/firebaseAdmin';

const COLLECTION = 'opportunityCategories';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const db = getDb();
    const snapshot = await db.collection(COLLECTION).orderBy('name').get();
    const categories = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Record<string, unknown>),
    }));

    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Failed to load opportunity categories', error);
    return NextResponse.json({ error: 'Failed to load categories' }, { status: 500 });
  }
}
