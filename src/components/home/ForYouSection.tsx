'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Sparkles, ChevronRight, Loader2 } from 'lucide-react';
import OpportunityCard from '@/components/OpportunityCard';
import type { ScoredOpportunity, RecommendationsResponse } from '@/types/recommendation';
import { useAuth } from '@/context/AuthContext';
import { format } from 'date-fns';

interface ForYouSectionProps {
    className?: string;
}

const formatDate = (value?: string | { _seconds?: number; seconds?: number } | Date | null) => {
    if (!value) return 'TBA';
    try {
        let date: Date;

        // Handle Firestore Timestamp-like objects
        if (typeof value === 'object' && value !== null) {
            if (value instanceof Date) {
                date = value;
            } else if ('_seconds' in value && typeof value._seconds === 'number') {
                date = new Date(value._seconds * 1000);
            } else if ('seconds' in value && typeof value.seconds === 'number') {
                date = new Date(value.seconds * 1000);
            } else {
                return 'TBA';
            }
        } else if (typeof value === 'string') {
            date = new Date(value);
        } else {
            return 'TBA';
        }

        if (Number.isNaN(date.getTime())) return 'TBA';
        return format(date, 'MMM dd, yyyy');
    } catch {
        return 'TBA';
    }
};

const formatFee = (fee?: string) => {
    const trimmed = fee?.trim() ?? '';
    const numeric = trimmed ? Number(trimmed) : Number.NaN;
    const isFree = !trimmed || trimmed.toLowerCase() === 'free' || (Number.isFinite(numeric) && numeric <= 0);

    if (isFree) return 'FREE';
    if (Number.isFinite(numeric)) {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(numeric);
    }
    return trimmed;
};

export default function ForYouSection({ className = '' }: ForYouSectionProps) {
    const { user, loading: authLoading, getIdToken } = useAuth();
    const [recommendations, setRecommendations] = useState<ScoredOpportunity[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchRecommendations = useCallback(async () => {
        // Only fetch if user is logged in
        if (!user) return;

        try {
            setLoading(true);
            setError(null);

            const headers: Record<string, string> = {};
            const token = await getIdToken();
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch('/api/recommendations?limit=8', { headers });

            if (!response.ok) {
                throw new Error('Failed to fetch recommendations');
            }

            const data: RecommendationsResponse = await response.json();
            setRecommendations(data.items || []);
        } catch (err) {
            console.error('Error fetching recommendations:', err);
            setError('Unable to load recommendations');
        } finally {
            setLoading(false);
        }
    }, [user, getIdToken]);

    useEffect(() => {
        if (authLoading) return;
        if (!user) {
            setLoading(false);
            return;
        }
        fetchRecommendations();
    }, [authLoading, user, fetchRecommendations]);

    // Don't show section if loading auth or if user is not logged in
    if (authLoading) return null;
    if (!user) return null;

    const sectionTitle = 'For You';
    const sectionSubtitle = 'Opportunities picked just for you based on your interests';

    return (
        <section className={`relative overflow-hidden py-12 md:py-16 bg-gradient-to-br from-violet-50 via-white to-indigo-50 dark:from-[#0c1030] dark:via-[#0c1540] dark:to-[#0b1038] ${className}`}>
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.08),transparent_60%)] dark:bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.15),transparent_60%)]" />

            <div className="container relative mx-auto max-w-[1920px] px-4 md:px-6 lg:px-8 xl:px-16">
                <div className="mb-6 flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className="rounded-xl border border-violet-200 bg-gradient-to-br from-violet-100 to-indigo-100 p-2 sm:p-3 shadow-sm dark:border-violet-500/30 dark:from-violet-500/20 dark:to-indigo-500/20 shrink-0">
                                <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-violet-600 dark:text-violet-300" />
                            </div>
                            <div>
                                <h2 className="text-lg sm:text-2xl font-bold text-slate-900 md:text-3xl lg:text-4xl dark:text-white">
                                    {sectionTitle}
                                </h2>
                                <span className="hidden sm:inline-flex items-center gap-1 mt-1 text-xs text-violet-600 dark:text-violet-300 font-medium">
                                    <Sparkles className="h-3 w-3" />
                                    Personalized for you
                                </span>
                            </div>
                        </div>
                        <p className="mt-1 sm:mt-2 max-w-2xl text-xs sm:text-sm text-slate-600 md:text-base dark:text-slate-100 line-clamp-1 sm:line-clamp-2">
                            {sectionSubtitle}
                        </p>
                    </div>

                    <Link
                        href="/opportunities"
                        className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white/80 px-3 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-violet-700 transition-all duration-300 hover:border-violet-400 hover:bg-violet-50 dark:border-violet-500/40 dark:bg-violet-500/10 dark:text-violet-200 dark:hover:bg-violet-500/20 shrink-0 ml-2"
                    >
                        <span className="hidden sm:inline">Explore all</span>
                        <span className="sm:hidden">All</span>
                        <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Link>
                </div>

                <div className="relative -mx-2">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
                            <span className="ml-3 text-slate-600 dark:text-slate-300">Finding opportunities for you...</span>
                        </div>
                    ) : error ? (
                        <div className="mx-2 rounded-2xl border border-red-200 bg-red-50 px-6 py-8 text-center text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200">
                            {error}
                        </div>
                    ) : recommendations.length === 0 ? (
                        <div className="mx-2 rounded-2xl border border-slate-200 bg-white/80 px-6 py-10 text-center text-slate-500 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-100">
                            No recommendations yet. Start exploring opportunities to get personalized suggestions!
                        </div>
                    ) : (
                        <div className="flex gap-4 overflow-x-auto px-2 pb-4 scrollbar-thin scrollbar-thumb-violet-200 dark:scrollbar-thumb-violet-700">
                            {recommendations.map(({ opportunity, matchReasons }) => (
                                <div key={opportunity.id} className="relative w-[280px] flex-shrink-0 group">
                                    {/* Match reason badge */}
                                    {matchReasons.length > 0 && (
                                        <div className="absolute -top-2 left-3 z-10 flex items-center gap-1.5 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 px-2.5 py-1 text-[10px] font-semibold text-white shadow-lg shadow-violet-500/25">
                                            <Sparkles className="h-3 w-3" />
                                            <span className="max-w-[140px] truncate">{matchReasons[0]}</span>
                                        </div>
                                    )}

                                    <OpportunityCard
                                        id={opportunity.id}
                                        title={opportunity.title}
                                        category={opportunity.category}
                                        gradeEligibility={opportunity.gradeEligibility || 'All Grades'}
                                        organizer={opportunity.organizer || 'Unknown Organizer'}
                                        startDate={formatDate(opportunity.startDate as any)}
                                        endDate={formatDate(opportunity.endDate as any)}
                                        registrationDeadline={formatDate(opportunity.registrationDeadline as any)}
                                        registrationDeadlineTBD={opportunity.registrationDeadlineTBD}
                                        startDateTBD={opportunity.startDateTBD}
                                        endDateTBD={opportunity.endDateTBD}
                                        mode={opportunity.mode || 'online'}
                                        fee={formatFee(opportunity.fee)}
                                        image={opportunity.image}
                                        status="active"
                                        className="pt-4"
                                        organizerLogo={opportunity.organizerLogo}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </section>
    );
}
