'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { QuizResultSummary } from '@/types/quiz';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trophy, Eye, CheckCircle2, Clock } from 'lucide-react';

interface QuizResultPageProps {
    result: QuizResultSummary;
    quizId: string;
    showExplanations: boolean;
}

export default function QuizResultPage({ result, quizId, showExplanations }: QuizResultPageProps) {
    const router = useRouter();

    const percentageColor =
        result.percentage >= 75
            ? 'text-green-600 dark:text-green-400'
            : result.percentage >= 50
                ? 'text-yellow-600 dark:text-yellow-400'
                : 'text-red-600 dark:text-red-400';

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1 bg-gradient-to-br from-accent/30 via-white to-accent/10 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
                <div className="container mx-auto px-4 md:px-6 lg:px-8 xl:px-16 max-w-[1920px] py-8">
                    {/* Result Header */}
                    <Card className={`p-8 text-center mb-8 ${result.passed
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                            : 'bg-gradient-to-r from-slate-500 to-slate-600 text-white'
                        }`}>
                        {result.passed ? (
                            <CheckCircle2 className="w-20 h-20 mx-auto mb-4" />
                        ) : (
                            <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                                <div className="text-6xl">📝</div>
                            </div>
                        )}
                        <h1 className="text-4xl font-bold mb-2">
                            {result.passed ? 'Congratulations!' : 'Quiz Completed'}
                        </h1>
                        <p className="text-xl opacity-90">
                            {result.passed ? 'You passed the quiz!' : 'Thanks for participating!'}
                        </p>
                    </Card>

                    {/* Score Display */}
                    <Card className="p-8 mb-8">
                        <div className="text-center mb-8">
                            <div className={`text-7xl font-bold ${percentageColor} mb-2`}>
                                {result.percentage.toFixed(1)}%
                            </div>
                            <div className="text-2xl text-slate-600 dark:text-slate-400">
                                {result.score} / {result.maxScore} marks
                            </div>
                        </div>

                        {/* Statistics Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <StatCard
                                icon={<CheckCircle2 className="w-6 h-6" />}
                                label="Correct"
                                value={result.correctAnswers}
                                color="green"
                            />
                            <StatCard
                                icon={<div className="text-red-600 dark:text-red-400">✗</div>}
                                label="Incorrect"
                                value={result.incorrectAnswers}
                                color="red"
                            />
                            <StatCard
                                icon={<div>—</div>}
                                label="Unanswered"
                                value={result.unanswered}
                                color="gray"
                            />
                            <StatCard
                                icon={<Clock className="w-6 h-6" />}
                                label="Time Taken"
                                value={formatTime(result.timeTaken)}
                                color="blue"
                            />
                        </div>
                    </Card>

                    {/* Rank Display */}
                    {result.rank && (
                        <Card className="p-6 mb-8 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-indigo-200 dark:border-indigo-800">
                            <div className="text-center">
                                <div className="text-sm text-slate-600 dark:text-slate-300 mb-2">Your Rank</div>
                                <div className="text-5xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
                                    #{result.rank}
                                </div>
                                {result.totalParticipants && (
                                    <div className="text-slate-600 dark:text-slate-300">
                                        out of {result.totalParticipants} participants
                                    </div>
                                )}
                            </div>
                        </Card>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-8">
                        <Button
                            onClick={() => router.push(`/quiz/${quizId}/leaderboard`)}
                            className="flex-1 text-lg py-6"
                            size="lg"
                        >
                            <Trophy className="w-5 h-5 mr-2" />
                            View Leaderboard
                        </Button>

                        {showExplanations && (
                            <Button
                                onClick={() => router.push(`/quiz/${quizId}/review`)}
                                variant="outline"
                                className="flex-1 text-lg py-6"
                                size="lg"
                            >
                                <Eye className="w-5 h-5 mr-2" />
                                Review Answers
                            </Button>
                        )}

                        <Button
                            onClick={() => router.push('/opportunities')}
                            variant="outline"
                            className="flex-1 text-lg py-6"
                            size="lg"
                        >
                            Back to Opportunities
                        </Button>
                    </div>

                    {/* Performance Analysis */}
                    <Card className="p-6">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                            Performance Analysis
                        </h2>

                        <div className="space-y-4">
                            {/* Accuracy Bar */}
                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-slate-600 dark:text-slate-400">Accuracy</span>
                                    <span className="font-semibold text-slate-900 dark:text-white">
                                        {result.percentage.toFixed(1)}%
                                    </span>
                                </div>
                                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                                    <div
                                        className={`h-3 rounded-full transition-all ${result.percentage >= 75
                                                ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                                                : result.percentage >= 50
                                                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                                                    : 'bg-gradient-to-r from-red-500 to-pink-500'
                                            }`}
                                        style={{ width: `${result.percentage}%` }}
                                    />
                                </div>
                            </div>

                            {/* Completion Bar */}
                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-slate-600 dark:text-slate-400">Completion Rate</span>
                                    <span className="font-semibold text-slate-900 dark:text-white">
                                        {(((result.totalQuestions - result.unanswered) / result.totalQuestions) * 100).toFixed(1)}%
                                    </span>
                                </div>
                                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                                    <div
                                        className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all"
                                        style={{
                                            width: `${((result.totalQuestions - result.unanswered) / result.totalQuestions) * 100}%`,
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </main>

            <Footer />
        </div>
    );
}

interface StatCardProps {
    icon: React.ReactNode;
    label: string;
    value: number | string;
    color: 'green' | 'red' | 'gray' | 'blue';
}

function StatCard({ icon, label, value, color }: StatCardProps) {
    const colorClasses = {
        green: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
        red: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
        gray: 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-400',
        blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
    };

    return (
        <div className={`${colorClasses[color]} rounded-lg p-4 text-center`}>
            <div className="flex justify-center mb-2">{icon}</div>
            <div className="text-3xl font-bold mb-1">{value}</div>
            <div className="text-sm opacity-80">{label}</div>
        </div>
    );
}

function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
}
