'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Lightbulb, ChevronRight, Loader2 } from 'lucide-react';
import OpportunityCard from '@/components/OpportunityCard';
import type { Opportunity } from '@/types/opportunity';
import { format } from 'date-fns';

interface SimilarOpportunitiesProps {
    opportunityId: string;
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
            maximumFractionDigits: 0,
        }).format(numeric);
    }
    return trimmed;
};

export default function SimilarOpportunities({ opportunityId, className = '' }: SimilarOpportunitiesProps) {
    const [similar, setSimilar] = useState<Opportunity[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchSimilar = useCallback(async () => {
        if (!opportunityId) return;

        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`/api/recommendations/similar/${opportunityId}?limit=6`);

            if (!response.ok) {
                throw new Error('Failed to fetch similar opportunities');
            }

            const data = await response.json();
            setSimilar(data.items || []);
        } catch (err) {
            console.error('Error fetching similar opportunities:', err);
            setError('Unable to load suggestions');
        } finally {
            setLoading(false);
        }
    }, [opportunityId]);

    useEffect(() => {
        fetchSimilar();
    }, [fetchSimilar]);

    // Don't render if loading or no results
    if (loading) {
        return (
            <section className={`py-12 border-t border-slate-200 dark:border-slate-700 ${className}`}>
                <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
                    <span className="ml-2 text-sm text-slate-500">Finding similar opportunities...</span>
                </div>
            </section>
        );
    }

    if (error || similar.length === 0) {
        return null; // Silently hide if no suggestions
    }

    return (
        <section className={`py-12 border-t border-slate-200 dark:border-slate-700 ${className}`}>
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-2.5 shadow-sm dark:border-amber-500/30 dark:from-amber-500/20 dark:to-orange-500/20">
                        <Lightbulb className="h-5 w-5 text-amber-600 dark:text-amber-300" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
                            You might also like
                        </h2>
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                            Similar opportunities you may find interesting
                        </p>
                    </div>
                </div>

                <Link
                    href="/opportunities"
                    className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-amber-600 hover:text-amber-700 dark:text-amber-300 dark:hover:text-amber-200 transition-colors"
                >
                    View all
                    <ChevronRight className="h-4 w-4" />
                </Link>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-thin scrollbar-thumb-amber-200 dark:scrollbar-thumb-amber-700">
                {similar.map((opportunity) => (
                    <OpportunityCard
                        key={opportunity.id}
                        id={opportunity.id}
                        title={opportunity.title}
                        category={opportunity.category}
                        gradeEligibility={opportunity.gradeEligibility || 'All Grades'}
                        organizer={opportunity.organizer || 'Unknown Organizer'}
                        startDate={formatDate(opportunity.startDate)}
                        endDate={formatDate(opportunity.endDate)}
                        registrationDeadline={opportunity.registrationDeadline ?? ''}
                        registrationDeadlineTBD={opportunity.registrationDeadlineTBD}
                        startDateTBD={opportunity.startDateTBD}
                        endDateTBD={opportunity.endDateTBD}
                        mode={opportunity.mode || 'online'}
                        fee={formatFee(opportunity.fee)}
                        image={opportunity.image}
                        status="active"
                        className="w-[260px] flex-shrink-0"
                        organizerLogo={opportunity.organizerLogo}
                    />
                ))}
            </div>
        </section>
    );
}
