import { NextResponse } from 'next/server';
import { getDb } from '@/lib/firebaseAdmin';
import {
  SLUG_REGEX,
  STUDENT_PROFILE_COLLECTION,
  buildPublicStudentProfile,
} from '@/lib/studentProfileServer';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(_request: Request, ctx: any) {
  try {
    const params = (ctx && ctx.params) as { slug?: string | string[] } | undefined;
    const slugParam = params?.slug;
    const rawSlug = Array.isArray(slugParam) ? slugParam[0] : slugParam ?? '';
    const normalized = rawSlug.trim().toLowerCase();

    if (!normalized || !SLUG_REGEX.test(normalized)) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const db = getDb();
    const snapshot = await db
      .collection(STUDENT_PROFILE_COLLECTION)
      .where('slug', '==', normalized)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const doc = snapshot.docs[0]!;
    const data = doc.data() ?? {};

    const profile = buildPublicStudentProfile(data, data.displayName ?? 'Student');

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    return NextResponse.json({ item: profile });
  } catch (error) {
    console.error('Failed to fetch public student profile', error);
    return NextResponse.json({ error: 'Failed to load student profile' }, { status: 500 });
  }
}
