import { NextResponse } from 'next/server';
import { getDb } from '@/lib/firebaseAdmin';

// Accept Next.js style route params which can be string or string[]
type Params = { id?: string | string[] };

export async function GET(
  request: Request,
  context: any
) {
  const params = (context && context.params) as Params | undefined;
  const idParam = params?.id;
  const id = Array.isArray(idParam) ? idParam[0] : idParam ?? '';

  try {
    const db = getDb();
    const doc = await db.collection('cities').doc(id).get();

    if (!doc.exists) {
      return NextResponse.json({ error: 'City not found' }, { status: 404 });
    }

    return NextResponse.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error('Failed to fetch city:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  context: any
) {
  const params = (context && context.params) as Params | undefined;
  const idParam = params?.id;
  const id = Array.isArray(idParam) ? idParam[0] : idParam ?? '';
  try {
    const body = await request.json();
    const { name, stateId } = body;

    if (!name || !stateId) {
      return NextResponse.json({ error: 'Name and State are required' }, { status: 400 });
    }

    const db = getDb();
    const docRef = db.collection('cities').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json({ error: 'City not found' }, { status: 404 });
    }

    await docRef.update({ name, stateId, updatedAt: new Date() });

    return NextResponse.json({ id, name, stateId });
  } catch (error) {
    console.error('Failed to update city:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  context: any
) {
  const params = (context && context.params) as Params | undefined;
  const idParam = params?.id;
  const id = Array.isArray(idParam) ? idParam[0] : idParam ?? '';

  try {
    const db = getDb();
    const docRef = db.collection('cities').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json({ error: 'City not found' }, { status: 404 });
    }

    await docRef.delete();

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('Failed to delete city:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
