'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { QuizOpportunity, QuizAttempt } from '@/types/quiz';
import { useAuth } from '@/context/AuthContext';
import { useAuthModal } from '@/hooks/use-auth-modal';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import QuizLeaderboardModal from '@/components/quiz/QuizLeaderboardModal';
import {
    Calendar,
    Clock,
    Users,
    Trophy,
    Eye,
    CheckCircle2,
    FileText,
    Target,
    Award,
    Timer,
    History,
    ChevronRight,
} from 'lucide-react';

interface QuizDetailProps {
    quiz: QuizOpportunity;
}

function calculateCountdown(endDate: string | null) {
    if (!endDate) return { days: 0, hours: 0, minutes: 0 };

    const now = new Date().getTime();
    const end = new Date(endDate).getTime();
    const diff = end - now;

    if (diff <= 0) return { days: 0, hours: 0, minutes: 0 };

    return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    };
}

function formatDuration(seconds: number): string {
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
}

export default function QuizDetail({ quiz }: QuizDetailProps) {
    const router = useRouter();
    const { user, loading: authLoading, getIdToken } = useAuth();
    const { openAuthModal } = useAuthModal();

    const [viewCount, setViewCount] = useState(quiz.views || 0);
    const [isRegistered, setIsRegistered] = useState(false);
    const [registeredAt, setRegisteredAt] = useState<string | null>(null);
    const [registrationLoading, setRegistrationLoading] = useState(false);
    const [actionMessage, setActionMessage] = useState<string | null>(null);
    const [countdown, setCountdown] = useState(calculateCountdown(quiz.endDate));
    const [leaderboardOpen, setLeaderboardOpen] = useState(false);
    const [userAttempts, setUserAttempts] = useState<QuizAttempt[]>([]);
    const [attemptsLoading, setAttemptsLoading] = useState(false);

    // Update countdown every minute
    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown(calculateCountdown(quiz.endDate));
        }, 60000);

        return () => clearInterval(timer);
    }, [quiz.endDate]);

    // Check registration status and fetch user attempts
    useEffect(() => {
        const checkRegistrationAndAttempts = async () => {
            if (!user || !quiz.id) return;

            try {
                const token = await getIdToken();
                if (!token) return;

                // Check registration
                const response = await fetch(`/api/quiz/${quiz.id}/register`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response.ok) {
                    const data = await response.json();
                    setIsRegistered(data.isRegistered);
                    setRegisteredAt(data.registeredAt);
                }

                // Fetch user attempts
                setAttemptsLoading(true);
                const attemptsResponse = await fetch(`/api/quiz/${quiz.id}/my-attempts`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (attemptsResponse.ok) {
                    const attemptsData = await attemptsResponse.json();
                    setUserAttempts(attemptsData.attempts || []);
                }
            } catch (error) {
                console.error('Error checking registration/attempts:', error);
            } finally {
                setAttemptsLoading(false);
            }
        };

        checkRegistrationAndAttempts();
    }, [user, quiz.id, getIdToken]);

    const now = new Date();
    const startDate = new Date(quiz.startDate);
    const endDate = new Date(quiz.endDate);
    const registrationDeadline = quiz.registrationDeadline ? new Date(quiz.registrationDeadline) : endDate;

    const isActive = now >= startDate && now <= endDate;
    const hasEnded = now > endDate;
    const notStarted = now < startDate;
    const registrationClosed = now > registrationDeadline;

    const avgMarksPerQuestion = quiz.quizConfig.totalMarks / quiz.quizConfig.totalQuestions;
    const difficulty = avgMarksPerQuestion > 3 ? 'Hard' : avgMarksPerQuestion > 1.5 ? 'Medium' : 'Easy';
    const difficultyColor = difficulty === 'Hard' ? 'destructive' : difficulty === 'Medium' ? 'secondary' : 'default';

    const handleRegister = async () => {
        if (!user) {
            openAuthModal({ mode: 'login', redirectUrl: `/quiz/${quiz.id}` });
            return;
        }

        if (registrationClosed) {
            setActionMessage('Registration deadline has passed.');
            return;
        }

        try {
            setRegistrationLoading(true);
            const token = await getIdToken();
            if (!token) throw new Error('Authentication required');

            const response = await fetch(`/api/quiz/${quiz.id}/register`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) throw new Error('Registration failed');

            setIsRegistered(true);
            setRegisteredAt(new Date().toISOString());
            setActionMessage('Successfully registered for the quiz!');
        } catch (error) {
            setActionMessage('Failed to register. Please try again.');
        } finally {
            setRegistrationLoading(false);
        }
    };

    const handleStartQuiz = () => {
        if (!isActive) {
            setActionMessage(hasEnded ? 'This quiz has ended.' : 'Quiz has not started yet.');
            return;
        }

        if (!user) {
            openAuthModal({ mode: 'login', redirectUrl: `/quiz/${quiz.id}/attempt` });
            return;
        }

        if (!isRegistered && quiz.registrationDeadline) {
            setActionMessage('Please register first to take this quiz.');
            return;
        }

        router.push(`/quiz/${quiz.id}/attempt`);
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1 bg-gradient-to-br from-accent/30 via-white to-accent/10 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
                {/* Hero Section */}
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
                    {quiz.thumbnailUrl && (
                        <div className="absolute inset-0 opacity-10">
                            <img src={quiz.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                        </div>
                    )}

                    <div className="relative container mx-auto px-4 md:px-6 lg:px-8 xl:px-16 max-w-[1920px] py-8 md:py-12">
                        {/* Breadcrumb */}
                        <nav className="mb-6 text-sm flex items-center gap-2 text-slate-600 dark:text-slate-400">
                            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                            <span>/</span>
                            <Link href="/quizzes" className="hover:text-primary transition-colors">Quizzes</Link>
                            <span>/</span>
                            <span className="text-slate-900 dark:text-white">{quiz.title}</span>
                        </nav>

                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-4">
                                    <Badge variant={difficultyColor} className="text-sm">
                                        {difficulty}
                                    </Badge>
                                    <Badge variant="outline">{quiz.categoryName || 'Quiz'}</Badge>
                                    {isActive && <Badge className="bg-green-600">Active Now</Badge>}
                                    {hasEnded && <Badge variant="destructive">Ended</Badge>}
                                    {notStarted && <Badge variant="secondary">Upcoming</Badge>}
                                </div>

                                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
                                    {quiz.title}
                                </h1>

                                {quiz.description && (
                                    <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl">
                                        {quiz.description}
                                    </p>
                                )}

                                <div className="flex flex-wrap items-center gap-4 mt-6 text-sm text-slate-600 dark:text-slate-300">
                                    <div className="flex items-center gap-2">
                                        <Eye className="h-4 w-4" />
                                        <span>{viewCount.toLocaleString()} views</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Users className="h-4 w-4" />
                                        <span>{quiz.registrationCount || 0} registered</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FileText className="h-4 w-4" />
                                        <span>{quiz.submissionCount || 0} submitted</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="container mx-auto px-4 md:px-6 lg:px-8 xl:px-16 max-w-[1920px] py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Details */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Status Alert */}
                            {actionMessage && (
                                <Card className="p-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                                    <p className="text-blue-800 dark:text-blue-200">{actionMessage}</p>
                                </Card>
                            )}

                            {/* Quiz Info Cards */}
                            <Card className="p-6">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                    <Target className="h-5 w-5 text-primary" />
                                    Quiz Overview
                                </h2>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <InfoStat icon={FileText} label="Questions" value={quiz.quizConfig.totalQuestions} />
                                    <InfoStat icon={Award} label="Total Marks" value={quiz.quizConfig.totalMarks} />
                                    <InfoStat icon={Timer} label="Duration" value={`${quiz.quizConfig.settings.totalDuration}min`} />
                                    <InfoStat icon={Trophy} label="Attempts" value={quiz.attemptLimit === 0 ? '∞' : quiz.attemptLimit} />
                                </div>
                            </Card>

                            {/* Important Dates */}
                            <Card className="p-6">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                    <Calendar className="h-5 w-5 text-primary" />
                                    Important Dates
                                </h2>
                                <div className="space-y-3">
                                    <DateRow label="Start Date" date={startDate} />
                                    <DateRow label="End Date" date={endDate} />
                                    {registrationDeadline && quiz.registrationDeadline && (
                                        <DateRow label="Registration Deadline" date={registrationDeadline} highlighted />
                                    )}
                                </div>
                            </Card>

                            {/* Quiz Features */}
                            <Card className="p-6">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Features</h2>
                                <div className="grid grid-cols-2 gap-3">
                                    <FeatureItem enabled={quiz.quizConfig.settings.showInstantResults} label="Instant Results" />
                                    <FeatureItem enabled={quiz.quizConfig.settings.allowReview} label="Review Answers" />
                                    <FeatureItem enabled={quiz.quizConfig.settings.showExplanations} label="Explanations" />
                                    <FeatureItem enabled={quiz.quizConfig.settings.enableNegativeMarking} label="Negative Marking" />
                                    <FeatureItem enabled={quiz.quizConfig.settings.shuffleQuestions} label="Random Order" />
                                    <FeatureItem enabled={quiz.quizConfig.settings.shuffleOptions} label="Shuffle Options" />
                                </div>
                            </Card>
                        </div>

                        {/* Right Column - Actions (Sticky Sidebar) */}
                        <div className="lg:col-span-1">
                            <Card className="p-6 sticky top-4 bg-white/90 dark:bg-slate-800/50 shadow-sm backdrop-blur-sm border-slate-200 dark:border-slate-700">
                                <div className="space-y-4">
                                    {/* Countdown Timer - EXACTLY like opportunities */}
                                    <div>
                                        <h3 className="mb-3 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-300">
                                            <Clock className="h-4 w-4 text-primary" />
                                            Time Remaining
                                        </h3>
                                        {hasEnded ? (
                                            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center text-red-600 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-200">
                                                Quiz has ended
                                            </div>
                                        ) : (
                                            <>
                                                <div className="grid grid-cols-3 gap-3">
                                                    <div className="flex flex-col items-center p-3 bg-white/60 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-700">
                                                        <div className="text-3xl font-bold text-primary">{countdown.days}</div>
                                                        <div className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">Days</div>
                                                    </div>
                                                    <div className="flex flex-col items-center p-3 bg-white/60 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-700">
                                                        <div className="text-3xl font-bold text-primary">{countdown.hours}</div>
                                                        <div className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">Hours</div>
                                                    </div>
                                                    <div className="flex flex-col items-center p-3 bg-white/60 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-700">
                                                        <div className="text-3xl font-bold text-primary">{countdown.minutes}</div>
                                                        <div className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">Mins</div>
                                                    </div>
                                                </div>
                                                <p className="mt-3 text-center text-xs text-slate-500 dark:text-slate-300">
                                                    Ends: {endDate.toLocaleString()}
                                                </p>
                                            </>
                                        )}
                                    </div>

                                    {/* Registration Section - ONLY show if quiz requires registration */}
                                    {quiz.registrationDeadline && (
                                        <>
                                            {isRegistered ? (
                                                <div className="space-y-2">
                                                    <div className="h-14 w-full flex items-center justify-center gap-2 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 rounded-lg font-semibold border border-emerald-200 dark:border-emerald-500/30">
                                                        <CheckCircle2 className="h-6 w-6" />
                                                        <span className="text-lg">Registered</span>
                                                    </div>
                                                    {registeredAt && (
                                                        <p className="text-center text-xs text-slate-500 dark:text-slate-400">
                                                            Registered on {new Date(registeredAt).toLocaleDateString()}
                                                        </p>
                                                    )}
                                                </div>
                                            ) : (
                                                <Button
                                                    onClick={handleRegister}
                                                    disabled={registrationClosed || registrationLoading}
                                                    className="w-full h-14 bg-gradient-to-r from-chart-1 to-chart-2 text-white text-lg font-semibold hover:from-chart-2 hover:to-chart-3 disabled:opacity-60"
                                                >
                                                    {registrationLoading ? 'Registering...' : registrationClosed ? 'Registration Closed' : 'Register Now'}
                                                </Button>
                                            )}
                                        </>
                                    )}

                                    {/* Start Quiz Button - ONLY show if registered OR no registration required */}
                                    {(!quiz.registrationDeadline || isRegistered) && (
                                        <Button
                                            onClick={handleStartQuiz}
                                            disabled={!isActive}
                                            className="w-full text-lg py-6"
                                            size="lg"
                                        >
                                            {hasEnded ? '🔒 Quiz Ended' : notStarted ? '🕐 Not Started' : '🚀 Start Quiz'}
                                        </Button>
                                    )}

                                    {/* Leaderboard Button - Opens modal */}
                                    <Button
                                        onClick={() => setLeaderboardOpen(true)}
                                        variant="outline"
                                        className="w-full"
                                    >
                                        <Trophy className="h-4 w-4 mr-2" />
                                        View Leaderboard
                                    </Button>

                                    {/* My Attempts Section */}
                                    {user && userAttempts.length > 0 && (
                                        <div className="border-t border-slate-200 dark:border-slate-700 pt-4 mt-2">
                                            <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white mb-3">
                                                <History className="h-4 w-4 text-primary" />
                                                My Attempts ({userAttempts.length})
                                            </h3>
                                            <div className="space-y-2 max-h-64 overflow-y-auto">
                                                {userAttempts.map((attempt, index) => (
                                                    <div
                                                        key={attempt.id}
                                                        className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer group"
                                                        onClick={() => router.push(`/quiz/${quiz.id}/result?attemptId=${attempt.id}`)}
                                                    >
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                                                    Attempt #{userAttempts.length - index}
                                                                </span>
                                                                {index === 0 && (
                                                                    <Badge variant="secondary" className="text-xs">Latest</Badge>
                                                                )}
                                                            </div>
                                                            <div className="flex items-center gap-3 mt-1">
                                                                <span className="text-sm font-bold text-primary">
                                                                    {attempt.score}/{attempt.maxScore || quiz.quizConfig.totalMarks}
                                                                </span>
                                                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                                                    ({(() => {
                                                                        const total = attempt.maxScore || quiz.quizConfig.totalMarks;
                                                                        return total > 0 ? Math.round(((attempt.score || 0) / total) * 100) : 0;
                                                                    })()}%)
                                                                </span>
                                                                <span className="text-xs text-slate-400 dark:text-slate-500">
                                                                    • {formatDuration(attempt.timeSpent)}
                                                                </span>
                                                            </div>
                                                            <div className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                                                                {attempt.submittedAt ? new Date(attempt.submittedAt).toLocaleString() : 'In Progress'}
                                                            </div>
                                                        </div>
                                                        <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-primary transition-colors flex-shrink-0" />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Loading state for attempts */}
                                    {user && attemptsLoading && (
                                        <div className="flex items-center justify-center py-3 text-sm text-slate-500">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2" />
                                            Loading attempts...
                                        </div>
                                    )}
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />

            {/* Leaderboard Modal */}
            <QuizLeaderboardModal
                open={leaderboardOpen}
                onClose={() => setLeaderboardOpen(false)}
                quizId={quiz.id}
                quizTitle={quiz.title}
                visibilitySettings={quiz.quizConfig.leaderboardSettings}
                quizEndDate={quiz.endDate}
                currentUserId={user?.uid}
            />
        </div>
    );
}

function InfoStat({ icon: Icon, label, value }: { icon: any; label: string; value: string | number }) {
    return (
        <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <Icon className="h-6 w-6 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{value}</div>
            <div className="text-xs text-slate-600 dark:text-slate-400">{label}</div>
        </div>
    );
}

function DateRow({ label, date, highlighted }: { label: string; date: Date; highlighted?: boolean }) {
    return (
        <div className={`flex justify-between items-center p-3 rounded-lg ${highlighted ? 'bg-primary/10' : 'bg-slate-50 dark:bg-slate-800'}`}>
            <span className="text-sm text-slate-600 dark:text-slate-400">{label}</span>
            <span className={`text-sm font-medium ${highlighted ? 'text-primary' : 'text-slate-900 dark:text-white'}`}>
                {date.toLocaleString()}
            </span>
        </div>
    );
}

function FeatureItem({ enabled, label }: { enabled: boolean; label: string }) {
    return (
        <div className="flex items-center gap-2 text-sm">
            {enabled ? (
                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
            ) : (
                <div className="h-4 w-4 rounded-full border-2 border-slate-300 dark:border-slate-600" />
            )}
            <span className={enabled ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}>
                {label}
            </span>
        </div>
    );
}
