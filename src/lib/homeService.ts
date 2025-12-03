import { getDb } from '@/lib/firebaseAdmin';
import { getOpportunities } from '@/lib/opportunityService';
import type { Opportunity } from '@/types/opportunity';
import { FALLBACK_HOME_SEGMENTS } from '@/constants/homeSegments';
import { INDIAN_STATES, INDIAN_STATES_SET } from '@/constants/india';
import type { Firestore, Query } from 'firebase-admin/firestore';

// --- Types ---

export type HomeSegment = {
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

// --- Constants ---

const SEGMENTS_COLLECTION = 'homeSegments';
const CONFIG_COLLECTION = 'config';
const CONFIG_DOC_ID = 'homeStats';
const DEFAULT_MULTIPLIER = 1;

const FALLBACK_HOME_STATS = {
    students: 500_000,
    organizations: 2_500,
    verifiedSchools: 1_200,
    activeOpportunities: 120,
};

const FETCH_LIMIT_STATES = 200;
const MAX_OPPORTUNITIES_PER_STATE = 8;

// --- Helper Functions ---

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

const toMultiplier = (value: unknown): number => {
    if (typeof value === 'number' && Number.isFinite(value) && value > 0) {
        return value;
    }
    if (typeof value === 'string') {
        const parsed = Number(value);
        if (Number.isFinite(parsed) && parsed > 0) {
            return parsed;
        }
    }
    return DEFAULT_MULTIPLIER;
};

const applyMultiplier = (value: number, multiplier: number) => {
    const scaled = value * multiplier;
    if (!Number.isFinite(scaled) || scaled <= 0) {
        return 0;
    }
    return Math.round(scaled);
};

const countQuery = async (query: Query): Promise<number> => {
    try {
        const snapshot = await query.count().get();
        return snapshot.data().count ?? 0;
    } catch (error) {
        console.error('Failed to execute aggregate count query', error);
        return 0;
    }
};

// --- Service Functions ---

export async function getHomeSegments(): Promise<HomeSegment[]> {
    try {
        const db = getDb();
        const snapshot = await db.collection(SEGMENTS_COLLECTION).orderBy('order', 'asc').get();

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

        const loadQuizzesForSegment = async (
            segmentKey: string,
            limit: number,
        ): Promise<any[]> => {
            if (!segmentKey) return [];

            try {
                const db = getDb();
                const snapshot = await db
                    .collection('quizzes')
                    .where('homeSegmentId', '==', segmentKey)
                    .where('visibility', '==', 'published')
                    .limit(limit * 2) // Fetch more to sort client-side
                    .get();

                const quizzes = snapshot.docs
                    .map(doc => ({
                        id: doc.id,
                        type: 'quiz',
                        ...doc.data(),
                    }))
                    // Sort by createdAt client-side
                    .sort((a: any, b: any) => {
                        const dateA = new Date(a.createdAt || 0).getTime();
                        const dateB = new Date(b.createdAt || 0).getTime();
                        return dateB - dateA; // Newest first
                    })
                    .slice(0, limit);

                return quizzes;
            } catch (error) {
                console.error(`Failed to load quizzes for segment "${segmentKey}"`, error);
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
                const [opportunities, quizzes] = await Promise.all([
                    loadOpportunitiesForSegment(segment.segmentKey, segment.limit),
                    loadQuizzesForSegment(segment.segmentKey, Math.ceil(segment.limit / 2)),
                ]);

                // Combine opportunities and quizzes, limited to segment.limit total
                const combined = [...opportunities, ...quizzes]
                    .slice(0, segment.limit);

                return {
                    ...segment,
                    opportunities: combined, // Contains both opportunities and quizzes
                };
            }),
        );

        const visibleSegments = segmentsWithOpportunities
            .filter((segment) => segment.opportunities.length > 0)
            .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));

        return visibleSegments;
    } catch (error) {
        console.error('Failed to fetch home segments', error);
        return FALLBACK_HOME_SEGMENTS.map(s => ({ ...s, opportunities: [] }));
    }
}

