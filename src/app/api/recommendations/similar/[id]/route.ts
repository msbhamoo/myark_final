import { NextRequest, NextResponse } from 'next/server';
import { getSimilarOpportunities } from '@/lib/recommendationService';

type RouteContext = {
    params: Promise<{ id: string }>;
};

/**
 * GET /api/recommendations/similar/[id]
 * Returns similar opportunities based on category and attributes
 */
export async function GET(
    request: NextRequest,
    context: RouteContext
) {
    try {
        const { id } = await context.params;

        if (!id) {
            return NextResponse.json(
                { error: 'Opportunity ID is required' },
                { status: 400 }
            );
        }

        // Parse limit from query params
        const { searchParams } = new URL(request.url);
        const limit = Math.min(parseInt(searchParams.get('limit') || '6', 10), 12);

        const similar = await getSimilarOpportunities(id, limit);

        return NextResponse.json({
            items: similar,
            sourceId: id,
        });
    } catch (error) {
        console.error('Failed to get similar opportunities:', error);
        return NextResponse.json(
            { error: 'Failed to get similar opportunities' },
            { status: 500 }
        );
    }
}
