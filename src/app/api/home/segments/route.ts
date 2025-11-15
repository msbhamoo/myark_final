import { NextResponse } from 'next/server';
import { getDb } from '@/lib/firebaseAdmin';
import { getOpportunities } from '@/lib/opportunityService';
import type { Opportunity } from '@/types/opportunity';
import { FALLBACK_HOME_SEGMENTS } from '@/constants/homeSegments';

type HomeSegment = {
  id: string;
  title: string;
  subtitle?: string;
  segmentKey: string;
  limit: number;
  order: number;
  highlight?: boolean;
  opportunities: Opportunity[];
};

type HomeSegmentMeta = Omit<HomeSegment, 'opportunities'>;

const COLLECTION = 'homeSegments';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const toNumber = (value: unknown, fallback: number) => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  return fallback;
};

export async function GET() {
  try {
    const db = getDb();
    const snapshot = await db.collection(COLLECTION).orderBy('order', 'asc').get();

    const fallbackByKey = new Map(
      FALLBACK_HOME_SEGMENTS.map((segment) => [segment.segmentKey.toLowerCase(), segment]),
    );

    const segmentCache = new Map<string, Awaited<ReturnType<typeof getOpportunities>>>();

    const ensureOpportunities = (segmentKey: string, limit: number) => {
      const cacheKey = `${segmentKey || 'default'}::${limit}`;
      if (!segmentCache.has(cacheKey)) {
        return getOpportunities(segmentKey ? { segment: segmentKey, limit } : { limit }).then((result) => {
          segmentCache.set(cacheKey, result);
          return result;
        });
      }
      return Promise.resolve(segmentCache.get(cacheKey)!);
    };

const loadOpportunitiesForSegment = async (
  segmentKey: string,
  limit: number,
): Promise<Opportunity[]> => {
  const key = segmentKey || '';
  try {
    const result = await ensureOpportunities(key, limit);
    const opportunities = result.opportunities.slice(0, limit);
    return opportunities;
  } catch (error) {
    console.error(`Failed to load opportunities for home segment "${segmentKey || 'default'}"`, error);
    const cacheKey = `${key || 'default'}::${limit}`;
    segmentCache.delete(cacheKey);
    return [];
  }
};

    const segmentsMap = new Map<string, HomeSegmentMeta>();
    const hiddenKeys = new Set<string>();

    snapshot.docs.forEach((doc) => {
      const data = doc.data();
      if (data.isVisible === false) {
        const hiddenKey = typeof data.segmentKey === 'string' ? data.segmentKey.trim().toLowerCase() : '';
        if (hiddenKey) {
          hiddenKeys.add(hiddenKey);
        }
        return;
      }

      const rawKey = typeof data.segmentKey === 'string' ? data.segmentKey.trim() : '';
      const normalizedKey = rawKey.toLowerCase();
      const mapKey = normalizedKey || doc.id;
      const fallback = fallbackByKey.get(normalizedKey);

      const entry: HomeSegmentMeta = {
        id: doc.id,
        title:
          typeof data.title === 'string' && data.title.trim()
            ? data.title.trim()
            : fallback?.title ?? '',
        subtitle:
          typeof data.subtitle === 'string' && data.subtitle.trim()
            ? data.subtitle.trim()
            : fallback?.subtitle,
        segmentKey: rawKey || fallback?.segmentKey || '',
        limit: toNumber(data.limit, fallback?.limit ?? 8),
        order: toNumber(data.order, fallback?.order ?? 0),
        highlight:
          data.highlight !== undefined
            ? Boolean(data.highlight)
            : fallback?.highlight ?? false,
      };

      const existing = segmentsMap.get(mapKey);
      if (!existing || entry.order < existing.order) {
        segmentsMap.set(mapKey, entry);
      }
    });

    FALLBACK_HOME_SEGMENTS.forEach((fallback) => {
      const key = fallback.segmentKey.toLowerCase();
      if (hiddenKeys.has(key)) {
        return;
      }
      if (!segmentsMap.has(key)) {
        segmentsMap.set(key, { ...fallback });
      }
    });

    const segmentsList = Array.from(segmentsMap.values());

    const segmentsWithOpportunities = await Promise.all(
      segmentsList.map(async (segment) => {
        const opportunities = await loadOpportunitiesForSegment(segment.segmentKey, segment.limit);
        return {
          ...segment,
          opportunities,
        };
      }),
    );

    const visibleSegments = segmentsWithOpportunities
      .filter((segment) => segment.opportunities.length > 0)
      .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));

    return NextResponse.json({ items: visibleSegments });
  } catch (error) {
    console.error('Failed to fetch home segments', error);
    return NextResponse.json({ error: 'Failed to fetch home segments' }, { status: 500 });
  }
}
