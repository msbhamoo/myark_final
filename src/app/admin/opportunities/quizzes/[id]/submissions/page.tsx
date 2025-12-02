'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, FileCheck, Calendar, Award } from 'lucide-react';

export default function QuizSubmissionsPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [quiz, setQuiz] = useState<any>(null);
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // Fetch quiz
            const quizRes = await fetch(`/api/quiz/${params.id}`);
            const quizData = await quizRes.json();
            setQuiz(quizData.quiz);

            // Fetch submissions
            const submissionsRes = await fetch(`/api/quiz/${params.id}/submissions`);
            const submissionsData = await submissionsRes.json();
            setSubmissions(submissionsData.submissions || []);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!quiz) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Quiz not found</h1>
                    <Button onClick={() => router.push('/admin/opportunities/quizzes')}>
                        Back to Quizzes
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href={`/admin/opportunities/quizzes/${params.id}/edit`}
                        className="inline-flex items-center text-sm text-slate-600 dark:text-slate-400 hover:text-primary mb-4"
                    >
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Back to Quiz
                    </Link>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Quiz Submissions</h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-2">{quiz.title}</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <Card className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                                <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Total Submissions</p>
                                <p className="text-2xl font-bold text-slate-900 dark:text-white">{submissions.length}</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                                <FileCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Passed</p>
                                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                    {submissions.filter(s => s.passed).length}
                                </p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                                <Award className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Avg Score</p>
                                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                    {submissions.length > 0
                                        ? (submissions.reduce((sum, s) => sum + s.percentage, 0) / submissions.length).toFixed(1)
                                        : 0}%
                                </p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                                <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Latest</p>
                                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                    {submissions.length > 0
                                        ? new Date(submissions[0].submittedAt).toLocaleDateString()
                                        : 'N/A'}
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Submissions Table */}
                <Card className="overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                        Participant
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                        Score
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                        Percentage
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                        Time Taken
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                        Submitted At
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-700">
                                {submissions.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                                            No submissions yet
                                        </td>
                                    </tr>
                                ) : (
                                    submissions.map((submission: any) => (
                                        <tr key={submission.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10 bg-primary text-white rounded-full flex items-center justify-center font-semibold">
                                                        {submission.userName?.charAt(0).toUpperCase() || 'U'}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-slate-900 dark:text-white">
                                                            {submission.userName || 'Anonymous'}
                                                        </div>
                                                        <div className="text-sm text-slate-500 dark:text-slate-400">
                                                            {submission.userEmail || 'N/A'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-semibold text-slate-900 dark:text-white">
                                                    {submission.score}/{submission.maxScore}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-semibold text-slate-900 dark:text-white">
                                                    {submission.percentage.toFixed(1)}%
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Badge variant={submission.passed ? 'default' : 'destructive'}>
                                                    {submission.passed ? 'Passed' : 'Failed'}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
                                                {Math.floor(submission.timeSpent / 60)}m {submission.timeSpent % 60}s
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
                                                {new Date(submission.submittedAt).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => router.push(`/quiz/${params.id}/result?attemptId=${submission.id}`)}
                                                >
                                                    View Details
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </div>
    );
}
