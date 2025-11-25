import { NextResponse } from 'next/server';
import { getDb } from '@/lib/firebaseAdmin';
import { hasAdminSessionFromRequest } from '@/lib/adminSession';
import type { QueryDocumentSnapshot } from 'firebase-admin/firestore';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const COLLECTION = 'users';

const serializeDoc = (doc: QueryDocumentSnapshot) => {
  const data = doc.data();
  // Infer role from accountType if role is missing
  let role = data.role;
  if (!role) {
    if (data.accountType === 'organization') role = 'organizer';
    else if (data.accountType === 'user') role = 'student';
    else role = 'student'; // Fallback
  }

  return {
    id: doc.id,
    email: data.email ?? '',
    role,
    firstName: data.first_name ?? data.firstName ?? '',
    lastName: data.last_name ?? data.lastName ?? '',
    createdAt: data.createdAt?.toDate?.()?.toISOString() ?? data.createdAt ?? null,
    updatedAt: data.updatedAt?.toDate?.()?.toISOString() ?? data.updatedAt ?? null,
    // Analytics
    lastActiveAt: data.lastActiveAt?.toDate?.()?.toISOString() ?? null,
    profileCompletion: data.profileCompletionPercentage ?? 0,
    opportunitiesViewed: data.opportunitiesViewed ?? 0,
    opportunitiesApplied: data.opportunitiesApplied ?? 0,
    opportunitiesCreated: data.opportunitiesCreated ?? 0,
  };
};

const normaliseRole = (role: unknown) => {
  if (typeof role !== 'string') {
    return 'student';
  }
  const value = role.trim();
  if (!value) return 'student';
  return value;
};

export async function GET(request: Request) {
  if (!hasAdminSessionFromRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const roleFilter = searchParams.get('role');

  try {
    const db = getDb();
    let items: any[] = [];

    if (roleFilter) {
      const queries: Promise<FirebaseFirestore.QuerySnapshot>[] = [];

      // 1. Primary Query: Filter by Role
      // REMOVED orderBy to avoid "FAILED_PRECONDITION: The query requires an index"
      let roleQuery: FirebaseFirestore.Query = db.collection(COLLECTION);
      if (roleFilter === 'organizer') {
        roleQuery = roleQuery.where('role', 'in', ['organizer', 'business']);
      } else {
        roleQuery = roleQuery.where('role', '==', roleFilter);
      }
      queries.push(roleQuery.limit(100).get());

      // 2. Secondary Query: Filter by Legacy accountType (if applicable)
      // REMOVED orderBy here as well
      if (roleFilter === 'student') {
        queries.push(db.collection(COLLECTION).where('accountType', '==', 'user').limit(100).get());
      } else if (roleFilter === 'organizer') {
        queries.push(db.collection(COLLECTION).where('accountType', '==', 'organization').limit(100).get());
      }

      const snapshots = await Promise.all(queries);
      const docMap = new Map<string, any>();

      snapshots.forEach(snap => {
        snap.docs.forEach(doc => {
          if (!docMap.has(doc.id)) {
            docMap.set(doc.id, serializeDoc(doc));
          }
        });
      });

      items = Array.from(docMap.values());

      // Re-sort in memory because merging might mess up order
      items.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });

    } else {
      // No role filter, just fetch all (default behavior, though UI always sends role)
      const snapshot = await db.collection(COLLECTION).orderBy('createdAt', 'desc').limit(200).get();
      items = snapshot.docs.map(serializeDoc);
    }

    return NextResponse.json({ items });
  } catch (error) {
    console.error('Failed to list users', error);
    return NextResponse.json({ error: 'Failed to list users' }, { status: 500 });
  }
}

import bcrypt from 'bcrypt';

export async function POST(request: Request) {
  if (!hasAdminSessionFromRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const payload = await request.json().catch(() => null) as Record<string, unknown> | null;
    if (!payload) {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const email = typeof payload.email === 'string' ? payload.email.trim() : '';
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const role = normaliseRole(payload.role);
    const password = typeof payload.password === 'string' ? payload.password : '';

    // If creating an admin, require password
    if ((role === 'admin_manager' || role === 'superadmin') && !password) {
      return NextResponse.json({ error: 'Password is required for admin users' }, { status: 400 });
    }

    const now = new Date();
    const docData: Record<string, any> = {
      email,
      role,
      firstName: typeof payload.firstName === 'string' ? payload.firstName.trim() : typeof payload.first_name === 'string' ? payload.first_name.trim() : '',
      lastName: typeof payload.lastName === 'string' ? payload.lastName.trim() : typeof payload.last_name === 'string' ? payload.last_name.trim() : '',
      createdAt: now,
      updatedAt: now,
    };

    if (password) {
      const salt = await bcrypt.genSalt(10);
      docData.passwordHash = await bcrypt.hash(password, salt);
    }

    // Save permissions if provided (and valid)
    if (Array.isArray(payload.permissions)) {
      docData.permissions = payload.permissions.filter(p => typeof p === 'string');
    }

    const db = getDb();

    // Check if user already exists
    const existing = await db.collection(COLLECTION).where('email', '==', email).limit(1).get();
    if (!existing.empty) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 409 });
    }

    const docRef = await db.collection(COLLECTION).add(docData);
    const docSnapshot = await docRef.get();
    return NextResponse.json({ item: serializeDoc(docSnapshot as QueryDocumentSnapshot) }, { status: 201 });
  } catch (error) {
    console.error('Failed to create user', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}
