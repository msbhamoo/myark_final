import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/firebaseAdmin';
import { LeaderboardEntry } from '@/types/quiz';

const db = getDb();

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id: quizId } = await context.params;

        // Fetch all leaderboard entries without ordering (to avoid composite index)
        const leaderboardSnapshot = await db
            .collection('quizzes')
            .doc(quizId)
            .collection('leaderboard')
            .get();

        // Sort client-side to avoid composite index requirement
        const sortedEntries = leaderboardSnapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .sort((a: any, b: any) => {
                // Sort by score (descending), then by timeTaken (ascending)
                if (b.score !== a.score) {
                    return b.score - a.score;
                }
                return a.timeTaken - b.timeTaken;
            });

        const leaderboard: LeaderboardEntry[] = [];
        let rank = 1;

        sortedEntries.forEach((data: any) => {
            leaderboard.push({
                userId: data.userId,
                userName: data.userName,
                userAvatar: data.userAvatar,
                userSlug: data.userSlug,
                score: data.score,
                maxScore: data.maxScore,
                percentage: data.percentage,
                rank,
                timeTaken: data.timeTaken,
                submittedAt: data.submittedAt,
                attemptId: data.attemptId,
            });
            rank++;
        });

        return NextResponse.json({
            success: true,
            leaderboard,
            totalParticipants: leaderboard.length,
        });
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        return NextResponse.json(
            { error: 'Failed to fetch leaderboard' },
            { status: 500 }
        );
    }
}
