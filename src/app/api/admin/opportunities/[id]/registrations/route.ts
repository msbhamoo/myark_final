import { NextResponse } from 'next/server';
import { getDb } from '@/lib/firebaseAdmin';
import { hasAdminSessionFromRequest } from '@/lib/adminSession';
import { OpportunityRegistrationRecord } from '@/types/opportunity';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const COLLECTION = 'opportunity_registrations';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!hasAdminSessionFromRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id: opportunityId } = await params;
  if (!opportunityId) {
    return NextResponse.json({ error: 'Opportunity ID is required' }, { status: 400 });
  }

  try {
    const db = getDb();
    // Query by collecting all docs and filtering by opportunityId to avoid composite index requirement
    const snapshot = await db
      .collection(COLLECTION)
      .get();

    const items: OpportunityRegistrationRecord[] = snapshot.docs
      .map((doc) => {
        const data = doc.data();
        return {
          studentUid: data.studentUid,
          studentName: data.studentName,
          studentEmail: data.studentEmail,
          className: data.className,
          schoolName: data.schoolName,
          profileSlug: data.profileSlug,
          registeredAt: data.registeredAt,
          opportunityId: data.opportunityId,
        };
      })
      .filter((item) => item.opportunityId === opportunityId)
      .sort((a, b) => new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime());

    return NextResponse.json({ items });
  } catch (error) {
    console.error('Failed to list registrations', error);
    return NextResponse.json({ error: 'Failed to list registrations' }, { status: 500 });
  }
}
