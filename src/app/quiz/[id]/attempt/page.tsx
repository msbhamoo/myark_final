'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import QuizAttemptInterface from '@/components/quiz/QuizAttemptInterface';
import { QuizOpportunity } from '@/types/quiz';
import { useAuth } from '@/context/AuthContext';

export default function QuizAttemptPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const { user, loading: authLoading, getIdToken } = useAuth();
    const [quiz, setQuiz] = useState<QuizOpportunity | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [userAttempts, setUserAttempts] = useState<number>(0);

    // Check authentication
    useEffect(() => {
        if (!authLoading && !user) {
            // Redirect to home with login prompt
            router.push(`/?login=true&redirect=/quiz/${params.id}/attempt`);
        }
    }, [user, authLoading, router, params.id]);

    useEffect(() => {
        if (user) {
            fetchQuiz();
        }
    }, [user]);

    const fetchQuiz = async () => {
        try {
            const response = await fetch(`/api/quiz/${params.id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch quiz');
            }
            const data = await response.json();
            const quizData = data.quiz;

            // Check user's previous attempts
            if (user) {
                const token = await getIdToken();
                const attemptsResponse = await fetch(`/api/quiz/${params.id}/my-attempts`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (attemptsResponse.ok) {
                    const attemptsData = await attemptsResponse.json();
                    const attemptCount = attemptsData.attempts?.length || 0;
                    setUserAttempts(attemptCount);

                    // Check if user has exceeded attempt limit
                    // attemptLimit of 0 means unlimited attempts
                    if (quizData.attemptLimit > 0 && attemptCount >= quizData.attemptLimit) {
                        setError(`You have already attempted this quiz ${attemptCount} time(s). Maximum allowed attempts: ${quizData.attemptLimit}`);
                        setLoading(false);
                        return;
                    }
                }
            }

            setQuiz(quizData);
        } catch (err) {
            setError('Failed to load quiz. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (responses: any[], timeSpent: number) => {
        if (!user) {
            alert('Please login to submit quiz');
            return;
        }

        try {
            const response = await fetch(`/api/quiz/${params.id}/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: user.uid,
                    userName: user.displayName || 'Anonymous',
                    userEmail: user.email || '',
                    responses,
                    timeSpent,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to submit quiz');
            }

            const result = await response.json();

            if (result.success) {
                // Redirect to result page with attemptId
                const attemptId = result.result?.attempt?.id;
                if (attemptId) {
                    router.push(`/quiz/${params.id}/result?attemptId=${attemptId}`);
                } else {
                    router.push(`/quizzes`);
                }
            } else {
                setError(result.error || 'Failed to submit quiz');
            }
        } catch (err) {
            console.error('Error submitting quiz:', err);
            alert('Failed to submit quiz. Please try again.');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading quiz...</p>
                </div>
            </div>
        );
    }

    if (error || !quiz) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
                <div className="text-center max-w-md">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                        <div className="text-6xl mb-4">{error?.includes('attempted') ? '🚫' : '❌'}</div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            {error || 'Quiz not found'}
                        </h1>
                        {error?.includes('attempted') && (
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                You can view your previous results or go back to the quiz page.
                            </p>
                        )}
                        <div className="flex flex-col gap-3">
                            {error?.includes('attempted') && (
                                <button
                                    onClick={() => router.push(`/quiz/${params.id}/result`)}
                                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                >
                                    View My Results
                                </button>
                            )}
                            <button
                                onClick={() => router.push(`/quiz/${params.id}`)}
                                className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                            >
                                Back to Quiz
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <QuizAttemptInterface
            quizId={params.id}
            questions={quiz.quizConfig.questions}
            settings={quiz.quizConfig.settings}
            onSubmit={handleSubmit}
        />
    );
}
