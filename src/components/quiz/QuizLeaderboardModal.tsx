'use client';

import { useState, useEffect } from 'react';
import { LeaderboardEntry, LeaderboardVisibilitySettings } from '@/types/quiz';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Trophy, Clock, X } from 'lucide-react';

interface QuizLeaderboardModalProps {
    open: boolean;
    onClose: () => void;
    quizId: string;
    quizTitle: string;
    visibilitySettings: LeaderboardVisibilitySettings;
    quizEndDate: string;
    currentUserId?: string;
}

export default function QuizLeaderboardModal({
    open,
    onClose,
    quizId,
    quizTitle,
    visibilitySettings,
    quizEndDate,
    currentUserId,
}: QuizLeaderboardModalProps) {
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [isVisible, setIsVisible] = useState(false);
    const [visibilityMessage, setVisibilityMessage] = useState('');

    useEffect(() => {
        if (open) {
            checkVisibility();
        }
    }, [open]);

    useEffect(() => {
        if (isVisible && open) {
            fetchLeaderboard();
        }
    }, [isVisible, open]);

    const checkVisibility = () => {
        const now = new Date();

        if (visibilitySettings.type === 'instant') {
            setIsVisible(true);
            return;
        }

        if (visibilitySettings.type === 'scheduled') {
            const scheduledDate = new Date(visibilitySettings.scheduledDate!);
            if (now >= scheduledDate) {
                setIsVisible(true);
            } else {
                setVisibilityMessage(
                    `Leaderboard will be available on ${scheduledDate.toLocaleString()}`
                );
            }
            return;
        }

        if (visibilitySettings.type === 'delayed') {
            const endDate = new Date(quizEndDate);
            const delayMs = (visibilitySettings.delayHours || 24) * 60 * 60 * 1000;
            const visibleDate = new Date(endDate.getTime() + delayMs);

            if (now >= visibleDate) {
                setIsVisible(true);
            } else {
                const timeRemaining = visibleDate.getTime() - now.getTime();
                const hoursRemaining = Math.ceil(timeRemaining / (60 * 60 * 1000));
                setVisibilityMessage(
                    `Leaderboard will be available in approximately ${hoursRemaining} hours`
                );
            }
        }
    };

    const fetchLeaderboard = async () => {
        try {
            const response = await fetch(`/api/quiz/${quizId}/leaderboard`);
            if (response.ok) {
                const data = await response.json();
                setLeaderboard(data.leaderboard || []);
            }
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
        } finally {
            setLoading(false);
        }
    };

    const currentUserEntry = leaderboard.find((entry) => entry.userId === currentUserId);

    if (!isVisible) {
        return (
            <Dialog open={open} onOpenChange={onClose}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Trophy className="h-5 w-5 text-primary" />
                            Leaderboard Locked
                        </DialogTitle>
                    </DialogHeader>
                    <div className="text-center py-8">
                        <div className="text-6xl mb-4">🔒</div>
                        <p className="text-slate-600 dark:text-slate-400">{visibilityMessage}</p>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    if (loading) {
        return (
            <Dialog open={open} onOpenChange={onClose}>
                <DialogContent className="sm:max-w-3xl">
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-3xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-2xl">
                        <Trophy className="h-6 w-6 text-primary" />
                        Leaderboard
                    </DialogTitle>
                    <p className="text-slate-600 dark:text-slate-400">{quizTitle}</p>
                </DialogHeader>

                {/* Current User Rank */}
                {currentUserEntry && (
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg p-4 mb-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm opacity-90">Your Rank</p>
                                <p className="text-3xl font-bold">#{currentUserEntry.rank}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm opacity-90">Your Score</p>
                                <p className="text-2xl font-bold">
                                    {currentUserEntry.score}/{currentUserEntry.maxScore}
                                </p>
                                <p className="text-sm opacity-90">{currentUserEntry.percentage.toFixed(1)}%</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Top 3 Podium */}
                {leaderboard.length >= 3 && (
                    <div className="grid grid-cols-3 gap-2 mb-6">
                        <PodiumCard entry={leaderboard[1]} rank={2} />
                        <PodiumCard entry={leaderboard[0]} rank={1} isWinner />
                        <PodiumCard entry={leaderboard[2]} rank={3} />
                    </div>
                )}

                {/* Leaderboard Table */}
                <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-slate-50 dark:bg-slate-800">
                            <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Rank</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Participant</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Score</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Time</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                            {leaderboard.slice(3, 20).map((entry) => (
                                <tr
                                    key={entry.userId}
                                    className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 ${entry.userId === currentUserId ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''
                                        }`}
                                >
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <span className="font-semibold text-slate-900 dark:text-white">
                                            #{entry.rank}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            {entry.userAvatar ? (
                                                <img src={entry.userAvatar} alt="" className="w-8 h-8 rounded-full" />
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold">
                                                    {entry.userName.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                            <span className="font-medium text-slate-900 dark:text-white">
                                                {entry.userName}
                                                {entry.userId === currentUserId && (
                                                    <span className="ml-2 text-xs text-indigo-600 dark:text-indigo-400">(You)</span>
                                                )}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <div className="font-semibold text-slate-900 dark:text-white">
                                            {entry.score}/{entry.maxScore}
                                        </div>
                                        <div className="text-xs text-slate-500">{entry.percentage.toFixed(1)}%</div>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                                        {formatTime(entry.timeTaken)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {leaderboard.length === 0 && (
                    <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                        No submissions yet
                    </div>
                )}

                {leaderboard.length > 20 && (
                    <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-4">
                        Showing top 20 participants • {leaderboard.length} total
                    </p>
                )}
            </DialogContent>
        </Dialog>
    );
}

function PodiumCard({ entry, rank, isWinner }: { entry: LeaderboardEntry; rank: number; isWinner?: boolean }) {
    const medals = { 1: '🥇', 2: '🥈', 3: '🥉' };

    return (
        <div className={`${rank === 2 ? 'order-1' : rank === 1 ? 'order-2' : 'order-3'}`}>
            <div className={`bg-white dark:bg-slate-800 rounded-lg p-3 text-center border-2 ${isWinner ? 'border-yellow-400' : 'border-slate-200 dark:border-slate-700'
                }`}>
                <div className="text-3xl mb-1">{medals[rank as keyof typeof medals]}</div>
                {entry.userAvatar ? (
                    <img src={entry.userAvatar} alt="" className="w-12 h-12 rounded-full mx-auto mb-1 border-2 border-slate-200 dark:border-slate-600" />
                ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-center text-lg font-bold mx-auto mb-1">
                        {entry.userName.charAt(0).toUpperCase()}
                    </div>
                )}
                <p className="font-semibold text-slate-900 dark:text-white text-xs truncate">
                    {entry.userName}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                    {entry.score}/{entry.maxScore} • {entry.percentage.toFixed(0)}%
                </p>
            </div>
        </div>
    );
}

function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
}
