import { NextResponse } from 'next/server';
import { getDb } from '@/lib/firebaseAdmin';
import { State } from '@/types/masters';

export async function GET() {
  try {
    const db = getDb();
    const snapshot = await db.collection('states').orderBy('name').get();
    const items = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as State[];
    return NextResponse.json({ items });
  } catch (error) {
    console.error('Failed to fetch states:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, countryId } = body;

    if (!name || !countryId) {
      return NextResponse.json({ error: 'Name and Country are required' }, { status: 400 });
    }

    const db = getDb();
    const newState = {
      name,
      countryId,
      createdAt: new Date(),
    };

    const docRef = await db.collection('states').add(newState);

    return NextResponse.json({ id: docRef.id, ...newState }, { status: 201 });
  } catch (error) {
    console.error('Failed to create state:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
