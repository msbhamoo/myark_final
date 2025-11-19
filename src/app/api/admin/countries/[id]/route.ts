import { NextResponse } from 'next/server';
import { getDb } from '@/lib/firebaseAdmin';

export async function GET(
  request: Request,
  context: any
) {
  const params = (context && context.params) as { id?: string | string[] } | undefined;
  const idParam = params?.id;
  const id = Array.isArray(idParam) ? idParam[0] : idParam ?? '';

  try {
    const db = getDb();
    const doc = await db.collection('countries').doc(id).get();

    if (!doc.exists) {
      return NextResponse.json({ error: 'Country not found' }, { status: 404 });
    }

    return NextResponse.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error('Failed to fetch country:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  context: any
) {
  const params = (context && context.params) as { id?: string | string[] } | undefined;
  const idParam = params?.id;
  const id = Array.isArray(idParam) ? idParam[0] : idParam ?? '';

  try {
    const body = await request.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const db = getDb();
    const docRef = db.collection('countries').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json({ error: 'Country not found' }, { status: 404 });
    }

    await docRef.update({ name, updatedAt: new Date() });

    return NextResponse.json({ id, name });
  } catch (error) {
    console.error('Failed to update country:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  context: any
) {
  const params = (context && context.params) as { id?: string | string[] } | undefined;
  const idParam = params?.id;
  const id = Array.isArray(idParam) ? idParam[0] : idParam ?? '';

  try {
    const db = getDb();
    const docRef = db.collection('countries').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json({ error: 'Country not found' }, { status: 404 });
    }

    await docRef.delete();

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('Failed to delete country:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
