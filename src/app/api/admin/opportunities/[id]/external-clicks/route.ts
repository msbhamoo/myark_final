import { NextResponse } from 'next/server';
import { getDb } from '@/lib/firebaseAdmin';
import { hasAdminSessionFromRequest } from '@/lib/adminSession';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const COLLECTION = 'external_registration_clicks';

export async function GET(
  request: Request,
  { params }: any,
) {
  if (!hasAdminSessionFromRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id: opportunityId } = params;
  if (!opportunityId) {
    return NextResponse.json({ error: 'Opportunity ID is required' }, { status: 400 });
  }

  try {
    const db = getDb();
    // Query by collecting all docs and filtering by opportunityId to avoid composite index requirement
    const snapshot = await db
      .collection(COLLECTION)
      .get();

    const items = snapshot.docs
      .map((doc) => doc.data())
      .filter((item) => item.opportunityId === opportunityId)
      .sort((a, b) => new Date(b.clickedAt).getTime() - new Date(a.clickedAt).getTime());

    return NextResponse.json({ items });
  } catch (error) {
    console.error('Failed to list external clicks', error);
    return NextResponse.json({ error: 'Failed to list external clicks' }, { status: 500 });
  }
}
