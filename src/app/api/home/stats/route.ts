import { NextResponse } from 'next/server';
import { getDb } from '@/lib/firebaseAdmin';
import type { Firestore, Query } from 'firebase-admin/firestore';

const CONFIG_COLLECTION = 'config';
const CONFIG_DOC_ID = 'homeStats';
const DEFAULT_MULTIPLIER = 1;

const FALLBACK_HOME_STATS = {
  students: 500_000,
  organizations: 2_500,
  verifiedSchools: 1_200,
  activeOpportunities: 120,
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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

export async function GET() {
  try {
    const db = getDb();

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

    return NextResponse.json({
      stats,
      multiplier,
      raw: {
        students: studentsRaw,
        organizations: organizationsRaw,
        verifiedSchools: verifiedSchoolsRaw,
        activeOpportunities: activeOpportunitiesRaw,
      },
    });
  } catch (error) {
    console.error('Failed to fetch home stats', error);
    return NextResponse.json({ stats: FALLBACK_HOME_STATS }, { status: 200 });
  }
}
