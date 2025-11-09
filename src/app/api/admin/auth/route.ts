import { NextResponse } from 'next/server';
import { applyAdminSessionCookie, clearAdminSessionCookie, getExpectedSession } from '@/lib/adminSession';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const expected = getExpectedSession();
  if (!expected) {
    return NextResponse.json(
      { error: 'Admin secret is not configured.' },
      { status: 500 },
    );
  }

  const body = await request.json().catch(() => null) as { password?: string } | null;
  const password = body?.password;

  if (!password) {
    return NextResponse.json({ error: 'Password is required.' }, { status: 400 });
  }

  if (password !== process.env.ADMIN_PANEL_SECRET) {
    return NextResponse.json({ error: 'Invalid password.' }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  applyAdminSessionCookie(response);
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  clearAdminSessionCookie(response);
  return response;
}
