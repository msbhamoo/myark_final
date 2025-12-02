import { getDb } from '@/lib/firebaseAdmin';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Users, Calendar, Mail } from 'lucide-react';

export default async function QuizRegistrationsPage({ params }: { params: { id: string } }) {
    const db = getDb();
    const quizId = params.id;

    // Fetch quiz details
    const quizDoc = await db.collection('quizzes').doc(quizId).get();
    if (!quizDoc.exists) {
        redirect('/admin/opportunities/quizzes');
    }

    const quiz = { id: quizDoc.id, ...quizDoc.data() } as any;

    // Fetch all registrations
    const registrationsSnapshot = await db
        .collection('quizzes')
        .doc(quizId)
        .collection('registrations')
        .orderBy('registeredAt', 'desc')
        .get();

    const registrations = registrationsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
    }));

    // Check who has submitted
    const attemptsSnapshot = await db
        .collection('quizzes')
        .doc(quizId)
        .collection('attempts')
        .get();

    const submittedUserIds = new Set(attemptsSnapshot.docs.map(doc => doc.data().userId));

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href={`/admin/opportunities/quizzes/${quizId}/edit`}
                        className="inline-flex items-center text-sm text-slate-600 dark:text-slate-400 hover:text-primary mb-4"
                    >
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Back to Quiz
                    </Link>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Quiz Registrations</h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-2">{quiz.title}</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <Card className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                                <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Total Registered</p>
                                <p className="text-2xl font-bold text-slate-900 dark:text-white">{registrations.length}</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                                <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Submitted</p>
                                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                    {submittedUserIds.size}
                                </p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                                <Calendar className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Pending</p>
                                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                    {registrations.length - submittedUserIds.size}
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Registrations Table */}
                <Card className="overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                        Participant
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                        Registered At
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-700">
                                {registrations.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                                            No registrations yet
                                        </td>
                                    </tr>
                                ) : (
                                    registrations.map((registration: any) => {
                                        const hasSubmitted = submittedUserIds.has(registration.userId);
                                        return (
                                            <tr key={registration.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10 bg-primary text-white rounded-full flex items-center justify-center font-semibold">
                                                            {registration.userName?.charAt(0).toUpperCase() || 'U'}
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-slate-900 dark:text-white">
                                                                {registration.userName || 'Anonymous'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                                                        <Mail className="h-4 w-4" />
                                                        {registration.userEmail || 'N/A'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
                                                    {new Date(registration.registeredAt).toLocaleString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <Badge variant={hasSubmitted ? 'default' : 'secondary'}>
                                                        {hasSubmitted ? 'Submitted' : 'Pending'}
                                                    </Badge>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </div>
    );
}
