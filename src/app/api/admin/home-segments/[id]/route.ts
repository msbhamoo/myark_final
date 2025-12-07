import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { getDb } from '@/lib/firebaseAdmin';
import { hasAdminSessionFromRequest } from '@/lib/adminSession';
import { FALLBACK_HOME_SEGMENTS } from '@/constants/homeSegments';

const COLLECTION = 'homeSegments';
const MIN_LIMIT = 1;
const MAX_LIMIT = 50;
const MIN_ORDER = -1000;
const MAX_ORDER = 1000;

type RawPayload = Record<string, unknown>;

const toTrimmedString = (value: unknown) => (typeof value === 'string' ? value.trim() : '');

const toBoolean = (value: unknown, fallback: boolean) => {
  if (typeof value === 'boolean') {
    return value;
  }
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (normalized === 'true') return true;
    if (normalized === 'false') return false;
  }
  if (typeof value === 'number') {
    return value !== 0;
  }
  return fallback;
};

const clampNumber = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const toNumber = (value: unknown, fallback: number, min: number, max: number) => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return clampNumber(value, min, max);
  }
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value.trim());
    if (Number.isFinite(parsed)) {
      return clampNumber(parsed, min, max);
    }
  }
  return clampNumber(fallback, min, max);
};

const normalizeSegmentPayload = (
  payload: RawPayload | null,
  defaultValues: {
    segmentKey: string;
    title: string;
    subtitle: string;
    limit: number;
    order: number;
    highlight: boolean;
    isVisible: boolean;
  },
) => {
  if (!payload) {
    throw new Error('Invalid JSON body');
  }

  const segmentKey = toTrimmedString(payload.segmentKey ?? defaultValues.segmentKey);
  if (!segmentKey) {
    throw new Error('Segment key is required');
  }

  const title = toTrimmedString(payload.title ?? defaultValues.title);
  if (!title) {
    throw new Error('Title is required');
  }

  const subtitle = toTrimmedString(payload.subtitle ?? defaultValues.subtitle);
  const limit = toNumber(payload.limit, defaultValues.limit, MIN_LIMIT, MAX_LIMIT);
  const order = toNumber(payload.order, defaultValues.order, MIN_ORDER, MAX_ORDER);
  const highlight = toBoolean(payload.highlight ?? defaultValues.highlight, defaultValues.highlight);
  const isVisible = toBoolean(payload.isVisible ?? defaultValues.isVisible, defaultValues.isVisible);

  return {
    segmentKey,
    title,
    subtitle,
    limit,
    order,
    highlight,
    isVisible,
  };
};

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  if (!hasAdminSessionFromRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await context.params;
  if (!id) {
    return NextResponse.json({ error: 'Invalid segment id' }, { status: 400 });
  }

  try {
    const db = getDb();
    const docRef = db.collection(COLLECTION).doc(id);
    const snapshot = await docRef.get();
    if (!snapshot.exists) {
      return NextResponse.json({ error: 'Segment not found' }, { status: 404 });
    }

    const data = snapshot.data() ?? {};
    const existingKey = toTrimmedString(data.segmentKey);
    const fallback = existingKey
      ? FALLBACK_HOME_SEGMENTS.find(
        (segment) => segment.segmentKey.toLowerCase() === existingKey.toLowerCase(),
      )
      : undefined;

    const defaults = {
      segmentKey: existingKey || fallback?.segmentKey || '',
      title: toTrimmedString(data.title) || fallback?.title || '',
      subtitle: toTrimmedString(data.subtitle) || fallback?.subtitle || '',
      limit: toNumber(data.limit, fallback?.limit ?? 8, MIN_LIMIT, MAX_LIMIT),
      order: toNumber(data.order, fallback?.order ?? 0, MIN_ORDER, MAX_ORDER),
      highlight: toBoolean(data.highlight, fallback?.highlight ?? false),
      isVisible: toBoolean(data.isVisible, true),
    };

    const payload = (await request.json().catch(() => null)) as RawPayload | null;
    const normalized = normalizeSegmentPayload(payload, defaults);

    const now = new Date();
    await docRef.set(
      {
        ...normalized,
        updatedAt: now,
      },
      { merge: true },
    );

    revalidateTag('opportunities', 'max');

    const isDefault = FALLBACK_HOME_SEGMENTS.some(
      (segment) => segment.segmentKey.toLowerCase() === normalized.segmentKey.toLowerCase(),
    );
    const defaultId =
      FALLBACK_HOME_SEGMENTS.find(
        (segment) => segment.segmentKey.toLowerCase() === normalized.segmentKey.toLowerCase(),
      )?.id ?? null;

    return NextResponse.json({
      id,
      ...normalized,
      isDefault,
      defaultId,
      persisted: true,
    });
  } catch (error) {
    console.error(`Failed to update home segment ${id}`, error);
    const message = error instanceof Error ? error.message : 'Failed to update segment';
    const lowered = message.toLowerCase();
    const isClientError =
      lowered.includes('required') || lowered.includes('invalid') || lowered.includes('json');
    return NextResponse.json({ error: message }, { status: isClientError ? 400 : 500 });
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  if (!hasAdminSessionFromRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await context.params;
  if (!id) {
    return NextResponse.json({ error: 'Invalid segment id' }, { status: 400 });
  }

  try {
    const db = getDb();
    const docRef = db.collection(COLLECTION).doc(id);
    const snapshot = await docRef.get();
    if (!snapshot.exists) {
      return NextResponse.json({ error: 'Segment not found' }, { status: 404 });
    }

    await docRef.delete();
    revalidateTag('opportunities', 'max');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Failed to delete home segment ${id}`, error);
    return NextResponse.json({ error: 'Failed to delete segment' }, { status: 500 });
  }
}
