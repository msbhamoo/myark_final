import { NextResponse } from 'next/server';
import { getDb } from '@/lib/firebaseAdmin';
import { hasAdminSessionFromRequest } from '@/lib/adminSession';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const COLLECTION = 'schools';

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!hasAdminSessionFromRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await context.params;
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
    if (payload.cityId !== undefined) updates.cityId = String(payload.cityId ?? '');
    if (payload.stateId !== undefined) updates.stateId = String(payload.stateId ?? '');
    if (payload.countryId !== undefined) updates.countryId = String(payload.countryId ?? '');
    if (payload.schoolLogoUrl !== undefined) updates.schoolLogoUrl = String(payload.schoolLogoUrl ?? '');
    if (payload.address !== undefined) updates.address = String(payload.address ?? '');
    if (payload.website !== undefined) updates.website = String(payload.website ?? '');
    if (payload.pincode !== undefined) updates.pincode = String(payload.pincode ?? '');
    if (payload.email !== undefined) updates.email = String(payload.email ?? '');
    if (payload.phone !== undefined) updates.phone = String(payload.phone ?? '');
    if (payload.foundationYear !== undefined) updates.foundationYear = typeof payload.foundationYear === 'number' ? payload.foundationYear : null;
    if (payload.isVerified !== undefined) updates.isVerified = Boolean(payload.isVerified);
    if (payload.is_verified !== undefined) updates.isVerified = Boolean(payload.is_verified);
    // New fields
    if (payload.numberOfStudents !== undefined) updates.numberOfStudents = typeof payload.numberOfStudents === 'number' ? payload.numberOfStudents : null;
    if (payload.facilities !== undefined) updates.facilities = Array.isArray(payload.facilities) ? payload.facilities : [];
    if (payload.type !== undefined) updates.type = String(payload.type ?? '');
    if (payload.principalName !== undefined) updates.principalName = String(payload.principalName ?? '');
    if (payload.principalContact !== undefined) updates.principalContact = String(payload.principalContact ?? '');
    if (payload.affiliationNumber !== undefined) updates.affiliationNumber = String(payload.affiliationNumber ?? '');

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

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!hasAdminSessionFromRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await context.params;
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
