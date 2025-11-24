import { NextResponse } from 'next/server';
import { applyAdminSessionCookie, clearAdminSessionCookie } from '@/lib/adminSession';
import { getDb } from '@/lib/firebaseAdmin';
import bcrypt from 'bcrypt';
import { UserRole } from '@/types/user';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const { identifier, password } = body || {};

  if (!identifier || !password) {
    return NextResponse.json({ error: 'Email/Username and password are required.' }, { status: 400 });
  }

  // 1. Check Default Superadmin
  if (identifier === 'admin' && password === '123') {
    const response = NextResponse.json({ success: true });
    applyAdminSessionCookie(response, {
      userId: 'superadmin',
      email: 'admin',
      role: 'superadmin',
    });
    return response;
  }

  // 2. Check Firestore Users
  try {
    const db = getDb();
    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('email', '==', identifier).limit(1).get();

    if (snapshot.empty) {
      return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
    }

    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();

    if (!userData.passwordHash) {
      return NextResponse.json({ error: 'This account does not have admin access configured.' }, { status: 401 });
    }

    const match = await bcrypt.compare(password, userData.passwordHash);
    if (!match) {
      return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
    }

    const role = (userData.role || 'student') as UserRole;
    const allowedRoles: UserRole[] = ['admin_manager', 'superadmin'];

    if (!allowedRoles.includes(role)) {
      return NextResponse.json({ error: 'Access denied. Insufficient permissions.' }, { status: 403 });
    }

    const response = NextResponse.json({ success: true });
    applyAdminSessionCookie(response, {
      userId: userDoc.id,
      email: userData.email,
      role: role,
      permissions: userData.permissions || [],
    });
    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  clearAdminSessionCookie(response);
  return response;
}
