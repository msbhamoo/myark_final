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
  {
    requireSegmentKey = true,
    defaultValues = {},
  }: {
    requireSegmentKey?: boolean;
    defaultValues?: Partial<{
      segmentKey: string;
      title: string;
      subtitle: string;
      limit: number;
      order: number;
      highlight: boolean;
      isVisible: boolean;
    }>;
  } = {},
) => {
  if (!payload) {
    throw new Error('Invalid JSON body');
  }

  const segmentKey = toTrimmedString(payload.segmentKey ?? defaultValues.segmentKey ?? '');
  if (requireSegmentKey && !segmentKey) {
    throw new Error('Segment key is required');
  }

  const title = toTrimmedString(payload.title ?? defaultValues.title ?? '');
  if (!title) {
    throw new Error('Title is required');
  }

  const subtitle = toTrimmedString(payload.subtitle ?? defaultValues.subtitle ?? '');
  const limit = toNumber(payload.limit, defaultValues.limit ?? 8, MIN_LIMIT, MAX_LIMIT);
  const order = toNumber(payload.order, defaultValues.order ?? 0, MIN_ORDER, MAX_ORDER);
  const highlight = toBoolean(
    payload.highlight ?? defaultValues.highlight ?? false,
    defaultValues.highlight ?? false,
  );
  const isVisible = toBoolean(
    payload.isVisible ?? defaultValues.isVisible ?? true,
    defaultValues.isVisible ?? true,
  );

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

const buildSegmentResponse = (
  data: {
    id: string | null;
    segmentKey: string;
    title: string;
    subtitle: string;
    limit: number;
    order: number;
    highlight: boolean;
    isVisible: boolean;
    isDefault: boolean;
    defaultId: string | null;
    persisted: boolean;
  },
) => data;

export async function GET(request: NextRequest) {
  if (!hasAdminSessionFromRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const db = getDb();
    const snapshot = await db.collection(COLLECTION).orderBy('order', 'asc').get().catch(() => null);

    const fallbackByKey = new Map(
      FALLBACK_HOME_SEGMENTS.map((segment) => [segment.segmentKey.toLowerCase(), segment]),
    );

    const items: ReturnType<typeof buildSegmentResponse>[] = [];
    const seenKeys = new Set<string>();

    snapshot?.docs.forEach((doc) => {
      const data = doc.data() ?? {};
      const rawKey = toTrimmedString(data.segmentKey);
      const normalizedKey = rawKey.toLowerCase();
      const fallback = normalizedKey ? fallbackByKey.get(normalizedKey) : undefined;

      const response = buildSegmentResponse({
        id: doc.id,
        segmentKey: rawKey || fallback?.segmentKey || '',
        title: toTrimmedString(data.title) || fallback?.title || '',
        subtitle: toTrimmedString(data.subtitle) || fallback?.subtitle || '',
        limit: toNumber(data.limit, fallback?.limit ?? 8, MIN_LIMIT, MAX_LIMIT),
        order: toNumber(data.order, fallback?.order ?? 0, MIN_ORDER, MAX_ORDER),
        highlight: toBoolean(data.highlight, fallback?.highlight ?? false),
        isVisible: toBoolean(data.isVisible, true),
        isDefault: Boolean(fallback),
        defaultId: fallback?.id ?? null,
        persisted: true,
      });

      const key = response.segmentKey.toLowerCase() || doc.id;
      seenKeys.add(key);
      items.push(response);
    });

    FALLBACK_HOME_SEGMENTS.forEach((fallback) => {
      const key = fallback.segmentKey.toLowerCase();
      if (!seenKeys.has(key)) {
        items.push(
          buildSegmentResponse({
            id: null,
            segmentKey: fallback.segmentKey,
            title: fallback.title,
            subtitle: fallback.subtitle ?? '',
            limit: fallback.limit,
            order: fallback.order,
            highlight: fallback.highlight ?? false,
            isVisible: true,
            isDefault: true,
            defaultId: fallback.id,
            persisted: false,
          }),
        );
        seenKeys.add(key);
      }
    });

    items.sort((a, b) => {
      const orderDiff = a.order - b.order;
      if (orderDiff !== 0) {
        return orderDiff;
      }
      return a.segmentKey.localeCompare(b.segmentKey);
    });

    return NextResponse.json({ items });
  } catch (error) {
    console.error('Failed to fetch home segments', error);
    return NextResponse.json({ error: 'Failed to fetch segments' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!hasAdminSessionFromRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const payload = (await request.json().catch(() => null)) as RawPayload | null;
    const normalized = normalizeSegmentPayload(payload, { requireSegmentKey: true });

    const db = getDb();
    const now = new Date();
    const docRef = await db.collection(COLLECTION).add({
      ...normalized,
      createdAt: now,
      updatedAt: now,
    });

    revalidateTag('opportunities', 'max');

    return NextResponse.json(
      {
        id: docRef.id,
        ...normalized,
        isDefault: FALLBACK_HOME_SEGMENTS.some(
          (segment) => segment.segmentKey.toLowerCase() === normalized.segmentKey.toLowerCase(),
        ),
        defaultId:
          FALLBACK_HOME_SEGMENTS.find(
            (segment) => segment.segmentKey.toLowerCase() === normalized.segmentKey.toLowerCase(),
          )?.id ?? null,
        persisted: true,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Failed to create home segment', error);
    const message = error instanceof Error ? error.message : 'Failed to create home segment';
    const lowered = message.toLowerCase();
    const isClientError =
      lowered.includes('required') || lowered.includes('invalid') || lowered.includes('json');
    return NextResponse.json({ error: message }, { status: isClientError ? 400 : 500 });
  }
}
