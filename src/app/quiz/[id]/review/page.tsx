'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { QuizOpportunity } from '@/types/quiz';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, Circle } from 'lucide-react';

export default function QuizReviewPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const { user } = useAuth();
    const [quiz, setQuiz] = useState<QuizOpportunity | null>(null);
    const [attempt, setAttempt] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            router.push(`/quiz/${params.id}`);
            return;
        }
        fetchQuizAndAttempt();
    }, [user, params.id]);

    const fetchQuizAndAttempt = async () => {
        try {
            // Fetch quiz
            const quizRes = await fetch(`/api/quiz/${params.id}`);
            if (!quizRes.ok) throw new Error('Quiz not found');
            const quizData = await quizRes.json();
            setQuiz(quizData.quiz);

            // Fetch latest attempt
            const attemptRes = await fetch(`/api/quiz/${params.id}/my-attempts`);
            if (attemptRes.ok) {
                const attempts = await attemptRes.json();
                if (attempts.length > 0) {
                    setAttempt(attempts[0]);  // Latest attempt
                }
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
                    <p>Loading review...</p>
                </div>
            </div>
        );
    }

    if (!quiz || !attempt) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">No attempt found</h1>
                    <button onClick={() => router.push(`/quiz/${params.id}`)} className="text-primary hover:underline">
                        Back to Quiz
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1 bg-gradient-to-br from-accent/30 via-white to-accent/10 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
                <div className="container mx-auto px-4 md:px-6 lg:px-8 xl:px-16 max-w-[1920px] py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
                            Quiz Review
                        </h1>
                        <p className="text-lg text-slate-600 dark:text-slate-300">{quiz.title}</p>
                    </div>

                    {/* Summary Card */}
                    <Card className="p-6 mb-8">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Your Performance</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                <div className="text-3xl font-bold text-primary">{attempt.score}/{attempt.maxScore}</div>
                                <div className="text-sm text-slate-600 dark:text-slate-400">Score</div>
                            </div>
                            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                                    {attempt.responses.filter((r: any) => r.isCorrect).length}
                                </div>
                                <div className="text-sm text-slate-600 dark:text-slate-400">Correct</div>
                            </div>
                            <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                                <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                                    {attempt.responses.filter((r: any) => !r.isCorrect && r.selectedOptions.length > 0).length}
                                </div>
                                <div className="text-sm text-slate-600 dark:text-slate-400">Wrong</div>
                            </div>
                            <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                <div className="text-3xl font-bold text-slate-600 dark:text-slate-400">
                                    {attempt.responses.filter((r: any) => r.selectedOptions.length === 0).length}
                                </div>
                                <div className="text-sm text-slate-600 dark:text-slate-400">Skipped</div>
                            </div>
                        </div>
                    </Card>

                    {/* Questions Review */}
                    <div className="space-y-6">
                        {quiz.quizConfig.questions.map((question: any, index: number) => {
                            const response = attempt.responses[index];
                            const isCorrect = response.isCorrect;
                            const wasAttempted = response.selectedOptions.length > 0;

                            return (
                                <Card key={index} className="p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0">
                                            {isCorrect ? (
                                                <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                                            ) : wasAttempted ? (
                                                <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                                            ) : (
                                                <Circle className="h-6 w-6 text-slate-400" />
                                            )}
                                        </div>

                                        <div className="flex-1">
                                            {/* Question */}
                                            <div className="mb-4">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                                        Question {index + 1}
                                                    </h3>
                                                    <Badge variant={isCorrect ? 'default' : wasAttempted ? 'destructive' : 'secondary'}>
                                                        {isCorrect ? 'Correct' : wasAttempted ? 'Incorrect' : 'Skipped'}
                                                    </Badge>
                                                    <span className="text-sm text-slate-600 dark:text-slate-400">
                                                        {question.marks} {question.marks === 1 ? 'mark' : 'marks'}
                                                    </span>
                                                </div>
                                                <p className="text-slate-700 dark:text-slate-300">
                                                    {question.questionText}
                                                </p>
                                            </div>

                                            {/* Options */}
                                            <div className="space-y-2">
                                                {question.options.map((option: any, optIdx: number) => {
                                                    const isSelected = response.selectedOptions.includes(optIdx);
                                                    const isCorrectOption = option.isCorrect;

                                                    return (
                                                        <div
                                                            key={optIdx}
                                                            className={`p-3 rounded-lg border-2 ${isCorrectOption
                                                                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                                                                    : isSelected
                                                                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                                                                        : 'border-slate-200 dark:border-slate-700'
                                                                }`}
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-medium text-slate-700 dark:text-slate-300">
                                                                    {String.fromCharCode(65 + optIdx)}.
                                                                </span>
                                                                <span className={isCorrectOption || isSelected ? 'font-medium' : ''}>
                                                                    {option.text}
                                                                </span>
                                                                {isCorrectOption && (
                                                                    <CheckCircle2 className="h-4 w-4 text-green-600 ml-auto" />
                                                                )}
                                                                {isSelected && !isCorrectOption && (
                                                                    <XCircle className="h-4 w-4 text-red-600 ml-auto" />
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            {/* Explanation */}
                                            {quiz.quizConfig.settings.showExplanations && question.explanation && (
                                                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                                                    <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
                                                        Explanation
                                                    </h4>
                                                    <p className="text-blue-800 dark:text-blue-200">{question.explanation}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>

                    {/* Actions */}
                    <div className="mt-8 flex gap-4">
                        <button
                            onClick={() => router.push(`/quiz/${params.id}/leaderboard`)}
                            className="px-6 py-3 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity"
                        >
                            View Leaderboard
                        </button>
                        <button
                            onClick={() => router.push(`/quiz/${params.id}`)}
                            className="px-6 py-3 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg hover:opacity-90 transition-opacity"
                        >
                            Back to Quiz
                        </button>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