export async function getHomeStats() {
    try {
        const db = getDb();

        const getMultiplier = async (db: Firestore) => {
            const doc = await db.collection(CONFIG_COLLECTION).doc(CONFIG_DOC_ID).get().catch(() => null);
            if (!doc || !doc.exists) {
                return DEFAULT_MULTIPLIER;
            }
            return toMultiplier(doc.data()?.multiplier);
        };

        const getStudentsCount = (db: Firestore) =>
            countQuery(db.collection('users').where('accountType', '==', 'user'));

        const getOrganizationsCount = (db: Firestore) => countQuery(db.collection('organizers'));

        const getVerifiedSchoolsCount = async (db: Firestore) => {
            const primary = await countQuery(db.collection('schools').where('isVerified', '==', true));
            if (primary > 0) {
                return primary;
            }
            // Backward compatibility for legacy field name
            return countQuery(db.collection('schools').where('is_verified', '==', true));
        };

        const getActiveOpportunitiesCount = async (db: Firestore) => {
            try {
                const query = db.collection('opportunities').where('status', 'in', ['approved', 'published']);
                const snapshot = await query.count().get();
                return snapshot.data().count ?? 0;
            } catch (error) {
                console.warn('Failed to aggregate opportunities with IN filter, falling back to per-status queries', error);
            }

            const statuses: Array<'approved' | 'published'> = ['approved', 'published'];
            let total = 0;
            await Promise.all(
                statuses.map(async (status) => {
                    const count = await countQuery(db.collection('opportunities').where('status', '==', status));
                    total += count;
                }),
            );
            return total;
        };

        const [studentsRaw, organizationsRaw, verifiedSchoolsRaw, activeOpportunitiesRaw, multiplier] =
            await Promise.all([
                getStudentsCount(db),
                getOrganizationsCount(db),
                getVerifiedSchoolsCount(db),
                getActiveOpportunitiesCount(db),
                getMultiplier(db),
            ]);

        const stats = {
            students: applyMultiplier(studentsRaw || FALLBACK_HOME_STATS.students, multiplier),
            organizations: applyMultiplier(organizationsRaw || FALLBACK_HOME_STATS.organizations, multiplier),
            verifiedSchools: applyMultiplier(verifiedSchoolsRaw || FALLBACK_HOME_STATS.verifiedSchools, multiplier),
            activeOpportunities: applyMultiplier(
                activeOpportunitiesRaw || FALLBACK_HOME_STATS.activeOpportunities,
                multiplier,
            ),
        };

        return {
            stats,
            multiplier,
            raw: {
                students: studentsRaw,
                organizations: organizationsRaw,
                verifiedSchools: verifiedSchoolsRaw,
                activeOpportunities: activeOpportunitiesRaw,
            },
        };
    } catch (error) {
        console.error('Failed to fetch home stats', error);
        return { stats: FALLBACK_HOME_STATS, multiplier: 1, raw: {} };
    }
}

export async function getHomeStates() {
    try {
        const { opportunities } = await getOpportunities({ limit: FETCH_LIMIT_STATES });

        const grouped = new Map<string, Opportunity[]>();
        opportunities.forEach((opportunity) => {
            const state = opportunity.state;
            if (!state) {
                return;
            }
            const trimmed = state.trim();
            if (!INDIAN_STATES_SET.has(trimmed as any)) {
                return;
            }
            if (!grouped.has(trimmed)) {
                grouped.set(trimmed, []);
            }
            grouped.get(trimmed)!.push(opportunity);
        });

        const stateOrder = new Map(INDIAN_STATES.map((state, index) => [state, index]));

        const items = Array.from(grouped.entries())
            .map(([state, list]) => ({
                state,
                count: list.length,
                opportunities: list.slice(0, MAX_OPPORTUNITIES_PER_STATE),
            }))
            .sort((a, b) => {
                const orderA = stateOrder.get(a.state as any) ?? Number.MAX_SAFE_INTEGER;
                const orderB = stateOrder.get(b.state as any) ?? Number.MAX_SAFE_INTEGER;
                if (orderA !== orderB) {
                    return orderA - orderB;
                }
                return a.state.localeCompare(b.state);
            });

        return items;
    } catch (error) {
        console.error('Failed to fetch state opportunities', error);
        return [];
    }
}
