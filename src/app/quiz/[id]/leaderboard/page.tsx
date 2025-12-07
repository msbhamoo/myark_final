'use client';

import { useState, useEffect, use } from 'react';
import QuizLeaderboard from '@/components/quiz/QuizLeaderboard';
import { QuizOpportunity } from '@/types/quiz';
import { useAuth } from '@/context/AuthContext';

export default function QuizLeaderboardPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [quiz, setQuiz] = useState<QuizOpportunity | null>(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        fetchQuiz();
    }, []);

    const fetchQuiz = async () => {
        try {
            const response = await fetch(`/api/quiz/${id}`);
            if (response.ok) {
                const data = await response.json();
                setQuiz(data.quiz);
            }
        } catch (err) {
            console.error('Error fetching quiz:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading...</p>
                </div>
            </div>
        );
    }

    if (!quiz) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        Quiz not found
                    </h1>
                    <a href="/opportunities" className="text-indigo-600 hover:underline">
                        Back to Opportunities
                    </a>
                </div>
            </div>
        );
    }

    return (
        <QuizLeaderboard
            quizId={id}
            quizTitle={quiz.title}
            visibilitySettings={quiz.quizConfig.leaderboardSettings}
            quizEndDate={quiz.endDate}
            currentUserId={user?.uid}  // Use actual user ID
        />
    );
}
