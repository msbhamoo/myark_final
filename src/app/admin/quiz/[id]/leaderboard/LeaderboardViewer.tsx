'use client';

import { useState } from 'react';
import { revealLeaderboard, unrevealLeaderboard } from '@/app/admin/quiz/actions';

type Period = { id: string, period_label: string, start_time: string, leaderboard_revealed: boolean };
type LeaderboardEntry = { id: string, rank: number, student_name: string, school: string, city: string, final_score: number, time_taken_seconds: number };

export function LeaderboardViewer({ quiz, periods, initialPeriodId, initialLeaderboard }: { quiz: { id: string }, periods: Period[], initialPeriodId: string, initialLeaderboard: LeaderboardEntry[] }) {
    const [loading, setLoading] = useState(false);
    const [periodId, setPeriodId] = useState(initialPeriodId);
    
    const activePeriod = periods.find((p: Period) => p.id === periodId);

    const handleReveal = async () => {
        if (!periodId) return;
        if (!confirm('Are you sure you want to reveal the leaderboard? This will calculate all ranks and lock the current scores.')) return;
        
        setLoading(true);
        try {
            await revealLeaderboard(quiz.id, periodId);
            window.location.reload();
        } catch (err: unknown) {
            alert('Failed: ' + (err instanceof Error ? err.message : String(err)));
            setLoading(false);
        }
    };

    const handleUnreveal = async () => {
        if (!periodId) return;
        if (!confirm('Are you sure you want to unreveal? This will hide the leaderboard from the public and delete the calculated ranks. You can reveal it again later.')) return;
        setLoading(true);
        try {
            await unrevealLeaderboard(quiz.id, periodId);
            window.location.reload();
        } catch (err: unknown) {
            alert('Failed: ' + (err instanceof Error ? err.message : String(err)));
            setLoading(false);
        }
    };

    if (!periods || periods.length === 0) {
        return <div className="p-6 bg-white dark:bg-[#111] rounded-lg border border-gray-200 dark:border-gray-800">No periods found. This quiz might not be a competition.</div>
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between p-6 bg-white dark:bg-[#111] rounded-lg border border-gray-200 dark:border-gray-800">
                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-500">Viewing Period</label>
                    <select 
                        className="block w-full min-w-[200px] rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                        value={periodId} 
                        onChange={(e) => setPeriodId(e.target.value)}
                    >
                        {periods.map((p: Period) => {
                            const d = new Date(p.start_time);
                            const dateStr = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
                            return (
                                <option key={p.id} value={p.id} className="text-black">
                                    {p.period_label} ({dateStr})
                                </option>
                            );
                        })}
                    </select>
                </div>
                <div>
                    {!activePeriod?.leaderboard_revealed ? (
                        <button 
                            onClick={handleReveal} 
                            disabled={loading}
                            className="bg-black text-white dark:bg-white dark:text-black px-4 py-2 rounded-md font-medium text-sm hover:opacity-90 disabled:opacity-50"
                        >
                            {loading ? 'Calculating...' : 'Reveal Leaderboard Manually'}
                        </button>
                    ) : (
                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1 inline-flex items-center bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-400 rounded-full text-sm font-medium">✨ Revealed</span>
                            <button 
                                onClick={handleUnreveal} 
                                disabled={loading}
                                className="text-gray-500 hover:text-red-600 dark:hover:text-red-400 text-sm font-medium underline px-2"
                            >
                                Undo
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {activePeriod?.leaderboard_revealed && initialLeaderboard.length > 0 && (
                <div className="bg-white dark:bg-[#111] overflow-hidden shadow-sm sm:rounded-lg border border-gray-200 dark:border-gray-800">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                        <thead className="bg-gray-50 dark:bg-[#1a1a1a]">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">School / City</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                            {initialLeaderboard.map((entry: LeaderboardEntry) => (
                                <tr key={entry.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-white">#{entry.rank}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{entry.student_name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.school}, {entry.city}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-600 dark:text-blue-400">{entry.final_score} pts</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.time_taken_seconds}s</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            
            {activePeriod?.leaderboard_revealed && initialLeaderboard.length === 0 && (
                <div className="p-12 text-center text-gray-500 bg-white dark:bg-[#111] rounded-lg border border-gray-200 dark:border-gray-800">
                    Leaderboard is revealed but no attempts found for this period.
                </div>
            )}
        </div>
    )
}
