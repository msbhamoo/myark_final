import { NextResponse } from 'next/server';
import { getDb } from '@/lib/firebaseAdmin';
import { hasAdminSessionFromRequest } from '@/lib/adminSession';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const COLLECTION = 'schools';

export async function PUT(request: Request, context: any) {
  if (!hasAdminSessionFromRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const params = (context && context.params) as { id?: string | string[] } | undefined;
  const idParam = params?.id;
  const id = Array.isArray(idParam) ? idParam[0] : idParam ?? '';
  if (!id) {
    return NextResponse.json({ error: 'Invalid school id' }, { status: 400 });
  }

  try {
    const payload = await request.json().catch(() => null) as Record<string, unknown> | null;
    if (!payload) {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const updates: Record<string, unknown> = { updatedAt: new Date() };

    if (payload.name !== undefined) updates.name = String(payload.name ?? '');
    if (payload.city !== undefined) updates.city = String(payload.city ?? '');
    if (payload.state !== undefined) updates.state = String(payload.state ?? '');
    if (payload.country !== undefined) updates.country = String(payload.country ?? '');
    if (payload.isVerified !== undefined) updates.isVerified = Boolean(payload.isVerified);
    if (payload.is_verified !== undefined) updates.isVerified = Boolean(payload.is_verified);

    const db = getDb();
    await db.collection(COLLECTION).doc(id).set(updates, { merge: true });
    const updated = await db.collection(COLLECTION).doc(id).get();
    if (!updated.exists) {
      return NextResponse.json({ error: 'School not found' }, { status: 404 });
    }
    return NextResponse.json({ item: { id: updated.id, ...updated.data() } });
  } catch (error) {
    console.error('Failed to update school', error);
    return NextResponse.json({ error: 'Failed to update school' }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: any) {
  if (!hasAdminSessionFromRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const params = (context && context.params) as { id?: string | string[] } | undefined;
  const idParam = params?.id;
  const id = Array.isArray(idParam) ? idParam[0] : idParam ?? '';
  if (!id) {
    return NextResponse.json({ error: 'Invalid school id' }, { status: 400 });
  }

  try {
    const db = getDb();
    await db.collection(COLLECTION).doc(id).delete();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete school', error);
    return NextResponse.json({ error: 'Failed to delete school' }, { status: 500 });
  }
}
