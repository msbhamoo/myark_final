import { NextResponse } from 'next/server';
import { getDb } from '@/lib/firebaseAdmin';
import { Country } from '@/types/masters';

export async function GET() {
  try {
    const db = getDb();
    const snapshot = await db.collection('countries').orderBy('name').get();
    const items = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Country[];
    return NextResponse.json({ items });
  } catch (error) {
    console.error('Failed to fetch countries:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const db = getDb();
    const newCountry = {
      name,
      createdAt: new Date(),
    };

    const docRef = await db.collection('countries').add(newCountry);

    return NextResponse.json({ id: docRef.id, ...newCountry }, { status: 201 });
  } catch (error) {
    console.error('Failed to create country:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
