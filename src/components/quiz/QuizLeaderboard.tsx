'use client';

import { useState, useEffect } from 'react';
import { LeaderboardEntry, LeaderboardVisibilitySettings } from '@/types/quiz';

interface QuizLeaderboardProps {
    quizId: string;
    quizTitle: string;
    visibilitySettings: LeaderboardVisibilitySettings;
    quizEndDate: string;
    currentUserId?: string;
}

export default function QuizLeaderboard({
    quizId,
    quizTitle,
    visibilitySettings,
    quizEndDate,
    currentUserId,
}: QuizLeaderboardProps) {
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [isVisible, setIsVisible] = useState(false);
    const [visibilityMessage, setVisibilityMessage] = useState('');

    useEffect(() => {
        checkVisibility();
    }, []);

    useEffect(() => {
        if (isVisible) {
            fetchLeaderboard();
        }
    }, [isVisible]);

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
            console.log('Fetching leaderboard for quiz:', quizId);
            const response = await fetch(`/api/quiz/${quizId}/leaderboard`);
            console.log('Leaderboard response status:', response.status);

            if (response.ok) {
                const data = await response.json();
                console.log('Leaderboard data:', data);
                console.log('Leaderboard entries:', data.leaderboard);
                setLeaderboard(data.leaderboard || []);
            } else {
                console.error('Leaderboard fetch failed:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading && isVisible) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading leaderboard...</p>
                </div>
            </div>
        );
    }

    if (!isVisible) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 text-center">
                    <svg
                        className="w-20 h-20 mx-auto mb-6 text-indigo-600 dark:text-indigo-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                    </svg>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                        Leaderboard Not Available Yet
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">{visibilityMessage}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        Refresh Page
                    </button>
                </div>
            </div>
        );
    }

    const currentUserEntry = leaderboard.find((entry) => entry.userId === currentUserId);

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                        🏆 Leaderboard
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400">{quizTitle}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                        {leaderboard.length} participants
                    </p>
                </div>

                {/* Current User Rank Card */}
                {currentUserEntry && (
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow-2xl p-6 mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm opacity-90 mb-1">Your Rank</p>
                                <p className="text-5xl font-bold">#{currentUserEntry.rank}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm opacity-90 mb-1">Your Score</p>
                                <p className="text-3xl font-bold">
                                    {currentUserEntry.score}/{currentUserEntry.maxScore}
                                </p>
                                <p className="text-lg opacity-90">{currentUserEntry.percentage.toFixed(1)}%</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Top 3 Podium - only show if 3 or more participants */}
                {leaderboard.length >= 3 && (
                    <div className="grid grid-cols-3 gap-4 mb-8">
                        {/* 2nd Place */}
                        <PodiumCard entry={leaderboard[1]} rank={2} />
                        {/* 1st Place */}
                        <PodiumCard entry={leaderboard[0]} rank={1} isWinner />
                        {/* 3rd Place */}
                        <PodiumCard entry={leaderboard[2]} rank={3} />
                    </div>
                )}

                {/* Leaderboard Table */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Rank
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Participant
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Score
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Percentage
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Time Taken
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {/* Show all entries if less than 3, otherwise skip first 3 (shown in podium) */}
                                {(leaderboard.length < 3 ? leaderboard : leaderboard.slice(3)).map((entry) => (
                                    <tr
                                        key={entry.userId}
                                        className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${entry.userId === currentUserId
                                            ? 'bg-indigo-50 dark:bg-indigo-900/20'
                                            : ''
                                            }`}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-semibold text-gray-900 dark:text-white">
                                                #{entry.rank}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                {entry.userAvatar ? (
                                                    <img
                                                        src={entry.userAvatar}
                                                        alt={entry.userName}
                                                        className="w-8 h-8 rounded-full"
                                                    />
                                                ) : (
                                                    <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-semibold">
                                                        {entry.userName.charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {entry.userName}
                                                        {entry.userId === currentUserId && (
                                                            <span className="ml-2 text-xs text-indigo-600 dark:text-indigo-400">
                                                                (You)
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-semibold text-gray-900 dark:text-white">
                                                {entry.score}/{entry.maxScore}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-semibold text-gray-900 dark:text-white">
                                                {entry.percentage.toFixed(1)}%
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                                {formatTime(entry.timeTaken)}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

interface PodiumCardProps {
    entry: LeaderboardEntry;
    rank: number;
    isWinner?: boolean;
}

function PodiumCard({ entry, rank, isWinner }: PodiumCardProps) {
    const medals = {
        1: '🥇',
        2: '🥈',
        3: '🥉',
    };

    const heights = {
        1: 'h-40',
        2: 'h-32',
        3: 'h-28',
    };

    return (
        <div className={`${rank === 2 ? 'order-1' : rank === 1 ? 'order-2' : 'order-3'}`}>
            <div
                className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 text-center ${isWinner ? 'border-4 border-yellow-400' : 'border-2 border-gray-200 dark:border-gray-700'
                    }`}
            >
                <div className="text-4xl mb-2">{medals[rank as keyof typeof medals]}</div>
                {entry.userAvatar ? (
                    <img
                        src={entry.userAvatar}
                        alt={entry.userName}
                        className="w-16 h-16 rounded-full mx-auto mb-2 border-4 border-gray-200 dark:border-gray-600"
                    />
                ) : (
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-center text-2xl font-bold mx-auto mb-2">
                        {entry.userName.charAt(0).toUpperCase()}
                    </div>
                )}
                <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                    {entry.userName}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {entry.score}/{entry.maxScore} • {entry.percentage.toFixed(1)}%
                </p>
            </div>
            <div
                className={`${heights[rank as keyof typeof heights]} ${rank === 1
                    ? 'bg-gradient-to-t from-yellow-400 to-yellow-300'
                    : rank === 2
                        ? 'bg-gradient-to-t from-gray-400 to-gray-300'
                        : 'bg-gradient-to-t from-orange-400 to-orange-300'
                    } rounded-t-lg mt-2 flex items-center justify-center`}
            >
                <span className="text-3xl font-bold text-white">#{rank}</span>
            </div>
        </div>
    );
}

function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
}
