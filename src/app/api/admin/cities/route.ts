import { NextResponse } from 'next/server';
import { getDb } from '@/lib/firebaseAdmin';
import { City } from '@/types/masters';

export async function GET() {
  try {
    const db = getDb();
    const snapshot = await db.collection('cities').orderBy('name').get();
    const items = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as City[];
    return NextResponse.json({ items });
  } catch (error) {
    console.error('Failed to fetch cities:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, stateId } = body;

    if (!name || !stateId) {
      return NextResponse.json({ error: 'Name and State are required' }, { status: 400 });
    }

    const db = getDb();
    const newCity = {
      name,
      stateId,
      createdAt: new Date(),
    };

    const docRef = await db.collection('cities').add(newCity);

    return NextResponse.json({ id: docRef.id, ...newCity }, { status: 201 });
  } catch (error) {
    console.error('Failed to create city:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
