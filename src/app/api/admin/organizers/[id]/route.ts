import { NextResponse } from 'next/server';
import { getDb } from '@/lib/firebaseAdmin';

const normalizeVisibility = (value: unknown): 'public' | 'private' => {
  if (value === 'private') {
    return 'private';
  }
  if (typeof value === 'string' && value.toLowerCase() === 'private') {
    return 'private';
  }
  return 'public';
};

const normalizeBoolean = (value: unknown): boolean => {
  if (typeof value === 'boolean') {
    return value;
  }
  if (typeof value === 'string') {
    return ['true', '1', 'yes', 'y'].includes(value.toLowerCase());
  }
  if (typeof value === 'number') {
    return value !== 0;
  }
  return false;
};

const parseFoundationYear = (value: unknown): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) {
      return null;
    }
    const parsed = Number(trimmed);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

export async function GET(_request: Request, context: any) {
  const params = (context && context.params) as { id?: string | string[] } | undefined;
  const idParam = params?.id;
  const id = Array.isArray(idParam) ? idParam[0] : idParam ?? '';
  try {
    const db = getDb();
    const doc = await db.collection('organizers').doc(id).get();

    if (!doc.exists) {
      return NextResponse.json({ error: 'Organizer not found' }, { status: 404 });
    }

    const data = doc.data() ?? {};
    return NextResponse.json({
      id: doc.id,
      name: data.name ?? '',
      shortName: data.shortName ?? '',
      address: data.address ?? '',
      website: data.website ?? '',
      foundationYear: parseFoundationYear(data.foundationYear),
      type: data.type ?? 'other',
      visibility: data.visibility ?? 'public',
      isVerified: Boolean(data.isVerified),
      logoUrl: data.logoUrl ?? '',
      contactUrl: data.contactUrl ?? '',
      contactEmail: data.contactEmail ?? '',
      contactPhone: data.contactPhone ?? '',
      contactWebsite: data.contactWebsite ?? '',
      description: data.description ?? '',
      opportunityTypeIds: Array.isArray(data.opportunityTypeIds) ? data.opportunityTypeIds : [],
      country: data.country ?? '',
      state: data.state ?? '',
      city: data.city ?? '',
      schoolLogoUrl: data.schoolLogoUrl ?? '',
      createdAt: data.createdAt ?? null,
      updatedAt: data.updatedAt ?? null,
    });
  } catch (error) {
    console.error('Failed to fetch organizer:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request, context: any) {
  const params = (context && context.params) as { id?: string | string[] } | undefined;
  const idParam = params?.id;
  const id = Array.isArray(idParam) ? idParam[0] : idParam ?? '';
  try {
    const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
    if (!body) {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const name = typeof body.name === 'string' ? body.name.trim() : '';
    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const updateData = {
      name,
      shortName: typeof body.shortName === 'string' ? body.shortName.trim() : '',
      address: typeof body.address === 'string' ? body.address.trim() : '',
      website: typeof body.website === 'string' ? body.website.trim() : '',
      foundationYear: parseFoundationYear(body.foundationYear),
      type: typeof body.type === 'string' ? body.type : 'other',
      visibility: normalizeVisibility(body.visibility),
      isVerified: normalizeBoolean(body.isVerified),
      logoUrl: typeof body.logoUrl === 'string' ? body.logoUrl.trim() : '',
      contactUrl: typeof body.contactUrl === 'string' ? body.contactUrl.trim() : '',
      contactEmail: typeof body.contactEmail === 'string' ? body.contactEmail.trim() : '',
      contactPhone: typeof body.contactPhone === 'string' ? body.contactPhone.trim() : '',
      contactWebsite: typeof body.contactWebsite === 'string' ? body.contactWebsite.trim() : '',
      description: typeof body.description === 'string' ? body.description.trim() : '',
      opportunityTypeIds: Array.isArray(body.opportunityTypeIds) ? body.opportunityTypeIds : [],
      updatedAt: new Date(),
    };

    const db = getDb();
    const docRef = db.collection('organizers').doc(id);
    const snapshot = await docRef.get();

    if (!snapshot.exists) {
      return NextResponse.json({ error: 'Organizer not found' }, { status: 404 });
    }

    await docRef.set(updateData, { merge: true });

    return NextResponse.json({ id, ...updateData });
  } catch (error) {
    console.error('Failed to update organizer:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: any) {
  const params = (context && context.params) as { id?: string | string[] } | undefined;
  const idParam = params?.id;
  const id = Array.isArray(idParam) ? idParam[0] : idParam ?? '';
  try {
    const db = getDb();
    const docRef = db.collection('organizers').doc(id);
    const snapshot = await docRef.get();

    if (!snapshot.exists) {
      return NextResponse.json({ error: 'Organizer not found' }, { status: 404 });
    }

    await docRef.delete();

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('Failed to delete organizer:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
