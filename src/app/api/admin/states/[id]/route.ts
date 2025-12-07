import { NextResponse } from 'next/server';
import { getDb } from '@/lib/firebaseAdmin';

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    const db = getDb();
    const doc = await db.collection('states').doc(id).get();

    if (!doc.exists) {
      return NextResponse.json({ error: 'State not found' }, { status: 404 });
    }

    return NextResponse.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error('Failed to fetch state:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    const body = await request.json();
    const { name, countryId } = body;

    if (!name || !countryId) {
      return NextResponse.json({ error: 'Name and Country are required' }, { status: 400 });
    }

    const db = getDb();
    const docRef = db.collection('states').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json({ error: 'State not found' }, { status: 404 });
    }

    await docRef.update({ name, countryId, updatedAt: new Date() });

    return NextResponse.json({ id, name, countryId });
  } catch (error) {
    console.error('Failed to update state:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    const db = getDb();
    const docRef = db.collection('states').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json({ error: 'State not found' }, { status: 404 });
    }

    await docRef.delete();

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('Failed to delete state:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
