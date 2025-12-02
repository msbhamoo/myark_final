import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getDb } from '@/lib/firebaseAdmin';
import DeleteQuizButton from '@/components/quiz/DeleteQuizButton';

async function getQuizzes() {
    const db = getDb();
    const snapshot = await db.collection('quizzes').orderBy('createdAt', 'desc').limit(50).get();

    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
}

export default async function QuizzesPage() {
    const quizzes = await getQuizzes();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-semibold text-foreground dark:text-white">Quizzes</h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Create and manage quizzes for students
                    </p>
                </div>
                <Link href="/admin/opportunities/create-quiz">
                    <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700">
                        + Create Quiz
                    </Button>
                </Link>
            </div>

            {/* Quiz List */}
            <div className="space-y-4">
                {quizzes.length === 0 ? (
                    <div className="text-center py-12 bg-card/50 rounded-lg border border-border">
                        <svg
                            className="w-16 h-16 mx-auto text-muted-foreground mb-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                        </svg>
                        <h3 className="text-lg font-semibold text-foreground mb-2">No quizzes yet</h3>
                        <p className="text-muted-foreground mb-4">Create your first quiz to get started</p>
                        <Link href="/admin/opportunities/create-quiz">
                            <Button>Create Quiz</Button>
                        </Link>
                    </div>
                ) : (
                    quizzes.map((quiz: any) => (
                        <div
                            key={quiz.id}
                            className="bg-card/50 border border-border rounded-lg p-6 hover:bg-card/70 transition-colors"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-foreground dark:text-white mb-2">
                                        {quiz.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                        {quiz.description}
                                    </p>

                                    <div className="flex flex-wrap gap-4 text-sm">
                                        <div className="flex items-center gap-2">
                                            <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            <span className="text-muted-foreground">
                                                {quiz.quizConfig?.totalQuestions || 0} Questions
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span className="text-muted-foreground">
                                                {quiz.quizConfig?.settings?.totalDuration || 0} mins
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                            <span className="text-muted-foreground">
                                                {quiz.views || 0} views
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <span className="text-muted-foreground">
                                                {new Date(quiz.startDate).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-2 ml-4">
                                    <Link href={`/admin/opportunities/quizzes/${quiz.id}/edit`}>
                                        <Button variant="outline" size="sm">
                                            Edit
                                        </Button>
                                    </Link>
                                    <Link href={`/quiz/${quiz.id}`} target="_blank">
                                        <Button variant="outline" size="sm">
                                            View
                                        </Button>
                                    </Link>
                                    <Link href={`/quiz/${quiz.id}/leaderboard`} target="_blank">
                                        <Button variant="outline" size="sm">
                                            Leaderboard
                                        </Button>
                                    </Link>
                                    <DeleteQuizButton quizId={quiz.id} quizTitle={quiz.title} />
                                </div>
                            </div>

                            {/* Status Badge */}
                            <div className="mt-4 flex items-center gap-2">
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-medium ${quiz.visibility === 'published'
                                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                        : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                                        }`}
                                >
                                    {quiz.visibility === 'published' ? '✓ Published' : 'Draft'}
                                </span>

                                {quiz.submissionCount > 0 && (
                                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400">
                                        {quiz.submissionCount} submissions
                                    </span>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
