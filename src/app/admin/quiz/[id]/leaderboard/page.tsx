import { createServerClient } from '@/lib/supabase-server';
import { LeaderboardViewer } from './LeaderboardViewer';

export default async function AdminLeaderboardPage({ params }: { params: { id: string } }) {
    const supabase = createServerClient();
    
    // Fetch quiz info
    const { data: quiz } = await supabase.from('quizzes').select('*, subject:quiz_subjects(*)').eq('id', params.id).single();
    
    if (!quiz) return <div>Quiz not found</div>;
    
    // Fetch periods
    const { data: periods } = await supabase.from('quiz_periods').select('*').eq('quiz_id', params.id).order('period_number', { ascending: false });
    
    // Pick the most recent period
    const activePeriodId = periods?.[0]?.id || null;
    
    // Fetch current leaderboard if revealed
    let leaderboard = [];
    if (activePeriodId) {
        const { data } = await supabase
            .from('quiz_leaderboard')
            .select('*')
            .eq('period_id', activePeriodId)
            .order('rank', { ascending: true });
        leaderboard = data || [];
    }

    return (
        <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Leaderboard: {quiz.title}</h1>
              <p className="text-gray-500">Manage competition results.</p>
            </div>
            
            <LeaderboardViewer 
              quiz={quiz} 
              periods={periods || []} 
              initialPeriodId={activePeriodId} 
              initialLeaderboard={leaderboard} 
            />
        </div>
    )
}
