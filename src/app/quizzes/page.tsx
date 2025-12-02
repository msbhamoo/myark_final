import Link from 'next/link';
import { getDb } from '@/lib/firebaseAdmin';

async function getQuizzes() {
    const db = getDb();
    const snapshot = await db
        .collection('quizzes')
        .where('visibility', '==', 'published')
        .limit(20)
        .get();

    // Sort by startDate in JavaScript instead of Firestore to avoid index requirement
    const quizzes = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));

    return quizzes.sort((a: any, b: any) => {
        const dateA = new Date(a.startDate || 0).getTime();
        const dateB = new Date(b.startDate || 0).getTime();
        return dateB - dateA; // desc order
    });
}

export default async function QuizzesListingPage() {
    const quizzes = await getQuizzes();

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
                        📝 Quizzes
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400">
                        Test your knowledge with our interactive quizzes
                    </p>
                </div>

                {/* Quiz Grid */}
                {quizzes.length === 0 ? (
                    <div className="text-center py-20">
                        <svg
                            className="w-24 h-24 mx-auto text-gray-400 mb-6"
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
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            No quizzes available yet
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            Check back soon for exciting quizzes!
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {quizzes.map((quiz: any) => (
                            <Link
                                key={quiz.id}
                                href={`/quiz/${quiz.id}`}
                                className="group bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all overflow-hidden border border-gray-200 dark:border-gray-700 hover:scale-105"
                            >
                                {/* Thumbnail */}
                                {quiz.thumbnailUrl ? (
                                    <img
                                        src={quiz.thumbnailUrl}
                                        alt={quiz.title}
                                        className="w-full h-48 object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-48 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                        <svg
                                            className="w-20 h-20 text-white/80"
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
                                    </div>
                                )}

                                <div className="p-6">
                                    {/* Title */}
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                                        {quiz.title}
                                    </h3>

                                    {/* Description */}
                                    {quiz.description && (
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                                            {quiz.description}
                                        </p>
                                    )}

                                    {/* Stats */}
                                    <div className="flex flex-wrap gap-3 mb-4 text-sm">
                                        <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            <span>{quiz.quizConfig?.totalQuestions || 0} Qs</span>
                                        </div>

                                        <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span>{quiz.quizConfig?.settings?.totalDuration || 0} min</span>
                                        </div>

                                        <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                            <span>{quiz.submissionCount || 0} attempts</span>
                                        </div>
                                    </div>

                                    {/* CTA Button */}
                                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                        <span className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold group-hover:gap-3 transition-all">
                                            Start Quiz
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {/* View All Link */}
                {quizzes.length > 0 && (
                    <div className="text-center mt-12">
                        <Link
                            href="/opportunities?type=quiz"
                            className="inline-flex items-center gap-2 px-8 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-semibold"
                        >
                            View All Opportunities
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
