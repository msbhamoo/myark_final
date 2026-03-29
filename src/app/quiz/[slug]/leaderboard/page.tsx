import { getQuizBySlug, getLeaderboard, getCurrentPeriod } from '../../actions';
import { notFound } from 'next/navigation';
import { PublicLeaderboardClient } from './PublicLeaderboardClient';

export default async function PublicLeaderboardPage({ params }: { params: { slug: string } }) {
    const quiz = await getQuizBySlug(params.slug);
    if (!quiz) notFound();
    
    const period = await getCurrentPeriod(quiz.id);
    
    let entries = [];
    if (period && period.leaderboard_revealed) {
        entries = await getLeaderboard(quiz.id, period.id);
    }
    
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white py-12 px-4 relative overflow-hidden selection:bg-purple-500/30">
            {/* Gamified background elements */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-yellow-500/10 blur-[150px] rounded-full pointer-events-none"></div>
            <div className="absolute top-[40%] left-[-20%] w-[600px] h-[600px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none"></div>
            
            <div className="max-w-4xl mx-auto relative z-10 w-full">
                <PublicLeaderboardClient quiz={quiz} period={period} entries={entries} />
            </div>
        </div>
    );
}
