import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getDb } from '@/lib/firebaseAdmin';

interface OpportunityCategory {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function GET() {
  try {
    const db = getDb();
    const snapshot = await db.collection('opportunityCategories').get();
    const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json({ items });
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description } = body;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const db = getDb();
    const docRef = await db.collection('opportunityCategories').add({
      name,
      description,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const newCategory = {
      id: docRef.id,
      name,
      description,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error('Failed to create category:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
