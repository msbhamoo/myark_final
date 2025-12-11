import { NextRequest, NextResponse } from 'next/server';
import { getAdminAuth } from '@/lib/firebaseAdmin';
import { getPersonalizedRecommendations, getTrendingRecommendations } from '@/lib/recommendationService';

/**
 * GET /api/recommendations
 * Returns personalized opportunity recommendations for authenticated users
 */
export async function GET(request: NextRequest) {
    try {
        // Get authorization header
        const authHeader = request.headers.get('authorization') || request.headers.get('Authorization');

        // Parse limit from query params
        const { searchParams } = new URL(request.url);
        const limit = Math.min(parseInt(searchParams.get('limit') || '10', 10), 20);

        // If no auth, return trending
        if (!authHeader) {
            const trending = await getTrendingRecommendations(limit);
            return NextResponse.json(trending);
        }

        // Extract token
        const [scheme, token] = authHeader.split(' ');
        if (!scheme || scheme.toLowerCase() !== 'bearer' || !token) {
            const trending = await getTrendingRecommendations(limit);
            return NextResponse.json(trending);
        }

        // Verify token and get user
        const auth = getAdminAuth();
        let uid: string;

        try {
            const decoded = await auth.verifyIdToken(token);
            uid = decoded.uid;
        } catch {
            // Invalid token - return trending
            const trending = await getTrendingRecommendations(limit);
            return NextResponse.json(trending);
        }

        // Get personalized recommendations
        const recommendations = await getPersonalizedRecommendations(uid, limit);

        return NextResponse.json(recommendations);
    } catch (error) {
        console.error('Failed to get recommendations:', error);
        return NextResponse.json(
            { error: 'Failed to get recommendations' },
            { status: 500 }
        );
    }
}
