import { NextResponse } from 'next/server';
import { getDb } from '@/lib/firebaseAdmin';
import { hasAdminSessionFromRequest } from '@/lib/adminSession';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const COLLECTION = 'users';

const normaliseRole = (role: unknown) => {
  if (typeof role !== 'string') {
    return undefined;
  }
  const value = role.trim();
  return value || undefined;
};

export async function PUT(request: Request, context: any) {
  if (!hasAdminSessionFromRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const params = (context && context.params) as { id?: string | string[] } | undefined;
  const idParam = params?.id;
  const id = Array.isArray(idParam) ? idParam[0] : idParam ?? '';
  if (!id) {
    return NextResponse.json({ error: 'Invalid user id' }, { status: 400 });
  }

  try {
    const payload = await request.json().catch(() => null) as Record<string, unknown> | null;
    if (!payload) {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const updates: Record<string, unknown> = { updatedAt: new Date() };

    if (payload.email !== undefined) updates.email = String(payload.email ?? '');
    const role = normaliseRole(payload.role);
    if (role !== undefined) updates.role = role;
    if (payload.firstName !== undefined || payload.first_name !== undefined) {
      const firstName =
        typeof payload.firstName === 'string'
          ? payload.firstName.trim()
          : typeof payload.first_name === 'string'
            ? payload.first_name.trim()
            : '';
      updates.firstName = firstName;
    }
    if (payload.lastName !== undefined || payload.last_name !== undefined) {
      const lastName =
        typeof payload.lastName === 'string'
          ? payload.lastName.trim()
          : typeof payload.last_name === 'string'
            ? payload.last_name.trim()
            : '';
      updates.lastName = lastName;
    }

    const db = getDb();
    await db.collection(COLLECTION).doc(id).set(updates, { merge: true });
    const updated = await db.collection(COLLECTION).doc(id).get();
    if (!updated.exists) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ item: { id: updated.id, ...updated.data() } });
  } catch (error) {
    console.error('Failed to update user', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
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
    return NextResponse.json({ error: 'Invalid user id' }, { status: 400 });
  }

  try {
    const db = getDb();
    await db.collection(COLLECTION).doc(id).delete();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete user', error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}
