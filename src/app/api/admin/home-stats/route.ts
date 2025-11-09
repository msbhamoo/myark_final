import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/firebaseAdmin';
import { hasAdminSessionFromRequest } from '@/lib/adminSession';

const CONFIG_COLLECTION = 'config';
const CONFIG_DOC_ID = 'homeStats';
const DEFAULT_MULTIPLIER = 1;
const MIN_MULTIPLIER = 1;
const MAX_MULTIPLIER = 10;

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const normalizeMultiplier = (value: unknown) => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value.trim());
    if (Number.isFinite(parsed)) {
      return parsed;
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
    const doc = await db.collection(CONFIG_COLLECTION).doc(CONFIG_DOC_ID).get().catch(() => null);
    const rawMultiplier = doc?.exists ? doc.data()?.multiplier : undefined;
    const multiplierCandidate = normalizeMultiplier(rawMultiplier);
    const multiplier =
      multiplierCandidate && multiplierCandidate > 0 ? Math.min(Math.max(multiplierCandidate, MIN_MULTIPLIER), MAX_MULTIPLIER) : DEFAULT_MULTIPLIER;

    return NextResponse.json({ multiplier });
  } catch (error) {
    console.error('Failed to load home stats settings', error);
    return NextResponse.json({ error: 'Failed to load settings' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  if (!hasAdminSessionFromRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const payload = (await request.json().catch(() => null)) as Record<string, unknown> | null;
    if (!payload) {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const normalized = normalizeMultiplier(payload.multiplier);
    if (normalized === null) {
      return NextResponse.json({ error: 'Multiplier must be a number' }, { status: 400 });
    }

    const clamped = Math.min(Math.max(normalized, MIN_MULTIPLIER), MAX_MULTIPLIER);

    const db = getDb();
    const docRef = db.collection(CONFIG_COLLECTION).doc(CONFIG_DOC_ID);
    const now = new Date();
    await docRef.set(
      {
        multiplier: clamped,
        updatedAt: now,
      },
      { merge: true },
    );

    return NextResponse.json({ multiplier: clamped });
  } catch (error) {
    console.error('Failed to update home stats settings', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
