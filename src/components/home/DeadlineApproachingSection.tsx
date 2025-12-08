'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Clock, AlertTriangle, ChevronRight, Flame } from 'lucide-react';
import OpportunityCard from '@/components/OpportunityCard';
import type { Opportunity } from '@/types/opportunity';
import { format } from 'date-fns';

interface DeadlineApproachingSectionProps {
    className?: string;
}

const formatFee = (opportunity: Opportunity) => {
    const trimmedFee = opportunity.fee?.trim() ?? '';
    const numeric = trimmedFee ? Number(trimmedFee) : Number.NaN;
    const hasNumericValue = Number.isFinite(numeric);
    const isFree =
        !trimmedFee ||
        trimmedFee.toLowerCase() === 'free' ||
        (hasNumericValue && numeric <= 0);

    if (isFree) return 'FREE';
    if (hasNumericValue) {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(numeric);
    }
    return trimmedFee;
};

const normalizeMode = (mode?: Opportunity['mode']): Opportunity['mode'] => {
    if (mode === 'online' || mode === 'offline' || mode === 'hybrid') return mode;
    return 'online';
};

function CountdownTimer({ deadline }: { deadline: string }) {
    const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const calculateTimeLeft = () => {
            const deadlineDate = new Date(deadline);
            const now = new Date();
            const diff = deadlineDate.getTime() - now.getTime();

            if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0 };

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            return { hours, minutes, seconds };
        };

        setTimeLeft(calculateTimeLeft());
        const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
        return () => clearInterval(timer);
    }, [deadline]);

    return (
        <div className="flex items-center gap-1 text-xs font-mono">
            <span className="bg-red-600 text-white px-1.5 py-0.5 rounded">{String(timeLeft.hours).padStart(2, '0')}</span>
            <span className="text-red-500">:</span>
            <span className="bg-red-600 text-white px-1.5 py-0.5 rounded">{String(timeLeft.minutes).padStart(2, '0')}</span>
            <span className="text-red-500">:</span>
            <span className="bg-red-600 text-white px-1.5 py-0.5 rounded animate-pulse">{String(timeLeft.seconds).padStart(2, '0')}</span>
        </div>
    );
}

function UrgencyBadge({ daysLeft }: { daysLeft: number }) {
    if (daysLeft <= 1) {
        return (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/30">
                <Flame className="h-3 w-3" />
                Last Day!
            </span>
        );
    }
    if (daysLeft <= 3) {
        return (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold bg-orange-500 text-white shadow-md">
                <AlertTriangle className="h-3 w-3" />
                {daysLeft} days left
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
            <Clock className="h-3 w-3" />
            {daysLeft} days left
        </span>
    );
}

export default function DeadlineApproachingSection({ className = '' }: DeadlineApproachingSectionProps) {
    const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDeadlineOpportunities = async () => {
            try {
                const response = await fetch('/api/opportunities/deadline-approaching');
                if (response.ok) {
                    const data = await response.json();
                    setOpportunities(data.opportunities || []);
                }
            } catch (error) {
                console.error('Failed to fetch deadline opportunities:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDeadlineOpportunities();
    }, []);

    const getDaysLeft = (deadline: string) => {
        const deadlineDate = new Date(deadline);
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        return Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    };

    const getHoursLeft = (deadline: string) => {
        const deadlineDate = new Date(deadline);
        const now = new Date();
        return Math.floor((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60));
    };

    if (loading) {
        return (
            <section className={`relative overflow-hidden py-12 bg-gradient-to-r from-red-50 via-orange-50 to-amber-50 dark:from-red-950/30 dark:via-orange-950/30 dark:to-amber-950/30 ${className}`}>
                <div className="container mx-auto max-w-[1920px] px-4 md:px-6 lg:px-8 xl:px-16">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 rounded-xl bg-red-100 dark:bg-red-500/20">
                            <Clock className="h-6 w-6 text-red-500 animate-pulse" />
                        </div>
                        <div className="h-8 w-64 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                    </div>
                    <div className="flex gap-4 overflow-hidden">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="w-[280px] flex-shrink-0 h-64 bg-slate-200 dark:bg-slate-700 rounded-2xl animate-pulse" />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (opportunities.length === 0) return null;

    return (
        <section className={`relative overflow-hidden py-12 md:py-16 bg-gradient-to-r from-red-50 via-orange-50 to-amber-50 dark:from-red-950/30 dark:via-orange-950/30 dark:to-amber-950/30 ${className}`}>
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-32 h-32 bg-red-400/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-orange-400/20 rounded-full blur-3xl animate-pulse delay-500" />
            </div>

            <div className="container relative mx-auto max-w-[1920px] px-4 md:px-6 lg:px-8 xl:px-16">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 shadow-lg shadow-red-500/30">
                            <Clock className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                Deadline Approaching
                                <Flame className="h-6 w-6 text-orange-500 animate-bounce" />
                            </h2>
                            <p className="text-sm text-slate-600 dark:text-slate-300">
                                Don&apos;t miss out! Apply before it&apos;s too late
                            </p>
                        </div>
                    </div>
                    <Link
                        href="/opportunities?sort=deadline"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-red-500/50 bg-white/80 text-red-600 font-semibold text-sm hover:bg-red-50 hover:border-red-500 transition-all dark:bg-slate-900/80 dark:text-red-400 dark:hover:bg-red-950/30"
                    >
                        View all urgent
                        <ChevronRight className="h-4 w-4" />
                    </Link>
                </div>

                <div className="relative -mx-2">
                    <div className="flex gap-4 overflow-x-auto px-2 pb-4 scrollbar-hide">
                        {opportunities.map((opp) => {
                            const daysLeft = getDaysLeft(opp.registrationDeadline || '');
                            const hoursLeft = getHoursLeft(opp.registrationDeadline || '');
                            const showCountdown = hoursLeft <= 24 && hoursLeft > 0;

                            return (
                                <div key={opp.id} className="relative flex-shrink-0">
                                    {/* Urgency overlay badge */}
                                    <div className="absolute -top-2 -right-2 z-10">
                                        <UrgencyBadge daysLeft={daysLeft} />
                                    </div>

                                    {/* Countdown timer for <24h */}
                                    {showCountdown && (
                                        <div className="absolute top-12 left-2 z-10">
                                            <CountdownTimer deadline={opp.registrationDeadline || ''} />
                                        </div>
                                    )}

                                    <OpportunityCard
                                        id={opp.id}
                                        title={opp.title}
                                        category={opp.category}
                                        gradeEligibility={opp.gradeEligibility || 'All Grades'}
                                        eligibilityType={opp.eligibilityType}
                                        ageEligibility={opp.ageEligibility}
                                        organizer={opp.organizer || 'Unknown Organizer'}
                                        registrationDeadline={opp.registrationDeadline ?? ''}
                                        registrationDeadlineTBD={opp.registrationDeadlineTBD}
                                        mode={normalizeMode(opp.mode)}
                                        fee={formatFee(opp)}
                                        image={opp.image}
                                        status="active"
                                        className="w-[280px] ring-2 ring-red-200 dark:ring-red-500/30 hover:ring-red-400"
                                        organizerLogo={opp.organizerLogo}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
