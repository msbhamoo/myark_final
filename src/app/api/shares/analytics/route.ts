import { getDb } from '@/lib/firebaseAdmin';
import { NextResponse } from 'next/server';
import type { ShareRecord } from '@/types/shareTracking';

const SHARES_COLLECTION = 'shares';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const opportunityId = searchParams.get('opportunityId');

    const adminDb = getDb();
    let query: FirebaseFirestore.Query<FirebaseFirestore.DocumentData> = adminDb.collection(SHARES_COLLECTION);

    // Filter by date range
    if (startDate) {
      query = query.where('sharedAt', '>=', startDate);
    }
    if (endDate) {
      query = query.where('sharedAt', '<=', endDate);
    }

    // Filter by opportunity
    if (opportunityId) {
      query = query.where('opportunityId', '==', opportunityId);
    }

    const snapshot = await query.get();
    const shares: ShareRecord[] = snapshot.docs.map(doc => doc.data() as ShareRecord);

    // Calculate metrics
    const totalShares = shares.length;
    const totalClicks = shares.reduce((sum, share) => sum + share.clickCount, 0);
    const totalConversions = shares.reduce((sum, share) =>
      sum + share.conversions.viewed + share.conversions.registered + share.conversions.bookmarked, 0
    );

    const clickThroughRate = totalShares > 0 ? (totalClicks / totalShares) * 100 : 0;
    const conversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;

    // Share breakdown
    const authenticatedShares = shares.filter(s => s.sharedBy.isAuthenticated).length;
    const anonymousShares = totalShares - authenticatedShares;

    // Conversion breakdown
    const viewedCount = shares.reduce((sum, s) => sum + s.conversions.viewed, 0);
    const registeredCount = shares.reduce((sum, s) => sum + s.conversions.registered, 0);
    const bookmarkedCount = shares.reduce((sum, s) => sum + s.conversions.bookmarked, 0);

    // Top sharers (authenticated only)
    const userSharesMap = new Map<string, {
      userId: string;
      userName: string;
      userEmail: string;
      shares: number;
      clicks: number;
      conversions: number;
    }>();

    shares.forEach(share => {
      if (share.sharedBy.isAuthenticated && share.sharedBy.userId) {
        const existing = userSharesMap.get(share.sharedBy.userId) || {
          userId: share.sharedBy.userId,
          userName: share.sharedBy.userName || 'Unknown',
          userEmail: share.sharedBy.userEmail || '',
          shares: 0,
          clicks: 0,
          conversions: 0,
        };

        existing.shares += 1;
        existing.clicks += share.clickCount;
        existing.conversions += share.conversions.viewed + share.conversions.registered + share.conversions.bookmarked;

        userSharesMap.set(share.sharedBy.userId, existing);
      }
    });

    const topSharers = Array.from(userSharesMap.values())
      .map(user => ({
        ...user,
        conversionRate: user.clicks > 0 ? (user.conversions / user.clicks) * 100 : 0,
      }))
      .sort((a, b) => b.shares - a.shares)
      .slice(0, 10);

    // Recent shares
    const recentShares = shares
      .sort((a, b) => new Date(b.sharedAt).getTime() - new Date(a.sharedAt).getTime())
      .slice(0, 20);

    // Shares over time (group by date)
    const sharesOverTime = shares.reduce((acc, share) => {
      const date = share.sharedAt.split('T')[0]; // Get date part only
      const existing = acc.find(item => item.date === date);

      if (existing) {
        existing.shares += 1;
        existing.clicks += share.clickCount;
        existing.conversions += share.conversions.viewed + share.conversions.registered + share.conversions.bookmarked;
      } else {
        acc.push({
          date,
          shares: 1,
          clicks: share.clickCount,
          conversions: share.conversions.viewed + share.conversions.registered + share.conversions.bookmarked,
        });
      }

      return acc;
    }, [] as Array<{ date: string; shares: number; clicks: number; conversions: number; }>)
      .sort((a, b) => a.date.localeCompare(b.date));

    return NextResponse.json({
      totalShares,
      totalClicks,
      totalConversions,
      clickThroughRate: Math.round(clickThroughRate * 10) / 10,
      conversionRate: Math.round(conversionRate * 10) / 10,
      shareBreakdown: {
        authenticated: authenticatedShares,
        anonymous: anonymousShares,
      },
      conversionBreakdown: {
        viewed: viewedCount,
        registered: registeredCount,
        bookmarked: bookmarkedCount,
      },
      topSharers,
      recentShares,
      sharesOverTime,
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
