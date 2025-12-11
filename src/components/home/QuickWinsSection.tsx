'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Zap, ChevronRight, Loader2 } from 'lucide-react';
import OpportunityCard from '@/components/OpportunityCard';
import type { Opportunity } from '@/types/opportunity';
import { format } from 'date-fns';

interface QuickWinsSectionProps {
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

export default function QuickWinsSection({ className = '' }: QuickWinsSectionProps) {
    const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchQuickWins = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch('/api/recommendations/quick-wins?limit=8');

            if (!response.ok) {
                throw new Error('Failed to fetch quick wins');
            }

            const data = await response.json();
            setOpportunities(data.items || []);
        } catch (err) {
            console.error('Error fetching quick wins:', err);
            setError('Unable to load opportunities');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchQuickWins();
    }, [fetchQuickWins]);

    if (loading) {
        return (
            <section className={`py-12 ${className}`}>
                <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-emerald-500" />
                    <span className="ml-2 text-sm text-slate-500">Finding quick wins...</span>
                </div>
            </section>
        );
    }

    if (error || opportunities.length === 0) {
        return null;
    }

    return (
        <section className={`relative overflow-hidden py-12 md:py-16 bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-[#0c1a18] dark:via-[#0c1520] dark:to-[#0b1518] ${className}`}>
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.08),transparent_60%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.15),transparent_60%)]" />

            <div className="container relative mx-auto max-w-[1920px] px-4 md:px-6 lg:px-8 xl:px-16">
                <div className="mb-6 flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className="rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-100 to-teal-100 p-2 sm:p-3 shadow-sm dark:border-emerald-500/30 dark:from-emerald-500/20 dark:to-teal-500/20 shrink-0">
                                <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600 dark:text-emerald-300" />
                            </div>
                            <div>
                                <h2 className="text-lg sm:text-2xl font-bold text-slate-900 md:text-3xl lg:text-4xl dark:text-white">
                                    Quick Wins
                                </h2>
                                <span className="hidden sm:inline-flex items-center gap-1 mt-1 text-xs text-emerald-600 dark:text-emerald-300 font-medium">
                                    Free • Online • Easy to apply
                                </span>
                            </div>
                        </div>
                        <p className="mt-1 sm:mt-2 max-w-2xl text-xs sm:text-sm text-slate-600 md:text-base dark:text-slate-100 line-clamp-1 sm:line-clamp-2">
                            Get started quickly with these free online opportunities
                        </p>
                    </div>

                    <Link
                        href="/opportunities?fee=free&mode=online"
                        className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-3 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-emerald-700 transition-all duration-300 hover:border-emerald-400 hover:bg-emerald-50 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-200 dark:hover:bg-emerald-500/20 shrink-0 ml-2"
                    >
                        <span className="hidden sm:inline">View all</span>
                        <span className="sm:hidden">All</span>
                        <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Link>
                </div>

                <div className="flex gap-4 overflow-x-auto pb-4 -mx-2 px-2 scrollbar-thin scrollbar-thumb-emerald-200 dark:scrollbar-thumb-emerald-700">
                    {opportunities.map((opportunity) => (
                        <div key={opportunity.id} className="relative w-[260px] flex-shrink-0">
                            {/* Quick Win badge */}
                            <div className="absolute -top-2 left-3 z-10 flex items-center gap-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-2.5 py-1 text-[10px] font-semibold text-white shadow-lg shadow-emerald-500/25">
                                <Zap className="h-3 w-3" />
                                <span>Quick Win</span>
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
                                registrationDeadlineTBD={opportunity.registrationDeadlineTBD}
                                mode={opportunity.mode || 'online'}
                                fee="FREE"
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
