import { NextRequest, NextResponse } from 'next/server';
import { getAdminAuth, getDb } from '@/lib/firebaseAdmin';

const PROFILE_COLLECTION = 'users';
const ORGANIZATIONS_COLLECTION = 'organizations';

const getBearerToken = (request: NextRequest): string | null => {
  const header = request.headers.get('authorization') ?? request.headers.get('Authorization');
  if (!header) {
    return null;
  }
  const [scheme, token] = header.split(' ');
  if (!scheme || scheme.toLowerCase() !== 'bearer' || !token) {
    return null;
  }
  return token;
};

const buildProfileResponse = (data: FirebaseFirestore.DocumentData | undefined, fallback: {
  uid: string;
  email: string | null | undefined;
  displayName: string | null | undefined;
}) => {
  const accountType =
    data?.accountType === 'organization' || data?.accountType === 'user' ? data.accountType : 'user';

  return {
    uid: fallback.uid,
    email: data?.email ?? fallback.email ?? null,
    displayName: data?.displayName ?? fallback.displayName ?? null,
    accountType,
    organizationName: data?.organizationName ?? null,
    createdAt: data?.createdAt ? data.createdAt.toISOString?.() ?? null : null,
    updatedAt: data?.updatedAt ? data.updatedAt.toISOString?.() ?? null : null,
  };
};

export async function GET(request: NextRequest) {
  try {
    const token = getBearerToken(request);
    if (!token) {
      return NextResponse.json({ error: 'Missing authorization token' }, { status: 401 });
    }

    const auth = getAdminAuth();
    const decoded = await auth.verifyIdToken(token);

    const db = getDb();
    const doc = await db.collection(PROFILE_COLLECTION).doc(decoded.uid).get();
    if (!doc.exists) {
      return NextResponse.json(
        buildProfileResponse(undefined, {
          uid: decoded.uid,
          email: decoded.email ?? null,
          displayName: decoded.name ?? null,
        }),
      );
    }

    return NextResponse.json(
      buildProfileResponse(doc.data(), {
        uid: decoded.uid,
        email: decoded.email ?? null,
        displayName: decoded.name ?? null,
      }),
    );
  } catch (error) {
    console.error('Failed to fetch auth profile', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = getBearerToken(request);
    if (!token) {
      return NextResponse.json({ error: 'Missing authorization token' }, { status: 401 });
    }

    const auth = getAdminAuth();
    const decoded = await auth.verifyIdToken(token);

    const payload = (await request.json().catch(() => null)) as Record<string, unknown> | null;
    if (!payload) {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const rawAccountType = payload.accountType;
    if (rawAccountType !== 'organization' && rawAccountType !== 'user') {
      return NextResponse.json({ error: 'Invalid account type' }, { status: 400 });
    }

    const displayName =
      typeof payload.displayName === 'string' && payload.displayName.trim()
        ? payload.displayName.trim()
        : decoded.name ?? '';

    const organizationName =
      rawAccountType === 'organization' && typeof payload.organizationName === 'string'
        ? payload.organizationName.trim()
        : null;

    if (rawAccountType === 'organization' && !organizationName) {
      return NextResponse.json({ error: 'Organization name is required' }, { status: 400 });
    }

    const organizationDetails =
      typeof payload.organizationDetails === 'string'
        ? payload.organizationDetails.trim()
        : '';

    const db = getDb();
    const userRef = db.collection(PROFILE_COLLECTION).doc(decoded.uid);
    const existing = await userRef.get();

    const now = new Date();
    const docData: Record<string, unknown> = {
      uid: decoded.uid,
      email: decoded.email ?? (typeof payload.email === 'string' ? payload.email.trim() : ''),
      displayName,
      accountType: rawAccountType,
      role: rawAccountType === 'organization' ? 'business' : 'student',
      updatedAt: now,
      createdAt: existing.exists ? existing.data()?.createdAt ?? now : now,
    };

    if (organizationName) {
      docData.organizationName = organizationName;
    }
    if (rawAccountType === 'organization' && organizationDetails) {
      docData.organizationDetails = organizationDetails;
    }

    await userRef.set(docData, { merge: true });

    if (rawAccountType === 'organization') {
      const orgRef = db.collection(ORGANIZATIONS_COLLECTION).doc(decoded.uid);
      const orgSnapshot = await orgRef.get();
      const existingOrg = orgSnapshot.exists ? orgSnapshot.data() ?? {} : {};
      await orgRef.set(
        {
          id: decoded.uid,
          name: organizationName,
          ownerUid: decoded.uid,
          contactEmail: docData.email,
          displayName,
          overview: organizationDetails,
           visibility: existingOrg.visibility ?? 'private',
           isVerified: existingOrg.isVerified ?? false,
           source: existingOrg.source ?? 'self-service',
          updatedAt: now,
          createdAt: existingOrg.createdAt ?? now,
        },
        { merge: true },
      );
    }

    return NextResponse.json(
      buildProfileResponse(
        {
          ...docData,
        },
        {
          uid: decoded.uid,
          email: (docData.email as string | null | undefined) ?? decoded.email ?? null,
          displayName,
        },
      ),
      { status: 200 },
    );
  } catch (error) {
    console.error('Failed to update auth profile', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
