'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Users2, ChevronRight, Loader2, Sparkles } from 'lucide-react';
import OpportunityCard from '@/components/OpportunityCard';
import type { Opportunity } from '@/types/opportunity';
import { useAuth } from '@/context/AuthContext';
import { format } from 'date-fns';

interface StudentsLikeYouSectionProps {
    className?: string;
}

const formatDate = (value?: string) => {
    if (!value) return 'TBA';
    try {
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return value;
        return format(date, 'MMM dd, yyyy');
    } catch {
        return value;
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
        }).format(numeric);
    }
    return trimmed;
};

export default function StudentsLikeYouSection({ className = '' }: StudentsLikeYouSectionProps) {
    const { user, loading: authLoading, getIdToken } = useAuth();
    const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
    const [similarUserCount, setSimilarUserCount] = useState<number>(0);
    const [loading, setLoading] = useState(true);

    const fetchStudentsLikeYou = useCallback(async () => {
        if (!user) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);

            const token = await getIdToken();
            if (!token) {
                setLoading(false);
                return;
            }

            const response = await fetch('/api/recommendations/students-like-you?limit=8', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch');
            }

            const data = await response.json();
            setOpportunities(data.items || []);
            setSimilarUserCount(data.similarUserCount || 0);
        } catch (err) {
            console.error('Error fetching students like you:', err);
        } finally {
            setLoading(false);
        }
    }, [user, getIdToken]);

    useEffect(() => {
        if (authLoading) return;
        fetchStudentsLikeYou();
    }, [authLoading, fetchStudentsLikeYou]);

    // Don't show if not logged in
    if (!user || authLoading) return null;
    if (loading) {
        return (
            <section className={`py-12 ${className}`}>
                <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
                    <span className="ml-2 text-sm text-slate-500">Finding similar students...</span>
                </div>
            </section>
        );
    }

    if (opportunities.length === 0) {
        return null;
    }

    return (
        <section className={`relative overflow-hidden py-12 md:py-16 bg-gradient-to-br from-orange-50 via-white to-amber-50 dark:from-[#1a1008] dark:via-[#151015] dark:to-[#181008] ${className}`}>
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(251,146,60,0.08),transparent_60%)] dark:bg-[radial-gradient(circle_at_center,rgba(251,146,60,0.15),transparent_60%)]" />

            <div className="container relative mx-auto max-w-[1920px] px-4 md:px-6 lg:px-8 xl:px-16">
                <div className="mb-6 flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className="rounded-xl border border-orange-200 bg-gradient-to-br from-orange-100 to-amber-100 p-2 sm:p-3 shadow-sm dark:border-orange-500/30 dark:from-orange-500/20 dark:to-amber-500/20 shrink-0">
                                <Users2 className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 dark:text-orange-300" />
                            </div>
                            <div>
                                <h2 className="text-lg sm:text-2xl font-bold text-slate-900 md:text-3xl lg:text-4xl dark:text-white">
                                    Students Like You Applied
                                </h2>
                                {similarUserCount > 0 && (
                                    <span className="hidden sm:inline-flex items-center gap-1 mt-1 text-xs text-orange-600 dark:text-orange-300 font-medium">
                                        <Sparkles className="h-3 w-3" />
                                        Based on {similarUserCount} similar students
                                    </span>
                                )}
                            </div>
                        </div>
                        <p className="mt-1 sm:mt-2 max-w-2xl text-xs sm:text-sm text-slate-600 md:text-base dark:text-slate-100 line-clamp-1 sm:line-clamp-2">
                            Opportunities chosen by students with similar interests
                        </p>
                    </div>

                    <Link
                        href="/opportunities"
                        className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/80 px-3 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-orange-700 transition-all duration-300 hover:border-orange-400 hover:bg-orange-50 dark:border-orange-500/40 dark:bg-orange-500/10 dark:text-orange-200 dark:hover:bg-orange-500/20 shrink-0 ml-2"
                    >
                        <span className="hidden sm:inline">Explore all</span>
                        <span className="sm:hidden">All</span>
                        <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Link>
                </div>

                <div className="flex gap-4 overflow-x-auto pb-4 -mx-2 px-2 scrollbar-thin scrollbar-thumb-orange-200 dark:scrollbar-thumb-orange-700">
                    {opportunities.map((opportunity) => (
                        <div key={opportunity.id} className="relative w-[260px] flex-shrink-0">
                            {/* Similar students badge */}
                            <div className="absolute -top-2 left-3 z-10 flex items-center gap-1 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-2.5 py-1 text-[10px] font-semibold text-white shadow-lg shadow-orange-500/25">
                                <Users2 className="h-3 w-3" />
                                <span>Similar Students</span>
                            </div>

                            <OpportunityCard
                                id={opportunity.id}
                                title={opportunity.title}
                                category={opportunity.category}
                                gradeEligibility={opportunity.gradeEligibility || 'All Grades'}
                                organizer={opportunity.organizer || 'Unknown Organizer'}
                                startDate={formatDate(opportunity.startDate)}
                                endDate={formatDate(opportunity.endDate)}
                                registrationDeadline={opportunity.registrationDeadline ?? ''}
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
            </div>
        </section>
    );
}
