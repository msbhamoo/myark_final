'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { School, ChevronRight, Loader2, Users } from 'lucide-react';
import OpportunityCard from '@/components/OpportunityCard';
import type { Opportunity } from '@/types/opportunity';
import { useAuth } from '@/context/AuthContext';
import { format } from 'date-fns';

interface PopularInSchoolSectionProps {
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

export default function PopularInSchoolSection({ className = '' }: PopularInSchoolSectionProps) {
    const { user, loading: authLoading, getIdToken } = useAuth();
    const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
    const [schoolName, setSchoolName] = useState<string>('');
    const [studentCount, setStudentCount] = useState<number>(0);
    const [message, setMessage] = useState<string>('');
    const [loading, setLoading] = useState(true);

    const fetchPopularInSchool = useCallback(async () => {
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

            const response = await fetch('/api/recommendations/popular-in-school?limit=8', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch');
            }

            const data = await response.json();
            setOpportunities(data.items || []);
            setSchoolName(data.schoolName || '');
            setStudentCount(data.studentCount || 0);
            setMessage(data.message || '');
        } catch (err) {
            console.error('Error fetching popular in school:', err);
        } finally {
            setLoading(false);
        }
    }, [user, getIdToken]);

    useEffect(() => {
        if (authLoading) return;
        fetchPopularInSchool();
    }, [authLoading, fetchPopularInSchool]);

    // Don't show if not logged in or no school data
    if (!user || authLoading) return null;
    if (loading) {
        return (
            <section className={`py-12 ${className}`}>
                <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                    <span className="ml-2 text-sm text-slate-500">Loading school trends...</span>
                </div>
            </section>
        );
    }

    if (opportunities.length === 0) {
        // Show hint if no school set
        if (!schoolName && message) {
            return (
                <section className={`py-8 ${className}`}>
                    <div className="container mx-auto max-w-[1920px] px-4 md:px-6 lg:px-8 xl:px-16">
                        <div className="rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 dark:border-blue-800/50 p-6 text-center">
                            <School className="h-8 w-8 mx-auto mb-3 text-blue-500" />
                            <p className="text-slate-700 dark:text-slate-300">{message}</p>
                            <Link href="/dashboard" className="inline-flex items-center gap-2 mt-3 text-sm font-medium text-blue-600 hover:text-blue-700">
                                Add your school <ChevronRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </section>
            );
        }
        return null;
    }

    return (
        <section className={`relative overflow-hidden py-12 md:py-16 bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-[#0c1030] dark:via-[#0c1540] dark:to-[#0b1038] ${className}`}>
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.08),transparent_60%)] dark:bg-[radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.15),transparent_60%)]" />

            <div className="container relative mx-auto max-w-[1920px] px-4 md:px-6 lg:px-8 xl:px-16">
                <div className="mb-6 flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className="rounded-xl border border-blue-200 bg-gradient-to-br from-blue-100 to-indigo-100 p-2 sm:p-3 shadow-sm dark:border-blue-500/30 dark:from-blue-500/20 dark:to-indigo-500/20 shrink-0">
                                <School className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-300" />
                            </div>
                            <div>
                                <h2 className="text-lg sm:text-2xl font-bold text-slate-900 md:text-3xl lg:text-4xl dark:text-white">
                                    Popular at {schoolName || 'Your School'}
                                </h2>
                                {studentCount > 1 && (
                                    <span className="hidden sm:inline-flex items-center gap-1 mt-1 text-xs text-blue-600 dark:text-blue-300 font-medium">
                                        <Users className="h-3 w-3" />
                                        {studentCount} students from your school
                                    </span>
                                )}
                            </div>
                        </div>
                        <p className="mt-1 sm:mt-2 max-w-2xl text-xs sm:text-sm text-slate-600 md:text-base dark:text-slate-100 line-clamp-1 sm:line-clamp-2">
                            What your schoolmates are exploring
                        </p>
                    </div>

                    <Link
                        href="/opportunities"
                        className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-3 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-blue-700 transition-all duration-300 hover:border-blue-400 hover:bg-blue-50 dark:border-blue-500/40 dark:bg-blue-500/10 dark:text-blue-200 dark:hover:bg-blue-500/20 shrink-0 ml-2"
                    >
                        <span className="hidden sm:inline">Explore all</span>
                        <span className="sm:hidden">All</span>
                        <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Link>
                </div>

                <div className="flex gap-4 overflow-x-auto pb-4 -mx-2 px-2 scrollbar-thin scrollbar-thumb-blue-200 dark:scrollbar-thumb-blue-700">
                    {opportunities.map((opportunity) => (
                        <div key={opportunity.id} className="relative w-[260px] flex-shrink-0">
                            {/* School popular badge */}
                            <div className="absolute -top-2 left-3 z-10 flex items-center gap-1 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 px-2.5 py-1 text-[10px] font-semibold text-white shadow-lg shadow-blue-500/25">
                                <School className="h-3 w-3" />
                                <span>School Favorite</span>
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
