import { NextRequest, NextResponse } from 'next/server';
import { getOpportunities } from '@/lib/opportunityService';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const query = searchParams.get('q') || '';
        const limit = parseInt(searchParams.get('limit') || '12', 10);

        if (!query.trim()) {
            return NextResponse.json({ opportunities: [] });
        }

        const { opportunities } = await getOpportunities({
            search: query,
            limit: Math.min(limit, 50), // Cap at 50 results
        });

        // Filter out closed opportunities
        const now = new Date();
        const openOpportunities = opportunities.filter((opp) => {
            if (opp.status?.toLowerCase() === 'closed') {
                return false;
            }
            if (opp.registrationDeadline) {
                const deadline = new Date(opp.registrationDeadline);
                return deadline >= now;
            }
            return true;
        });

        // Sort by deadline (nearest first)
        const sorted = openOpportunities.sort((a, b) => {
            const getDeadlineTime = (opp: typeof a) => {
                if (!opp.registrationDeadline) return Infinity;
                return new Date(opp.registrationDeadline).getTime();
            };
            return getDeadlineTime(a) - getDeadlineTime(b);
        });

        return NextResponse.json({ opportunities: sorted });
    } catch (error) {
        console.error('Search API error:', error);
        return NextResponse.json(
            { error: 'Failed to search opportunities' },
            { status: 500 }
        );
    }
}
