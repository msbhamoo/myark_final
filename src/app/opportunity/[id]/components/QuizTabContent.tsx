'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Clock, FileQuestion, Users, Play, Trophy, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Quiz {
    id: string;
    title: string;
    description: string;
    thumbnailUrl?: string;
    startDate: string;
    endDate: string;
    visibility: string;
    totalQuestions: number;
    totalMarks: number;
    duration: number;
    attemptLimit: number;
    submissionCount: number;
}

interface QuizTabContentProps {
    opportunityId: string;
}

export default function QuizTabContent({ opportunityId }: QuizTabContentProps) {
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const response = await fetch(`/api/opportunities/${opportunityId}/quizzes`);
                if (!response.ok) {
                    throw new Error('Failed to fetch quizzes');
                }
                const data = await response.json();
                setQuizzes(data.quizzes || []);
            } catch (err) {
                console.error('Error fetching quizzes:', err);
                setError('Failed to load quizzes');
            } finally {
                setLoading(false);
            }
        };

        if (opportunityId) {
            fetchQuizzes();
        }
    }, [opportunityId]);

    const getQuizStatus = (quiz: Quiz): { label: string; color: string } => {
        const now = new Date();
        const startDate = new Date(quiz.startDate);
        const endDate = new Date(quiz.endDate);

        if (quiz.visibility !== 'published') {
            return { label: 'Draft', color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300' };
        }
        if (now < startDate) {
            return { label: 'Upcoming', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' };
        }
        if (now > endDate) {
            return { label: 'Ended', color: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400' };
        }
        return { label: 'Live', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' };
    };

    const formatDate = (dateStr: string) => {
        try {
            return new Date(dateStr).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
            });
        } catch {
            return 'TBA';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <p className="text-red-500 dark:text-red-400">{error}</p>
            </div>
        );
    }

    if (quizzes.length === 0) {
        return (
            <div className="text-center py-12">
                <FileQuestion className="h-12 w-12 mx-auto text-slate-400 mb-4" />
                <h3 className="text-lg font-semibold text-foreground dark:text-white mb-2">
                    No Quizzes Available
                </h3>
                <p className="text-slate-500 dark:text-slate-400">
                    Check back later for practice quizzes and mock tests.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {quizzes.map((quiz) => {
                const status = getQuizStatus(quiz);
                const isLive = status.label === 'Live';
                const isEnded = status.label === 'Ended';

                return (
                    <div
                        key={quiz.id}
                        className={`p-6 rounded-xl border transition-all ${isLive
                                ? 'border-primary/30 bg-primary/5 dark:bg-primary/10'
                                : 'border-slate-200 bg-white/50 dark:border-slate-700 dark:bg-slate-800/30'
                            }`}
                    >
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <Badge className={status.color}>
                                        {status.label}
                                    </Badge>
                                    {quiz.submissionCount > 0 && (
                                        <Badge variant="outline" className="border-slate-300 dark:border-slate-600">
                                            <Users className="h-3 w-3 mr-1" />
                                            {quiz.submissionCount} attempted
                                        </Badge>
                                    )}
                                </div>

                                <h3 className={`text-lg font-bold mb-2 ${isLive ? 'text-primary' : 'text-foreground dark:text-white'
                                    }`}>
                                    {quiz.title}
                                </h3>

                                {quiz.description && (
                                    <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 line-clamp-2">
                                        {quiz.description}
                                    </p>
                                )}

                                <div className="flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-400">
                                    <div className="flex items-center gap-1.5">
                                        <FileQuestion className="h-4 w-4" />
                                        <span>{quiz.totalQuestions} Questions</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Trophy className="h-4 w-4" />
                                        <span>{quiz.totalMarks} Marks</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Clock className="h-4 w-4" />
                                        <span>{quiz.duration} mins</span>
                                    </div>
                                    {quiz.attemptLimit > 1 && (
                                        <div className="flex items-center gap-1.5">
                                            <CheckCircle className="h-4 w-4" />
                                            <span>{quiz.attemptLimit} attempts allowed</span>
                                        </div>
                                    )}
                                </div>

                                <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
                                    {formatDate(quiz.startDate)} - {formatDate(quiz.endDate)}
                                </p>
                            </div>

                            <div className="flex-shrink-0">
                                {isLive ? (
                                    <Button asChild className="bg-primary hover:bg-primary/90">
                                        <Link href={`/quiz/${quiz.id}`}>
                                            <Play className="h-4 w-4 mr-2" />
                                            Start Quiz
                                        </Link>
                                    </Button>
                                ) : isEnded ? (
                                    <Button asChild variant="outline">
                                        <Link href={`/quiz/${quiz.id}/leaderboard`}>
                                            <Trophy className="h-4 w-4 mr-2" />
                                            View Results
                                        </Link>
                                    </Button>
                                ) : (
                                    <Button disabled variant="outline">
                                        Coming Soon
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
