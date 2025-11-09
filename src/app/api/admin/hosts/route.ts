import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/firebaseAdmin';
import { hasAdminSessionFromRequest } from '@/lib/adminSession';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const USERS_COLLECTION = 'users';
const ORGANIZATIONS_COLLECTION = 'organizations';
const OPPORTUNITIES_COLLECTION = 'opportunities';

const toIsoString = (value: unknown): string | null => {
  if (!value) return null;
  if (value instanceof Date) return value.toISOString();
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && value && 'toDate' in value) {
    const dateValue = (value as { toDate?: () => Date | null }).toDate?.();
    if (dateValue instanceof Date && !Number.isNaN(dateValue.getTime())) {
      return dateValue.toISOString();
    }
  }
  return null;
};

export async function GET(request: NextRequest) {
  if (!hasAdminSessionFromRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const db = getDb();
    const snapshot = await db
      .collection(USERS_COLLECTION)
      .where('accountType', '==', 'organization')
      .limit(200)
      .get();

    const hosts = await Promise.all(
      snapshot.docs.map(async (doc) => {
        const data = doc.data();
        const orgRef = db.collection(ORGANIZATIONS_COLLECTION).doc(doc.id);
        const orgDoc = await orgRef.get();
        const orgData = orgDoc.exists ? orgDoc.data() ?? {} : {};

        const submissionsSnapshot = await db
          .collection(OPPORTUNITIES_COLLECTION)
          .where('submittedBy', '==', doc.id)
          .limit(200)
          .get();

        const stats = submissionsSnapshot.docs.reduce(
          (acc, submission) => {
            acc.total += 1;
            const status = submission.data()?.status ?? 'pending';
            if (status === 'published' || status === 'approved') {
              acc.approved += 1;
            } else if (status === 'pending') {
              acc.pending += 1;
            } else if (status === 'rejected') {
              acc.rejected += 1;
            }
            return acc;
          },
          { total: 0, approved: 0, pending: 0, rejected: 0 },
        );

        return {
          id: doc.id,
          email: data.email ?? '',
          accountType: data.accountType ?? 'organization',
          role: data.role ?? 'business',
          displayName: data.displayName ?? '',
          organizationName: data.organizationName ?? '',
          organizationDetails: data.organizationDetails ?? '',
          createdAt: toIsoString(data.createdAt),
          updatedAt: toIsoString(data.updatedAt),
          organizer: {
            name: orgData.name ?? data.organizationName ?? '',
            overview: orgData.overview ?? '',
            contactEmail: orgData.contactEmail ?? data.email ?? '',
            visibility: orgData.visibility ?? 'private',
            isVerified: Boolean(orgData.isVerified),
            updatedAt: toIsoString(orgData.updatedAt),
          },
          stats,
        };
      }),
    );

    hosts.sort((a, b) => {
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bTime - aTime;
    });

    return NextResponse.json({ items: hosts });
  } catch (error) {
    console.error('Failed to list hosts', error);
    return NextResponse.json({ error: 'Failed to list hosts' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  if (!hasAdminSessionFromRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const payload = (await request.json().catch(() => null)) as Record<string, unknown> | null;
    if (!payload) {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const id = typeof payload.id === 'string' ? payload.id.trim() : '';
    if (!id) {
      return NextResponse.json({ error: 'Host id is required' }, { status: 400 });
    }

    const visibility =
      payload.visibility === 'public' || payload.visibility === 'private'
        ? payload.visibility
        : undefined;
    const isVerified =
      payload.isVerified === undefined ? undefined : Boolean(payload.isVerified);

    if (visibility === undefined && isVerified === undefined) {
      return NextResponse.json({ error: 'Nothing to update' }, { status: 400 });
    }

    const db = getDb();
    const orgRef = db.collection(ORGANIZATIONS_COLLECTION).doc(id);
    const orgDoc = await orgRef.get();
    if (!orgDoc.exists) {
      return NextResponse.json({ error: 'Host organization not found' }, { status: 404 });
    }

    const updates: Record<string, unknown> = { updatedAt: new Date() };
    if (visibility !== undefined) {
      updates.visibility = visibility;
    }
    if (isVerified !== undefined) {
      updates.isVerified = isVerified;
    }

    await orgRef.set(updates, { merge: true });
    const updatedDoc = await orgRef.get();
    const orgData = updatedDoc.data() ?? {};

    return NextResponse.json({
      id,
      visibility: orgData.visibility ?? 'private',
      isVerified: Boolean(orgData.isVerified),
      updatedAt: toIsoString(orgData.updatedAt),
    });
  } catch (error) {
    console.error('Failed to update host', error);
    return NextResponse.json({ error: 'Failed to update host' }, { status: 500 });
  }
}
