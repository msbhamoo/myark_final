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

export async function GET() {
  try {
    const db = getDb();

    // Fetch organizers
    const organizersSnapshot = await db.collection('organizers').orderBy('updatedAt', 'desc').limit(500).get();
    const organizers = organizersSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
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
        source: 'organizers' as const,
      };
    });

    // Fetch schools and map to organizer format
    const schoolsSnapshot = await db.collection('schools').orderBy('updatedAt', 'desc').limit(200).get();
    const schoolsAsOrganizers = schoolsSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name ?? '',
        shortName: '',
        address: data.address ?? '',
        website: data.website ?? '',
        foundationYear: parseFoundationYear(data.foundationYear),
        type: 'school' as const,
        visibility: 'public' as const,
        isVerified: Boolean(data.isVerified ?? data.is_verified),
        logoUrl: data.schoolLogoUrl ?? '',
        contactUrl: '',
        contactEmail: data.email ?? '',
        contactPhone: data.phone ?? '',
        contactWebsite: data.website ?? '',
        description: '',
        opportunityTypeIds: [],
        country: data.countryId ?? '',
        state: data.stateId ?? '',
        city: data.cityId ?? '',
        schoolLogoUrl: data.schoolLogoUrl ?? '',
        createdAt: data.createdAt ?? null,
        updatedAt: data.updatedAt ?? null,
        source: 'schools' as const,
      };
    });

    // Merge and dedupe (schools take precedence if same id exists in both)
    const schoolIds = new Set(schoolsAsOrganizers.map(s => s.id));
    const filteredOrganizers = organizers.filter(o => !schoolIds.has(o.id));
    const items = [...schoolsAsOrganizers, ...filteredOrganizers];

    return NextResponse.json({ items });
  } catch (error) {
    console.error('Failed to fetch organizers:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
    if (!body) {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const name = typeof body.name === 'string' ? body.name.trim() : '';
    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const now = new Date();
    const organizerType = typeof body.type === 'string' ? body.type : 'other';

    const payload = {
      name,
      shortName: typeof body.shortName === 'string' ? body.shortName.trim() : '',
      address: typeof body.address === 'string' ? body.address.trim() : '',
      website: typeof body.website === 'string' ? body.website.trim() : '',
      foundationYear: parseFoundationYear(body.foundationYear),
      type: organizerType,
      visibility: normalizeVisibility(body.visibility),
      isVerified: normalizeBoolean(body.isVerified),
      logoUrl: typeof body.logoUrl === 'string' ? body.logoUrl.trim() : '',
      contactUrl: typeof body.contactUrl === 'string' ? body.contactUrl.trim() : '',
      contactEmail: typeof body.contactEmail === 'string' ? body.contactEmail.trim() : '',
      contactPhone: typeof body.contactPhone === 'string' ? body.contactPhone.trim() : '',
      contactWebsite: typeof body.contactWebsite === 'string' ? body.contactWebsite.trim() : '',
      description: typeof body.description === 'string' ? body.description.trim() : '',
      opportunityTypeIds: Array.isArray(body.opportunityTypeIds) ? body.opportunityTypeIds : [],
      createdAt: now,
      updatedAt: now,
    };

    const db = getDb();
    const docRef = await db.collection('organizers').add(payload);

    // If type is 'school', also add to schools collection for sync with /admin/schools
    if (organizerType === 'school') {
      const schoolPayload = {
        name,
        address: payload.address,
        website: payload.website,
        foundationYear: payload.foundationYear,
        isVerified: payload.isVerified,
        schoolLogoUrl: payload.logoUrl,
        email: payload.contactEmail,
        phone: payload.contactPhone,
        cityId: '',
        stateId: '',
        countryId: '',
        pincode: '',
        numberOfStudents: null,
        facilities: [],
        type: 'school',
        principalName: '',
        principalContact: '',
        affiliationNumber: '',
        loginEnabled: false,
        linkedUserId: null,
        createdAt: now,
        updatedAt: now,
        linkedOrganizerId: docRef.id, // Link back to organizer
      };
      // Use same ID for consistency
      await db.collection('schools').doc(docRef.id).set(schoolPayload);
    }

    return NextResponse.json({ id: docRef.id, ...payload }, { status: 201 });
  } catch (error) {
    console.error('Failed to create organizer:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
